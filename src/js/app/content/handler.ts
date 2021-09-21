import Bowser from 'bowser';

import TrailCanvas from '../content/trail_canvas';
import InputGesture from '../domains/Entities/InputGesture';
import MousePoint from '../domains/ValueObjects/MousePoint';
import Keyboard from '../keyboard';
import Mouse, {HTMLChildElement, HTMLElementEvent} from '../mouse';
import {LineParameter, SendMessageParameter} from '../types/common';
import ContentScripts from './content_scripts';

const scrollTop = (): number =>
  (document.documentElement && document.documentElement.scrollTop) ||
    (document.body && document.body.scrollTop);

const scrollLeft = (): number =>
  (document.documentElement && document.documentElement.scrollLeft) ||
    (document.body && document.body.scrollLeft);

(function() {
  const inputMouse: Mouse = new Mouse();
  const inputKeyboard: Keyboard = new Keyboard();
  const inputGesture: InputGesture = new InputGesture();
  const trailCanvas: TrailCanvas = new TrailCanvas('gestureTrailCanvas', '1000000');
  const contentScripts: ContentScripts = new ContentScripts(trailCanvas);
  let nextMenuSkip = false;

  /**
   * content_scripts->backgroundへのデータ送信
   * @param {SendMessageParameter} param
   * @return {Promise}
   */
  const sendMessageToBackground = (param: SendMessageParameter): Promise<any> => {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(param, (response) => resolve(response));
    });
  };

  /**
   * 画面表示をすべてクリア
   */
  const clearAllDisplay = (): void => {
    if (trailCanvas) {
      trailCanvas.clearCanvas();

      const canvasId = trailCanvas.getCanvasId();
      if (canvasId && document.getElementById(canvasId)) {
        document.body.removeChild(document.getElementById(canvasId));
      }
    }

    if (contentScripts.infoDiv) {
      if (document.getElementById(contentScripts.infoDiv.id)) {
        document.body.removeChild(
            document.getElementById(contentScripts.infoDiv.id));
      }
    }
  };

  trailCanvas.setCanvasSize(window.innerWidth, window.innerHeight);
  contentScripts.loadOption();

  (async () => {
    const initialNextMenuSkip = await sendMessageToBackground({msg: 'nextMenuSkipGet'});
    if (initialNextMenuSkip.nextMenuSkip) {
      nextMenuSkip = true;
    }
  })();

  // ------------------------------------------------------------------------
  // Event Handler
  // ------------------------------------------------------------------------
  /**
   * ジェスチャ中にキーボードショートカットでタブ切り替えされると、'mouseup' が取れずに停止してしまうのでフォーカス戻ってきたときにいったんクリアする。
   */
  window.addEventListener('focus', async () => {
    inputKeyboard.reset();
    inputGesture.clear();

    contentScripts.loadOption();
  });

  window.addEventListener('resize', () => {
    trailCanvas.setCanvasSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener('keydown', async (event: KeyboardEvent): Promise<any> => {
    if (!event.repeat) {
      inputKeyboard.setOn(event.key);
    }
  });

  document.addEventListener('keyup', async (event: KeyboardEvent): Promise<any> => {
    inputKeyboard.setOff(event.key);
  });

  document.addEventListener('mousedown', async (event: HTMLElementEvent<HTMLChildElement>) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    // Ctrlが押された状態だと、マウスジェスチャ無効な仕様
    if (inputKeyboard.isOn(Keyboard.KEY_CTRL)) {
      return;
    }

    inputMouse.setOn(event.which);

    if (event.which !== Mouse.RIGHT_BUTTON) {
      return;
    }

    inputGesture
        .setLinkUrl(Mouse.getHref(event))
        .addPoint(new MousePoint(event.pageX - scrollLeft(), event.pageY - scrollTop()));

    if (inputGesture.isUpdateLine) {
      inputGesture.updateAction(contentScripts.option);
    }

    trailCanvas.clearCanvas();
  });

  document.addEventListener('mousemove', async (event: MouseEvent) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    // Ctrlが押された状態だと、マウスジェスチャ無効な仕様
    if (inputKeyboard.isOn(Keyboard.KEY_CTRL)) {
      return;
    }

    if (event.which !== Mouse.RIGHT_BUTTON) {
      return;
    }

    inputGesture
        .addPoint(new MousePoint(event.pageX - scrollLeft(), event.pageY - scrollTop()));

    if (inputGesture.isUpdateLine) {
      inputGesture.updateAction(contentScripts.option);

      const listParam: LineParameter = {
        fromX: inputGesture.newLineFrom.x,
        fromY: inputGesture.newLineFrom.y,
        toX: inputGesture.newLineTo.x,
        toY: inputGesture.newLineTo.y,
      };
      contentScripts.draw(
          listParam,
          inputGesture.gestureCommands.displayString,
          inputGesture.gestureActionName(contentScripts.option),
      );

      if (trailCanvas.getCanvas()) {
        document.body.appendChild(trailCanvas.getCanvas());
      }

      if (contentScripts.infoDiv) {
        document.body.appendChild(contentScripts.infoDiv);
      }
    }
  });

  document.addEventListener('mouseup', (event: MouseEvent) => {
    inputMouse.setOff(event.which);

    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    if (inputGesture.gestureCommands.rawString) {
      nextMenuSkip = true;
      sendMessageToBackground({msg: 'nextMenuSkipOn'});

      if (inputGesture.gestureActionCode) {
        if (!contentScripts.exeAction(inputGesture.gestureActionCode)) {
          sendMessageToBackground({
            event: inputGesture.gestureActionCode,
            href: inputGesture.linkUrl,
            msg: 'executeAction',
          });
        }
      }
    }

    inputGesture.clear();
    clearAllDisplay();
  });

  let timerId = null;
  /**
   * コンテキストメニューの呼び出しをされたときに実行されるイベント。
   * falseを返すと、コンテキストメニューを無効にする。
   */
  document.addEventListener('contextmenu', (event: MouseEvent) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    // NOTE: Windows以外のOSだとイベントがマウスダウンで発生してしまいジェスチャ操作と衝突するので
    //       ダブルクリック時にメニューイベントとして扱う
    const bowser = Bowser.getParser(window.navigator.userAgent);
    if (!bowser.is('Windows')) {
      if (timerId) {
        clearTimeout(timerId);
        timerId = null;
        return true;
      }

      timerId = setTimeout(() => {
        timerId = null;
      }, 500);

      event.preventDefault();
    }

    if (nextMenuSkip) {
      event.preventDefault();
    }

    nextMenuSkip = false;
    sendMessageToBackground({msg: 'nextMenuSkipOff'});
  });
})();

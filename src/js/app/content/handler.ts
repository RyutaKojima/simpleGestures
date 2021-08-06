import Bowser from 'bowser';

import TrailCanvas from '../content/trail_canvas';
import DEBUG_ON from '../debug_flg';
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
  contentScripts.setCanvasStyle();
  contentScripts.createInfoDiv();

  // ------------------------------------------------------------------------
  // Event Handler
  // ------------------------------------------------------------------------
  /**
   * ジェスチャ中にキーボードショートカットでタブ切り替えされると、'mouseup' が取れずに停止してしまうのでフォーカス戻ってきたときにいったんクリアする。
   */
  window.addEventListener('focus', async () => {
    await sendMessageToBackground({event: 'focus', msg: 'reset_input'});
  });

  window.addEventListener('resize', () => {
    trailCanvas.setCanvasSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener('keydown', async (event: KeyboardEvent): Promise<any> => {
    if (!event.repeat) {
      await sendMessageToBackground({keyCode: event.key, msg: 'keydown'});
    }
  });

  document.addEventListener('keyup', async (event: KeyboardEvent): Promise<any> => {
    await sendMessageToBackground({keyCode: event.key, msg: 'keyup'});
  });

  document.addEventListener('mousedown', async (event: HTMLElementEvent<HTMLChildElement>) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    const sendMouseDownParam = {
      href: Mouse.getHref(event),
      msg: 'mousedown',
      which: event.which,
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    const response = await sendMessageToBackground(sendMouseDownParam);
    if (response === null) {
      return;
    }

    if (response.action) {
      nextMenuSkip = true;
      contentScripts.exeAction(response.action);
    }

    if (response.canvas.clear) {
      trailCanvas.clearCanvas();
    }

    contentScripts.loadOption();
  });

  document.addEventListener('mousemove', async (event: MouseEvent) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    // console.log('(' + event.pageX + ', ' + event.pageY + ')'
    // +event.which + ',frm=' + window.frames.length;
    // );

    const sendMouseMoveParam = {
      href: '',
      msg: 'mousemove',
      which: event.which,
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    const response = await sendMessageToBackground(sendMouseMoveParam);
    if (response === null) {
      return;
    }

    if (response.canvas.draw) {
      nextMenuSkip = (response.gestureString !== '');

      if (trailCanvas.getCanvas()) {
        document.body.appendChild(trailCanvas.getCanvas());
      }

      if (contentScripts.infoDiv) {
        document.body.appendChild(contentScripts.infoDiv);
      }

      const listParam: LineParameter = {
        fromX: response.canvas.x,
        fromY: response.canvas.y,
        toX: response.canvas.toX,
        toY: response.canvas.toY,
      };
      contentScripts.draw(listParam, response.gestureString,
          response.gestureAction);
    }

    if (response.canvas.clear) {
      clearAllDisplay();
    }
  });

  document.addEventListener('mouseup', async (event: MouseEvent) => {
    if ( ! contentScripts.option.getEnabled()) {
      return;
    }

    const sendMouseUpParam = {
      href: '',
      msg: 'mouseup',
      which: event.which,
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    const response: any = await sendMessageToBackground(sendMouseUpParam);
    if (response === null) {
      return;
    }

    // console.log(response);

    nextMenuSkip = (response.gestureString !== '');

    if (response.action) {
      nextMenuSkip = true;
      contentScripts.exeAction(response.action);
    }

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
      nextMenuSkip = false;
      event.preventDefault();
    }
  });
})();

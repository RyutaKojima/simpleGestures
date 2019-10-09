/** @var chrome {Object} */
/** @var chrome.runtime {Object} */
/** @var chrome.runtime.sendMessage {function} */
import DEBUG_ON from '../debug_flg';
import Mouse from '../mouse';
import ContentScripts from './content_scripts';
import TrailCanvas from '../content/trail_canvas';

const scrollTop = () => document.documentElement.scrollTop ||
    document.body.scrollTop;
const scrollLeft = () => document.documentElement.scrollLeft ||
    document.body.scrollLeft;

(function() {
  const trailCanvas = new TrailCanvas('gestureTrailCanvas', '1000000');
  const contentScripts = new ContentScripts(trailCanvas);

  let nextMenuSkip = false;

  /**
   * 画面表示をすべてクリア
   */
  const clearAllDisplay = function() {
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
   * ジェスチャ中にキーボードショートカットでタブ切り替えされると、'mouseup'が取れずに停止してしまうのでフォーカス戻ってきたときにいったんクリアする。
   */
  window.addEventListener('focus', () => {
    chrome.runtime.sendMessage({msg: 'reset_input', event: 'focus'}, () => {
    });
  });

  window.addEventListener('resize', () => {
    trailCanvas.setCanvasSize(window.innerWidth, window.innerHeight);
  });

  document.addEventListener('keydown', (event) => {
    if (!event.repeat) {
      chrome.runtime.sendMessage({msg: 'keydown', keyCode: event.key}, () => {
      });
    }
  });

  document.addEventListener('keyup', (event) => {
    chrome.runtime.sendMessage({msg: 'keyup', keyCode: event.key}, () => {
    });
  });

  document.addEventListener('mousedown', (event) => {
    const sendMouseDownParam = {
      msg: 'mousedown',
      which: event.which,
      href: Mouse.getHref(event),
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    chrome.runtime.sendMessage(sendMouseDownParam, function(response) {
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
  });

  document.addEventListener('mousemove', (event) => {
    // console.log('(' + event.pageX + ', ' + event.pageY + ')'
    // 	+ event.which + ',frm=' + window.frames.length
    // );

    const sendMouseMoveParam = {
      msg: 'mousemove',
      which: event.which,
      href: '',
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    chrome.runtime.sendMessage(sendMouseMoveParam, function(response) {
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

        const listParam = {
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
  });

  document.addEventListener('mouseup', (event) => {
    const sendMouseUpParam = {
      msg: 'mouseup',
      which: event.which,
      href: '',
      x: event.pageX - scrollLeft(),
      y: event.pageY - scrollTop(),
    };
    chrome.runtime.sendMessage(sendMouseUpParam, function(response) {
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
  });

  /**
   * コンテキストメニューの呼び出しをされたときに実行されるイベント。
   * falseを返すと、コンテキストメニューを無効にする。
   */
  document.addEventListener('contextmenu', (event) => {
    if (nextMenuSkip) {
      nextMenuSkip = false;
      event.preventDefault();
    }
  });
})();

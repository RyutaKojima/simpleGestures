import DEBUG_ON from '../debug_flg';
import lang from '../lang';
import Mouse from '../mouse';
import Keyboard from '../keyboard';
import LibGesture from '../content/lib_gesture';
import LibOption from '../lib_option';

import actionOpenNewTab from './Action/open_new_tab';
import actionTogglePinTab from './Action/toggle_pin_tab';
import actionCloseActiveTab from './Action/close_active_tab';
import actionReload from './Action/reload';
import actionReloadAll from './Action/reload_all';
import actionNextTab from './Action/next_tab';
import actionPrevTab from './Action/prev_tab';
import actionCloseRightTabWithoutPinned from './Action/close_right_tab_without_pinned';
import actionCloseRightTab from './Action/close_right_tab';
import actionCloseLeftTabWithoutPinned from './Action/close_left_tab_without_pinned';
import actionCloseLeftTab from './Action/close_left_tab';
import actionCloseAllBackgroundTab from './Action/close_all_background_tab';
import actionCloseAllTab from './Action/close_all_tab';
import actionOpenOptionPage from './Action/open_option_page';
import actionOpenExtensionPage from './Action/open_extension_page';
import actionBrowserRestart from './Action/browser_restart';
import actionRestoreLastTab from './Action/restore_last_tab';

const inputMouse = new Mouse();
const inputKeyboard = new Keyboard();
const mainGestureMan = new LibGesture();
const option = new LibOption();
option.load();

let lockerOn = false;
let nextMenuSkip = true;

/**
 * 現在のジェスチャ軌跡に対応するアクション名を返す
 *
 * @return {null|string}
 */
const getNowGestureActionName = function() {
  const gestureString = mainGestureMan.getGestureString();
  if ( ! gestureString) {
    return null;
  }

  return option.getGestureActionName(gestureString);
};

/**
 * フロントからのメッセージリクエストに対する処理
 *
 * @type {{load_options: requestFunction.load_options}}
 */
const requestFunction = {
  'reset_input': (request) => {
    inputKeyboard.lock();
    inputKeyboard.reset();
    inputMouse.reset();

    setTimeout(() => {
      inputKeyboard.unlock();
    }, 100);
  },
  'reload_option': function() {
    option.load();
  },
  'load_options': function(request) {
    return {'message': 'yes', 'options_json': option.getRawStorageData()};
  },
  'keydown': (request) => {
    inputKeyboard.setOn(request.keyCode);

    return {message: 'yes'};
  },
  'keyup': (request) => {
    inputKeyboard.setOff(request.keyCode);

    return {message: 'yes'};
  },
  'mousedown': function(request) {
    const response = {
      message: 'yes',
      action: null,
      href: request.href,
      gestureString: '',
      gestureAction: '',
      canvas: {
        clear: false,
        draw: false,
        x: request.x,
        y: request.y,
        toX: request.x,
        toY: request.y,
      },
    };

    // Ctrlが押された状態だと、マウスジェスチャ無効な仕様
    if (inputKeyboard.isOn(Keyboard.KEY_CTRL)) {
      console.log('on KEY_CTRL. skip gesture.');
      return;
    }

    inputMouse.setOn(request.which);

    if (request.which === Mouse.LEFT_BUTTON) {
      if (inputMouse.isLeft() && inputMouse.isRight()) {
        lockerOn = true;
        response.canvas.clear = true;

        response.action = 'back';
      }
    } else if (request.which === Mouse.RIGHT_BUTTON) {
      nextMenuSkip = false;

      // locker gesture
      if (inputMouse.isLeft() && inputMouse.isRight()) {
        lockerOn = true;

        response.action = 'forward';
      }

      mainGestureMan.clear();

      if ( ! lockerOn) {
        console.log('select request.href: ' + request.href );

        response.canvas.draw = true;
        mainGestureMan.startGesture(request.x, request.y, request.href);
      }
    }

    return response;
  },
  'mousemove': function(request) {
    const doAction = getNowGestureActionName();
    const displayActionName = doAction
								? lang.gesture['gesture_' + doAction][option.getLanguage()]
								: '';

    // mousemove の event.whichには、最初に押されたボタンが入る。
    const response = {
      message: 'yes',
      action: null,
      href: request.href,
      gestureString: mainGestureMan.getGestureString(),
      gestureAction: displayActionName,
      canvas: {
        clear: false,
        draw: false,
        x: request.x,
        y: request.y,
        toX: request.x,
        toY: request.y,
      },
    };

    if (request.which == 0) {
      inputMouse.reset();
      mainGestureMan.clear();
      response.canvas.clear = true;
      return response;
    }

    if (inputMouse.isRight() && request.which == Mouse.RIGHT_BUTTON) {
      if ( ! lockerOn) {
        if (mainGestureMan.registPoint(request.x, request.y)) {
          response.canvas.draw = true;
          response.canvas.x = mainGestureMan.getLastX();
          response.canvas.y = mainGestureMan.getLastY();
          response.canvas.toX = mainGestureMan.getX();
          response.canvas.toY = mainGestureMan.getY();
        }
      }
    }

    return response;
  },
  'mouseup': function(request) {
    const doAction = getNowGestureActionName();
    const displayActionName = doAction
								? lang.gesture['gesture_' + doAction][option.getLanguage()]
								: '';

    const response = {
      message: 'yes',
      action: null,
      href: mainGestureMan.getURL(),
      gestureString: mainGestureMan.getGestureString(),
      gestureAction: displayActionName,
      canvas: {
        clear: false,
        draw: false,
        x: request.x,
        y: request.y,
        toX: request.x,
        toY: request.y,
      },
    };

    inputMouse.setOff(request.which);

    if (request.which === Mouse.RIGHT_BUTTON) {
      if (lockerOn) {
        nextMenuSkip = true;
      } else if (doAction) {
        nextMenuSkip = true;

        if (typeof gestureFunction[doAction] === 'function') {
          const optionParams = {
            href: mainGestureMan.getURL(),
          };
          gestureFunction[doAction](optionParams);
        } else {
          // バックグラウンドで処理できないものはフロントに任せる
          response.action = doAction;
        }
      }

      mainGestureMan.endGesture();
      lockerOn = false;
    }

    return response;
  },
};

/**
 * 各マウスジェスチャの処理
 * @type type
 */
const gestureFunction = {
  'new_tab': actionOpenNewTab,
  'pin_tab': actionTogglePinTab,
  'close_tab': actionCloseActiveTab,
  'reload': actionReload,
  'reload_all': actionReloadAll,
  'next_tab': actionNextTab,
  'prev_tab': actionPrevTab,
  'close_right_tab_without_pinned': actionCloseRightTabWithoutPinned,
  'close_right_tab': actionCloseRightTab,
  'close_left_tab_without_pinned': actionCloseLeftTabWithoutPinned,
  'close_left_tab': actionCloseLeftTab,
  'close_all_background': actionCloseAllBackgroundTab,
  'close_all': actionCloseAllTab,
  'open_option': actionOpenOptionPage,
  'open_extension': actionOpenExtensionPage,
  'restart': actionBrowserRestart,
  'last_tab': actionRestoreLastTab,
};

/**
 * フロントサイドからのメッセージ受信した時に発生するイベント
 *
 * @param {type} param
 */
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  const reqFunc = requestFunction[request.msg];
  if (typeof reqFunc === 'function') {
    sendResponse(reqFunc(request, sender));
  } else {
    sendResponse({message: 'unknown command'});
  }
});

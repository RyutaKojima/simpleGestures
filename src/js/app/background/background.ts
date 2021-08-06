import LibGesture from '../content/lib_gesture';
import Keyboard from '../keyboard';
import lang from '../lang';
import LibOption from '../lib_option';
import Mouse from '../mouse';
import {mouseEventResponse, SendMessageParameter} from '../types/common';
import actionBrowserRestart from './Action/browser_restart';
import actionCloseActiveTab from './Action/close_active_tab';
import actionCloseAllBackgroundTab from './Action/close_all_background_tab';
import actionCloseAllTab from './Action/close_all_tab';
import actionCloseLeftTab from './Action/close_left_tab';
import actionCloseLeftTabWithoutPinned from './Action/close_left_tab_without_pinned';
import actionCloseRightTab from './Action/close_right_tab';
import actionCloseRightTabWithoutPinned from './Action/close_right_tab_without_pinned';
import actionNextTab from './Action/next_tab';
import actionOpenExtensionPage from './Action/open_extension_page';
import actionOpenNewTab from './Action/open_new_tab';
import actionOpenNewTabBackGround from './Action/open_new_tab_background';
import actionOpenOptionPage from './Action/open_option_page';
import actionPrevTab from './Action/prev_tab';
import actionReload from './Action/reload';
import actionReloadAll from './Action/reload_all';
import actionRestoreLastTab from './Action/restore_last_tab';
import actionTogglePinTab from './Action/toggle_pin_tab';
import MessageSender = chrome.runtime.MessageSender;

const inputMouse: Mouse = new Mouse();
const inputKeyboard: Keyboard = new Keyboard();
const mainGestureMan: LibGesture = new LibGesture();
const option: LibOption = new LibOption();
option.load();

let lockerOn = false;
let nextMenuSkip = true;

/**
 * 現在のジェスチャ軌跡に対応するアクション名を返す
 * @return {null | string}
 */
const getNowGestureActionName = (): null | string => {
  const gestureString: string = mainGestureMan.getGestureString();
  if (!gestureString) {
    return null;
  }

  return option.getGestureActionName(gestureString);
};

/**
 * 各マウスジェスチャの処理
 * @type type
 */
const gestureFunction: { [key: string]: any } = {
  'close_all': actionCloseAllTab,
  'close_all_background': actionCloseAllBackgroundTab,
  'close_left_tab': actionCloseLeftTab,
  'close_left_tab_without_pinned': actionCloseLeftTabWithoutPinned,
  'close_right_tab': actionCloseRightTab,
  'close_right_tab_without_pinned': actionCloseRightTabWithoutPinned,
  'close_tab': actionCloseActiveTab,
  'last_tab': actionRestoreLastTab,
  'new_tab': actionOpenNewTab,
  'new_tab_background': actionOpenNewTabBackGround,
  'next_tab': actionNextTab,
  'open_extension': actionOpenExtensionPage,
  'open_option': actionOpenOptionPage,
  'pin_tab': actionTogglePinTab,
  'prev_tab': actionPrevTab,
  'reload': actionReload,
  'reload_all': actionReloadAll,
  'restart': actionBrowserRestart,
};

/**
 * Backgroundで処理できるアクションなら実行する
 * @param {string} doAction
 * @return {boolean}
 */
const executeGestureFunctionOnBackground = (doAction: string): boolean => {
  if (gestureFunction.hasOwnProperty(doAction) && typeof gestureFunction[doAction] === 'function') {
    const optionParams: { href: any; } = {
      href: mainGestureMan.getURL(),
    };
    gestureFunction[doAction](optionParams);

    return true;
  }

  return false;
};

/**
 * マウスイベントのレスポンスのテンプレート
 * @return {mouseEventResponse}
 */
const mouseEventResponseTemplate = (): mouseEventResponse => {
  return {
    action: null,
    canvas: {
      clear: false,
      draw: false,
      toX: 0,
      toY: 0,
      x: 0,
      y: 0,
    },
    gestureAction: '',
    gestureString: '',
    href: '',
    message: 'yes',
  };
};

/**
 * フロントからのメッセージリクエストに対する処理
 *
 * @type {{load_options: requestFunction.load_options}}
 */
const requestFunction: { [key: string]: any } = {
  'keydown': (request: SendMessageParameter) => {
    inputKeyboard.setOn(request.keyCode);

    return {message: 'yes'};
  },
  'keyup': (request: SendMessageParameter) => {
    inputKeyboard.setOff(request.keyCode);

    return {message: 'yes'};
  },
  'load_options': () => {
    return {'message': 'yes', 'options_json': option.getRawStorageData()};
  },
  'mousedown': (request: SendMessageParameter) => {
    const response: mouseEventResponse = mouseEventResponseTemplate();
    response.href = request.href;
    response.canvas.x = request.x;
    response.canvas.y = request.y;
    response.canvas.toX = request.x;
    response.canvas.toY = request.y;

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

      if (!lockerOn) {
        console.log('select request.href: ' + request.href);

        response.canvas.draw = true;
        mainGestureMan.startGesture(request.x, request.y, request.href);
      }
    }

    return response;
  },
  'mousemove': function(request: SendMessageParameter) {
    const doAction: null | string = getNowGestureActionName();
    const displayActionName: string = doAction ?
      lang.gesture['gesture_' + doAction][option.getLanguage()] :
      '';

    // mousemove の event.whichには、最初に押されたボタンが入る。
    const response: mouseEventResponse = mouseEventResponseTemplate();
    response.href = request.href;
    response.gestureString = mainGestureMan.getGestureString();
    response.gestureAction = displayActionName;
    response.canvas.x = request.x;
    response.canvas.y = request.y;
    response.canvas.toX = request.x;
    response.canvas.toY = request.y;

    if (request.which === 0) {
      inputMouse.reset();
      mainGestureMan.clear();
      response.canvas.clear = true;
      return response;
    }

    if (inputMouse.isRight() && request.which === Mouse.RIGHT_BUTTON) {
      if (!lockerOn) {
        if (mainGestureMan.registerPoint(request.x, request.y)) {
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
  'mouseup': function(request: SendMessageParameter) {
    const doAction: null | string = getNowGestureActionName();
    const displayActionName: string = doAction ?
      lang.gesture['gesture_' + doAction][option.getLanguage()] :
      '';

    const response: mouseEventResponse = mouseEventResponseTemplate();
    response.href = mainGestureMan.getURL();
    response.gestureString = mainGestureMan.getGestureString();
    response.gestureAction = displayActionName;
    response.canvas.x = request.x;
    response.canvas.y = request.y;
    response.canvas.toX = request.x;
    response.canvas.toY = request.y;

    inputMouse.setOff(request.which);

    if (request.which === Mouse.RIGHT_BUTTON) {
      if (lockerOn) {
        nextMenuSkip = true;
      } else if (doAction) {
        nextMenuSkip = true;

        if (!executeGestureFunctionOnBackground(doAction)) {
          // バックグラウンドで処理できないものはフロントに任せる
          response.action = doAction;
        }
      }

      mainGestureMan.endGesture();
      lockerOn = false;
    }

    return response;
  },
  'reload_option': () => {
    option.load();
  },
  'reset_input': () => {
    inputKeyboard.lock();
    inputKeyboard.reset();
    inputMouse.reset();

    setTimeout(() => {
      inputKeyboard.unlock();
    }, 100);
  },
};

/**
 * フロントサイドからのメッセージ受信した時に発生するイベント
 *
 * @param {type} param
 */
chrome.runtime.onMessage.addListener(
    function(request: SendMessageParameter, sender: MessageSender, sendResponse) {
      const reqFunc = requestFunction[request.msg];
      if (typeof reqFunc === 'function') {
        sendResponse(reqFunc(request, sender));
      } else {
        sendResponse({message: 'unknown command'});
      }
    });

/**
 * 拡張機能がインストール/アップデートされたときに発生するイベント
 */
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    actionOpenOptionPage();
  }
});

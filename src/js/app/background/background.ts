import LibOption from '../lib_option';
import {SendMessageParameter} from '../types/common';
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

let nextMenuSkip = false;
const option: LibOption = new LibOption();
option.load();

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
 * @param {null|string} href
 * @return {boolean}
 */
const executeGestureFunctionOnBackground = (
    doAction: string,
    href: null|string = null,
): boolean => {
  if (gestureFunction.hasOwnProperty(doAction) && typeof gestureFunction[doAction] === 'function') {
    const optionParams: { href: null|string; } = {
      href,
    };
    gestureFunction[doAction](optionParams);

    return true;
  }

  return false;
};

/**
 * フロントからのメッセージリクエストに対する処理
 */
const requestFunction: { [key: string]: any } = {
  'executeAction': (request: SendMessageParameter) => {
    const wasExecuted = executeGestureFunctionOnBackground(request.event, request.href);

    return {
      message: 'yes',
      wasExecuted,
    };
  },
  'nextMenuSkipGet': () => {
    return {
      message: 'yes',
      nextMenuSkip,
    };
  },
  'nextMenuSkipOff': () => {
    nextMenuSkip = false;
  },
  'nextMenuSkipOn': () => {
    nextMenuSkip = true;
  },
};

/**
 * フロントサイドからのメッセージ受信した時に発生するイベント
 *
 * @param {type} param
 */
chrome.runtime.onMessage.addListener((
    request: SendMessageParameter,
    sender: MessageSender,
    sendResponse,
) => {
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

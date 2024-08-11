import actionBrowserRestart from './Action/browser_restart';
import actionCloseActiveTab from './Action/close_active_tab';
import actionCloseAllBackgroundTab from './Action/close_all_background_tab';
import actionCloseAllTab from './Action/close_all_tab';
import actionCloseLeftTab from './Action/close_left_tab';
import actionCloseLeftTabWithoutPinned from './Action/close_left_tab_without_pinned';
import actionCloseRightTab from './Action/close_right_tab';
import actionCloseRightTabWithoutPinned from './Action/close_right_tab_without_pinned';
import actionNextTab from './Action/next_tab';
import actionDuplicateTab from './Action/open_duplicate_tab';
import actionOpenExtensionPage from './Action/open_extension_page';
import actionOpenNewTab from './Action/open_new_tab';
import actionOpenNewTabBackGround from './Action/open_new_tab_background';
import actionOpenOptionPage from './Action/open_option_page';
import actionPrevTab from './Action/prev_tab';
import actionReload from './Action/reload';
import actionReloadAll from './Action/reload_all';
import actionRestoreLastTab from './Action/restore_last_tab';
import actionTogglePinTab from './Action/toggle_pin_tab';
import actionWindowMaximize from './Action/window_maximize';
import actionWindowMinimize from './Action/window_minimize';
import actionWindowNormalize from './Action/window_normalize';


/**
 * 各マウスジェスチャの処理
 */
const gestureFunction: { [key: string]: (GestureOptions?) => void | Promise<void> } = {
  'close_all': actionCloseAllTab,
  'close_all_background': actionCloseAllBackgroundTab,
  'close_left_tab': actionCloseLeftTab,
  'close_left_tab_without_pinned': actionCloseLeftTabWithoutPinned,
  'close_right_tab': actionCloseRightTab,
  'close_right_tab_without_pinned': actionCloseRightTabWithoutPinned,
  'close_tab': actionCloseActiveTab,
  'duplicate_tab': actionDuplicateTab,
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
  'window_maximize': actionWindowMaximize,
  'window_minimize': actionWindowMinimize,
  'window_normalize': actionWindowNormalize,
};

/**
 * Backgroundで処理できるアクションなら実行する
 *
 * @param {string} actionName
 * @param {null|string} href
 * @return {boolean}
 */
export const backgroundActions = (
  actionName: string,
  href: null | string = null,
): boolean => {
  if (!gestureFunction.hasOwnProperty(actionName)) {
    return false;
  }
  if (typeof gestureFunction[actionName] !== 'function') {
    return false;
  }

  const optionParams: { href: null | string; } = {
    href,
  };
  gestureFunction[actionName](optionParams);

  return true;
};

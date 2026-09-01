/**
 * Validate and sanitize gesture inputs to restrict to allowed gesture directions (R, D, L, U)
 */
const sanitizeGesture = (val: unknown, defaultVal: string): string => {
  return typeof val === 'string' && /^[RDLU]*$/.test(val) ? val : defaultVal;
};

/**
 *
 */
class Option {
  public readonly enabled: boolean;
  public readonly language: string;
  public readonly colorCode: string;
  public readonly lineWidth: number;
  public readonly commandTextOn: boolean;
  public readonly actionTextOn: boolean;
  public readonly trailOn: boolean;

  public readonly gestureCloseTab: string;
  public readonly gestureCloseTabWithoutPinned: string;
  public readonly gestureNewTab: string;
  public readonly gestureNewTabBackground: string;
  public readonly gestureDuplicateTab: string;
  public readonly gesturePinTab: string;
  public readonly gestureReload: string;
  public readonly gestureForward: string;
  public readonly gestureBack: string;
  public readonly gestureScrollTop: string;
  public readonly gestureScrollBottom: string;
  public readonly gestureLastTab: string;
  public readonly gestureReloadAll: string;
  public readonly gestureNextTab: string;
  public readonly gesturePrevTab: string;
  public readonly gestureCloseRightTabWithoutPinned: string;
  public readonly gestureCloseRightTab: string;
  public readonly gestureCloseLeftTabWithoutPinned: string;
  public readonly gestureCloseLeftTab: string;
  public readonly gestureCloseAllBackground: string;
  public readonly gestureCloseAll: string;
  public readonly gestureOpenOption: string;
  public readonly gestureOpenExtension: string;
  // public readonly gestureRestart: string;
  public readonly gestureWindowMaximize: string;
  public readonly gestureWindowMinimize: string;
  public readonly gestureWindowNormalize: string;

  /**
     *
     * @param {any} value
     */
  constructor(value) {
    this.enabled = value.enabled ?? true;
    const isValidLanguage = value.language === 'Japanese' || value.language === 'English';
    this.language = isValidLanguage ? value.language : 'Japanese';
    const isHexColor =
      typeof value.color_code === 'string' && /^#([0-9a-fA-F]{3}){1,2}$/.test(value.color_code);
    this.colorCode = isHexColor ? value.color_code : '#FF0000';

    const parsedLineWidth = typeof value.line_width === 'number'
      ? value.line_width
      : typeof value.line_width === 'string'
        ? parseInt(value.line_width, 10)
        : NaN;
    const isValidWidth =
      Number.isInteger(parsedLineWidth) && parsedLineWidth >= 1 && parsedLineWidth <= 50;
    this.lineWidth = isValidWidth ? parsedLineWidth : 3;
    this.commandTextOn = value.command_text_on ?? true;
    this.actionTextOn = value.action_text_on ?? true;
    this.trailOn = value.trail_on ?? true;

    this.gestureCloseTab = sanitizeGesture(value.gesture_close_tab, '');
    this.gestureCloseTabWithoutPinned = sanitizeGesture(
        value.gesture_close_tab_without_pinned,
        'DR',
    );
    this.gestureNewTab = sanitizeGesture(value.gesture_new_tab, 'D');
    this.gestureNewTabBackground = sanitizeGesture(value.gesture_new_tab_background, '');
    this.gestureDuplicateTab = sanitizeGesture(value.gesture_duplicate_tab, '');
    this.gesturePinTab = sanitizeGesture(value.gesture_pin_tab, '');
    this.gestureReload = sanitizeGesture(value.gesture_reload, 'DU');
    this.gestureForward = sanitizeGesture(value.gesture_forward, 'R');
    this.gestureBack = sanitizeGesture(value.gesture_back, 'L');
    this.gestureScrollTop = sanitizeGesture(value.gesture_scroll_top, '');
    this.gestureScrollBottom = sanitizeGesture(value.gesture_scroll_bottom, '');
    this.gestureLastTab = sanitizeGesture(value.gesture_last_tab, '');
    this.gestureReloadAll = sanitizeGesture(value.gesture_reload_all, '');
    this.gestureNextTab = sanitizeGesture(value.gesture_next_tab, '');
    this.gesturePrevTab = sanitizeGesture(value.gesture_prev_tab, '');
    this.gestureCloseRightTabWithoutPinned = sanitizeGesture(
        value.gesture_close_right_tab_without_pinned,
        '',
    );
    this.gestureCloseRightTab = sanitizeGesture(value.gesture_close_right_tab, '');
    this.gestureCloseLeftTabWithoutPinned = sanitizeGesture(
        value.gesture_close_left_tab_without_pinned,
        '',
    );
    this.gestureCloseLeftTab = sanitizeGesture(value.gesture_close_left_tab, '');
    this.gestureCloseAllBackground = sanitizeGesture(value.gesture_close_all_background, '');
    this.gestureCloseAll = sanitizeGesture(value.gesture_close_all, '');
    this.gestureOpenOption = sanitizeGesture(value.gesture_open_option, 'RDLU');
    this.gestureOpenExtension = sanitizeGesture(value.gesture_open_extension, 'RDL');

    this.gestureWindowMaximize = sanitizeGesture(value.gesture_window_maximize, '');
    this.gestureWindowMinimize = sanitizeGesture(value.gesture_window_minimize, '');
    this.gestureWindowNormalize = sanitizeGesture(value.gesture_window_normalize, '');
  }

  /**
     * @return {object}
     */
  public serialize(): object {
    return {
      action_text_on: this.actionTextOn,
      color_code: this.colorCode,
      command_text_on: this.commandTextOn,
      enabled: this.enabled,
      gesture_back: this.gestureBack,
      gesture_close_all: this.gestureCloseAll,
      gesture_close_all_background: this.gestureCloseAllBackground,

      gesture_close_left_tab: this.gestureCloseLeftTab,
      gesture_close_left_tab_without_pinned: this.gestureCloseLeftTabWithoutPinned,
      gesture_close_right_tab: this.gestureCloseRightTab,
      gesture_close_right_tab_without_pinned: this.gestureCloseRightTabWithoutPinned,
      gesture_close_tab: this.gestureCloseTab,
      gesture_close_tab_without_pinned: this.gestureCloseTabWithoutPinned,
      gesture_duplicate_tab: this.gestureDuplicateTab,
      gesture_forward: this.gestureForward,
      gesture_last_tab: this.gestureLastTab,
      gesture_new_tab: this.gestureNewTab,
      gesture_new_tab_background: this.gestureNewTabBackground,
      gesture_next_tab: this.gestureNextTab,
      gesture_open_extension: this.gestureOpenExtension,
      gesture_open_option: this.gestureOpenOption,
      gesture_pin_tab: this.gesturePinTab,
      gesture_prev_tab: this.gesturePrevTab,
      gesture_reload: this.gestureReload,
      gesture_reload_all: this.gestureReloadAll,
      gesture_scroll_bottom: this.gestureScrollBottom,
      gesture_scroll_top: this.gestureScrollTop,
      gesture_window_maximize: this.gestureWindowMaximize,
      gesture_window_minimize: this.gestureWindowMinimize,
      gesture_window_normalize: this.gestureWindowNormalize,

      language: this.language,
      line_width: this.lineWidth,
      trail_on: this.trailOn,
      // gesture_restart: '',
    };
  }

  /**
     * @return {string}
     */
  public toJson(): string {
    return JSON.stringify(this.serialize());
  }
}

export default Option;

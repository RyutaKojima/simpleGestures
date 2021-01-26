class Option {
    public readonly language: string;
    public readonly colorCode: string;
    public readonly lineWidth: number;
    public readonly commandTextOn: boolean;
    public readonly actionTextOn: boolean;
    public readonly trailOn: boolean;

    public readonly gestureCloseTab: string;
    public readonly gestureNewTab: string;
    public readonly gestureNewTabBackground: string;
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

    constructor(value) {
        this.language = value.language ?? 'Japanese';
        this.colorCode = value.color_code ?? '#FF0000';
        this.lineWidth = value.line_width ?? 3;
        this.commandTextOn = value.command_text_on ?? true;
        this.commandTextOn = value.actionTextOn ?? true;
        this.trailOn = value.trail_on ?? true;

        this.gestureCloseTab = value.gesture_close_tab ?? 'DR';
        this.gestureNewTab = value.gesture_new_tab ?? 'D';
        this.gestureNewTabBackground = value.gesture_new_tab_background ?? '';
        this.gesturePinTab = value.gesture_pin_tab ?? '';
        this.gestureReload = value.gesture_reload ?? 'DU';
        this.gestureForward = value.gesture_forward ?? 'R';
        this.gestureBack = value.gesture_back ?? 'L';
        this.gestureScrollTop = value.gesture_scroll_top ?? '';
        this.gestureScrollBottom = value.gesture_scroll_bottom ?? '';
        this.gestureLastTab = value.gesture_last_tab ?? '';
        this.gestureReloadAll = value.gesture_reload_all ?? '';
        this.gestureNextTab = value.gesture_next_tab ?? '';
        this.gesturePrevTab = value.gesture_prev_tab ?? '';
        this.gestureCloseRightTabWithoutPinned = value.gesture_close_right_tab_without_pinned ?? '';
        this.gestureCloseRightTab = value.gesture_close_right_tab ?? '';
        this.gestureCloseLeftTabWithoutPinned = value.gesture_close_left_tab_without_pinned ?? '';
        this.gestureCloseLeftTab = value.gesture_close_left_tab ?? '';
        this.gestureCloseAllBackground = value.gesture_close_all_background ?? '';
        this.gestureCloseAll = value.gesture_close_all ?? '';
        this.gestureOpenOption = value.gesture_open_option ?? 'RDLU';
        this.gestureOpenExtension = value.gesture_open_extension ?? 'RDL';
    }

    public serialize(): Object {
        return {
            language: this.language,
            color_code: this.colorCode,
            line_width: this.lineWidth,
            command_text_on: this.commandTextOn,
            action_text_on: this.actionTextOn,
            trail_on: this.trailOn,

            gesture_close_tab: this.gestureCloseTab,
            gesture_new_tab: this.gestureNewTab,
            gesture_new_tab_background: this.gestureNewTabBackground,
            gesture_pin_tab: this.gesturePinTab,
            gesture_reload: this.gestureReload,
            gesture_forward: this.gestureForward,
            gesture_back: this.gestureBack,
            gesture_scroll_top: this.gestureScrollTop,
            gesture_scroll_bottom: this.gestureScrollBottom,
            gesture_last_tab: this.gestureLastTab,
            gesture_reload_all: this.gestureReloadAll,
            gesture_next_tab: this.gestureNextTab,
            gesture_prev_tab: this.gesturePrevTab,
            gesture_close_right_tab_without_pinned: this.gestureCloseRightTabWithoutPinned,
            gesture_close_right_tab: this.gestureCloseRightTab,
            gesture_close_left_tab_without_pinned: this.gestureCloseLeftTabWithoutPinned,
            gesture_close_left_tab: this.gestureCloseLeftTab,
            gesture_close_all_background: this.gestureCloseAllBackground,
            gesture_close_all: this.gestureCloseAll,
            gesture_open_option: this.gestureOpenOption,
            gesture_open_extension: this.gestureOpenExtension,
            // gesture_restart: '',
        }
    };

    public toJson(): string {
        return JSON.stringify(this.serialize());
    };
}

export default Option;

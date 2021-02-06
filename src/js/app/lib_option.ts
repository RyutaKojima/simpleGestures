import MyStorage from './storage';
import Option from "./domains/ValueObjects/option";
import camelcase from "camelcase";

/**
 * オプション情報管理
 */
class LibOption {
  LOCAL_STORAGE_KEY: string;
  OPTION_ID_LIST: string[];
  GESTURE_ID_LIST: string[];
  storage: MyStorage;
  localStorage: MyStorage;
  storageData: any;
  optionsInstance: Option|null;
  gestureHash: {
    [key: string]: string
  };

  /**
   * @constructor
   */
  constructor() {
    /**
     * ローカル領域に保存するときのキー
     * @const
     */
    this.LOCAL_STORAGE_KEY = 'options';

    this.storage = new MyStorage(MyStorage.CHROME_STORAGE_LOCAL);
    this.localStorage = new MyStorage(MyStorage.LOCAL_STORAGE);

    /**
     * @const
     */
    this.OPTION_ID_LIST = [
      'color_code',
      'line_width',
    ];

    /**
     * @const
     */
    this.GESTURE_ID_LIST = [
      'gesture_close_tab',
      'gesture_new_tab',
      'gesture_new_tab_background',
      'gesture_pin_tab',
      'gesture_reload',
      'gesture_forward',
      'gesture_back',
      'gesture_scroll_top',
      'gesture_scroll_bottom',
      'gesture_last_tab',
      'gesture_reload_all',
      'gesture_next_tab',
      'gesture_prev_tab',
      'gesture_close_right_tab_without_pinned',
      'gesture_close_right_tab',
      'gesture_close_left_tab_without_pinned',
      'gesture_close_left_tab',
      'gesture_close_all_background',
      'gesture_close_all',
      'gesture_open_option',
      'gesture_open_extension',
      // "gesture_restart"
    ];

    this.storageData = null;
    this.optionsInstance = null;
    this.gestureHash = {};
  }


  /**
   *
   * @return {undefined}
   */
  reset(): void {
    this.localStorage.clear();
    this.storage.clear();

    this.load();
  };

  /**
   * 永続化データを読み込み
   */
  async load(): Promise<void> {
    this.storageData = await this.storage.load(this.LOCAL_STORAGE_KEY).catch((e) => {
      this.storageData = null;
      console.error(e);
    });

    if ( ! this.storageData) {
      this.storageData = await this.localStorage.load(this.LOCAL_STORAGE_KEY);
      this.setRawStorageData(this.storageData);
      this.save();
    }

    this.setRawStorageData(this.storageData);
  };

  /**
   * 永続化したデータのままを取得
   * @return {null|Object}
   */
  getRawStorageData(): null|Object {
    return this.storageData;
  }

  /**
   * 永続化データを設定
   * @param {Object} rawStorageData
   */
  setRawStorageData(rawStorageData: Object) {
    this.storageData = rawStorageData;

    if (this.storageData === null) {
      this.optionsInstance = new Option({});
    } else {
      this.optionsInstance = new Option(JSON.parse(this.storageData));
    }

    this.gestureHash = {};
    this.GESTURE_ID_LIST.forEach((key) => {
      if (this.paramExists(key)) {
        const command: string = this.getParam(key, '');
        const action: string = key.replace('gesture_', '');
        if (command) {
          // cut "gesture_" prefix
          this.gestureHash[command] = action;
        }
      }
    });
  }

  /**
   * ジェスチャ名が存在するかを確認
   *
   * @param {string} paramName
   * @return {string[]|boolean}
   */
  enableGestureParam(paramName: string): boolean {
    return (this.GESTURE_ID_LIST && this.GESTURE_ID_LIST.indexOf(paramName) !== -1);
  };

  /**
   * オプション設定値が存在するか確認
   *
   * @param {string} paramName
   * @return {null|boolean}
   */
  paramExists(paramName: string): boolean {
    const camelParamName = camelcase(paramName)
    return (this.optionsInstance && this.optionsInstance.hasOwnProperty(camelParamName));
  }

  /**
   * 設定パラメータ値を取得
   *
   * @param {string} paramName
   * @param {*} defaultValue
   * @return {*}
   */
  getParam(paramName: string, defaultValue: any): any {
    const camelParamName = camelcase(paramName)
    return this.paramExists(camelParamName) ? this.optionsInstance[camelParamName] : defaultValue;
  }

  /**
   * 設定パラメータ値を設定
   *
   * @param {string} paramName
   * @param {*} value
   */
  setParam(paramName: string, value: any): void {
    if (this.paramExists(paramName) || this.enableGestureParam(paramName)) {
      this.optionsInstance = new Option({...this.optionsInstance.serialize(), [paramName]: value})
    }
  }

  /**
   * コマンドからジェスチャ名を取得
   *
   * @param {string} command
   * @return {*}
   */
  getGestureActionName(command: string): null|string {
    if (this.gestureHash && this.gestureHash.hasOwnProperty(command)) {
      return this.gestureHash[command];
    }

    return null;
  }

  /**
   * 言語設定が「日本語」か？
   * @return {boolean}
   */
  isJapanese(): boolean {
    return (this.getLanguage() === 'Japanese');
  }

  /**
   * 言語設定が「英語」か？
   *
   * @return {boolean}
   */
  isEnglish(): boolean {
    return (this.getLanguage() === 'English');
  };

  /**
   * 言語設定を返す
   */
  getLanguage(): 'Japanese'|'English' {
    return this.getParam('language', 'English');
  }

  /**
   * ジェスチャ軌跡/コマンド/アクションの表示色を返す
   *
   * @return {string}
   */
  getColorCode(): string {
    return this.getParam('color_code', '#FF0000');
  }

  /**
   * ジェスチャ軌跡の太さを返す
   * @return {number}
   */
  getLineWidth(): number {
    return this.getParam('line_width', 1);
  }

  /**
   * コマンドを表示するか？
   *
   * @return {boolean}
   */
  isCommandTextOn(): boolean {
    return this.getParam('command_text_on', true);
  }

  /**
   * アクションを表示するか？
   *
   * @return {boolean}
   */
  isActionTextOn(): boolean {
    return this.getParam('action_text_on', true);
  }

  /**
   * ジェスチャ軌跡を表示するか？
   *
   * @return {boolean}
   */
  isTrailOn(): boolean {
    return this.getParam('trail_on', true);
  }

  /**
   * すでに同じジェスチャが何かのアクションに設定されている
   *
   * @param {string} gesture
   * @return {boolean|string}
   */
  isGestureAlreadyExist(gesture: string): string|boolean {
    let actionName: string|boolean = false;

    this.GESTURE_ID_LIST.forEach((key: string) => {
      const setText = this.getParam(key, '');

      if (gesture === setText) {
        actionName = key;
      }
    });

    return actionName;
  }

  /**
   * 永続化する
   */
  save(): void {
    const saveRawData: string = this.optionsInstance.toJson();
    this.storage.save(this.LOCAL_STORAGE_KEY, saveRawData);
    // this.localStorage.save(this.LOCAL_STORAGE_KEY, saveRawData);
  }
}

export default LibOption;

/**
 * マウスの状態を管理する
 */
class Mouse {
  // 定数の定義
  static get LEFT_BUTTON() {
    return 1;
  }

  static get RIGHT_BUTTON() {
    return 3;
  }

  constructor() {
    /**
     * マウスの入力状態を記録する配列
     */
    this.btnBuffer = [];
  }

  /**
   * マウスイベントから、リンクURLを取得して返す
   *
   * @param {Object} mouseevent
   * @return {*}
   */
  static getHref(mouseevent) {
    if (mouseevent.target.href) {
      return mouseevent.target.href;
    }
    if (mouseevent.target.parentElement && mouseevent.target.parentElement.href) {
      return mouseevent.target.parentElement.href;
    }
    return null;
  }


  /**
   * 現在の入力状態をリセットする
   */
  reset() {
    this.btnBuffer = [];
  }

  /**
   * 基本操作メソッド
   * @param {numeric} btnCode
   * @return {*}
   */
  isOn(btnCode) {
    return this.btnBuffer[btnCode];
  }

  /**
   *
   * @param {string|numeric} btnCode
   */
  setOn(btnCode) {
    this.btnBuffer[btnCode] = true;
  }

  /**
   *
   * @param {mixed} btnCode
   */
  setOff(btnCode) {
    this.btnBuffer[btnCode] = false;
  }

  /**
   * @returns {boolean}
   */
  isLeft() {
    return this.btnBuffer[Mouse.LEFT_BUTTON];
  }

  /**
   * @param {boolean} _flg
   */
  setLeft(_flg) {
    this.btnBuffer[Mouse.LEFT_BUTTON] = _flg;
  }

  /**
   * @returns {boolean}
   */
  isRight() {
    return this.btnBuffer[Mouse.RIGHT_BUTTON];
  }

  /**
   * @param {boolean} _flg
   */
  setRight(_flg) {
    this.btnBuffer[Mouse.RIGHT_BUTTON] = _flg;
  }
}

export default Mouse;

/**
 * キーボードの状態を管理する
 */
class Keyboard {
  /**
   * @constructor
   */
  constructor() {
    this.lockedCount = 0;

    /**
     * キーボードの入力状態を記録する配列
     */
    this.keyBuffer = [];
  }

  /**
   * @return {number}
   */
  static get KEY_CTRL() {
    return 17;
  }

  /**
   * 現在の入力状態をリセットする
   *
   * @return {Keyboard}
   */
  reset() {
    console.log('reset keyboard');
    this.keyBuffer = [];
    return this;
  }

  /**
   * キーボードの押されたイベントをロックする
   *
   * @return {Keyboard}
   */
  lock() {
    this.lockedCount++;
    return this;
  }

  /**
   * キーボードの押されたイベントをロック解除する
   *
   * @return {Keyboard}
   */
  unlock() {
    if (this.lockedCount) {
      this.lockedCount--;
    }
    return this;
  }

  /**
   * 指定したキーが押されているか判定する。 押されていたら true
   *
   * @param {number} keyCode
   * @return {bool}
   */
  isOn(keyCode) {
    return this.keyBuffer[keyCode];
  }

  /**
   * キーを押された状態に設定する
   *
   * @param {number} keyCode
   * @return {Keyboard}
   */
  setOn(keyCode) {
    if (this.lockedCount) {
      return this;
    }

    console.log('on keybord: ' + keyCode);

    this.keyBuffer[keyCode] = true;

    return this;
  }

  /**
   * キーを離した状態に設定する
   *
   * @param {number} keyCode
   * @return {Keyboard}
   */
  setOff(keyCode) {
    console.log('off keybord: ' + keyCode);

    this.keyBuffer[keyCode] = false;
    return this;
  }
}

export default Keyboard;


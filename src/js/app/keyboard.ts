/**
 * キーボードの状態を管理する
 */
class Keyboard {
  lockedCount: number;

  /**
   * キーボードの入力状態を記録する配列
   */
  keyBuffer: {[key:string]: boolean};

  /**
   * @constructor
   */
  constructor() {
    this.lockedCount = 0;
    this.keyBuffer = {};
  }

  /**
   * @return {string}
   */
  static get KEY_CTRL(): string {
    return 'Control';
  }

  /**
   * 現在の入力状態をリセットする
   * @return {Keyboard}
   */
  reset(): Keyboard {
    console.log('reset keyboard');
    this.keyBuffer = {};
    return this;
  }

  /**
   * キーボードの押されたイベントをロックする
   * @return {Keyboard}
   */
  lock(): Keyboard {
    this.lockedCount++;
    return this;
  }

  /**
   * キーボードの押されたイベントをロック解除する
   * @return {Keyboard}
   */
  unlock(): Keyboard {
    if (this.lockedCount) {
      this.lockedCount--;
    }
    return this;
  }

  /**
   * 指定したキーが押されているか判定する。 押されていたら true
   * @param {string} keyCode
   * @return {boolean}
   */
  isOn(keyCode: string): boolean {
    return this.keyBuffer[keyCode];
  }

  /**
   * キーを押された状態に設定する
   * @param {string} keyCode
   * @return {Keyboard}
   */
  setOn(keyCode: string): Keyboard {
    if (this.lockedCount) {
      return this;
    }

    console.log('on keyboard: ' + keyCode);

    this.keyBuffer[keyCode] = true;

    return this;
  }

  /**
   * キーを離した状態に設定する
   * @param {string} keyCode
   * @return {Keyboard}
   */
  setOff(keyCode: string): Keyboard {
    console.log('off keyboard: ' + keyCode);

    this.keyBuffer[keyCode] = false;
    return this;
  }
}

export default Keyboard;

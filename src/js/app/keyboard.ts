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

  static get KEY_CTRL(): string {
    return 'Control';
  }

  /**
   * 現在の入力状態をリセットする
   */
  reset(): Keyboard {
    console.log('reset keyboard');
    this.keyBuffer = {};
    return this;
  }

  /**
   * キーボードの押されたイベントをロックする
   */
  lock(): Keyboard {
    this.lockedCount++;
    return this;
  }

  /**
   * キーボードの押されたイベントをロック解除する
   */
  unlock(): Keyboard {
    if (this.lockedCount) {
      this.lockedCount--;
    }
    return this;
  }

  /**
   * 指定したキーが押されているか判定する。 押されていたら true
   */
  isOn(keyCode: string): boolean {
    return this.keyBuffer[keyCode];
  }

  /**
   * キーを押された状態に設定する
   */
  setOn(keyCode: string): Keyboard {
    if (this.lockedCount) {
      return this;
    }

    console.log('on keybord: ' + keyCode);

    this.keyBuffer[keyCode] = true;

    return this;
  }

  /**
   * キーを離した状態に設定する
   */
  setOff(keyCode: string): Keyboard {
    console.log('off keybord: ' + keyCode);

    this.keyBuffer[keyCode] = false;
    return this;
  }
}

export default Keyboard;

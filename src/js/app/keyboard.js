/**
 * キーボードの状態を管理する
 *
 * @constructor
 */
const Keyboard = function() {
  /** @const */
  this.KEY_CTRL = 17;

  this.lockedCount = 0;

  /**
	 * キーボードの入力状態を記録する配列
	 */
  this.keyBuffer = [];
};

/**
 * 現在の入力状態をリセットする
 */
Keyboard.prototype.reset = function() {
  console.log('reset keyboard');

  this.keyBuffer = [];
};

/**
 * キーボードの押されたイベントをロックする
 */
Keyboard.prototype.lock = function() {
  this.lockedCount++;
};
Keyboard.prototype.unlock = function() {
  if (this.lockedCount) {
    this.lockedCount--;
  }
};

/**
 * 指定したキーが押されているか判定する。 押されていたら true
 *
 * @param {number} keyCode
 * @return {bool}
 */
Keyboard.prototype.isOn = function(keyCode) {
  return this.keyBuffer[keyCode];
};

/**
 * キーを押された状態に設定する
 *
 * @param {number} keyCode
 */
Keyboard.prototype.setOn = function(keyCode) {
  if (this.lockedCount) {
    return;
  }

  console.log('on keybord: '+keyCode);

  this.keyBuffer[keyCode] = true;
};

/**
 * キーを離した状態に設定する
 *
 * @param {number} keyCode
 */
Keyboard.prototype.setOff = function(keyCode) {
  console.log('off keybord: '+keyCode);

  this.keyBuffer[keyCode] = false;
};

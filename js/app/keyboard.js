/**
 * キーボードの状態を管理する
 *
 * @constructor
 */
var Keyboard = function() {
	/** @const */
	this.KEY_CTRL = 17;

	/**
	 * キーボードの入力状態を記録する配列
	 */
	this.key_buffer = new Array();
};

/**
 * 現在の入力状態をリセットする
 */
Keyboard.prototype.reset = function() {
	this.key_buffer = new Array();
};

/**
 * 指定したキーが押されているか判定する。 押されていたら true
 * @param keyCode
 * @returns bool
 */
Keyboard.prototype.isOn = function(keyCode) {
	return this.key_buffer[keyCode];
};

/**
 * キーを押された状態に設定する
 * @param keyCode
 */
Keyboard.prototype.setOn = function(keyCode) {
	this.key_buffer[keyCode] = true;
};

/**
 * キーを離した状態に設定する
 * @param keyCode
 */
Keyboard.prototype.setOff = function(keyCode) {
	this.key_buffer[keyCode] = false;
};
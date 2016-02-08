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

Keyboard.prototype.isOn = function(keyCode) {
	return this.key_buffer[keyCode];
}

Keyboard.prototype.setOn = function(keyCode) {
	this.key_buffer[keyCode] = true;
};

Keyboard.prototype.setOff = function(keyCode) {
	this.key_buffer[keyCode] = false;
};
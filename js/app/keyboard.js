/**
 * キーボードの状態を管理する
 *
 * @constructor
 */
const Keyboard = function() {
	/** @const */
	this.KEY_CTRL = 17;

	this.locked_count = 0;

	/**
	 * キーボードの入力状態を記録する配列
	 */
	this.key_buffer = [];
};

/**
 * 現在の入力状態をリセットする
 */
Keyboard.prototype.reset = function() {
	console.log("reset keybord");

	this.key_buffer = [];
};

/**
 * キーボードの押されたイベントをロックする
 */
Keyboard.prototype.lock = function() {
	this.locked_count++;
};
Keyboard.prototype.unlock = function() {
	if (this.locked_count) {
		this.locked_count--;
	}
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
	if (this.locked_count) {
		return;
	}

	console.log("on keybord: "+keyCode);

	this.key_buffer[keyCode] = true;
};

/**
 * キーを離した状態に設定する
 * @param keyCode
 */
Keyboard.prototype.setOff = function(keyCode) {
	console.log("off keybord: "+keyCode);

	this.key_buffer[keyCode] = false;
};
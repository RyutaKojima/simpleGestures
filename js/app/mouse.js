/**
 * マウスの状態を管理する
 *
 * @constructor
 */
var Mouse = function() {
	/** @const */
	this.LEFT_BUTTON = 1;

	/** @const */
	this.RIGHT_BUTTON = 3;

	/**
	 * マウスの入力状態を記録する配列
	 */
	this.btn_buffer = [];
};

/**
 * マウスイベントから、リンクURLを取得して返す
 *
 * @param mouseevent
 * @returns {*}
 */
Mouse.getHref = function (mouseevent) {
	if (mouseevent.target.href) {
		return mouseevent.target.href;
	}
	else if (mouseevent.target.parentElement && mouseevent.target.parentElement.href) {
		return mouseevent.target.parentElement.href;
	}
	else {
		return null;
	}
};

/**
 * 現在の入力状態をリセットする
 */
Mouse.prototype.reset = function() {
	this.btn_buffer = [];
};

/**
 * 基本操作メソッド
 * @param btnCode
 * @returns {*}
 */
Mouse.prototype.isOn = function(btnCode) {
	return this.btn_buffer[btnCode];
};

Mouse.prototype.setOn = function(btnCode) {
	this.btn_buffer[btnCode] = true;
};

Mouse.prototype.setOff = function(btnCode) {
	this.btn_buffer[btnCode] = false;
};

// --------------------------------------------------------------------------------
// for Left Button

Mouse.prototype.isLeft = function() {
	return this.btn_buffer[this.LEFT_BUTTON];
};

Mouse.prototype.setLeft = function(_flg) {
	this.btn_buffer[this.LEFT_BUTTON] = _flg;
};

// --------------------------------------------------------------------------------
// for Right Button
Mouse.prototype.isRight = function() {
	return this.btn_buffer[this.RIGHT_BUTTON];
};

Mouse.prototype.setRight = function(_flg) {
	this.btn_buffer[this.RIGHT_BUTTON] = _flg;
};

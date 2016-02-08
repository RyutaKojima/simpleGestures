/**
 * 標準関数を定義
 */

/**
 * デバッグ用のログをコンソールに出力する
 */
var debug_log = function (str) {
	if (DEBUG_ON) {
		console.log(str);
	}
}

var x_debug_log = function (str) {
	console.log(str);
}

/**
 *
 */
var getParent = function(win) {
	if (win.parent && win.parent != win) {
		return arguments.callee(win.parent);
	}
	else {
		return win;
	}
}

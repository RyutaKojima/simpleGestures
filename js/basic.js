/**
 * 標準関数を定義
 */

/**
 * デバッグ用のログをコンソールに出力する
 */
function debug_log(str) {
	if (DEBUG_ON) {
		console.log(str);
	}
}

function x_debug_log(str) {
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
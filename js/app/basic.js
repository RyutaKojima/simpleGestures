/**
 * 標準関数を定義
 */

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

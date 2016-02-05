/**
 * 命名規則 (よく忘れるので、ココのみメモ)
 *
 * 関数は		functionNamesLikeThis
 * 変数は		variableNamesLikeThis
 * クラスは		ClassNamesLikeThis
 * 列挙型は		EnumNamesLikeThis
 * メソッドは	methodNamesLikeThis
 * 定数は		CONSTANT_VALUES_LIKE_THIS
 * 名前空間は	foo.namespaceNamesLikeThis.bar
 * ファイルは	filenameslikethis.js
 */

var DEBUG_ON = false;
var KEY_CTRL = 17;

//--------------------------------------------------------------------------------------------------
// Global Variables
//--------------------------------------------------------------------------------------------------
var trailCanvas			= null;
var infoDiv				= null;
var commandDiv			= null;
var actionNameDiv		= null;

// option variables
var optionsHash	= null;

var optTrailColor		= '#FF0000';
var optTrailWidth		= 3;
var optDrawTrailOn		= true;
var optDrawActionNameOn	= true;
var optDrawCommandOn	= false;
var optGestureHash		= new Object();	// hash: gesture list

// work variables
var gesture_man = new LibGesture();
var locker_on			= false;
var next_menu_skip		= true;

var link_url			= null;
var lmousedown			= false;
var rmousedown			= false;
var input_key_buffer	= new Array();	// キーボードの入力状態を記録する配列

var contentScripts		= new ContentScripts();

//--------------------------------------------------------------------------------------------------
// Event Handler
//--------------------------------------------------------------------------------------------------
/**
 * entory point.
 */
$(window).ready(function onready_handler() {
//	debug_log("$(window).ready");
//	debug_log("frames=" + window.frames.length);
	input_key_buffer = new Array();
});

$(window).load(function onload_handler() {
//	debug_log("$(window).load");
	input_key_buffer = new Array();
});

/**
 * キーボードを押したときに実行されるイベント
 */
$(document).on('keydown', function (e) {
	// InternetExplorer 用
	if (!e)	e = window.event;

	debug_log('onkeydown: ' + e.keyCode);

	input_key_buffer[e.keyCode] = true;
});

/**
 * キーボードを離したときに実行されるイベント
 */
$(document).on('keyup', function (e) {
	// InternetExplorer 用
	if (!e)	e = window.event;

	input_key_buffer[e.keyCode] = false;
});

/**
 * いずれかのマウスボタンを押したときに実行されるイベント
 */
$(document).on('mousedown', function onmousedown_handler(event) {
//	debug_log("down (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	// 初回の初期化
	contentScripts.initializeExtensionOnce();

	// Ctrlが押された状態だと、マウスジェスチャを開始しない。
	if (input_key_buffer[KEY_CTRL] === true) {
		return;
	}

	// down button type
	if (event.which === 1) {
		lmousedown = true;

		// locker gesture
		if (lmousedown & rmousedown) {
			locker_on = true;
			contentScripts.exeAction("back");
		}
	}
	else if (event.which === 3) {
		rmousedown = true;
		next_menu_skip = false;

		// locker gesture
		if (lmousedown & rmousedown) {
			locker_on = true;
			contentScripts.exeAction("forward");
		}

		gesture_man.clear();
		gesture_man.startGestrue(event.pageX - $(window).scrollLeft(), event.pageY - $(window).scrollTop() );

		// select link url copy
		if (event.target.href) {
			link_url = event.target.href;
		}
		else if (event.target.parentElement && event.target.parentElement.href) {
			link_url = event.target.parentElement.href;
		}
		else {
			link_url = null;
		}
		debug_log("select link: " + link_url );

		// setting
		contentScripts.loadOption();

		if (infoDiv) {
			document.body.appendChild(infoDiv);

			$("#gestureCommandDiv").html("");
			$("#gestureActionNameDiv").html("");
		}
	}
});

/**
 * マウスが移動したときに実行されるイベント
 */
$(document).on('mousemove', function onmousemove_handler(event) {
//	debug_log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	if (rmousedown) {
		var tmp_x = event.pageX - $(window).scrollLeft();
		var tmp_y = event.pageY - $(window).scrollTop();

		if (gesture_man.registPoint(tmp_x, tmp_y)) {
			if (trailCanvas) {
				document.body.appendChild(trailCanvas);
			}

			contentScripts.drawCanvas();
		}
	}
});

/**
 * いずれかのマウスボタンを離したときに実行されるイベント
 */
$(document).on('mouseup', function onmouseup_handler(event) {
//	debug_log("up (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	var tmp_canvas;

	// down button type
	if (event.which == 1) {
		lmousedown = false;
	}
	else if (event.which == 3) {
		rmousedown = false;

		// gesture action run !
		if (locker_on) {
			next_menu_skip = true;
		}
		else {
			var tmp_action_name = contentScripts.getNowGestureActionName();
			if( tmp_action_name != null ) {
				contentScripts.exeAction(tmp_action_name);
			}
		}

		// removeChild
		tmp_canvas = document.getElementById('gestureTrailCanvas');
		if (tmp_canvas) {
			document.body.removeChild(tmp_canvas);
		}

		tmp_canvas = document.getElementById('infoDiv');
		if (tmp_canvas) {
			document.body.removeChild(tmp_canvas);
		}

		link_url = null;
		contentScripts.clearCanvas();
		locker_on = false;
	}
});

/**
 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
 * falseを返すと、コンテキストメニューを無効にする。
 */
$(document).on('contextmenu', function oncontextmenu_handler() {
	debug_log(arguments.callee.name);

	if (next_menu_skip) {
		next_menu_skip = false;
		return false;
	}
	else if (lmousedown || rmousedown) {
		return false;
	}
	else if (gesture_man.gesture_command === "") {
		return true;
	}
	else {
		return false;
	}

	return true;
});

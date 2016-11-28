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

var DEBUG_ON = true;

/**
 * デバッグモード以外では console.log を出力しない
 */
if (typeof DEBUG_ON == 'undefined' || ! DEBUG_ON) {
	console.log = function(dummy){}
}

(function(){
	//--------------------------------------------------------------------------------------------------
	// Global Variables
	//--------------------------------------------------------------------------------------------------
	// option variables
	var optionsHash	= null;
	var optGestureHash = new Object();	// hash: gesture list
	var lockerOn = false;
	var nextMenuSkip = true;

	var inputMouse = new Mouse();
	var inputKeyboard = new Keyboard();
	var mainGestureMan = new LibGesture();
	var contentScripts = new ContentScripts(mainGestureMan);

//--------------------------------------------------------------------------------------------------
// Event Handler
//--------------------------------------------------------------------------------------------------
	/**
	 * entory point.
	 */
	$(window).ready(function onready_handler() {
		console.log("$(window).ready: frames=" + window.frames.length);
	});

	/**
	 * キーボードを押したときに実行されるイベント
	 */
	$(document).on('keydown', function (e) {
		inputKeyboard.setOn(e.keyCode);

		chrome.extension.sendMessage({msg: 'keydown', keyCode: e.keyCode}, function(response) {
			if (response !== null) {
				console.log("message: " + response.message);
			}
		});
	});

	/**
	 * キーボードを離したときに実行されるイベント
	 */
	$(document).on('keyup', function (e) {
		inputKeyboard.setOff(e.keyCode);

		chrome.extension.sendMessage({msg: 'keyup', keyCode: e.keyCode}, function(response) {
			if (response !== null) {
				console.log("message: " + response.message);
			}
		});
	});

	/**
	 * いずれかのマウスボタンを押したときに実行されるイベント
	 */
	$(document).on('mousedown', function onmousedown_handler(event) {
//	console.log("down (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

		// 初回の初期化
		contentScripts.initializeExtensionOnce();

		// Ctrlが押された状態だと、マウスジェスチャ無効な仕様
		if (inputKeyboard.isOn(inputKeyboard.KEY_CTRL)) {
			return;
		}

		inputMouse.setOn(event.which);

		if (event.which === inputMouse.LEFT_BUTTON) {
			// locker gesture
			if (inputMouse.isLeft() & inputMouse.isRight()) {
				lockerOn = true;
				mainGestureMan.clearCanvas();

				contentScripts.exeAction("back");
			}
		}
		else if (event.which === inputMouse.RIGHT_BUTTON) {
			nextMenuSkip = false;

			// locker gesture
			if (inputMouse.isLeft() & inputMouse.isRight()) {
				lockerOn = true;

				contentScripts.exeAction("forward");
			}

			mainGestureMan.clear();

			if ( ! lockerOn) {
				var link_url = null;
				if (event.target.href) {
					link_url = event.target.href;
				}
				else if (event.target.parentElement && event.target.parentElement.href) {
					link_url = event.target.parentElement.href;
				}
				else {
					link_url = null;
				}
				console.log("select link: " + link_url );

				mainGestureMan.startGestrue(event.pageX - $(window).scrollLeft(), event.pageY - $(window).scrollTop(), link_url);

				// setting
				contentScripts.loadOption();
			}
		}
	});

	/**
	 * マウスが移動したときに実行されるイベント
	 */
	$(document).on('mousemove', function onmousemove_handler(event) {
//	console.log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);
		if (inputMouse.isRight()) {
			if ( ! lockerOn) {
				if (mainGestureMan.registPoint(event.pageX - $(window).scrollLeft(), event.pageY - $(window).scrollTop())) {
					document.body.appendChild(mainGestureMan.getCanvas());

					if (contentScripts.infoDiv) {
						document.body.appendChild(contentScripts.infoDiv);
						$("#gestureCommandDiv").html("");
						$("#gestureActionNameDiv").html("");
					}

					contentScripts.draw();
				}
			}
		}
	});

	/**
	 * いずれかのマウスボタンを離したときに実行されるイベント
	 */
	$(document).on('mouseup', function onmouseup_handler(event) {
//	console.log("up (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);
		inputMouse.setOff(event.which);

		if (event.which === inputMouse.RIGHT_BUTTON) {
			if (lockerOn) {
				nextMenuSkip = true;
			}
			else if (mainGestureMan.getGestureString()) {
				nextMenuSkip = true;

				// gesture action run !
				if( contentScripts.getNowGestureActionName() ) {
					contentScripts.exeAction(contentScripts.getNowGestureActionName());
				}
			}

			// removeChild
			if (document.getElementById(mainGestureMan.getCanvas().id)) {
				document.body.removeChild(document.getElementById(mainGestureMan.getCanvas().id));
			}

			if (document.getElementById(contentScripts.infoDiv.id)) {
				document.body.removeChild(document.getElementById(contentScripts.infoDiv.id));
			}

			mainGestureMan.endGesture();
			lockerOn = false;
		}
	});

	/**
	 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
	 * falseを返すと、コンテキストメニューを無効にする。
	 */
	$(document).on('contextmenu', function oncontextmenu_handler() {
		console.log(arguments.callee.name);

		if (nextMenuSkip) {
			nextMenuSkip = false;
			return false;
		}
		else if (inputMouse.isLeft() || inputMouse.isRight()) {
			return false;
		}
		else if (mainGestureMan.getGestureString() === "") {
			return true;
		}
		else {
			return false;
		}

		return true;
	});

})();

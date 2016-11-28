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
	var optionsHash	= null;
	var nextMenuSkip = true;

	var mainGestureMan = new LibGesture();
	var contentScripts = new ContentScripts(mainGestureMan);

	/**
	 * マウスイベントから、リンクURLを取得して返す
	 * 
	 * @param mouseevent
	 * @returns {*}
	 */
	var getHref = function (mouseevent) {
		var link_url = null;

		if (mouseevent.target.href) {
			link_url = mouseevent.target.href;
		}
		else if (mouseevent.target.parentElement && mouseevent.target.parentElement.href) {
			link_url = mouseevent.target.parentElement.href;
		}
		else {
			link_url = null;
		}
		
		return link_url;
	};

	//--------------------------------------------------------------------------------------------------
	//--------------------------------------------------------------------------------------------------
	var callee_handler = {
		ready: function () {
			console.log("$(window).ready: frames=" + window.frames.length);
		},
		keydown: function (e) {
			if (! e.originalEvent.repeat) {
				chrome.extension.sendMessage({msg: 'keydown', keyCode: e.keyCode}, function(response) {});
			}
		},
		keyup: function (e) {
			chrome.extension.sendMessage({msg: 'keyup', keyCode: e.keyCode}, function(response) {});
		},
		mousedown: function (event) {
			//console.log("down (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

			contentScripts.initializeExtensionOnce();

			var sendParam = {
				msg: 'mousedown',
				which: event.which,
				href: getHref(event),
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response !== null) {
					console.log(response);

					if (response.action) {
						contentScripts.exeAction(response.action);
					}

					if (response.canvas.clear) {
						mainGestureMan.clearCanvas();
					} else if (response.canvas.draw) {
						mainGestureMan.startGestrue(response.canvas.x, response.canvas.y, response.href);
					}

					// TODO: 既存互換
					contentScripts.loadOption();
				}
			});
		},
		mousemove: function (event) {
			//console.log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

			var sendParam = {
				msg: 'mousemove',
				which: event.which,
				href: '',
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response !== null) {
					if (response.canvas.draw) {
						mainGestureMan.registPoint(response.canvas.x, response.canvas.y);

						document.body.appendChild(mainGestureMan.getCanvas());

						if (contentScripts.infoDiv) {
							document.body.appendChild(contentScripts.infoDiv);
							$("#gestureCommandDiv").html("");
							$("#gestureActionNameDiv").html("");
						}

						contentScripts.draw(response.gestureString, response.gestureAction);
					}
				}
			});
		},
		mouseup: function (event) {
			//console.log("up (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

			var sendParam = {
				msg: 'mouseup',
				which: event.which,
				href: '',
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response !== null) {
					console.log(response);

					if (response.action) {
						contentScripts.exeAction(response.action);
					}

					// removeChild
					if (document.getElementById(mainGestureMan.getCanvas().id)) {
						document.body.removeChild(document.getElementById(mainGestureMan.getCanvas().id));
					}

					if (document.getElementById(contentScripts.infoDiv.id)) {
						document.body.removeChild(document.getElementById(contentScripts.infoDiv.id));
					}

					mainGestureMan.endGesture();
				}
			});
		},

		/**
		 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
		 * falseを返すと、コンテキストメニューを無効にする。
		 */
		contextmenu: function () {
			console.log(arguments.callee.name);

			if (nextMenuSkip) {
				nextMenuSkip = false;
				return false;
			}
			else if (mainGestureMan.getGestureString() === "") {
				return true;
			}
			else {
				return false;
			}

			return true;
		},
	};

	//--------------------------------------------------------------------------------------------------
	// Event Handler
	//--------------------------------------------------------------------------------------------------
	$(window).ready(callee_handler.ready);
	$(document).on('keydown', callee_handler.keydown);
	$(document).on('keyup', callee_handler.keyup);
	$(document).on('mousedown', callee_handler.mousedown);
	$(document).on('mousemove', callee_handler.mousemove);
	$(document).on('mouseup', callee_handler.mouseup);
	$(document).on('contextmenu', callee_handler.contextmenu);
})();

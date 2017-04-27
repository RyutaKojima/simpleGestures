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
(function(){
	var nextMenuSkip = false;
	var trailCanvas = new TrailCanvas();
	var contentScripts = new ContentScripts(trailCanvas);

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

	/**
	 * 画面表示をすべてクリア
	 */
	var clearAllDisplay = function() {
		if (trailCanvas && trailCanvas.getCanvasId()){
			var canvasId = trailCanvas.getCanvasId();
			if (document.getElementById(canvasId)) {
				document.body.removeChild(document.getElementById(canvasId));
			}
		}

		if (contentScripts.infoDiv) {
			if (document.getElementById(contentScripts.infoDiv.id)) {
				document.body.removeChild(document.getElementById(contentScripts.infoDiv.id));
			}
		}

		if (trailCanvas) {
			trailCanvas.clearCanvas();
		}
	};

	/**
	 * 各イベントのコールバックを定義する
	 * @type {{ready: ready, keydown: keydown, keyup: keyup, mousedown: mousedown, mousemove: mousemove, mouseup: mouseup, contextmenu: contextmenu}}
	 */
	var callee_handler = {
		ready: function () {
			// console.log("$(window).ready: frames=" + window.frames.length);
			contentScripts.initializeExtensionOnce();
		},
		focus: function() {
			chrome.extension.sendMessage({ msg: 'reset_input', event:'focus' }, function(response) {});
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
			var sendParam = {
				msg: 'mousedown',
				which: event.which,
				href: getHref(event),
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response === null) {
					return;
				}

				// console.log(response);

				if (response.action) {
					nextMenuSkip = true;
					contentScripts.exeAction(response.action);
				}

				if (response.canvas.clear) {
					trailCanvas.clearCanvas();
				}

				contentScripts.loadOption();
			});
		},
		mousemove: function (event) {
			// console.log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

			var sendParam = {
				msg: 'mousemove',
				which: event.which,
				href: '',
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response === null) {
					return;
				}

				if (response.canvas.draw) {
					nextMenuSkip = (response.gestureString != "");

					if (trailCanvas.getCanvas()) {
						document.body.appendChild(trailCanvas.getCanvas());
					}

					if (contentScripts.infoDiv) {
						document.body.appendChild(contentScripts.infoDiv);
					}

					var listParam = {
						fromX: response.canvas.x,
						fromY: response.canvas.y,
						toX: response.canvas.toX,
						toY: response.canvas.toY,
					};
					contentScripts.draw(listParam, response.gestureString, response.gestureAction);
				}

				if (response.canvas.clear) {
					clearAllDisplay();
				}
			});
		},
		mouseup: function (event) {
			var sendParam = {
				msg: 'mouseup',
				which: event.which,
				href: '',
				x: event.pageX - $(window).scrollLeft(),
				y: event.pageY - $(window).scrollTop()
			};
			chrome.extension.sendMessage(sendParam, function(response) {
				if (response === null) {
					return;
				}

				// console.log(response);

				nextMenuSkip = (response.gestureString != "");

				if (response.action) {
					nextMenuSkip = true;
					contentScripts.exeAction(response.action, response.href);
				}

				clearAllDisplay();
			});
		},

		/**
		 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
		 * falseを返すと、コンテキストメニューを無効にする。
		 */
		contextmenu: function () {
			// console.log(arguments.callee.name);

			if (nextMenuSkip) {
				nextMenuSkip = false;
				return false;
			}

			return true;
		},
	};

	//--------------------------------------------------------------------------------------------------
	// Event Handler
	//--------------------------------------------------------------------------------------------------
	$(window).on('ready', callee_handler.ready);
	$(window).on('focus', callee_handler.focus);
	// $(window).on('blur', callee_handler.blur);
	$(document).on('keydown',     callee_handler.keydown);
	$(document).on('keyup',       callee_handler.keyup);
	$(document).on('mousedown',   callee_handler.mousedown);
	$(document).on('mousemove',   callee_handler.mousemove);
	$(document).on('mouseup',     callee_handler.mouseup);
	$(document).on('contextmenu', callee_handler.contextmenu);
})();

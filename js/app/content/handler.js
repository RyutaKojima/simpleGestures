/**
 * 命名規則 (よく忘れるのでメモ)
 *
 * 関数     functionNamesLikeThis
 * 変数     variableNamesLikeThis
 * クラス   ClassNamesLikeThis
 * 列挙型   EnumNamesLikeThis
 * メソッド methodNamesLikeThis
 * 定数    CONSTANT_VALUES_LIKE_THIS
 * 名前空間 foo.namespaceNamesLikeThis.bar
 * ファイル filenameslikethis.js
 */
(function(){
	var nextMenuSkip = false;
	var trailCanvas = new TrailCanvas("gestureTrailCanvas", "1000000");
	var contentScripts = new ContentScripts(trailCanvas);

	/**
	 * 画面表示をすべてクリア
	 */
	var clearAllDisplay = function() {
		var canvasId = trailCanvas.getCanvasId();
		if (canvasId && document.getElementById(canvasId)) {
			document.body.removeChild(document.getElementById(canvasId));
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

	//--------------------------------------------------------------------------------------------------
	// Event Handler
	//--------------------------------------------------------------------------------------------------
	window.addEventListener('focus', function onFocus() {
		chrome.extension.sendMessage({ msg: 'reset_input', event:'focus' }, function(response) {});
	});

	$(document).on('ready', function onReady() {
		//console.log("$(window).ready: frames=" + window.frames.length);
		trailCanvas.setCanvasSize(window.innerWidth, window.innerHeight);

		contentScripts.loadOption();
		contentScripts.setCanvasStyle();
		contentScripts.createInfoDiv();
	});

	$(document).on('keydown', function onKeyDown(e) {
		if (! e.originalEvent.repeat) {
			chrome.extension.sendMessage({msg: 'keydown', keyCode: e.keyCode}, function(response) {});
		}
	});

	$(document).on('keyup', function onKeyUp(e) {
		chrome.extension.sendMessage({msg: 'keyup', keyCode: e.keyCode}, function(response) {});
	});

	$(document).on('mousedown', function onMouseDown(event) {
		var sendParam = {
			msg: 'mousedown',
			which: event.which,
			href: Mouse.getHref(event),
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
	});

	$(document).on('mousemove', function onMouseMove(event) {
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
	});

	$(document).on('mouseup', function onMouseUp(event) {
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
				contentScripts.exeAction(response.action);
			}

			clearAllDisplay();
		});
	});

	/**
	 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
	 * falseを返すと、コンテキストメニューを無効にする。
	 */
	$(document).on('contextmenu', function onContextMenu() {
		// console.log(arguments.callee.name);

		if (nextMenuSkip) {
			nextMenuSkip = false;
			return false;
		}

		return true;
	});

})();

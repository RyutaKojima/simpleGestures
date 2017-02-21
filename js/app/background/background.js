var inputMouse = new Mouse();
var inputKeyboard = new Keyboard();
var mainGestureMan = new LibGesture();
var opt = new LibOption();


var optionsHash = null;
var optGestureHash = new Object();	// hash: gesture list
var lockerOn = false;
var nextMenuSkip = true;


/**
 * 現在のジェスチャ軌跡に対応するアクション名を返す
 * @returns {*}
 */
var getNowGestureActionName = function () {
	var gestureString = mainGestureMan.getGestureString();
	if ( ! gestureString) {
		return null;
	}

	if (typeof optGestureHash[gestureString] !== "undefined") {
		return optGestureHash[gestureString];
	}

	return null;
};

/**
 * フロントからのメッセージリクエストに対する処理
 * 
 * @type {{load_options: requestFunction.load_options}}
 */
var requestFunction = {
	load_options: function(request) {
		var optionString = opt.loadOptionsString();
		optionsHash = JSON.parse(optionString);
		optGestureHash = new Object();

		var GESTURE_ID_LIST = optionsHash["gesture_id_list"];

		var id_name = "";
		var i=0;
		var len = GESTURE_ID_LIST.length;
		for (i=0; i < len; i++) {
			id_name = GESTURE_ID_LIST[i];

			if (optionsHash[id_name]) {
				// cut "gesture_" word
				optGestureHash[optionsHash[id_name]] = id_name.replace("gesture_", "");
			}
		}

		return {message: "yes", "options_json": optionString};
	},
	keydown: function(request) {
		responseString = request.msg + ": " + request.keyCode;
		console.log(responseString);

		inputKeyboard.setOn(request.keyCode);

		return {message: "yes"};
	},
	keyup: function (request) {
		responseString = request.msg + ": " + request.keyCode;
		console.log(responseString);

		inputKeyboard.setOff(request.keyCode);

		return {message: "yes"};
	},
	mousedown: function(request) {
		responseString = request.which === inputMouse.LEFT_BUTTON ? "LEFT" : "RIGHT";
		console.log(responseString);

		var response = {
			message: "yes",
			action: null,
			href: request.href,
			gestureString: '',
			gestureAction: '',
			canvas: {
				clear: false,
				draw: false,
				x: request.x,
				y: request.y,
				toX: request.x,
				toY: request.y,
			}
		};

		// Ctrlが押された状態だと、マウスジェスチャ無効な仕様
		if (inputKeyboard.isOn(inputKeyboard.KEY_CTRL)) {
			console.log('on KEY_CTRL. skip gesture.');
			return;
		}

		inputMouse.setOn(request.which);

		if (request.which === inputMouse.LEFT_BUTTON) {
			if (inputMouse.isLeft() && inputMouse.isRight()) {
				lockerOn = true;
				response.canvas.clear = true;

				response.action = "back";
			}
		}
		else if (request.which === inputMouse.RIGHT_BUTTON) {
			nextMenuSkip = false;

			// locker gesture
			if (inputMouse.isLeft() && inputMouse.isRight()) {
				lockerOn = true;

				response.action = "forward";
			}

			mainGestureMan.clear();

			if ( ! lockerOn) {
				console.log("select request.href: " + request.href );

				response.canvas.draw = true;
				mainGestureMan.startGestrue(request.x, request.y, request.href);
			}
		}

		return response;
	},
	mousemove: function(request) {
		// mousemove の event.whichには、最初に押されたボタンが入る。
		var response = {
			message: "yes",
			action: null,
			href: request.href,
			gestureString: mainGestureMan.getGestureString(),
			gestureAction: getNowGestureActionName(),
			canvas: {
				clear: false,
				draw: false,
				x: request.x,
				y: request.y,
				toX: request.x,
				toY: request.y,
			}
		};

		if (request.which == 0) {
			inputMouse.reset();
			mainGestureMan.clear();
			response.canvas.clear = true;
			return response;
		}

		if (inputMouse.isRight() && request.which == inputMouse.RIGHT_BUTTON) {
			if ( ! lockerOn) {
				if (mainGestureMan.registPoint(request.x, request.y)) {
					response.canvas.draw = true;
					response.canvas.x = mainGestureMan.getLastX();
					response.canvas.y = mainGestureMan.getLastY();
					response.canvas.toX = mainGestureMan.getX();
					response.canvas.toY = mainGestureMan.getY();
				}
			}
		}

		return response;
	},
	mouseup: function(request) {
		var response = {
			message: "yes",
			action: null,
			href: request.href,
			gestureString: mainGestureMan.getGestureString(),
			gestureAction: getNowGestureActionName(),
			canvas: {
				clear: false,
				draw: false,
				x: request.x,
				y: request.y,
				toX: request.x,
				toY: request.y,
			}
		};

		inputMouse.setOff(request.which);

		if (request.which === inputMouse.RIGHT_BUTTON) {
			if (lockerOn) {
				nextMenuSkip = true;
			}
			else if (mainGestureMan.getGestureString()) {
				nextMenuSkip = true;

				response.action = getNowGestureActionName();
			}

			mainGestureMan.endGesture();
			lockerOn = false;
		}

		return response;
	},
};

/**
 * 各マウスジェスチャの処理
 * @type type
 */
var gestureFunction = {
	"new_tab": function() {
		var _url = mainGestureMan.getURL();
		chrome.tabs.query({active: true}, function(tabs) {
			var current_tab = tabs[0];
			var append_index = current_tab.index+1;
			if (_url == null) {
				chrome.tabs.create({index:append_index});
			}
			else {
				chrome.tabs.create({url:_url, index:append_index});
			}
		});
	},
	"close_tab": function() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
			var current_tab = tabs[0];
			chrome.tabs.remove(current_tab.id);
		});
	},
	"reload": function() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
			var current_tab = tabs[0];
			chrome.tabs.reload(current_tab.id);
		});
	},
	"reload_all": function() {
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.reload(tabs[i].id);
			}
		});
	},
	"next_tab": function() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
			var current_tab = tabs[0];
			chrome.tabs.getAllInWindow(null, function(tabs) {
				if (current_tab.index == tabs.length-1) {
					chrome.tabs.update(tabs[0].id, {active:true});
				}
				else {
					chrome.tabs.update(tabs[current_tab.index+1].id, {active:true});
				}
			});
		});
	},
	"prev_tab": function() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
			var current_tab = tabs[0];
			chrome.tabs.getAllInWindow(null, function(tabs) {
				if (current_tab.index == 0) {
					chrome.tabs.update(tabs[tabs.length-1].id, {active:true});
				}
				else {
					chrome.tabs.update(tabs[current_tab.index-1].id, {active:true});
				}
			});
		});
	},
	"close_all_background": function() {
		chrome.tabs.query({active: true, lastFocusedWindow: true}, function(tabs) {
			var current_tab = tabs[0];
			chrome.tabs.getAllInWindow(null, function(all_tabs) {
				for (var i = 0; i < all_tabs.length; i++) {
					if (all_tabs[i].id != current_tab.id) {
						chrome.tabs.remove(all_tabs[i].id);
					}
				}
			});
		});
	},
	"close_all": function() {
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				chrome.tabs.remove(tabs[i].id);
			}
		});
	},
	"open_option": function() {
		chrome.tabs.create({
			"url": chrome.extension.getURL("html/options_page.html"),
		});
	},
	"open_extension": function() {
		var chromeExtURL="chrome://extensions/";
		chrome.tabs.getAllInWindow(null, function(tabs) {
			for (var i = 0; i < tabs.length; i++) {
				if (tabs[i].url == chromeExtURL) {
					chrome.tabs.update(tabs[i].id, {selected:true});
					return;
				}
			}
			chrome.tabs.create({url:chromeExtURL, selected:true});
		});
	},
	"restart": function() {
		chrome.tabs.create({url:"chrome://restart", selected:true});
	},
	"last_tab": function() {
		chrome.sessions.getRecentlyClosed({maxResults:1}, function(sessions){
			if (sessions.length) {
				chrome.sessions.restore();
			}
		});
	},
};

/**
 * フロントサイドからのメッセージ受信した時に発生するイベント
 *
 * @param {type} param
 */
chrome.extension.onMessage.addListener(function onMessage_handler(request, sender, sendResponse) {
	var responseString = "";

	if (typeof requestFunction[request.msg] === 'function') {
		sendResponse(requestFunction[request.msg](request, sender));
		return;
	}
	else if (typeof gestureFunction[request.msg] === 'function') {
		gestureFunction[request.msg](request);
	}
	else {
		responseString = "unknown command";
	}

	sendResponse({message: responseString});
});

/**
 * アクティブなタブが切り替わったときに発生するイベント
 */
chrome.tabs.onActivated.addListener(function(activeInfo){
	console.log("chrome.tabs.onActivated");

	inputKeyboard.reset();
	inputMouse.reset();
});

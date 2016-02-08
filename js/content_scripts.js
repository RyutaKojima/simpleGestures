var ContentScripts = function () {
	this.initialized = false;
	this.infoDiv = null;
	this.commandDiv = null;
	this.actionNameDiv = null;
};

ContentScripts.prototype.getOptTrailColor = function() {
	if (optionsHash && optionsHash["color_code"]) {
		return optionsHash["color_code"];
	}
	return '#FF0000';
};

ContentScripts.prototype.getOptTrailWidth = function() {
	if (optionsHash && optionsHash["line_width"]) {
		return optionsHash["line_width"];
	}
	return 3;
};

/**
 * 拡張機能の準備. ２回目移行の呼び出しは無視される
 * When initialization, return true.
 */
ContentScripts.prototype.initializeExtensionOnce = function() {
	if ( ! this.initialized) {
		debug_log("initialize run!!");

//		debug_log( "$(window).height()      = " +  $(window).height() );
//		debug_log( "$(window).innerHeight() = " +  $(window).innerHeight() );
//
//		debug_log( "window.innerHeight      = " +  window.innerHeight );
//		debug_log( "screen.height           = " +  screen.height );
//		debug_log( "screen.availHeight      = " +  screen.availHeight );
//		debug_log( "document.height         = " +  document.height );
//		debug_log( "document.body.scrollHeight             = " +  document.body.scrollHeight );
//		debug_log( "document.body.clientHeight             = " +  document.body.clientHeight );
//		debug_log( "document.documentElement.scrollHeight  = " +  document.documentElement.scrollHeight );
//		debug_log( "document.documentElement.clientHeight  = " +  document.documentElement.clientHeight );

		this.initialized = true;

		this.loadOption();

		this.createTrailCanvas();
		this.createInfoDiv();

		return true;
	}

	return false;
};

/**
 * initialize gesture list table.
 */
ContentScripts.prototype.initGestureHash = function () {
	optGestureHash = new Object();
//	optGestureHash["RDLU"]	= "open_option";
};

/**
 * load option values.
 */
ContentScripts.prototype.loadOption = function () {
	optionsHash = null;
	var _this = this;

	chrome.extension.sendMessage({msg: "load_options"}, function(response) {
		if (response) {
//			debug_log('message: ' + response.message);
//			debug_log('option: ' + response.options_json);

			optionsHash = JSON.parse(response.options_json);

			// gesture
			_this.initGestureHash();

			var GESTURE_ID_LIST = optionsHash["gesture_id_list"];

			var id_name = "";
			var i=0;
			var len = GESTURE_ID_LIST.length;
			for (i=0; i < len; i++) {
				id_name = GESTURE_ID_LIST[i];

				if (optionsHash[id_name]) {
					// cut "gesture_" word
					optGestureHash[optionsHash[id_name]]		= id_name.replace("gesture_", "");
				}
			}

			// reload setting for canvas.
			_this.createTrailCanvas();
			_this.createInfoDiv();
		}
	});
};

/**
 * create canvas & update style
 */
ContentScripts.prototype.createTrailCanvas = function () {
	mainGestureMan.createCanvas("gestureTrailCanvas", window.innerWidth, window.innerHeight, "1000000");
	mainGestureMan.setDrawStyleLine(this.getOptTrailColor(), this.getOptTrailWidth());

	return mainGestureMan.getCanvas();
};

/**
 * create infomation div & update style.
 */
ContentScripts.prototype.createInfoDiv = function () {

	if ( ! this.commandDiv) {
		this.commandDiv = document.createElement('div');
		this.commandDiv.id = "gestureCommandDiv";
	}

	if ( ! this.actionNameDiv) {
		this.actionNameDiv = document.createElement('div');
		this.actionNameDiv.id = "gestureActionNameDiv";
	}

	if ( ! this.infoDiv) {
		this.infoDiv = document.createElement('div');
		this.infoDiv.id = "infoDiv";

		this.infoDiv.appendChild(this.commandDiv);
		this.infoDiv.appendChild(this.actionNameDiv);
	}

	var set_width	= 300;
	var set_height	= 80;

	// style setting.
	this.infoDiv.style.width    = set_width + "px";
	this.infoDiv.style.height   = set_height + "px";

	// center position.
	this.infoDiv.style.top      = "0px";
	this.infoDiv.style.left     = "0px";
	this.infoDiv.style.right    = "0px";
	this.infoDiv.style.bottom    = "0px";
	this.infoDiv.style.margin   = "auto";
	this.infoDiv.style.position = 'fixed';

//	this.infoDiv.style.borderRadius = "3px";
//	this.infoDiv.style.backgroundColor = "#FFFFEE";

//	this.infoDiv.style.overflow = 'visible';
//	this.infoDiv.style.overflow = 'block';
	this.infoDiv.style.textAlign = "center";
	this.infoDiv.style.background = 'transparent';
	this.infoDiv.style.zIndex   ="10001";

	this.infoDiv.style.fontFamily = 'Arial';
	this.infoDiv.style.fontSize = 30 + "px";
	this.infoDiv.style.color      = this.getOptTrailColor();
	this.infoDiv.style.fontWeight = "bold";
};

/**
 *
 */
ContentScripts.prototype.draw = function () {
	var tmp_canvas = null;

	if (mainGestureMan.getCanvas()) {
		if (tmp_canvas = document.getElementById('gestureTrailCanvas')) {
			// draw trail line
			if (optionsHash && optionsHash["trail_on"]) {
				var ctx = tmp_canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(mainGestureMan.getLastX(), mainGestureMan.getLastY());
				ctx.lineTo(mainGestureMan.getX(), mainGestureMan.getY());
				ctx.stroke();
			}
		}
	}

	if (this.infoDiv) {
		if (document.getElementById('infoDiv')) {
			if (optionsHash && optionsHash["action_text_on"]) {
				var tmp_action_name = this.getNowGestureActionName();

				if (tmp_action_name != $("#gestureCommandDiv").html()) {
					if (tmp_action_name != null) {
						$("#gestureCommandDiv").html(tmp_action_name);
					}
					else {
						$("#gestureCommandDiv").html("");
					}
				}
			}

			if (optionsHash && optionsHash["command_text_on"]) {
				if (mainGestureMan.getGestureString() != $("#gestureActionNameDiv").html()) {
					$("#gestureActionNameDiv").html(mainGestureMan.getGestureString());
				}
			}
		}
	}
};

/**
 * exchange "gesture command" to "action name".
 */
ContentScripts.prototype.getNowGestureActionName = function () {
	if ( ! mainGestureMan.getGestureString()) {
		return null;
	}

	if (typeof optGestureHash[mainGestureMan.getGestureString()] !== "undefined") {
		return optGestureHash[mainGestureMan.getGestureString()];
	}

	return null;
};

/**
 * Run the selected action.
 *
 * @param {type} action_name
 * @returns {undefined}
 */
ContentScripts.prototype.exeAction = function (action_name) {

	switch (action_name) {
		case "back":
			window.history.back();
			break;

		case "forward":
			window.history.forward();
			break;

		case "stop":
			window.stop();
			break;

		case "scroll_top":
			window.scrollTo(0, 0);
			break;

		case "scroll_bottom":
			window.scrollTo(0, $(document).height());
			break;

		case "new_tab":
			chrome.extension.sendMessage({msg: action_name, url:mainGestureMan.getURL() }, function(response) {
					if (response !== null) {
						debug_log("message: " + response.message);
					}
					else {
						debug_log('problem executing open tab');
						if (chrome.extension.lastError) {
							debug_log(chrome.extension.lastError.message);
						}
					}
				});
			break;

		default:
			chrome.extension.sendMessage({msg: action_name});
			break;
	}
};

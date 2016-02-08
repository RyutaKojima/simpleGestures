/**
 * 拡張機能の準備. ２回目移行の呼び出しは無視される
 * When initialization, return true.
 */
var ContentScripts = function () {
	this.initialized = false;
};

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

		// initialize complete flag.
		this.initialized = true;

		this.loadOption();

		// create canvas.
//		debug_log("create canvas");
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

	var tmp_contentsScript = this;

	chrome.extension.sendMessage({msg: "load_options"}, function(response) {
		if (response) {
//			debug_log('message: ' + response.message);
//			debug_log('option: ' + response.options_json);

			optionsHash = JSON.parse(response.options_json);

			// general setting
			optTrailColor = optionsHash["color_code"];
			optTrailWidth = optionsHash["line_width"];

			// gesture
			tmp_contentsScript.initGestureHash();

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
			tmp_contentsScript.createTrailCanvas();
			tmp_contentsScript.createInfoDiv();
		}
	});
};

/**
 * create canvas & update style
 */
ContentScripts.prototype.createTrailCanvas = function () {
	if (!trailCanvas) {
		trailCanvas = document.createElement('canvas');
		trailCanvas.id = "gestureTrailCanvas";
	}

	var set_width	= window.innerWidth;
	var set_height	= window.innerHeight;

	trailCanvas.width    = set_width;
	trailCanvas.height   = set_height;

	// style setting.
//	trailCanvas.style.width    = set_width + "px";
//	trailCanvas.style.height   = set_height + "px";

	// center position.
	trailCanvas.style.top      = "0px";
	trailCanvas.style.left     = "0px";
	trailCanvas.style.right    = "0px";
	trailCanvas.style.bottom   = "0px";
	trailCanvas.style.margin   = "auto";
	trailCanvas.style.position = 'fixed';
//	trailCanvas.style.position = 'absolute';

	trailCanvas.style.overflow = 'visible';
//	trailCanvas.style.display  = 'block';
//	trailCanvas.style.border   = 'none';
//	trailCanvas.style.background = 'transparent';

	trailCanvas.style.zIndex   = "1000000";

	var ctx = trailCanvas.getContext('2d');
    ctx.strokeStyle = optTrailColor;
    ctx.lineWidth   = optTrailWidth;
};

/**
 * create infomation div & update style.
 */
ContentScripts.prototype.createInfoDiv = function () {

	if (!commandDiv) {
		commandDiv = document.createElement('div');
		commandDiv.id = "gestureCommandDiv";
	}

	if (!actionNameDiv) {
		actionNameDiv = document.createElement('div');
		actionNameDiv.id = "gestureActionNameDiv";
	}

	if (!infoDiv) {
		infoDiv = document.createElement('div');
		infoDiv.id = "infoDiv";

		infoDiv.appendChild(commandDiv);
		infoDiv.appendChild(actionNameDiv);
	}

	var set_width	= 300;
	var set_height	= 80;

	// style setting.
	infoDiv.style.width    = set_width + "px";
	infoDiv.style.height   = set_height + "px";

	// center position.
	infoDiv.style.top      = "0px";
	infoDiv.style.left     = "0px";
	infoDiv.style.right    = "0px";
	infoDiv.style.bottom    = "0px";
	infoDiv.style.margin   = "auto";
	infoDiv.style.position = 'fixed';


//	infoDiv.style.borderRadius = "3px";
//	infoDiv.style.backgroundColor = "#FFFFEE";

//	infoDiv.style.overflow = 'visible';
//	infoDiv.style.overflow = 'block';
	infoDiv.style.textAlign = "center";
	infoDiv.style.background = 'transparent';
	infoDiv.style.zIndex   ="10001";

	infoDiv.style.fontFamily = 'Arial';
	infoDiv.style.fontSize = 30 + "px";
	infoDiv.style.color      = optTrailColor;
	infoDiv.style.fontWeight = "bold";
};

/**
 * ジェスチャの軌道を消す
 */
ContentScripts.prototype.clearCanvas = function () {
	if (trailCanvas) {
		// canvas clear
		trailCanvas.width = trailCanvas.width;
/*
		var ctx = trailCanvas.getContext('2d');
		// clear canvas
		ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
*/
	}
};

/**
 *
 */
ContentScripts.prototype.drawCanvas = function () {
	var tmp_canvas = null;
	var ctx = null;

	if (trailCanvas) {
		tmp_canvas = document.getElementById('gestureTrailCanvas');
		if (tmp_canvas) {
			if (optDrawTrailOn) {
				ctx = tmp_canvas.getContext('2d');

				// draw trail line
				if (optionsHash["trail_on"]) {
					ctx.beginPath();
					ctx.moveTo(gesture_man.last_x, gesture_man.last_y);
					ctx.lineTo(gesture_man.now_x, gesture_man.now_y);
					ctx.stroke();
				}
			}
		}
	}

	if (infoDiv) {
		tmp_canvas = document.getElementById('infoDiv');
		if (tmp_canvas) {

			// draw text
//			if( optDrawActionNameOn ) {
			if (optionsHash["action_text_on"]) {
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

//			if( optDrawCommandOn ) {
			if (optionsHash["command_text_on"]) {
				if (gesture_man.gesture_command != $("#gestureActionNameDiv").html()) {
					$("#gestureActionNameDiv").html(gesture_man.gesture_command);
				}
			}
		}
	}
};

/**
 * exchange "gesture command" to "action name".
 */
ContentScripts.prototype.getNowGestureActionName = function () {

	if (gesture_man.gesture_command == "") {
		return null;
	}

	if (typeof optGestureHash[gesture_man.gesture_command] !== "undefined") {
		return optGestureHash[gesture_man.gesture_command];
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
			chrome.extension.sendMessage({msg: action_name, url:link_url}, function(response) {
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

/**
 * ContentScripts Object
 * @constructor
 */
var ContentScripts = function (trailCanvas) {
	this.initialized = false;
	this.infoDiv = null;
	this.commandDiv = null;
	this.actionNameDiv = null;
	this.trailCanvas = trailCanvas;

	this.trailColor = '#FF0000';
	this.trailWidth = 3;
	this.trailDisplayable = true;
	this.actionTextDisplayable = true;
	this.commandTextDisplayable = true;
};

ContentScripts.prototype.getOptTrailColor = function() {
	return this.trailColor;
};

ContentScripts.prototype.getOptTrailWidth = function() {
	return this.trailWidth;
};

/**
 * 拡張機能の準備. ２回目移行の呼び出しは無視される
 * When initialization, return true.
 */
ContentScripts.prototype.initializeExtensionOnce = function() {
	if ( ! this.initialized) {
		console.log("initialize run!!");

		this.initialized = true;

		this.loadOption();

		this.createTrailCanvas();
		this.createInfoDiv();

		return true;
	}

	return false;
};

/**
 * load option values.
 */
ContentScripts.prototype.loadOption = function () {
	var _this = this;

	chrome.extension.sendMessage({msg: "load_options"}, function(response) {
		if (response) {
			var optionsHash = JSON.parse(response.options_json);

			if(optionsHash) {
				if(optionsHash["color_code"]) {
					_this.trailColor = optionsHash["color_code"];
				}
				if (optionsHash["line_width"]) {
					_this.trailWidth = optionsHash["line_width"];
				}
				if (typeof optionsHash["trail_on"] !== 'undefined') {
					_this.trailDisplayable = optionsHash["trail_on"];
				}
				if (typeof optionsHash["action_text_on"] !== 'undefined') {
					_this.actionTextDisplayable = optionsHash["action_text_on"]
				}
				if (typeof optionsHash["command_text_on"] !== 'undefined') {
					_this.commandTextDisplayable = optionsHash["command_text_on"];
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
	this.trailCanvas.createCanvas("gestureTrailCanvas", window.innerWidth, window.innerHeight, "1000000");
	this.trailCanvas.setDrawStyleLine(this.getOptTrailColor(), this.getOptTrailWidth());
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
ContentScripts.prototype.draw = function (lineParam, command_name, action_name) {
	var tmp_canvas = null;

	if (this.trailCanvas.getCanvas()) {
		if (tmp_canvas = document.getElementById('gestureTrailCanvas')) {
			// draw trail line
			if (this.trailDisplayable) {
				var ctx = tmp_canvas.getContext('2d');
				ctx.beginPath();
				ctx.moveTo(lineParam.fromX, lineParam.fromY);
				ctx.lineTo(lineParam.toX, lineParam.toY);
				ctx.stroke();
			}
		}
	}

	if (this.infoDiv) {
		if (document.getElementById('infoDiv')) {
			if (this.actionTextDisplayable) {
				if (action_name != $("#gestureCommandDiv").html()) {
					$("#gestureCommandDiv").html( (action_name != null) ? action_name : "");
				}
			}

			if (this.commandTextDisplayable) {
				if (command_name != $("#gestureActionNameDiv").html()) {
					$("#gestureActionNameDiv").html(command_name);
				}
			}
		}
	}
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

		default:
			chrome.extension.sendMessage({msg: action_name});
			break;
	}
};

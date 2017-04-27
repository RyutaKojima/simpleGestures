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

	this.language = null;
	this.trailColor = '#FF0000';
	this.trailWidth = 3;
	this.trailDisplayable = true;
	this.actionTextDisplayable = true;
	this.commandTextDisplayable = true;
};

/**
 * 利用言語が日本語ならtrueを返す
 * @returns {boolean}
 */
ContentScripts.prototype.isJapanese = function() {
	return (this.language == 'Japanese');
};

/**
 * 拡張機能の準備. ２回目移行の呼び出しは無視される
 * When initialization, return true.
 */
ContentScripts.prototype.initializeExtensionOnce = function() {
	if ( ! this.initialized) {
		// console.log("run: initializeExtensionOnce");

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
				if(optionsHash["language"]) {
					_this.language = optionsHash["language"];
				}
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
	if (this.trailCanvas.getCanvas() == null) {
		this.trailCanvas.createCanvas("gestureTrailCanvas", window.innerWidth, window.innerHeight, "1000000");
	}
	this.trailCanvas.setDrawStyleLine(this.trailColor, this.trailWidth);
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
	this.infoDiv.style.color      = this.trailColor;
	this.infoDiv.style.fontWeight = "bold";
};

/**
 *
 */
ContentScripts.prototype.draw = function (lineParam, command_name, action_name) {
	if (this.trailCanvas.getCanvasId()) {
		// append されているか調べるため、あえて document.getElementById で取得
		var tmp_canvas = document.getElementById(this.trailCanvas.getCanvasId());
		if (tmp_canvas) {
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
		if (document.getElementById(this.infoDiv.id)) {
			var $divAction = $('#'+this.actionNameDiv.id);
			if (this.actionTextDisplayable) {

				if (action_name != $divAction.html()) {
					$divAction.html( (action_name != null) ? action_name : "");
				}
			} else {
				$divAction.html('');
			}

			var $divCommand = $('#'+this.commandDiv.id);
			if (this.commandTextDisplayable) {
				command_name = this.replaceCommandToArrow(command_name);

				if (command_name != $divCommand.html()) {
					$divCommand.html(command_name);
				}
			} else {
				$divCommand.html('');
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
ContentScripts.prototype.exeAction = function (action_name, href_url) {

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
			chrome.extension.sendMessage({msg: action_name, href: href_url});
			break;
	}
};

/**
 * ジェスチャコマンドを矢印表記に変換して返す D=>↓、U=>↑...
 * @param {string} action_name
 * @returns {string}
 */
ContentScripts.prototype.replaceCommandToArrow = function (action_name) {
	// マルチバイト文字表示出来ないかもしれないので、日本語のみ対応
	if (action_name && this.isJapanese()) {
		action_name = action_name.replace(/U/g, '↑');
		action_name = action_name.replace(/L/g, '←');
		action_name = action_name.replace(/R/g, '→');
		action_name = action_name.replace(/D/g, '↓');
	}

	return action_name;
};

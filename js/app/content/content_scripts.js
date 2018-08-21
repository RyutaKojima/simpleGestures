/**
 * ContentScripts Object
 * @constructor
 */
const ContentScripts = function (trailCanvas) {
	this.infoDiv = null;
	this.commandDiv = null;
	this.actionNameDiv = null;
	this.trailCanvas = trailCanvas;

	this.option = new LibOption();
};

/**
 * load option values.
 */
ContentScripts.prototype.loadOption = function () {
	const that = this;

	chrome.extension.sendMessage({msg: 'load_options'}, function(response) {
		if (response) {
			that.option.setRawStorageData(response.options_json);

			// reload setting for canvas.
			that.setCanvasStyle();
			that.createInfoDiv();
		}
	});
};

ContentScripts.prototype.setCanvasStyle = function () {
	this.trailCanvas.setLineStyle(this.option.getColorCode(), this.option.getLineWidth());
};

/**
 * create infomation div & update style.
 */
ContentScripts.prototype.createInfoDiv = function () {

	if ( ! this.commandDiv) {
		this.commandDiv = document.createElement('div');
		this.commandDiv.id = 'gestureCommandDiv';
	}

	if ( ! this.actionNameDiv) {
		this.actionNameDiv = document.createElement('div');
		this.actionNameDiv.id = 'gestureActionNameDiv';
	}

	if ( ! this.infoDiv) {
		this.infoDiv = document.createElement('div');
		this.infoDiv.id = 'infoDiv';

		this.infoDiv.appendChild(this.commandDiv);
		this.infoDiv.appendChild(this.actionNameDiv);
	}

	const setWidth  = 300;
	const setHeight = 80;

	// style setting.
	this.infoDiv.style.width    = setWidth + 'px';
	this.infoDiv.style.height   = setHeight + 'px';

	// center position.
	this.infoDiv.style.top      = '0px';
	this.infoDiv.style.left     = '0px';
	this.infoDiv.style.right    = '0px';
	this.infoDiv.style.bottom    = '0px';
	this.infoDiv.style.margin   = 'auto';
	this.infoDiv.style.position = 'fixed';

//	this.infoDiv.style.borderRadius = '3px';
//	this.infoDiv.style.backgroundColor = '#FFFFEE';

//	this.infoDiv.style.overflow = 'visible';
//	this.infoDiv.style.overflow = 'block';
	this.infoDiv.style.textAlign = 'center';
	this.infoDiv.style.background = 'transparent';
	this.infoDiv.style.zIndex   ='10001';

	this.infoDiv.style.fontFamily = 'Arial';
	this.infoDiv.style.fontSize = '30px';
	this.infoDiv.style.color      = this.option.getColorCode();
	this.infoDiv.style.fontWeight = 'bold';
};

/**
 *
 */
ContentScripts.prototype.draw = function (lineParam, commandName, actionName) {
	if (this.option.isTrailOn()) {
		// append されているか調べる。document.getElementById で取得出来たらOK
		const canvasId = this.trailCanvas.getCanvasId();
		if (canvasId && document.getElementById(canvasId)) {
			this.trailCanvas.drawLine(lineParam.fromX, lineParam.fromY, lineParam.toX, lineParam.toY);
		}
	}

	if (this.infoDiv) {
		if (document.getElementById(this.infoDiv.id)) {
			const $divAction = $('#'+this.actionNameDiv.id);

			if (this.option.isActionTextOn()) {
				if (actionName !== $divAction.html()) {
					$divAction.html( (actionName != null) ? actionName : "");
				}
			} else {
				$divAction.html('');
			}

			const $divCommand = $('#'+this.commandDiv.id);
			if (this.option.isCommandTextOn()) {
				commandName = this.replaceCommandToArrow(commandName);

				if (commandName !== $divCommand.html()) {
					$divCommand.html(commandName);
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
 * @param {type} actionName
 * @returns {undefined}
 */
ContentScripts.prototype.exeAction = function (actionName) {

	switch (actionName) {
		case 'back':
			window.history.back();
			break;

		case 'forward':
			window.history.forward();
			break;

		case 'stop':
			window.stop();
			break;

		case 'scroll_top':
			window.scrollTo(0, 0);
			break;

		case 'scroll_bottom':
			window.scrollTo(0, $(document).height());
			break;

		default:
			// なにもしない
			break;
	}
};

/**
 * ジェスチャコマンドを矢印表記に変換して返す D=>↓、U=>↑...
 * @param {string} actionName
 * @returns {string}
 */
ContentScripts.prototype.replaceCommandToArrow = function (actionName) {
	if (actionName) {
		actionName = actionName.replace(/U/g, '<i class="flaticon-up-arrow"></i>');
		actionName = actionName.replace(/L/g, '<i class="flaticon-left-arrow"></i>');
		actionName = actionName.replace(/R/g, '<i class="flaticon-right-arrow"></i>');
		actionName = actionName.replace(/D/g, '<i class="flaticon-down-arrow"></i>');
	}

	return actionName;
};

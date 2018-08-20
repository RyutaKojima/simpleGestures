/**
 * @constructor
 */
const LibOption = function() {
	/**
	 * ローカル領域に保存するときのキー
	 * @const
	 */
	this.LOCAL_STRAGE_KEY = "options";

	/**
	 * @const
	 */
	this.OPTION_ID_LIST = [
		"color_code",
		"line_width"
	];

	/**
	 * @const
	 */
	this.GESTURE_ID_LIST = [
		"gesture_close_tab",
		"gesture_new_tab",
		"gesture_reload",
		"gesture_forward",
		"gesture_back",
		"gesture_scroll_top",
		"gesture_scroll_bottom",
		"gesture_last_tab",
		"gesture_reload_all",
		"gesture_next_tab",
		"gesture_prev_tab",
		"gesture_close_all_background",
		"gesture_close_all",
		"gesture_open_option",
		"gesture_open_extension",
		"gesture_restart"
	];


	this.storageData = null;
	this.options_instance = null;
	this.gestureHash = {};
};

/**
 *
 * @returns {undefined}
 */
LibOption.prototype.reset = function () {
//	localStorage.removeItem(this.LOCAL_STRAGE_KEY);
	localStorage.clear();

	this.load();
};

LibOption.prototype.load = function () {
	this.storageData = localStorage.getItem(this.LOCAL_STRAGE_KEY);
	this.setRawStorageData(this.storageData);
};

LibOption.prototype.getRawStorageData = function () {
	return this.storageData;
};

LibOption.prototype.setRawStorageData = function (rawStorageData) {
	const that = this;

	this.storageData = rawStorageData;

	if (this.storageData === null) {
		this.options_instance = this.createDefaultOptions();
	} else {
		this.options_instance = JSON.parse(this.storageData);
	}

	this.gestureHash = {};
	this.GESTURE_ID_LIST.forEach(function(key){
		if (that.paramExists(key)) {
			const command = that.getParam(key, null);
			const action = key.replace("gesture_", "");
			if (command) {
				// cut "gesture_" prefix
				that.gestureHash[command] = action;
			}
		}
	});
};

LibOption.prototype.enableGestureParam = function(paramName) { return (this.GESTURE_ID_LIST && this.GESTURE_ID_LIST.indexOf(paramName) !== -1); };
LibOption.prototype.paramExists = function(paramName) { return (this.options_instance && this.options_instance.hasOwnProperty(paramName)); };
LibOption.prototype.getParam = function(paramName, defaultValue) { return this.paramExists(paramName) ? this.options_instance[paramName] : defaultValue; };
LibOption.prototype.setParam = function(paramName, value) {
	if (this.paramExists(paramName) || this.enableGestureParam(paramName)) {
		this.options_instance[paramName] = value;
	}
};

LibOption.prototype.getGestureActionName = function(command) {
	if (this.gestureHash && this.gestureHash.hasOwnProperty(command)) {
		return this.gestureHash[command];
	}

	return null;
};

LibOption.prototype.isJapanese      = function () { return (this.getLanguage() === 'Japanese'); };
LibOption.prototype.isEnglish       = function () { return (this.getLanguage() === 'English'); };
LibOption.prototype.getLanguage     = function () { return this.getParam("language",   'English'); };
LibOption.prototype.getColorCode    = function () { return this.getParam("color_code", '#FF0000'); };
LibOption.prototype.getLineWidth    = function () { return this.getParam("line_width",      1); };
LibOption.prototype.isCommandTextOn = function () { return this.getParam("command_text_on", true); };
LibOption.prototype.isActionTextOn  = function () { return this.getParam("action_text_on",  true); };
LibOption.prototype.isTrailOn       = function () { return this.getParam("trail_on",        true); };

/**
 * default option setting
 * @returns {Object|LibOption.prototype.createDefaultOptions.tmp_obj}
 */
LibOption.prototype.createDefaultOptions = function () {
	return {
		"language": "Japanese",
		"color_code": "#FF0000",
		"line_width": "3",
		"command_text_on": true,
		"action_text_on": true,
		"trail_on": true,
		// Default gesture
		"gesture_close_tab":   "DR",  // ↓→
		"gesture_forward":     "R",   // →
		"gesture_back":        "L",   // ←
		"gesture_new_tab":     "D",   // ↓
		"gesture_reload":      "DU",  // ↓↑
		"gesture_open_option": "RDLU" // →↓←↑
	};
};

LibOption.prototype.save = function () {
	localStorage.setItem(this.LOCAL_STRAGE_KEY, JSON.stringify(this.options_instance));
};

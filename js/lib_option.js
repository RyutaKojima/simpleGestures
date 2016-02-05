/**
 * @constructor
 */
var LibOption = function() {
	/**
	 * ローカル領域に保存するときのキー
	 * @const
	 */
	this.LOCAL_STRAGE_KEY = "options";

	/**
	 * @const
	 */
	this.OPTION_ID_LIST = [
		"language",
		"color_code",
		"line_width",
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
		"gesture_restart",
	];


	this.options_instance = null;
};

/**
 *
 * @returns {undefined}
 */
LibOption.prototype.resetOptions = function () {
//	localStorage.removeItem(this.LOCAL_STRAGE_KEY);
	localStorage.clear();

	this.options_instance = null;
}

/**
 * Load option in the saved "localStorage"
 * @returns {String}
 */
LibOption.prototype.loadOptionsString = function () {
	var str = localStorage.getItem(this.LOCAL_STRAGE_KEY);

	if (str === null) {
		str = JSON.stringify( this.createDefaultOptions() );
	}
	return str;
}

/**
 *
 * @returns {Array|Object|LibOption.prototype.createDefaultOptions.tmp_obj}
 */
LibOption.prototype.loadOptions = function () {
//	var str = localStorage.getItem(this.LOCAL_STRAGE_KEY);
	var str = this.loadOptionsString();
	var retObj = null;

	if (str === null) {
		retObj = this.createDefaultOptions();
	}
	else {
		retObj = JSON.parse(str);
	}

	return retObj;
}

/**
 * default option setting
 * @returns {Object|LibOption.prototype.createDefaultOptions.tmp_obj}
 */
LibOption.prototype.createDefaultOptions = function () {
	var tmp_obj = new Object();

	tmp_obj["language"]   = "English";
	tmp_obj["color_code"] = "#FF0000";
	tmp_obj["line_width"] = "3";
	tmp_obj["command_text_on"] = true;
	tmp_obj["action_text_on"] = true;
	tmp_obj["trail_on"] = true;

	tmp_obj["gesture_id_list"] = this.GESTURE_ID_LIST;
	tmp_obj["gesture_open_option"] = "RDLU";

	return tmp_obj;
}

/**
 * Save option to "localStorage"
 * @returns {undefined}
 */
LibOption.prototype.saveOptions = function () {

	if (this.options_instance == null) {
		this.options_instance = this.loadOptions();
	}

	// オプションデータの表示
	var id_name = "";
	var i=0;
	var len = null;

	// language
	// color_code
	// line_width
	// ...
	len = this.OPTION_ID_LIST.length;
	for (i=0; i < len; i++) {
		id_name = this.OPTION_ID_LIST[i];

		this.options_instance[id_name] = $('#'+id_name).val();
	}

	// チェックボタンがONになっているか受け取る
	this.options_instance["command_text_on"] = $('#command_text_on:checked').val();
	this.options_instance["action_text_on"] = $('#action_text_on:checked').val();
	this.options_instance["trail_on"] = $('#trail_on:checked').val();

	// "gesture_xxxxxx"
	len = this.GESTURE_ID_LIST.length;
	for ( i=0; i < len; i++) {
		id_name = this.GESTURE_ID_LIST[i];

		this.options_instance[id_name] = $('#'+id_name).val();
	}

	this.options_instance["gesture_id_list"] = this.GESTURE_ID_LIST;

	// save localstrage.
	localStorage.setItem(this.LOCAL_STRAGE_KEY, JSON.stringify(this.options_instance));
}

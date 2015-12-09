
// localStorage save key
var localStrageKey = "options";
var options_instance = null;

var OPTION_ID_LIST = [
	"language",
	"color_code",
	"line_width",
];

var GESTURE_ID_LIST = [
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

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// option all clear
function resetOptions() {
//	localStorage.removeItem(localStrageKey);
	localStorage.clear();

	options_instance = null;
}

// Load option in the saved "localStorage"
function loadOptionsString() {
	var str = localStorage.getItem(localStrageKey);

	if (str === null) {
		str = JSON.stringify( createDefaultOptions() );
	}
	return str;
}
function loadOptions() {
//	var str = localStorage.getItem(localStrageKey);
	var str = loadOptionsString();
	var retObj = null;

	if (str === null) {
		retObj = createDefaultOptions();
	}
	else {
		retObj = JSON.parse(str);
	}

	return retObj;
}

// default option setting
function createDefaultOptions() {
	var tmp_obj = new Object();

	tmp_obj["language"]   = "English";
	tmp_obj["color_code"] = "#FF0000";
	tmp_obj["line_width"] = "3";
	tmp_obj["command_text_on"] = true;
	tmp_obj["action_text_on"] = true;
	tmp_obj["trail_on"] = true;

	tmp_obj["gesture_id_list"] = GESTURE_ID_LIST;
	tmp_obj["gesture_open_option"] = "RDLU";

	return tmp_obj;
}

// Save option to "localStorage"
function saveOptions() {

	if (options_instance == null) {
		options_instance = loadOptions();
	}

	// オプションデータの表示
	var id_name = "";
	var i=0;
	var len = null;

	// language
	// color_code
	// line_width
	// ...
	len = OPTION_ID_LIST.length;
	for (i=0; i < len; i++) {
		id_name = OPTION_ID_LIST[i];

		options_instance[id_name] = $('#'+id_name).val();
	}

	// チェックボタンがONになっているか受け取る
	options_instance["command_text_on"] = $('#command_text_on:checked').val();
	options_instance["action_text_on"] = $('#action_text_on:checked').val();
	options_instance["trail_on"] = $('#trail_on:checked').val();

	// "gesture_xxxxxx"
	len = GESTURE_ID_LIST.length;
	for ( i=0; i < len; i++) {
		id_name = GESTURE_ID_LIST[i];

		options_instance[id_name] = $('#'+id_name).val();
	}

	options_instance["gesture_id_list"] = GESTURE_ID_LIST;

	// save localstrage.
	localStorage.setItem(localStrageKey, JSON.stringify(options_instance));
}

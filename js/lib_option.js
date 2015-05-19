
// localStorage save key
var localStrageKey = "options";
var options_instance = null;

var OPTION_ID_LIST = [
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
	if( str === null ) {
		str = JSON.stringify( createDefaultOptions() );
	}
	return str;
}
function loadOptions() {
//	var str = localStorage.getItem(localStrageKey);
	var str = loadOptionsString();
	var retObj = null;

	if( str === null ) {
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

	tmp_obj["color_code"] = "#FF0000";
	tmp_obj["line_width"] = "3";

//	tmp_obj["gesture_close_tab"] = "";

	return tmp_obj;
}

// Save option to "localStorage"
function saveOptions() {

	if( options_instance == null ) {
		options_instance = loadOptions();
	}

/*
	// general setting
	options_instance['color_code'] = $('#color_code').val();
	options_instance['line_width'] = $('#line_width').val();

	// gesture list
	options_instance['gesture_close_tab'] = $('#gesture_close_tab').val();
*/
	// オプションデータの表示
	var id_name = "";
	var i=0;
	var len = null;

	len = OPTION_ID_LIST.length;
	for( i=0; i < len; i++ ) {
		id_name = OPTION_ID_LIST[i];

		options_instance[id_name] = $('#'+id_name).val();
	}

	len = GESTURE_ID_LIST.length;
	for( i=0; i < len; i++ ) {
		id_name = GESTURE_ID_LIST[i];

		options_instance[id_name] = $('#'+id_name).val();
	}

	options_instance["gesture_id_list"] = GESTURE_ID_LIST;

	// save localstrage.
	localStorage.setItem(localStrageKey, JSON.stringify(options_instance));
}


// localStorage save key
var localStrageKey = "options";

var options_instance = null;

//-----------------------------------------------------------------------------
//-----------------------------------------------------------------------------
// option all clear
function resetOptions() {
//	localStorage.removeItem(localStrageKey);
	localStorage.clear();
}

// Load option in the saved "localStorage"
function loadOptions() {
	var str = localStorage.getItem(localStrageKey);
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

	tmp_obj["color_r"] = "FF";
	tmp_obj["color_g"] = "00";
	tmp_obj["color_b"] = "00";
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
	options_instance['color_r'] = $('#color_r').val();
	options_instance['color_g'] = $('#color_g').val();
	options_instance['color_b'] = $('#color_b').val();
	options_instance['line_width'] = $('#line_width').val();

	// gesture list
	options_instance['gesture_close_tab'] = $('#gesture_close_tab').val();
*/
	// オプションデータの表示
	var option_id_list = [
		"color_r",
		"color_g",
		"color_b",
		"line_width",
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
	];

	var id_name = "";
	var i=0;
	var len = option_id_list.length;
	for( i=0; i < len; i++ ) {
		id_name = option_id_list[i];

		options_instance[id_name] = $('#'+id_name).val();
	}

	// save localstrage.
	localStorage.setItem(localStrageKey, JSON.stringify(options_instance));
}

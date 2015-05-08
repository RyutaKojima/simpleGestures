
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

	tmp_obj["gesture_close"] = "";
	tmp_obj["gesture_newtab"] = "";

	return tmp_obj;
}

// Save option to "localStorage"
function saveOptions() {

	if( options_instance == null ) {
		options_instance = loadOptions();
	}

	// general setting
	options_instance['color_r'] = $('#color_r').val();
	options_instance['color_g'] = $('#color_g').val();
	options_instance['color_b'] = $('#color_b').val();
	options_instance['line_width'] = $('#line_width').val();

	// gesture list
	options_instance['gesture_close'] = $('#gesture_close').val();
	options_instance['gesture_newtab'] = $('#gesture_newtab').val();

	// save localstrage.
	localStorage.setItem(localStrageKey, JSON.stringify(options_instance));
}

/**
 * 
 */
//-------------------------------------------------------------------------------------------------- 
// Global Variables
//-------------------------------------------------------------------------------------------------- 
trailCanvas			= null;
infoDiv				= null;
commandDiv			= null;
actionNameDiv		= null;

// option variables
options_instance	= null;

optTrailColor		= "#FF0000";
optTrailWidth		= 3;
optDrawTrailOn		= true;
optDrawActionNameOn	= true;
optDrawCommandOn	= true;

// gesture list
optGesture_table	= new Array();

// work variables
gesture_man = new lib_gesture();
locker_on			= false;
next_menu_skip		= true;

initialized			= false;
link_url			= null;
lmousedown			= false;
rmousedown			= false;

//-------------------------------------------------------------------------------------------------- 
// Event Handler
//-------------------------------------------------------------------------------------------------- 
/**
 * entory point.
 */
$(window).ready(function onready_handler() {
	debug_log("window.ready");
	initializeExtensionOnce();

	debug_log("frames=" + window.frames.length);
});

$(window).load(function onload_handler() {
	debug_log("window.onload");
	initializeExtensionOnce();

	// setting 
	loadOption();
});

/**
 * window resize
 */
/*
$(window).resize(function(){
});
*/

/**
 *
 */
// $(document).mousedown(function onmousedown_handler(){ });
document.onmousedown = function onmousedown_handler(event) {
//	debug_log("down (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	initializeExtensionOnce();

	// down button type
	if(event.which == 1) {
		lmousedown = true;

		// locker gesture
		if( lmousedown & rmousedown ) {
			locker_on = true;

			exeAction("back");
		}
	}
	else if(event.which == 3) {
		rmousedown = true;

		next_menu_skip = false;

		// locker gesture
		if( lmousedown & rmousedown ) {
			locker_on = true;

			exeAction("forward");
		}

		gesture_man.clear();
		gesture_man.startGestrue(event.pageX - $(window).scrollLeft(), event.pageY - $(window).scrollTop() );

		// select link url copy
		if(event.target.href) {
			link_url = event.target.href;
		}
		else if(event.target.parentElement && event.target.parentElement.href) {
			link_url = event.target.parentElement.href;
		}
		else {
			link_url = null;
		}
		debug_log("select link: " + link_url );

		// setting 
		loadOption();

		// addChild
		if( trailCanvas ) {
			document.body.appendChild(trailCanvas);
//			window.top.document.body.appendChild(trailCanvas);
		}

		if( infoDiv ) {
			document.body.appendChild(infoDiv);

			$("#gestureCommandDiv").html("");
			$("#gestureActionNameDiv").html("");
		}

		adjustCanvasPosition();
	}
}

/**
 *
 */
document.onmousemove = function onmousemove_handler(event) {
//	debug_log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	if( rmousedown ) {
		var tmp_x = event.pageX - $(window).scrollLeft();
		var tmp_y = event.pageY - $(window).scrollTop();

		if( gesture_man.registPoint(tmp_x, tmp_y) ) {
			drawCanvas();
		}
	}
}

/**
 *
 */
document.onmouseup = function onmouseup_handler(event) {
//	debug_log("up (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);

	var tmp_canvas;

	// down button type
	if(event.which == 1) {
		lmousedown = false;
	}
	else if(event.which == 3) {
		rmousedown = false;

		// gesture action run !
		if( locker_on ) {
			next_menu_skip = true;
		}
		else {
			var tmp_action_name = getNowGestureActionName();
			if( tmp_action_name != null ) {
				exeAction(tmp_action_name);
			}
		}

		// removeChild
		tmp_canvas = document.getElementById('gestureTrailCanvas');
		if( tmp_canvas ) {
			document.body.removeChild(tmp_canvas);
		}

		tmp_canvas = document.getElementById('infoDiv');
		if( tmp_canvas ) {
			document.body.removeChild(tmp_canvas);
		}

// test code ...>>>
		tmp_canvas = window.top.document.getElementById('gestureTrailCanvas');
		if( tmp_canvas ) {
			window.top.document.body.removeChild(tmp_canvas);
		}
// <<<

		link_url = null;
		clearCanvas();
		locker_on = false;
	}
}

/**
 *
 */
document.onmousewheel = function onmousewheel_handler(event) {
//	debug_log(arguments.callee.name);
//	adjustCanvasPosition();
}

/**
 *
 */
document.oncontextmenu = function oncontextmenu_handler() {
	debug_log(arguments.callee.name);

	if( next_menu_skip ) {
		next_menu_skip = false;
		return false;
	}
	else if( lmousedown || rmousedown ) {
		// Whdn return "false", the context menu is not open.
		return false;
	}
	else if( gesture_man.gesture_command === "" ) {
		// debug_log("open it");
		return true;
	}
	else {
		// Whdn return "false", the context menu is not open.
		return false;
	}

	return true;
}

//-------------------------------------------------------------------------------------------------- 
// original method
//-------------------------------------------------------------------------------------------------- 
/**
 *
 */
function debug_log(str) {
//	console.log(str);
}

/**
 * When initialization, return true.
 */
function initializeExtensionOnce() {
	if( !initialized ) {
		debug_log("initialize run!!");

		debug_log( "$(window).height()      = " +  $(window).height() );
		debug_log( "$(window).innerHeight() = " +  $(window).innerHeight() );

		debug_log( "window.innerHeight      = " +  window.innerHeight );
		debug_log( "screen.height           = " +  screen.height );
		debug_log( "screen.availHeight      = " +  screen.availHeight );
		debug_log( "document.height         = " +  document.height );
		debug_log( "document.body.scrollHeight             = " +  document.body.scrollHeight );
		debug_log( "document.body.clientHeight             = " +  document.body.clientHeight );
		debug_log( "document.documentElement.scrollHeight  = " +  document.documentElement.scrollHeight );
		debug_log( "document.documentElement.clientHeight  = " +  document.documentElement.clientHeight );

		// initialize complete flag.
		initialized = true;

		loadOption();

		// create canvas.
//		debug_log("create canvas");
		createTrailCanvas();
		createInfoDiv();

		return true;
	}

	return false;
}

/**
 * initialize gesture list table.
 */
function initGestureTable() {
	optGesture_table = new Array();
//	optGesture_table["RDLU"]	= "open_option";
}

/**
 * load option values.
 */
function loadOption() {

	options_instance = null;

	chrome.extension.sendMessage({msg: "load_options"}, function(response) {
		if(response) {
//			debug_log('message: ' + response.message);
//			debug_log('option: ' + response.options_json);

			options_instance = JSON.parse(response.options_json);

			// general setting
			optTrailColor = options_instance["color_code"];
			optTrailWidth = options_instance["line_width"];

			// gesture
			initGestureTable();

			var GESTURE_ID_LIST = options_instance["gesture_id_list"];

			var id_name = "";
			var i=0;
			var len = GESTURE_ID_LIST.length;
			for( i=0; i < len; i++ ) {
				id_name = GESTURE_ID_LIST[i];

				if( options_instance[id_name] ) {
					// cut "gesture_" word
					optGesture_table[options_instance[id_name]]		= id_name.replace("gesture_", "");
				}
			}

			// reload setting for canvas.
			createTrailCanvas();
			createInfoDiv();
		}
	});
}

/**
 * create canvas & update style
 */
function createTrailCanvas() {
	if(!trailCanvas) {
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
}

/**
 * create infomation div & update style.
 */
function createInfoDiv() {

	if( !commandDiv ) {
		commandDiv = document.createElement('div');
		commandDiv.id = "gestureCommandDiv";
	}

	if( !actionNameDiv ) {
		actionNameDiv = document.createElement('div');
		actionNameDiv.id = "gestureActionNameDiv";
	}
	if( !infoDiv ) {
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
}

/**
 *
 */
function clearCanvas() {
	var ctx = null;

	if( trailCanvas ) {

		// canvas clear
		trailCanvas.width = trailCanvas.width;

/*
		ctx = trailCanvas.getContext('2d');
		// clear canvas
		ctx.clearRect(0, 0, trailCanvas.width, trailCanvas.height);
*/
	}
}

/**
 *
 */
function drawCanvas() {
	var tmp_canvas = null;
	var ctx = null;

	if( trailCanvas ) {
		tmp_canvas = document.getElementById('gestureTrailCanvas');
		if( tmp_canvas ) {
			if( optDrawTrailOn ) {
				ctx = tmp_canvas.getContext('2d');

				// draw trail line
				ctx.beginPath();
				ctx.moveTo(gesture_man.last_x, gesture_man.last_y);
				ctx.lineTo(gesture_man.now_x, gesture_man.now_y);
				ctx.stroke();
			}
		}
	}

	if( infoDiv ) {
		tmp_canvas = document.getElementById('infoDiv');
		if( tmp_canvas ) {

			// draw text
			if( optDrawActionNameOn ) {
				var tmp_action_name = getNowGestureActionName();

				if( tmp_action_name != $("#gestureCommandDiv").html() ) {
					if( tmp_action_name != null ) {
						$("#gestureCommandDiv").html(tmp_action_name);
					}
					else {
						$("#gestureCommandDiv").html("");
					}
				}
			}

			if( optDrawCommandOn ) {
				if( gesture_man.gesture_command != $("#gestureActionNameDiv").html() ) {
					$("#gestureActionNameDiv").html(gesture_man.gesture_command);
				}
			}
		}
	}

//	adjustCanvasPosition();
}

/**
 *
 */
function adjustCanvasPosition() {
/*
	// display position: full window
	if( trailCanvas ) {
	    trailCanvas.style.top  = $(window).scrollTop()  + "px";
	    trailCanvas.style.left = $(window).scrollLeft() + "px";
	}
*/
}

/**
 * exchange "gesture command" to "action name".
 */
function getNowGestureActionName() {

	if( gesture_man.gesture_command == "" ) {
		return null;
	}

	if( typeof optGesture_table[gesture_man.gesture_command] != "undefined" ) {
		return optGesture_table[gesture_man.gesture_command];
	}

	return null;
}

/**
 * Run the selected action.
 */
function exeAction(action_name) {

	switch( action_name ) {
		case "back":
			window.history.back();
			break;

		case "forward":
			window.history.forward();
			break;

		case "reload":
			window.location.reload();
			break;

		case "stop":
			window.stop();
			break;

		case "scroll_top":
			window.scrollTo(0, 0);
			break;

		case "scroll_bottom":
			window.scrollTo(0, $(window).scrollHeight());
			break;

		case "new_tab":
			if(link_url == null) {
				chrome.extension.sendMessage({msg: "new_tab"}, function(response) {
					if(response != null) {
						debug_log("message: " + response.message);
					}
					else {
						debug_log('problem executing open tab');
						if(chrome.extension.lastError) {
							debug_log(chrome.extension.lastError.message);
						}
					}
				});
			}
			else {
				window.open(link_url);
			}
			break;

		default:
			chrome.extension.sendMessage({msg: action_name});
			break;
	}
}

/**
 * 
 */
//-------------------------------------------------------------------------------------------------- 
// Global Variables
//-------------------------------------------------------------------------------------------------- 
trailCanvas			= null;
actionNameCanvas	= null;

initialized			= false;

// option variables
options_instance	= null;

optTrailColor		= "FF0000";
optTrailWidth		= 3;
optDrawTrailOn		= true;
optDrawActionNameOn	= true;
optDrawCommandOn	= true;

// gesture list
optGesture_table	= new Array();

// temporary variables
gesture_man = new lib_gesture();

link_url			= null;
lmousedown			= false;
rmousedown			= false;
drawn_gesture_command = "";

debug_count			= 0;

//-------------------------------------------------------------------------------------------------- 
// Event Handler
//-------------------------------------------------------------------------------------------------- 
/**
 * entory point.
 */
$(window).ready(function onready_handler() {
	debug_log("window.ready");
//	initializeExtensionOnce();

	debug_log("frames=" + window.frames.length);
});

$(window).load(function onload_handler() {
	debug_log("window.onload");
//	initializeExtensionOnce();
});

/**
 * window resize
 */
$(window).resize(function(){
});

/**
 *
 */
document.onmousedown = function onmousedown_handler(event) {
	debug_log("down (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);
//	debug_log(arguments.callee.name + ": " + event.which + ", (" + event.pageX + ", " + event.pageY + ")");
//	debug_log("frames=" + window.frames.length);

	initializeExtensionOnce();

	// down button type
	if(event.which == 1) {
		lmousedown = true;
	}
	else if(event.which == 3) {
		rmousedown = true;

		gesture_man.clear();
		gesture_man.startGestrue(event.pageX - $(window).scrollLeft(), event.pageY - $(window).scrollTop() );

		drawn_gesture_command = "";

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

		if( actionNameCanvas ) {
			document.body.appendChild(actionNameCanvas);
//			window.top.document.body.appendChild(actionNameCanvas);
		}

		adjustCanvasPosition();
	}

	debug_count++;
	debug_count %= 100;
}

/**
 *
 */
document.onmousemove = function onmousemove_handler(event) {
	debug_log("(" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length + ",cnt="+debug_count);
//	debug_log(arguments.callee.name + ": " + event.which + ", (" + event.pageX + ", " + event.pageY + ")");
//	debug_log("frames=" + window.frames.length);

	var tmp_x;
	var tmp_y;

	if( rmousedown ) {

		tmp_x = event.pageX - $(window).scrollLeft();
		tmp_y = event.pageY - $(window).scrollTop();

		if( gesture_man.registPoint(tmp_x, tmp_y) ) {
			draw();
		}
	}
}

/**
 *
 */
document.onmouseup = function onmouseup_handler(event) {
	debug_log("up (" + event.pageX + ", " + event.pageY + ")" + event.which + ",frm=" + window.frames.length);
//	debug_log(arguments.callee.name + ": " + event.which + ", (" + event.pageX + ", " + event.pageY + ")");
//	debug_log("frames=" + window.frames.length);

	var tmp_canvas;

	// down button type
	if(event.which == 1) {
		lmousedown = false;
	}
	else if(event.which == 3) {
		rmousedown = false;

		// gesture action run !
		var tmp_action_name = getNowGestureActionName();
		if( tmp_action_name != null ) {
			exeAction(tmp_action_name);
		}

		// removeChild
		tmp_canvas = document.getElementById('gestureTrailCanvas');
		if( tmp_canvas ) {
			document.body.removeChild(tmp_canvas);
		}
		tmp_canvas = document.getElementById('gestureActionNameCanvas');
		if( tmp_canvas ) {
			document.body.removeChild(tmp_canvas);
		}

// test code ...>>>
		tmp_canvas = window.top.document.getElementById('gestureTrailCanvas');
		if( tmp_canvas ) {
			window.top.document.body.removeChild(tmp_canvas);
		}
		tmp_canvas = window.top.document.getElementById('gestureActionNameCanvas');
		if( tmp_canvas ) {
			window.top.document.body.removeChild(tmp_canvas);
		}
// <<<

		link_url = null;
		clear();
	}
}

/**
 *
 */
document.onmousewheel = function onmousewheel_handler(event) {
	debug_log(arguments.callee.name);

//	adjustCanvasPosition();
}

/**
 *
 */
document.oncontextmenu = function oncontextmenu_handler() {
	debug_log(arguments.callee.name);

	if( gesture_man.gesture_command === "" ) {
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
	console.log(str);
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
		createActionNameCanvas();

		return true;
	}

	return false;
}

/**
 *
 */
function initGestureTable() {

	optGesture_table = new Array();
	optGesture_table["RDLU"]	= "open_option";
}

/**
 *
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

			var option_id_list = [
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

				if( options_instance[id_name] ) {
					optGesture_table[options_instance[id_name]]		= id_name.replace("gesture_", "");
				}
			}

			// reload setting for canvas.
			createTrailCanvas();
			createActionNameCanvas();
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
	trailCanvas.height   = set_height

	// style setting.
	trailCanvas.style.width    = set_width;
	trailCanvas.style.height   = set_height;

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
    ctx.strokeStyle = "#" + optTrailColor;
    ctx.lineWidth   = optTrailWidth;
}


/**
 * create canvas & update style
 */
function createActionNameCanvas() {
	if(!actionNameCanvas) {
		actionNameCanvas = document.createElement('canvas');
		actionNameCanvas.id = "gestureActionNameCanvas";
	}

//	var set_width	= $(window).width();
//	var set_height	= $(window).height();
	var set_width	= 300;
	var set_height	= 80;

	// style setting.
	actionNameCanvas.width          = set_width;
	actionNameCanvas.height         = set_height;

	actionNameCanvas.style.width    = set_width;
	actionNameCanvas.style.height   = set_height;

	// center position.
	actionNameCanvas.style.top      = "0px";
	actionNameCanvas.style.left     = "0px";
	actionNameCanvas.style.right    = "0px";
	actionNameCanvas.style.bottom    = "0px";
	actionNameCanvas.style.margin   = "auto";
	actionNameCanvas.style.position = 'fixed';


	actionNameCanvas.style.overflow = 'visible';
//	actionNameCanvas.style.background = 'transparent';
	actionNameCanvas.style.zIndex   ="10000";

	var ctx = actionNameCanvas.getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
	ctx.fillStyle = "#" + optTrailColor;
}

/**
 *
 */
function clear() {
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

	if( actionNameCanvas ) {

		actionNameCanvas.width = actionNameCanvas.width;

/*
		ctx = actionNameCanvas.getContext('2d');
		// clear canvas
		ctx.clearRect(0, 0, actionNameCanvas.width, actionNameCanvas.height);
*/
	}
}

/**
 *
 */
function draw() {
	var ctx = null;

	if( trailCanvas ) {
		if( optDrawTrailOn ) {
			ctx = trailCanvas.getContext('2d');

			// draw trail line
			ctx.beginPath();
			ctx.moveTo(gesture_man.last_x, gesture_man.last_y);
			ctx.lineTo(gesture_man.now_x, gesture_man.now_y);
			ctx.stroke();
		}
	}

	if( actionNameCanvas ) {
		if( optDrawActionNameOn || optDrawCommandOn ) {

			var tmp_redraw_on = false;
			var tmp_action_name = null;

			// debug_log( drawn_gesture_command + " , " + gesture_man.gesture_command );
			if( drawn_gesture_command !== gesture_man.gesture_command ) {

				tmp_action_name = getNowGestureActionName();

				if( optDrawActionNameOn ) {
					if( tmp_action_name != null ) {
						tmp_redraw_on = true;
					}
				}

				if( optDrawCommandOn ) {
					tmp_redraw_on = true;
				}
			}

			if( tmp_redraw_on ) {

				ctx = actionNameCanvas.getContext('2d');

				// clear canvas
				ctx.clearRect(0, 0, actionNameCanvas.width, actionNameCanvas.height);

				// draw text
				ctx.beginPath();
				if( optDrawActionNameOn ) {
					if( tmp_action_name != null ) {
						ctx.fillText(getNowGestureActionName(), 0, 0);
					}
				}

				if( optDrawCommandOn ) {
					ctx.fillText( gesture_man.gesture_command, 0, 30);

					drawn_gesture_command = gesture_man.gesture_command;
				}
				ctx.stroke();
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

	// display position: center
	if( actionNameCanvas ) {
		var top  = ( window.innerHeight - actionNameCanvas.height ) / 2 + $(window).scrollTop();
		var left = ( window.innerWidth  - actionNameCanvas.width  ) / 2 + $(window).scrollLeft();
		actionNameCanvas.style.top  = top  + "px";
		actionNameCanvas.style.left = left + "px";

//		debug_log( top  + "px" + left + "px" );
	}
*/
}

/**
 *
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

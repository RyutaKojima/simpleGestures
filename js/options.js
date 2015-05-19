
optionCanvas = null;
optionGestureMan = new lib_gesture();
cw = null;

/**
 * entory point.
 * ready
 */
//$(document).ready(function(){});
$(function ready_handler(){

	initTabView();

	// load option data.
	if( options_instance == null ) {
		options_instance = loadOptions();

		initOptionView();
	}

	createOptionCanvas();

	// オプションデータの表示

	var id_name = "";
	var i=0;
	var len = OPTION_ID_LIST.length;
	for( i=0; i < len; i++ ) {
		id_name = OPTION_ID_LIST[i];

		// textbox value change event
		$('#'+id_name).change(function() {
			saveOptions();
		});
	}

	len = GESTURE_ID_LIST.length;
	for(i=0; i < len; i++) {

		id_name = GESTURE_ID_LIST[i];

		// textbox value change event
		$('#'+id_name).change(function() {
			saveOptions();
		});

		// 
		$('#'+id_name).click(function() {

			select_instance = $(this);

			if( optionCanvas ) {
				document.body.appendChild(optionCanvas);

				optionGestureMan.clear();

				var ctx = optionCanvas.getContext('2d');
				ctx.clearRect(0, 0, optionCanvas.width, optionCanvas.height);
				ctx.globalAlpha = 0.5;
				ctx.fillRect(0, 0, optionCanvas.width, optionCanvas.height);

				$('#gestureOptionCanvas').mousedown(function(e) {
					var tmp_x	= e.pageX - $('#gestureOptionCanvas').offset().left;
					var tmp_y	= e.pageY - $('#gestureOptionCanvas').offset().top;
					optionGestureMan.startGestrue(tmp_x, tmp_y);

					return false;
				});

				$('#gestureOptionCanvas').mousemove(function(e) {

					var tmp_x = e.pageX - $('#gestureOptionCanvas').offset().left;
					var tmp_y = e.pageY - $('#gestureOptionCanvas').offset().top;
					console.log("('#gestureOptionCanvas').mousemove,   " + tmp_x + ", " + tmp_y);
					if( optionGestureMan.registPoint(tmp_x, tmp_y) ) {

						var ctx = optionCanvas.getContext('2d');
						ctx.globalAlpha = 1.0;
						ctx.beginPath();
						ctx.moveTo(optionGestureMan.last_x, optionGestureMan.last_y);
						ctx.lineTo(optionGestureMan.now_x, optionGestureMan.now_y);
						ctx.stroke();
					}

					return false;
				});

				$('#gestureOptionCanvas').mouseup(function(e) {
					if( optionCanvas ) {
						tmp_canvas = document.getElementById('gestureOptionCanvas');
						if( tmp_canvas ) {
							document.body.removeChild(tmp_canvas);
						}
					}

					// textbox value set.
					select_instance.val(optionGestureMan.gesture_command);
					select_instance = null;

					saveOptions();

					return false;
				});
			}
		});
	}

	$('[name=language]').change(function() {

		// 選択されているvalue属性値を取り出す
		var val = $('[name=language]').val();
		console.log(val);

		// 選択されている表示文字列を取り出す
//		var txt = $('[name=language] option:selected').text();
//		console.log(txt);
	});

	// 
	$('#reset_all').click(function() {
		resetOptions();

		// load option data.
		if( options_instance == null ) {
			options_instance = loadOptions();

			initOptionView();
		}
	});

	// color wheel
	cw = Raphael.colorwheel($("#input_example")[0],100);
	cw.input($("#color_code")[0]);
//	cw.color("#FF0000");
	cw.color(options_instance["color_code"]);

	cw.onchange(function(color) {
//	      var colors = [parseInt(color.r), parseInt(color.g), parseInt(color.b)]
//	      onchange_el.css("background", color.hex).text("RGB:"+colors.join(", "))
//			color.hex;
			saveOptions();
	    })
});

document.oncontextmenu = function oncontextmenu_handler() {
	return false;
}

/**
 * create canvas & update style
 */
function createOptionCanvas() {
	if(!optionCanvas) {
		optionCanvas = document.createElement('canvas');
		optionCanvas.id = "gestureOptionCanvas";
	}

	var set_width	= $(window).width();
	var set_height	= $(window).height();

	var set_width	= 300;
	var set_height	= 300;

	// style setting.
	optionCanvas.width          = set_width;
	optionCanvas.height         = set_height;
	optionCanvas.style.width    = set_width;
	optionCanvas.style.height   = set_height;

	// display position: center
	optionCanvas.style.top      = "0px";
	optionCanvas.style.left     = "0px";
	optionCanvas.style.right    = "0px";
	optionCanvas.style.bottom   = "0px";
	optionCanvas.style.margin   = "auto";
	optionCanvas.style.position = 'fixed';
//	optionCanvas.style.position = 'absolute';

	optionCanvas.style.overflow = 'visible';
	optionCanvas.style.zIndex   ="10002";

	var ctx = optionCanvas.getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
//	ctx.fillStyle = "#FF0000";


	// display position: center
/*
	if( optionCanvas ) {
		var top  = ( $(window).height() - optionCanvas.height ) / 2 + $(window).scrollTop();
		var left = ( $(window).width()  - optionCanvas.width  ) / 2 + $(window).scrollLeft();
		optionCanvas.style.top  = top  + "px";
		optionCanvas.style.left = left + "px";
	}
*/
}

/**
 *
 */
function initOptionView() {
	var id_name = "";
	var i=0;
	var len = OPTION_ID_LIST.length;
	for( i=0; i < len; i++ ) {
		id_name = OPTION_ID_LIST[i];

		// textbox value set.
		$('#'+id_name).val(options_instance[id_name]);
	}

	len = GESTURE_ID_LIST.length;
	for(i=0; i < len; i++) {

		id_name = GESTURE_ID_LIST[i];

		// textbox value set.
		$('#'+id_name).val(options_instance[id_name]);
	}
}

/**
 *
 */
function initTabView() {

	// default open tab
	ChangeTab("tab_body2");

	// for tab 
	$('#tab_btn1').click(function() {
		ChangeTab('tab_body1');
		return false;
	});

	$('#tab_btn2').click(function() {
		ChangeTab('tab_body2');
		return false;
	});

	$('#tab_btn3').click(function() {
		ChangeTab('tab_body3');
		return false;
	});
}

/**
 * change view tab.
 */
function ChangeTab(tabname) {

   // all tab body clear.
   $('#tab_body1').hide();
   $('#tab_body2').hide();
   $('#tab_body3').hide();

   // select tab body display.
   $('#'+tabname).show();
}

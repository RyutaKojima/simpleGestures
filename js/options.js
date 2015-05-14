
optionCanvas = null;

optionLastX	= 0;
optionLastY	= 0;

/**
 * entory point.
 * ready
 */
//$(document).ready(function(){});
$(function ready_handler(){

	initializeTab();

	// load option data.
	if( options_instance == null ) {
		options_instance = loadOptions();
	}

	createOptionCanvas();

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

		// textbox value set.
		$('#'+id_name).val(options_instance[id_name]);

		// textbox value change event
		$('#'+id_name).change(function() {
			saveOptions();
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

	// test code
	$('#gesture_close_tab').click(function() {

		if( optionCanvas ) {
			document.body.appendChild(optionCanvas);

			// display position: center
			if( optionCanvas ) {
				var top  = ( $(window).height() - optionCanvas.height ) / 2 + $(window).scrollTop();
				var left = ( $(window).width()  - optionCanvas.width  ) / 2 + $(window).scrollLeft();
				optionCanvas.style.top  = top  + "px";
				optionCanvas.style.left = left + "px";
			}


			var ctx = optionCanvas.getContext('2d');
			ctx.clearRect(0, 0, optionCanvas.width, optionCanvas.height);

			ctx.globalAlpha = 0.5;
			ctx.fillRect(0, 0, optionCanvas.width, optionCanvas.height);

			$('#gestureOptionCanvas').mousedown(function(e) {

				optionLastX	= e.pageX - $('#gestureOptionCanvas').offset().left;
				optionLastY	= e.pageY - $('#gestureOptionCanvas').offset().top;

				return false;
			});

			$('#gestureOptionCanvas').mousemove(function(e) {

				var now_x = e.pageX - $('#gestureOptionCanvas').offset().left;
				var now_y = e.pageY - $('#gestureOptionCanvas').offset().top;

				console.log("'#gestureOptionCanvas').mousemove,   " + now_x + ", " + now_y);

				var ctx = optionCanvas.getContext('2d');
				ctx.globalAlpha = 1.0;
				ctx.beginPath();
				ctx.moveTo(optionLastX, optionLastY);
				ctx.lineTo(now_x, now_y);
				ctx.stroke();

				optionLastX	= now_x;
				optionLastY	= now_y;

				return false;
			});

			$('#gestureOptionCanvas').mouseup(function(e) {
				if( optionCanvas ) {
					tmp_canvas = document.getElementById('gestureOptionCanvas');
					if( tmp_canvas ) {
						document.body.removeChild(optionCanvas);
					}
				}
				return false;
			});
		}
	});

	// 
	$('#reset_all').click(function() {
		resetOptions();
	});

});


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

	optionCanvas.style.overflow = 'visible';
	optionCanvas.style.position = 'absolute';
	optionCanvas.style.zIndex   ="10002";

	var ctx = optionCanvas.getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
//	ctx.fillStyle = "#FF0000";


	// display position: center
	if( optionCanvas ) {
		var top  = ( $(window).height() - optionCanvas.height ) / 2 + $(window).scrollTop();
		var left = ( $(window).width()  - optionCanvas.width  ) / 2 + $(window).scrollLeft();
		optionCanvas.style.top  = top  + "px";
		optionCanvas.style.left = left + "px";
	}
}

/**
 *
 */
function initializeTab() {

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

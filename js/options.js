
trailCanvas = null;


/**
 * entory point.
 * ready
 */
//$(document).ready(function(){});
$(function(){

	// for tab 
	$('#tab_btn1').click(function() {
		ChangeTab('tab_body1');
		return false;
	});

	$('#tab_btn2').click(function() {
		ChangeTab('tab_body2');
		return false;
	});

	// change view tab
	ChangeTab("tab_body1");

	// load option data.
	if( options_instance == null ) {
		options_instance = loadOptions();
	}

	createActionNameCanvas();

	// オプションデータの表示
	$('#color_r').val(options_instance['color_r']);
	$('#color_g').val(options_instance['color_g']);
	$('#color_b').val(options_instance['color_b']);
	$('#line_width').val(options_instance['line_width']);

	$('#gesture_close').val(options_instance['gesture_close']);
	$('#gesture_newtab').val(options_instance['gesture_newtab']);

	// text is changed
	var option_id_list = [
		"color_r",
		"color_g",
		"color_b",
		"line_width",
		"gesture_close",
		"gesture_newtab",
	];

	var i=0;
	var len = option_id_list.length;
	for( i=0; i < len; i++ ) {
		// textbox value change event
		$('#'+option_id_list[i]).change(function() {
			saveOptions();
		});
	}

	$('#gesture_close').click(function() {

		if( trailCanvas ) {
			document.body.appendChild(trailCanvas);

			var ctx = trailCanvas.getContext('2d');
			ctx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
		}
	});

//	$('#gesture_close').blur(function() {
	$('#gestureActionNameCanvas').click(function() {

		if( trailCanvas ) {

			tmp_canvas = document.getElementById('gestureActionNameCanvas');
			if( tmp_canvas ) {
				document.body.removeChild(trailCanvas);
			}
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
function createActionNameCanvas() {
	if(!trailCanvas) {
		trailCanvas = document.createElement('canvas');
		trailCanvas.id = "gestureActionNameCanvas";
	}

//	var set_width	= $(window).width();
//	var set_height	= $(window).height();
	var set_width	= 300;
	var set_height	= 80;

	// style setting.
	trailCanvas.width          = set_width;
	trailCanvas.height         = set_height;
	trailCanvas.style.width    = set_width;
	trailCanvas.style.height   = set_height;

	trailCanvas.style.overflow = 'visible';
	trailCanvas.style.position = 'absolute';
	trailCanvas.style.zIndex   ="99999";

	var ctx = trailCanvas.getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
	ctx.fillStyle = "#FF0000";
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

//   document.getElementById('tab1').style.display = 'none';
//   document.getElementById('tab2').style.display = 'none';
//   document.getElementById('tab3').style.display = 'none';

//   document.getElementById(tabname).style.display = 'block';
}

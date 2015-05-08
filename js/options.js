
trailCanvas = null;


/**
 * entory point.
 * ready
 */
//$(document).ready(function(){});
$(function(){

	initializeTab();

	// load option data.
	if( options_instance == null ) {
		options_instance = loadOptions();
	}

	createActionNameCanvas();

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

		if( trailCanvas ) {
			document.body.appendChild(trailCanvas);

			var ctx = trailCanvas.getContext('2d');
			ctx.fillRect(0, 0, trailCanvas.width, trailCanvas.height);
		}
	});

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

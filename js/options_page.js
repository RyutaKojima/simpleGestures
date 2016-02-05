
var optionCanvas = null;
var colorWheel = null;
var optionGestureMan = new LibGesture();
var opt = new LibOption();

/**
 * entory point.
 * ready
 */
//$(document).ready(function(){});
$(function ready_handler() {

	initTabView();

	// 言語設定の変更
	changeLanguage();

	// load option data.
	if (opt.options_instance == null) {
		opt.options_instance = opt.loadOptions();

		initOptionView();
	}

	createOptionCanvas();

	// オプションデータの表示
	var id_name = "";
	var i=0;
	var len = opt.OPTION_ID_LIST.length;
	for (i=0; i < len; i++) {
		id_name = opt.OPTION_ID_LIST[i];

		// textbox value change event
		$('#'+id_name).change(function() {
			// 設定の保存
			opt.saveOptions();

			// 言語設定の変更
			changeLanguage();
		});
	}

	// チェックボックス
	$('#command_text_on').change(function() {
		// 設定の保存
		opt.saveOptions();
	});
	$('#action_text_on').change(function() {
		// 設定の保存
		opt.saveOptions();
	});
	$('#trail_on').change(function() {
		// 設定の保存
		opt.saveOptions();
	});

	// ジェスチャ入力欄
	len = opt.GESTURE_ID_LIST.length;
	for (i=0; i < len; i++) {

		id_name = opt.GESTURE_ID_LIST[i];

		// textbox value change event
		$('#'+id_name).change(function() {
			opt.saveOptions();
		});

		//
		$('#'+id_name).click(function() {

			select_instance = $(this);

			if (optionCanvas) {
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

					if (optionGestureMan.registPoint(tmp_x, tmp_y)) {
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
					if (optionCanvas) {
						tmp_canvas = document.getElementById('gestureOptionCanvas');
						if (tmp_canvas) {
							document.body.removeChild(tmp_canvas);
						}
					}

					// textbox value set.
					select_instance.val(optionGestureMan.gesture_command);
					select_instance = null;

					opt.saveOptions();

					return false;
				});
			}
		});
	}

	//
	$('#reset_all').click(function() {
		opt.resetOptions();

		// load option data.
		if (opt.options_instance == null) {
			opt.options_instance = opt.loadOptions();

			initOptionView();
		}
	});

	// language selector
	$('#language').val(opt.options_instance["language"]);
	changeLanguage();

	// color wheel
	colorWheel = Raphael.colorwheel($("#input_example")[0],100);
	colorWheel.input($("#color_code")[0]);
	colorWheel.color(opt.options_instance["color_code"]);

	colorWheel.onchange(function(color) {
		opt.saveOptions();
	})
});

$(document).on('contextmenu', function oncontextmenu_handler() {
	return false;
});

/**
 * create canvas & update style
 */
function createOptionCanvas() {
	if (!optionCanvas) {
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
 * オプション表示の初期化をする
 */
function initOptionView() {
	var id_name = "";
	var i=0;

	// "textbox"の初期化
	var len = opt.OPTION_ID_LIST.length;
	for (i=0; i < len; i++) {
		id_name = opt.OPTION_ID_LIST[i];

		// textbox value set.
		$('#'+id_name).val(opt.options_instance[id_name]);
	}

	// checkboxの初期化
	$('#command_text_on').prop("checked", opt.options_instance["command_text_on"]);
	$('#action_text_on').prop("checked", opt.options_instance["action_text_on"]);
	$('#trail_on').prop("checked", opt.options_instance["trail_on"]);

	// ジェスチャー
	len = opt.GESTURE_ID_LIST.length;
	for (i=0; i < len; i++) {

		id_name = opt.GESTURE_ID_LIST[i];

		// textbox value set.
		$('#'+id_name).val(opt.options_instance[id_name]);
	}
}

/**
 * タブ表示の初期化をする
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

/**
 * change Language View.
 */
function changeLanguage(lang) {
	if (lang == null) {
		lang = 'English';

		if (opt.options_instance && 'language' in opt.options_instance)
		{
			lang = opt.options_instance.language;
		}
	}
	switch (lang)
	{
		default:
			// no break;
		case 'English':
			$('.class_English').show();
			$('.class_Japanese').hide();
			break;
		case 'Japanese':
			$('.class_English').hide();
			$('.class_Japanese').show();
			break;
	}
}

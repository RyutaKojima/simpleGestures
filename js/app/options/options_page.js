var colorWheel = null;
var canvasForOption = new TrailCanvas();
var gestureForOption = new LibGesture();
var opt = new LibOption();

/**
 * entory point.
 * ready
 */
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
		$textbox = $('#'+id_name);

		$textbox.change(function() {
			opt.saveOptions();
		});

		$textbox.click(function() {
			var $that = $(this);

			if (canvasForOption.getCanvas()) {
				var tmpCanvas = canvasForOption.getCanvas();
				document.body.appendChild(tmpCanvas);

				gestureForOption.clear();

				canvasForOption.clearCanvas();
				var ctx = canvasForOption.getCanvas().getContext('2d');
				ctx.globalAlpha = 0.5;
				ctx.fillRect(0, 0, tmpCanvas.width, tmpCanvas.height);

				var $canvas = $('#'+tmpCanvas.id);
				$canvas.mousedown(function(event) {
					var tmp_x	= event.pageX - $(this).offset().left;
					var tmp_y	= event.pageY - $(this).offset().top;
					gestureForOption.startGestrue(tmp_x, tmp_y, null);

					return false;
				});

				$canvas.mousemove(function(event) {
					var tmp_x = event.pageX - $(this).offset().left;
					var tmp_y = event.pageY - $(this).offset().top;

					if (gestureForOption.registPoint(tmp_x, tmp_y)) {
						var ctx = tmpCanvas.getContext('2d');
						ctx.globalAlpha = 1.0;
						ctx.beginPath();
						ctx.moveTo(gestureForOption.getLastX(), gestureForOption.getLastY());
						ctx.lineTo(gestureForOption.getX(), gestureForOption.getY());
						ctx.stroke();
					}

					return false;
				});

				$canvas.mouseup(function(event) {
					if (tmpCanvas) {
						var removeCanvas = document.getElementById(tmpCanvas.id);
						if (removeCanvas) {
							document.body.removeChild(removeCanvas);
						}
					}

					// textbox value set.
					$that.val(gestureForOption.getGestureString());
					$that = null;

					opt.saveOptions();

					$(this).unbind();

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
var createOptionCanvas = function () {
	canvasForOption.createCanvas("gestureOptionCanvas", 300, 300, '10002');
	canvasForOption.setDrawStyleLine('#000000', 1);

	var ctx = canvasForOption.getCanvas().getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
//	ctx.fillStyle = "#FF0000";
};

/**
 * オプション表示の初期化をする
 */
var initOptionView = function () {
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
var initTabView = function () {
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
var ChangeTab = function (tabname) {
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
var changeLanguage = function (lang) {
	if (lang == null) {
		lang = 'English';

		if (opt.options_instance && 'language' in opt.options_instance) {
			lang = opt.options_instance.language;
		}
	}

	switch (lang) {
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

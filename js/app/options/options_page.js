var colorWheel = null;
var gestureForOption = new LibGesture();
var option = new LibOption();
option.load();
var canvasForOption = new TrailCanvas("gestureOptionCanvas", '10002');
canvasForOption.setCanvasSize(300, 300);

/**
 * entory point.
 * ready
 */
$(function ready_handler() {
	initTabView();

	// 言語設定の変更
	changeLanguage();

	initOptionView();

	setCanvasStyle(canvasForOption);

	// オプションデータの表示
	option.OPTION_ID_LIST.forEach(function(id_name){
		// textbox value change event
		$('#'+id_name).change(function() {
			option.setParam(id_name, $(this).val());
			saveOptions();

			changeLanguage();
		});
	});

	// チェックボックス
	const checke_ids = ['command_text_on', 'action_text_on', 'trail_on'];
	checke_ids.forEach(function(id_name){
		$('#'+id_name).change(function() {
			option.setParam(id_name, $(this).prop("checked"));
			saveOptions();
		});
	});

	// ジェスチャ入力欄
	option.GESTURE_ID_LIST.forEach(function(id_name){
		$textbox = $('#'+id_name);

		$textbox.change(function() {
			option.setParam(id_name, $(this).val());
			saveOptions();
		});

		$textbox.click(function() {
			var $that = $(this);

			if (canvasForOption.getCanvas()) {
				var drawCanvas = canvasForOption.getCanvas();
				var ctx = canvasForOption.getContext2d();

				document.body.appendChild(drawCanvas);
				var $canvas = $('#'+canvasForOption.getCanvasId());

				gestureForOption.clear();
				canvasForOption.clearCanvas();

				ctx.globalAlpha = 0.5;
				ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
				ctx.globalAlpha = 1.0;

				$canvas.mousedown(function(event) {
					var tmp_x = event.pageX - $(this).offset().left;
					var tmp_y = event.pageY - $(this).offset().top;
					gestureForOption.startGestrue(tmp_x, tmp_y, null);

					return false;
				})
					.mousemove(function(event) {
						var tmp_x = event.pageX - $(this).offset().left;
						var tmp_y = event.pageY - $(this).offset().top;

						if (gestureForOption.registPoint(tmp_x, tmp_y)) {
							canvasForOption.drawLine(
								gestureForOption.getLastX(), gestureForOption.getLastY(),
								gestureForOption.getX(),     gestureForOption.getY()
							);
						}

						return false;
					})
					.mouseup(function(event) {
						if (drawCanvas) {
							var removeCanvas = document.getElementById(drawCanvas.id);
							if (removeCanvas) {
								document.body.removeChild(removeCanvas);
							}
						}

						// textbox value set.
						$that.val(gestureForOption.getGestureString()).triggerHandler('change');
						$that = null;

						$(this).unbind();

						return false;
					});
			}
		});
	});

	//
	$('#reset_all').click(function() {
		option.reset();
		chrome.extension.sendMessage({msg: "reload_option"}, function(response) {});

		initOptionView();
	});

	// language selector
	$('#language').val(option.getLanguage());

	// color wheel
	colorWheel = Raphael.colorwheel($("#input_example")[0],100);
	colorWheel.input($("#color_code")[0]);
	colorWheel.color(option.getColorCode());
	colorWheel.onchange(function(color) {
		$("#color_code").triggerHandler('change');
	})
});

$(document).on('contextmenu', function oncontextmenu_handler() {
	return false;
});

/**
 * create canvas & update style
 */
var setCanvasStyle = function (canvas) {
	canvas.setLineStyle('#000000', 1);

	var ctx = canvas.getCanvas().getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
//	ctx.fillStyle = "#FF0000";
};

/**
 * オプション表示の初期化をする
 */
var initOptionView = function () {
	var checkValues = {
		'command_text_on': option.isCommandTextOn(),
		'action_text_on': option.isActionTextOn(),
		'trail_on': option.isTrailOn()
	};

	var textValues = {
		"language": option.getLanguage(),
		"color_code": option.getColorCode(),
		"line_width": option.getLineWidth()
	};

	// ジェスチャー
	option.GESTURE_ID_LIST.forEach(function(key){
		textValues[key] = option.getParam(key, '');
	});

	// 各DOMに設定値を適用
	Object.keys(textValues).forEach(function(key){
		$('#'+key).val(this[key]);
	}, textValues);

	Object.keys(checkValues).forEach(function(key){
		$('#'+key).prop("checked", this[key]);
	}, checkValues);
};

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
};

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
};

/**
 * change Language View.
 */
var changeLanguage = function () {
	switch (option.getLanguage()) {
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
};

var saveOptions = function () {
	option.save();
	chrome.extension.sendMessage({msg: "reload_option"}, function(response) {});
};
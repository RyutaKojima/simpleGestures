var colorWheel = null;
const gestureForOption = new LibGesture();
const option = new LibOption();
option.load();
const canvasForOption = new TrailCanvas("gestureOptionCanvas", '10002');
canvasForOption.setCanvasSize(300, 300);

/**
 * entory point.
 * ready
 */
$(() => {
	initTabView();

	// 言語設定の変更
	changeLanguage();
	initOptionView();

	setCanvasStyle(canvasForOption);

	// オプションデータの表示
	option.OPTION_ID_LIST.forEach((id_name) => {
		$('#'+id_name).change((event) => {
			option.setParam(id_name, $(event.target).val());
			saveOptions();
			changeLanguage();
		});
	});

	// チェックボックス
	const checke_ids = ['command_text_on', 'action_text_on', 'trail_on'];
	checke_ids.forEach((id_name) => {
		$('#'+id_name).change(event => {
			option.setParam(id_name, $(event.target).prop("checked"));
			saveOptions();
		});
	});

	// ジェスチャ割り当てクリアボタン
	$('.reset_gesture').click(event => {
		const name = $(event.currentTarget).data('target');
		$('#' + name).val('').triggerHandler('change');
	});

	// ジェスチャ設定
	$('.input_gesture')
		.change(event => {
			const $input = $(event.target);
			option.setParam($input.attr('id'), $input.val());
			saveOptions();
		})
		.click(event => {
			if ( ! canvasForOption.getCanvas()) {
				return false;
			}

			const $input = $(event.target);
			const drawCanvas = canvasForOption.getCanvas();
			const ctx = canvasForOption.getContext2d();
			document.body.appendChild(drawCanvas);

			gestureForOption.clear();
			canvasForOption.clearCanvas();

			ctx.globalAlpha = 0.5;
			ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
			ctx.globalAlpha = 1.0;

			const $canvas = $('#'+canvasForOption.getCanvasId());
			$canvas
				.mousedown(event => {
					const tmp_x = event.pageX - $canvas.offset().left;
					const tmp_y = event.pageY - $canvas.offset().top;
					gestureForOption.startGestrue(tmp_x, tmp_y, null);
					return false;
				})
				.mousemove(event => {
					const tmp_x = event.pageX - $canvas.offset().left;
					const tmp_y = event.pageY - $canvas.offset().top;
					if (gestureForOption.registPoint(tmp_x, tmp_y)) {
						canvasForOption.drawLine(gestureForOption.getLastX(), gestureForOption.getLastY(), gestureForOption.getX(),     gestureForOption.getY() );
					}

					return false;
				})
				.mouseup(event => {
					if (drawCanvas) {
						const removeCanvas = document.getElementById(drawCanvas.id);
						if (removeCanvas) {
							document.body.removeChild(removeCanvas);
						}
					}

					$input.val(gestureForOption.getGestureString()).triggerHandler('change');
					$canvas.unbind();
					return false;
				});
		});

	//
	$('#reset_all').click(() => {
		option.reset();
		chrome.extension.sendMessage({msg: "reload_option"}, (response) => {});
		initOptionView();
		changeLanguage();
	});

	// language selector
	$('#language').val(option.getLanguage());

	// color wheel
	colorWheel = Raphael.colorwheel($("#input_example")[0],100);
	colorWheel.input($("#color_code")[0]);
	colorWheel.color(option.getColorCode());
	colorWheel.onchange((color) => {
		$("#color_code").triggerHandler('change');
	})
});

$(document).on('contextmenu', () => {
	return false;
});

/**
 * create canvas & update style
 */
const setCanvasStyle = (canvas) => {
	canvas.setLineStyle('#000000', 1);

	const ctx = canvas.getCanvas().getContext('2d');
	ctx.font = "bold 30px 'Arial'";
	ctx.textBaseline = 'top';
//	ctx.fillStyle = "#FF0000";
};

/**
 * オプション表示の初期化をする
 */
const initOptionView = () => {
	const checkValues = {
		'command_text_on': option.isCommandTextOn(),
		'action_text_on': option.isActionTextOn(),
		'trail_on': option.isTrailOn()
	};

	const textValues = {
		"language": option.getLanguage(),
		"color_code": option.getColorCode(),
		"line_width": option.getLineWidth()
	};

	// ジェスチャー
	option.GESTURE_ID_LIST.forEach((key) => {
		textValues[key] = option.getParam(key, '');
	});

	// 各DOMに設定値を適用
	Object.keys(textValues).forEach((key) => {
		$('#'+key).val(textValues[key]);
	});

	Object.keys(checkValues).forEach((key) => {
		$('#'+key).prop("checked", checkValues[key]);
	});
};

/**
 * タブ表示の初期化をする
 */
const initTabView = () => {
	$defaultActiveTab = $('#tab_btn2.changeTab');
	ChangeTab($defaultActiveTab);

	$('.changeTab').click(event => {
		const $target = $(event.currentTarget);
		ChangeTab($target);
	});
};

/**
 * change view tab.
 */
let setedColorClass = '';
const ChangeTab = ($target) => {
	const showBodyId = $target.data('show-body');
	const setColorClass = $target.data('set-color');

	$('.tabBody').hide();
	$('#'+showBodyId).show();

	const activeTabClass = 'is-active';
	$('.tabs li').removeClass(activeTabClass);
	$target.closest('li').addClass(activeTabClass);

	const $switchDom = $('.js-swich-color');
	const $allChangableTab = $('.changeTab');
	if (setedColorClass) {
		$switchDom.removeClass(setedColorClass);
		$allChangableTab.removeClass(setedColorClass);
	}
	$switchDom.addClass(setColorClass);
	$target.addClass(setColorClass);
	setedColorClass = setColorClass;
};

/**
 * change Language View.
 */
const changeLanguage = () => {
	const $langEn = $('.class_English');
	const $langJa = $('.class_Japanese');

	switch (option.getLanguage()) {
		default:
			// no break;
		case 'English':
			$langEn.show();
			$langJa.hide();
			break;
		case 'Japanese':
			$langEn.hide();
			$langJa.show();
			break;
	}
};

const saveOptions = () => {
	option.save();
	chrome.extension.sendMessage({msg: "reload_option"}, (response) => {});
};
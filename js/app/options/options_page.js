const gestureForOption = new LibGesture();
const option = new LibOption();
const canvasForOption = new TrailCanvas('gestureOptionCanvas', '10002');
const contentScripts = new ContentScripts(null);

option.load();
canvasForOption.setCanvasSize(500, 500);

/**
 * entry point (jQuery.ready)
 */
$(() => {
	initTabView();

	// 言語設定の変更
	changeLanguage();
	initOptionView();

	setCanvasStyle(canvasForOption);

	// オプションデータの表示
	// type: テキスト
	option.OPTION_ID_LIST.forEach((idName) => {
		$('#'+idName).on('change', (event) => {
			option.setParam(idName, $(event.target).val());
			saveOptions();
		});
	});

	// type: チェックボックス
	const checkIds = ['command_text_on', 'action_text_on', 'trail_on'];
	checkIds.forEach((idName) => {
		$('#'+idName).on('change', (event) => {
			option.setParam(idName, $(event.target).prop('checked'));
			saveOptions();
		});
	});

	// type: ラジオボタン
	const radioIds = ['language'];
	radioIds.forEach((idName) => {
		$('[name='+idName+']').on('change', (event) => {
			option.setParam(idName, $(event.currentTarget).attr('value'));
			saveOptions();
			changeLanguage();
		});
	});

	// ジェスチャ割り当てクリアボタン
	$('.reset_gesture').on('click', (event) => {
		const name = $(event.currentTarget).data('target');
		$('#' + name).val('').triggerHandler('change');
	});

	// ジェスチャ設定
	$('.views_gesture').on('click', (event) => {
		const $viewsGestureElement = $(event.currentTarget);
		$viewsGestureElement.siblings('.input_gesture').show().focus().trigger('click');
	});

	$('.input_gesture')
		.on('blur', (event) => {
			const $input = $(event.currentTarget);
			const drawCanvasId = canvasForOption.getCanvasId();
			const removeCanvas = document.getElementById(drawCanvasId);
			if (removeCanvas) {
				document.body.removeChild(removeCanvas);
				const $canvas = $('#'+drawCanvasId);
				$canvas.off();
			}

			$input.hide();
		})
		.on('change', (event) => {
			const $input = $(event.target);
			const $viewsGestureElement = $input.siblings('.views_gesture');
			const inputGesture = $input.val();

			// Validation
			if ( ! inputGesture.match(/^[DLUR]*$/)) {
				$input.val($input.data('prevValue'));
				return;
			}

			const setGestureText = inputGesture
				? contentScripts.replaceCommandToArrow(inputGesture)
				: '&nbsp;';

			$viewsGestureElement.html(setGestureText);
			$input.hide();

			option.setParam($input.attr('id'), inputGesture);
			saveOptions();
		})
		.on('click', (event) => {
			const $input = $(event.target);
			const drawCanvas = canvasForOption.getCanvas();
			const ctx = canvasForOption.getContext2d();

			if ( ! drawCanvas || ! ctx) {
				return;
			}

			document.body.appendChild(drawCanvas);

			$input.data('prevValue', $input.val());

			gestureForOption.clear();
			canvasForOption.clearCanvas();

			ctx.globalAlpha = 0.5;
			ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
			ctx.globalAlpha = 1.0;

			const helpTextColor = '#ECECEC';
			if (option.isJapanese()) {
				canvasForOption.drawText('この枠内にジェスチャを', 80, 180, helpTextColor);
				canvasForOption.drawText('描いてください', 140, 260, helpTextColor);
			} else {
				canvasForOption.drawText('Please draw a gesture', 80, 180, helpTextColor);
				canvasForOption.drawText('with this frame', 140, 260, helpTextColor);
			}

			const $canvas = $('#'+canvasForOption.getCanvasId());
			$canvas.off();
			$canvas
				.mousedown((event) => {
					const tmpX = event.pageX - $canvas.offset().left;
					const tmpY = event.pageY - $canvas.offset().top;
					gestureForOption.startGesture(tmpX, tmpY, null);
					return false;
				})
				.mousemove((event) => {
					const tmpX = event.pageX - $canvas.offset().left;
					const tmpY = event.pageY - $canvas.offset().top;
					if (gestureForOption.registPoint(tmpX, tmpY)) {
						canvasForOption.drawLine(
							gestureForOption.getLastX(), gestureForOption.getLastY(),
							gestureForOption.getX(), gestureForOption.getY()
						);
					}

					return false;
				})
				.mouseup(() => {
					const removeCanvas = document.getElementById(drawCanvas.id);
					if (removeCanvas) {
						document.body.removeChild(removeCanvas);
					}

					$input.val(gestureForOption.getGestureString()).triggerHandler('change');
					return false;
				});
		});

	//
	$('#reset_all').on('click', () => {
		const confirmOk = window.confirm(lang.confirmOptionReset[option.getLanguage()]);
		if (confirmOk) {
			option.reset();
			chrome.extension.sendMessage({msg: 'reload_option'}, (response) => {});
			initOptionView();
			changeLanguage();
		}
	});

	// color wheel
	const colorWheel = Raphael.colorwheel($('#input_example')[0], 100);
	colorWheel.input($('#color_code')[0]);
	colorWheel.color(option.getColorCode());
	colorWheel.onchange(() => {
		$('#color_code').triggerHandler('change');
	});
});

$(document).on('contextmenu', () => {
	return false;
});

/**
 * create canvas & update style
 *
 * @param {Object} canvas
 */
const setCanvasStyle = (canvas) => {
	canvas.setLineStyle('#000000', 1);

	const ctx = canvas.getCanvas().getContext('2d');
	ctx.font = 'bold 30px \'Arial\'';
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
		'trail_on': option.isTrailOn(),
	};
	const radioValues = {
		'language': option.getLanguage(),
	};
	const textValues = {
		'color_code': option.getColorCode(),
		'line_width': option.getLineWidth(),
	};

	// 各DOMに設定値を適用
	Object.keys(textValues).forEach((key) => {
		const $inputTextElement = $('#'+key);
		const setText = textValues[key];

		$inputTextElement.val(setText);
	});

	Object.keys(checkValues).forEach((key) => {
		$('#'+key).prop('checked', checkValues[key]);
	});

	Object.keys(radioValues).forEach((key) => {
		const value = radioValues[key];
		$('[name='+key+'][value='+value+']').prop('checked', true);
	});

	// ジェスチャー
	option.GESTURE_ID_LIST.forEach((key) => {
		const $inputTextElement = $('#'+key);
		const setText = option.getParam(key, '');

		$inputTextElement.val(setText);

		if ( ! $inputTextElement.hasClass('input_gesture')) {
			console.error('ジェスチャ設定に必須なDOM要素が見つかりません, {' + key + '}');
			return;
		}

		const setGestureText = setText ? contentScripts.replaceCommandToArrow(setText) : '&nbsp;';
		const $viewsGestureElement = $inputTextElement.siblings('.views_gesture');

		$viewsGestureElement.html(setGestureText);
		$inputTextElement.hide();
	});
};

/**
 * タブ表示の初期化をする
 */
const initTabView = () => {
	const $defaultActiveTab = $('#tab_btn2.changeTab');
	changeTab($defaultActiveTab);

	$('.changeTab').on('click', (event) => {
		const $target = $(event.currentTarget);
		changeTab($target);
	});
};

/**
 * change view tab.
 */
let currentlySetColorClass = '';
const changeTab = ($target) => {
	const showBodyId = $target.data('show-body');
	const setColorClass = $target.data('set-color');

	$('.tabBody').hide();
	$('#'+showBodyId).show();

	const activeTabClass = 'is-active';
	$('.tabs li').removeClass(activeTabClass);
	$target.closest('li').addClass(activeTabClass);

	const $switchDom = $('.js-switch-color');
	const $allChangeableTab = $('.changeTab');
	if (currentlySetColorClass) {
		$switchDom.removeClass(currentlySetColorClass);
		$allChangeableTab.removeClass(currentlySetColorClass);
	}
	$switchDom.addClass(setColorClass);
	$target.addClass(setColorClass);
	currentlySetColorClass = setColorClass;
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
	chrome.extension.sendMessage({msg: 'reload_option'}, (response) => {});
};

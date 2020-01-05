import DEBUG_ON from '../debug_flg';
import lang from '../lang';
import ContentScripts from '../content/content_scripts';
import TrailCanvas from '../content/trail_canvas';
import LibGesture from '../content/lib_gesture';
import LibOption from '../lib_option';

const gestureForOption = new LibGesture();
const option = new LibOption();
const canvasForOption = new TrailCanvas('gestureOptionCanvas', '10002');

(async () => {
  await option.load();
  canvasForOption.setCanvasSize(500, 500);

  /**
   * entry point (jQuery.ready)
   */
  $(() => {
    initializeAndRegisterEventForTab();

    // 言語設定の変更
    reflectSelectedLanguageToScreen();
    reflectOptionSettingsOnScreen();

    setCanvasStyle(canvasForOption);

    // オプションデータの表示
    // type: テキスト
    option.OPTION_ID_LIST.forEach((idName) => {
      $('#' + idName).on('change', (event) => {
        option.setParam(idName, $(event.target).val());
        saveOptions();
      });
    });

    // type: チェックボックス
    const checkIds = ['command_text_on', 'action_text_on', 'trail_on'];
    checkIds.forEach((idName) => {
      $('#' + idName).on('change', (event) => {
        option.setParam(idName, $(event.target).prop('checked'));
        saveOptions();
      });
    });

    // type: ラジオボタン
    const radioIds = ['language'];
    radioIds.forEach((idName) => {
      $('[name=' + idName + ']').on('change', (event) => {
        option.setParam(idName, $(event.currentTarget).attr('value'));
        saveOptions();
        reflectSelectedLanguageToScreen();
      });
    });

    registerEventForGesture();
    registerEventForAllReset();

    setupColorWheel();
  });
})();

/**
 * コンテキストメニューの呼び出しをされたときに実行されるイベント。
 * falseを返すと、コンテキストメニューを無効にする。
 */
document.addEventListener('contextmenu', (event) => {
  event.preventDefault();
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
  // ctx.fillStyle = '#FF0000';
};

/**
 * オプションの設定内容を画面に反映する
 */
const reflectOptionSettingsOnScreen = () => {
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
    const $inputTextElement = $('#' + key);
    const setText = textValues[key];

    $inputTextElement.val(setText);
  });

  Object.keys(checkValues).forEach((key) => {
    $('#' + key).prop('checked', checkValues[key]);
  });

  Object.keys(radioValues).forEach((key) => {
    const value = radioValues[key];
    $('[name=' + key + '][value=' + value + ']').prop('checked', true);
  });

  // ジェスチャー
  option.GESTURE_ID_LIST.forEach((key) => {
    const $inputTextElement = $('#' + key);
    const setText = option.getParam(key, '');

    if (!$inputTextElement.hasClass('input_gesture')) {
      console.error('ジェスチャ設定に必須なDOM要素が見つかりません, {' + key + '}');
      return;
    }

    setGestureInputComponent($inputTextElement, setText);
    $inputTextElement.hide();
  });
};

/**
 * タブに関する初期化と設定を行う
 */
const initializeAndRegisterEventForTab = () => {
  $('.changeTab').on('click', (event) => {
    const $clickedTab = $(event.currentTarget);
    reflectActiveTabToScreen($clickedTab);
  });

  const $defaultActiveTab = $('#tab_btn2.changeTab');
  reflectActiveTabToScreen($defaultActiveTab);
};

/**
 * アクティブなタブを画面に反映する
 */
let currentlySetColorClass = '';
const reflectActiveTabToScreen = ($target) => {
  const showBodyId = $target.data('show-body');
  const setColorClass = $target.data('set-color');

  $('.tabBody').hide();
  $('#' + showBodyId).show();

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
 * 使用言語の設定を画面に反映する
 */
const reflectSelectedLanguageToScreen = () => {
  const $langEn = $('.class_English');
  const $langJa = $('.class_Japanese');
  const currentLanguage = option.getLanguage();

  switch (currentLanguage) {
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

  $('input.input_gesture').each((index, target) => {
    const id = target.id;
    const $target = $(target);
    const text = lang.gesture[id][currentLanguage];

    $target.parent().siblings('th').text(text);
  });
};

/**
 * @param {jQuery} $input
 */
const createGestureInputComponent = ($input) => {
  const drawCanvas = canvasForOption.getCanvas();
  const ctx = canvasForOption.getContext2d();
  if (!drawCanvas || !ctx) {
    return;
  }

  document.body.appendChild(drawCanvas);
  $input.data('prevValue', $input.val());
  gestureForOption.clear();
  canvasForOption.clearCanvas();
  ctx.globalAlpha = 0.5;
  ctx.fillRect(0, 0, drawCanvas.width, drawCanvas.height);
  ctx.globalAlpha = 1.0;

  [
    option.isJapanese() ? 'この枠内にジェスチャを' : 'Please draw a gesture',
    option.isJapanese() ? '　　描いてください　　' : '   with this frame   ',
  ].forEach((text, index) => {
    canvasForOption.drawText(text, 80, 180 + (index * 80), '#ECECEC');
  });

  const $canvas = $('#' + canvasForOption.getCanvasId());
  $canvas.off();
  $canvas.on('mousedown', (event) => {
    const tmpX = event.pageX - $canvas.offset().left;
    const tmpY = event.pageY - $canvas.offset().top;
    gestureForOption.startGesture(tmpX, tmpY, null);
    return false;
  }).on('mousemove', (event) => {
    const tmpX = event.pageX - $canvas.offset().left;
    const tmpY = event.pageY - $canvas.offset().top;
    if (gestureForOption.registerPoint(tmpX, tmpY)) {
      canvasForOption.drawLine(
          gestureForOption.getLastX(), gestureForOption.getLastY(),
          gestureForOption.getX(), gestureForOption.getY(),
      );
    }
    return false;
  }).on('mouseup', () => {
    const removeCanvas = document.getElementById(drawCanvas.id);
    if (removeCanvas) {
      document.body.removeChild(removeCanvas);
    }

    setGestureInputComponent($input, gestureForOption.getGestureString());
    $input.triggerHandler('change');
    return false;
  });
};

const setGestureInputComponent = ($input, gestureText) => {
  const setGestureText = gestureText
      ? ContentScripts.replaceCommandToArrow(gestureText)
      : '&nbsp;';

  $input.val(gestureText);
  $input.siblings('.views_gesture').html(setGestureText);
};

const registerEventForGesture = () => {
  $('.reset_gesture').on('click', (event) => {
    const name = $(event.currentTarget).data('target');
    $('#' + name).val('').triggerHandler('change');
  });

  $('.views_gesture').on('click', (event) => {
    $(event.currentTarget).siblings('.input_gesture').show().focus().trigger('click');
  });

  $('.input_gesture').on('blur', (event) => {
    const $input = $(event.currentTarget);
    const drawCanvasId = canvasForOption.getCanvasId();
    const removeCanvas = document.getElementById(drawCanvasId);
    if (removeCanvas) {
      document.body.removeChild(removeCanvas);
      $('#' + drawCanvasId).off();
    }
    $input.hide();
  }).on('change', (event) => {
    const $input = $(event.target);
    const inputGesture = $input.val();
    const targetActionName = $input.attr('id');

    if (!inputGesture.match(/^[DLUR]*$/)) {
      setGestureInputComponent($input, $input.data('prevValue'));
      return;
    }

    const registeredAction = inputGesture ? option.isGestureAlreadyExist(inputGesture) : false;
    if (registeredAction !== false && registeredAction !== targetActionName) {
      const gestureLabel = lang.gesture[registeredAction][option.getLanguage()];
      if ( ! window.confirm('すでに「' + gestureLabel + '」に設定されています。入れ替えますか？')) {
        setGestureInputComponent($input, $input.data('prevValue'));
        return;
      }

      setGestureInputComponent($('#' + registeredAction), '');
      option.setParam(registeredAction, '');
    }

    setGestureInputComponent($input, inputGesture);
    $input.hide();

    option.setParam(targetActionName, inputGesture);
    saveOptions();
  }).on('click', (event) => {
    createGestureInputComponent($(event.target));
  });
};

const registerEventForAllReset = () => {
  $('#reset_all').on('click', () => {
    const confirmOk = window.confirm(lang.confirmOptionReset[option.getLanguage()]);
    if (confirmOk) {
      option.reset();
      chrome.extension.sendMessage({msg: 'reload_option'}, () => {
      });
      reflectOptionSettingsOnScreen();
      reflectSelectedLanguageToScreen();
    }
  });
};

const setupColorWheel = () => {
  const colorWheel = Raphael.colorwheel($('#input_example')[0], 100);
  colorWheel.input($('#color_code')[0]);
  colorWheel.color(option.getColorCode());
  colorWheel.onchange(() => {
    $('#color_code').triggerHandler('change');
  });
};

const saveOptions = () => {
  option.save();
  chrome.extension.sendMessage({msg: 'reload_option'}, () => {
  });
};

import LibOption from '../lib_option';

/**
 * ジェスチャーを描画するキャンバス
 */
class ContentScripts {
  /**
   * @param {Object} trailCanvas
   * @constructor
   */
  constructor(trailCanvas) {
    this.infoDiv = null;
    this.commandDiv = null;
    this.actionNameDiv = null;
    this.trailCanvas = trailCanvas;
    this.option = new LibOption();
  }

  /**
   * Load option values.
   */
  loadOption() {
    chrome.runtime.sendMessage({msg: 'load_options'}, (response) => {
      if (response) {
        this.option.setRawStorageData(response.options_json);

        // reload setting for canvas.
        this.setCanvasStyle();
        this.createInfoDiv();
      }
    });
  }

  /**
   * キャンバスの描画スタイルを設定
   */
  setCanvasStyle() {
    this.trailCanvas.setLineStyle(this.option.getColorCode(),
        this.option.getLineWidth());
  }


  /**
   * create infomation div & update style.
   */
  createInfoDiv() {
    this.createInfoDivElements();
    this.setStyleForInfoDiv();
  }

  /**
   * アクション名表示用のDIV要素を作る
   */
  createInfoDivElements() {
    const createDivElement = (id) => {
      const divElement = document.createElement('div');
      divElement.id = id;
      return divElement;
    };

    if ( ! this.commandDiv) {
      this.commandDiv = createDivElement('gestureCommandDiv');
    }
    if ( ! this.actionNameDiv) {
      this.actionNameDiv = createDivElement('gestureActionNameDiv');
    }
    if ( ! this.infoDiv) {
      this.infoDiv = createDivElement('infoDiv');
      this.infoDiv.appendChild(this.commandDiv);
      this.infoDiv.appendChild(this.actionNameDiv);
    }
  }

  /**
   * アクション名表示用の要素にスタイルを設定する
   */
  setStyleForInfoDiv() {
    // style setting.
    this.infoDiv.style.width = '300px';
    this.infoDiv.style.height = '80px';
    // center position.
    this.infoDiv.style.top = '0px';
    this.infoDiv.style.left = '0px';
    this.infoDiv.style.right = '0px';
    this.infoDiv.style.bottom = '0px';
    this.infoDiv.style.margin = 'auto';
    this.infoDiv.style.position = 'fixed';
    // this.infoDiv.style.borderRadius = '3px';
    // this.infoDiv.style.backgroundColor = '#FFFFEE';
    // this.infoDiv.style.overflow = 'visible';
    // this.infoDiv.style.overflow = 'block';
    this.infoDiv.style.textAlign = 'center';
    this.infoDiv.style.background = 'transparent';
    this.infoDiv.style.zIndex ='10001';
    this.infoDiv.style.fontFamily = 'Arial';
    this.infoDiv.style.fontSize = '30px';
    this.infoDiv.style.color = this.option.getColorCode();
    this.infoDiv.style.fontWeight = 'bold';
  }

  /**
   * @param {Object} lineParam
   * @param {string} commandName
   * @param {string} actionName
   */
  draw(lineParam, commandName, actionName) {
    this.drawTrail(lineParam);
    this.drawText(commandName, actionName);
  }

  /**
   * ラインを描画する
   *
   * @param {Object} lineParam
   */
  drawTrail(lineParam) {
    if ( ! this.option.isTrailOn()) {
      return;
    }

    // append されているか調べる。document.getElementById で取得出来たらOK
    const canvasId = this.trailCanvas.getCanvasId();
    if (document.getElementById(canvasId)) {
      this.trailCanvas.drawLine(
          lineParam.fromX, lineParam.fromY,
          lineParam.toX, lineParam.toY
      );
    }
  }

  /**
   * コマンド名、アクション名を描画する
   *
   * @param {string} commandName
   * @param {string} actionName
   */
  drawText(commandName, actionName) {
    if ( ! document.getElementById(this.infoDiv.id)) {
      return;
    }

    const divAction = document.getElementById(this.actionNameDiv.id);
    if (this.option.isActionTextOn()) {
      divAction.innerHTML = actionName ? actionName : '';
    } else {
      divAction.innerHTML = '';
    }

    const divCommand = document.getElementById(this.commandDiv.id);
    if (this.option.isCommandTextOn()) {
      commandName = ContentScripts.replaceCommandToArrow(commandName);
      divCommand.innerHTML = commandName;
    } else {
      divCommand.innerHTML = '';
    }
  }

  /**
   * Run the selected action.
   *
   * @param {type} actionName
   * @return {undefined}
   */
  exeAction(actionName) {
    switch (actionName) {
      case 'back':
        window.history.back();
        break;

      case 'forward':
        window.history.forward();
        break;

      case 'stop':
        window.stop();
        break;

      case 'scroll_top':
        window.scrollTo(0, 0);
        break;

      case 'scroll_bottom':
        const bodyHeight = parseInt(window.getComputedStyle(document.body).height, 10);
        window.scrollTo(0, bodyHeight);
        break;

      default:
        // なにもしない
        break;
    }
  }

  /**
   * ジェスチャコマンドを矢印表記に変換して返す D=>↓、U=>↑...
   * @param {string} actionName
   * @return {string}
   */
  static replaceCommandToArrow(actionName) {
    if (actionName) {
      return actionName.replace(/U/g, '<i class="flaticon-up-arrow"></i>').
          replace(/L/g, '<i class="flaticon-left-arrow"></i>').
          replace(/R/g, '<i class="flaticon-right-arrow"></i>').
          replace(/D/g, '<i class="flaticon-down-arrow"></i>');
    }

    return actionName;
  }
}

export default ContentScripts;


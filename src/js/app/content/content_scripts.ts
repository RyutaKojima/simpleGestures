import LibOption from '../lib_option';
import TrailCanvas from "./trail_canvas";
import {LineParameter} from "../types/common";

/**
 * ジェスチャーを描画するキャンバス
 */
class ContentScripts {
  infoDiv: null | HTMLDivElement;
  commandDiv: null | HTMLDivElement;
  actionNameDiv: null | HTMLDivElement;
  trailCanvas: TrailCanvas;
  option: LibOption;
  
  /**
   * @constructor
   */
  constructor(trailCanvas: TrailCanvas) {
    this.infoDiv = null;
    this.commandDiv = null;
    this.actionNameDiv = null;
    this.trailCanvas = trailCanvas;
    this.option = new LibOption();
  }

  /**
   * Load option values.
   */
  loadOption(): void {
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
  setCanvasStyle(): void {
    this.trailCanvas.setLineStyle(this.option.getColorCode(),
        this.option.getLineWidth());
  }


  /**
   * create information div & update style.
   */
  createInfoDiv(): void {
    this.createInfoDivElements();
    this.setStyleForInfoDiv();
  }

  /**
   * アクション名表示用のDIV要素を作る
   */
  createInfoDivElements(): void {
    const createDivElement = (id: string): HTMLDivElement => {
      const divElement: HTMLDivElement = document.createElement('div');
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
  setStyleForInfoDiv(): void {
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

  draw(lineParam: LineParameter, commandName: string, actionName: string): void {
    this.drawTrail(lineParam);
    this.drawText(commandName, actionName);
  }

  /**
   * ラインを描画する
   */
  drawTrail(lineParam: LineParameter): void {
    if ( ! this.option.isTrailOn()) {
      return;
    }

    const canvasId: null|string  = this.trailCanvas.getCanvasId();

    if (!this.elementExists(canvasId)) {
      return;
    }

    this.trailCanvas.drawLine(
        lineParam.fromX, lineParam.fromY,
        lineParam.toX, lineParam.toY
    );
  }

  elementExists(id: null|string): boolean {
    if (id === null) {
      return false;
    }

    // append されているか調べる。document.getElementById で取得出来たらOK
    return document.getElementById(id) !== null;
  }
  
  /**
   * コマンド名、アクション名を描画する
   */
  drawText(commandName: string, actionName: string): void {
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
  exeAction(actionName: string): void {
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
   */
  static replaceCommandToArrow(actionName: string): string {
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


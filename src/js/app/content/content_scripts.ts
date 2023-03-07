import LibOption from '../lib_option';
import {LineParameter} from '../types/common';
import TrailCanvas from './trail_canvas';

/**
 * ジェスチャーを描画するキャンバス
 */
class ContentScripts {
  infoDiv: null | HTMLDivElement;
  commandDiv: null | HTMLDivElement;
  actionNameDiv: null | HTMLDivElement;
  trailCanvas: TrailCanvas;
  option: LibOption;
  latestOptionLoadedAt: number;

  /**
   * @constructor
   * @param {TrailCanvas} trailCanvas
   */
  constructor(trailCanvas: TrailCanvas) {
    this.infoDiv = null;
    this.commandDiv = null;
    this.actionNameDiv = null;
    this.trailCanvas = trailCanvas;
    this.option = new LibOption();
    this.latestOptionLoadedAt = 0;
  }

  /**
   * Load option values.
   */
  async loadOption(): Promise<void> {
    const Threshold = (1000);
    const elapseMilliSec = Date.now() - this.latestOptionLoadedAt;

    this.latestOptionLoadedAt = Date.now();

    if (elapseMilliSec < Threshold) {
      return;
    }

    try {
      await this.option.load();
    } catch (e) {}

    // reload setting for canvas.
    this.setCanvasStyle();
    this.createInfoDiv();
  }

  /**
   * キャンバスの描画スタイルを設定
   */
  setCanvasStyle(): void {
    this.trailCanvas.setLineStyle(
        this.option.getColorCode(),
        this.option.getLineWidth(),
    );
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

    if (!this.commandDiv) {
      this.commandDiv = createDivElement('gestureCommandDiv');
    }
    if (!this.actionNameDiv) {
      this.actionNameDiv = createDivElement('gestureActionNameDiv');
    }
    if (!this.infoDiv) {
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
    this.infoDiv.style.zIndex = '10001';
    this.infoDiv.style.fontFamily = 'Arial';
    this.infoDiv.style.fontSize = '30px';
    this.infoDiv.style.color = this.option.getColorCode();
    this.infoDiv.style.fontWeight = 'bold';
  }

  /**
   *
   * @param {LineParameter} lineParam
   * @param {string} commandName
   * @param {string} actionName
   */
  draw(lineParam: LineParameter, commandName: string, actionName: string): void {
    this.drawTrail(lineParam);
    this.drawText(commandName, actionName);
  }

  /**
   * ラインを描画する
   *
   * @param {LineParameter} lineParam
   */
  drawTrail(lineParam: LineParameter): void {
    if (!this.option.isTrailOn()) {
      return;
    }

    const canvasId: null | string = this.trailCanvas.getCanvasId();

    if (!this.elementExists(canvasId)) {
      return;
    }

    this.trailCanvas.drawLine(
        lineParam.fromX, lineParam.fromY,
        lineParam.toX, lineParam.toY,
    );
  }

  /**
   * @param {null|string} id
   * @return {boolean}
   */
  elementExists(id: null | string): boolean {
    if (id === null) {
      return false;
    }

    // append されているか調べる。document.getElementById で取得出来たらOK
    return document.getElementById(id) !== null;
  }

  /**
   * コマンド名、アクション名を描画する
   *
   * @param {string} commandName
   * @param {string} actionName
   */
  drawText(commandName: string, actionName: string): void {
    if (!document.getElementById(this.infoDiv.id)) {
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
      divCommand.innerHTML = commandName;
    } else {
      divCommand.innerHTML = '';
    }
  }

  /**
   * Run the selected action.
   *
   * @param {string} actionName
   * @param {Element} startTarget
   * @return {undefined}
   */
  exeAction(actionName: string, startTarget: Element | null): boolean {
    switch (actionName) {
      case 'back':
        window.history.back();
        return true;

      case 'forward':
        window.history.forward();
        return true;

      case 'stop':
        window.stop();
        return true;

      case 'scroll_top':
        this.scrollToTop(startTarget);
        return true;

      case 'scroll_bottom':
        this.scrollToBottom(startTarget);
        return true;

      default:
        // なにもしない
        return false;
    }
  }

  /**
   * @param {Element|null} startTarget
   */
  scrollToTop(startTarget: Element | null): void {
    const recursiveScrollToTop = (element: Element | null) => {
      if (!element) return;

      element.scrollTo(0, 0);
      recursiveScrollToTop(element.parentElement);
    };

    window.scrollTo(0, 0);
    recursiveScrollToTop(startTarget);
  }

  /**
   * @param {Element | null} startTarget
   */
  scrollToBottom(startTarget: Element | null): void {
    const recursiveScrollToBottom = (element: Element | null) => {
      if (!element) return;

      const toHeight = element.scrollHeight;
      element.scrollTo(0, toHeight);
      recursiveScrollToBottom(element.parentElement);
    };

    const bodyHeight = parseInt(window.getComputedStyle(document.body).height, 10);
    const bodyScrollHeight = document.body.scrollHeight;
    const height = Math.max(bodyHeight, bodyScrollHeight);
    window.scrollTo(0, height);
    recursiveScrollToBottom(startTarget);
  }
}

export default ContentScripts;


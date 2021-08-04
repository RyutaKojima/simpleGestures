/**
 * TrailCanvas
 */
class TrailCanvas {
  myCanvas: HTMLCanvasElement;

  /**
   *
   * @param {string} id
   * @param {string} zIndex
   */
  constructor(id: string, zIndex: string) {
    this.myCanvas = document.createElement('canvas');
    this.myCanvas.id = id;

    // ------------------------------
    // Style settings.
    // ------------------------------
    // Set priority
    this.myCanvas.style.zIndex = zIndex;

    // Set in the center position.
    this.myCanvas.style.top = '0px';
    this.myCanvas.style.left = '0px';
    this.myCanvas.style.right = '0px';
    this.myCanvas.style.bottom = '0px';
    this.myCanvas.style.margin = 'auto';
    this.myCanvas.style.position = 'fixed';
    this.myCanvas.style.overflow = 'visible';
  }

  /**
   * @return {HTMLCanvasElement}
   */
  getCanvas(): HTMLCanvasElement {
    return this.myCanvas;
  }

  /**
   * @return {null|string}
   */
  getCanvasId(): null|string {
    return (this.myCanvas) ? this.myCanvas.id : null;
  }

  /**
   * @return {null|CanvasRenderingContext2D}
   */
  getContext2d(): null|CanvasRenderingContext2D {
    return (this.myCanvas) ? this.myCanvas.getContext('2d') : null;
  }

  /**
   * キャンバスのサイズを変更
   *
   * @param {number} width
   * @param {number} height
   */
  setCanvasSize(width: number, height: number): void {
    if (this.myCanvas) {
      // this.myCanvas.style.width    = width + "px";
      // this.myCanvas.style.height   = height + "px";
      this.myCanvas.width = width;
      this.myCanvas.height = height;
    }
  }

  /**
   * 描画するラインのスタイルを設定する
   *
   * @param {string} color
   * @param {number} width
   */
  setLineStyle(color: string, width: number): void {
    const ctx: null|CanvasRenderingContext2D = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  }

  /**
   * キャンバスをクリア
   */
  clearCanvas(): void {
    const ctx: null|CanvasRenderingContext2D = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  }

  /**
   * テキストを描画
   *
   * @param {string} text
   * @param {number} drawX
   * @param {number} drawY
   * @param {string} textColor
   */
  drawText(text: string, drawX: number, drawY: number, textColor: string): void {
    const ctx: null|CanvasRenderingContext2D = this.getContext2d();
    if (!ctx) {
      return;
    }

    const prevFillStyle: string | CanvasGradient | CanvasPattern = ctx.fillStyle;

    if (textColor) {
      ctx.fillStyle = textColor;
    }

    ctx.fillText(text, drawX, drawY);

    if (textColor) {
      ctx.fillStyle = prevFillStyle;
    }
  }

  /**
   * 直線を描く
   *
   * @param {number} fromX
   * @param {number} fromY
   * @param {number} toX
   * @param {number} toY
   */
  drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
    const ctx: null|CanvasRenderingContext2D = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  }
}

export default TrailCanvas;

/**
 * TrailCanvas
 */
class TrailCanvas {
  myCanvas: HTMLCanvasElement;

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

  getCanvas(): HTMLCanvasElement {
    return this.myCanvas;
  }

  getCanvasId(): null|string {
    return (this.myCanvas) ? this.myCanvas.id : null;
  }

  getContext2d(): null|CanvasRenderingContext2D  {
    return (this.myCanvas) ? this.myCanvas.getContext('2d') : null;
  };

  /**
   * キャンバスのサイズを変更
   */
  setCanvasSize(width: number, height: number): void {
    if (this.myCanvas) {
      // this.myCanvas.style.width    = width + "px";
      // this.myCanvas.style.height   = height + "px";
      this.myCanvas.width = width;
      this.myCanvas.height = height;
    }
  };

  /**
   * 描画するラインのスタイルを設定する
   */
  setLineStyle(color: string, width: number): void {
    const ctx: null|CanvasRenderingContext2D = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = width;
  };

  /**
   * キャンバスをクリア
   */
  clearCanvas(): void {
    const ctx: null|CanvasRenderingContext2D  = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  };

  /**
   * テキストを描画
   */
  drawText(text: string, drawX: number, drawY: number, textColor: string): void {
    const ctx: null|CanvasRenderingContext2D  = this.getContext2d();
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
  };

  /**
   * 直線を描く
   */
  drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
    const ctx: null|CanvasRenderingContext2D  = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.beginPath();
    ctx.moveTo(fromX, fromY);
    ctx.lineTo(toX, toY);
    ctx.stroke();
  };
}

export default TrailCanvas;

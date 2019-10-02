/**
 * TrailCanvas
 */
class TrailCanvas {
  /**
   * @constructor
   * @param {string} _Id
   * @param {string} _zIndex
   */
  constructor(_Id, _zIndex) {
    this.myCanvas = document.createElement('canvas');
    this.myCanvas.id = _Id;

    // ------------------------------
    // Style settings.
    // ------------------------------
    // Set priority
    this.myCanvas.style.zIndex = _zIndex;

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
   * Getter
   * @return {HTMLElement | *}
   */
  getCanvas() {
    return this.myCanvas;
  }

  /**
   * Getter
   * @return {any}
   */
  getCanvasId() {
    return (this.myCanvas) ? this.myCanvas.id : null;
  }

  /**
   * Getter
   * @return {*}
   */
  getContext2d() {
    return (this.myCanvas) ? this.myCanvas.getContext('2d') : null;
  };

  /**
   * キャンバスのサイズを変更
   *
   * @param {number} _width
   * @param {number} _height
   */
  setCanvasSize(_width, _height) {
    if (this.myCanvas) {
      //		this.myCanvas.style.width    = _width + "px";
      //		this.myCanvas.style.height   = _height + "px";
      this.myCanvas.width = _width;
      this.myCanvas.height = _height;
    }
  };

  /**
   * 描画するラインのスタイルを設定する
   *
   * @param {type} _color
   * @param {type} _width
   * @return {undefined}
   */
  setLineStyle(_color, _width) {
    const ctx = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.strokeStyle = _color;
    ctx.lineWidth = _width;
  };

  /**
   * キャンバスをクリア
   */
  clearCanvas() {
    const ctx = this.getContext2d();
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
  };

  /**
   * テキストを描画
   *
   * @param {string} text
   * @param {number} drawX
   * @param {number} drawY
   * @param {string} textColor
   */
  drawText(text, drawX, drawY, textColor) {
    const ctx = this.getContext2d();
    if (ctx) {
      const prevFillStyle = ctx.fillStyle;

      if (textColor) {
        ctx.fillStyle = textColor;
      }

      ctx.fillText(text, drawX, drawY);

      if (textColor) {
        ctx.fillStyle = prevFillStyle;
      }
    }
  };

  /**
   * 直線を描く
   *
   * @param {number} fromX
   * @param {number} fromY
   * @param {number} toX
   * @param {number} toY
   */
  drawLine(fromX, fromY, toX, toY) {
    const ctx = this.getContext2d();
    if (ctx) {
      ctx.beginPath();
      ctx.moveTo(fromX, fromY);
      ctx.lineTo(toX, toY);
      ctx.stroke();
    }
  };
}

export default TrailCanvas;

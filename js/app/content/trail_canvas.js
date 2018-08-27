/**
 * TrailCanvas
 *
 * @param {number} _Id
 * @param {number} _zIndex
 * @constructor
 */
const TrailCanvas = function(_Id, _zIndex) {
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
};

TrailCanvas.prototype.getCanvas = function() {
	return this.myCanvas;
};
TrailCanvas.prototype.getCanvasId = function() {
	return (this.myCanvas) ? this.myCanvas.id : null;
};
TrailCanvas.prototype.getContext2d = function() {
	return (this.myCanvas) ? this.myCanvas.getContext('2d') : null;
};

/**
 * キャンバスのサイズを変更
 *
 * @param {type} _width
 * @param {type} _height
 */
TrailCanvas.prototype.setCanvasSize = function(_width, _height) {
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
TrailCanvas.prototype.setLineStyle = function(_color, _width) {
	const ctx = this.getContext2d();
	if ( ! ctx) {
		return;
	}

	ctx.strokeStyle = _color;
	ctx.lineWidth = _width;
};

/**
 * キャンバスをクリア
 */
TrailCanvas.prototype.clearCanvas = function() {
	const ctx = this.getContext2d();
	if ( ! ctx) {
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
TrailCanvas.prototype.drawText = function(text, drawX, drawY, textColor) {
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
TrailCanvas.prototype.drawLine = function(fromX, fromY, toX, toY) {
	const ctx = this.getContext2d();
	if (ctx) {
		ctx.beginPath();
		ctx.moveTo(fromX, fromY);
		ctx.lineTo(toX, toY);
		ctx.stroke();
	}
};

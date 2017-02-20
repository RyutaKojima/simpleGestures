/**
 * TrailCanvas
 * @constructor
 */
var TrailCanvas = function() {
	this.myCanvas = null;
};

TrailCanvas.prototype.getCanvas = function() {
	return this.myCanvas;
};
TrailCanvas.prototype.getContext2d = function() {
	return (this.myCanvas) ? this.myCanvas.getContext('2d') : null;
};

/**
 * ジェスチャの軌跡描画用のキャンパスインスタンスを作成する
 *
 * @param {type} _width
 * @param {type} _height
 * @param {type} _zIndex
 * @returns {this.myCanvas}
 */
TrailCanvas.prototype.createCanvas = function (_Id, _width, _height, _zIndex) {
	if ( ! this.myCanvas) {
		this.myCanvas = document.createElement('canvas');
		this.myCanvas.id = _Id;
	}

	this.myCanvas.width    = _width;
	this.myCanvas.height   = _height;

	//------------------------------
	// Style settings.
	//------------------------------
//	this.myCanvas.style.width    = _width + "px";
//	this.myCanvas.style.height   = _height + "px";

	// Set priority
	this.myCanvas.style.zIndex   = _zIndex;

	// Set in the center position.
	this.myCanvas.style.top      = "0px";
	this.myCanvas.style.left     = "0px";
	this.myCanvas.style.right    = "0px";
	this.myCanvas.style.bottom   = "0px";
	this.myCanvas.style.margin   = "auto";
	this.myCanvas.style.position = 'fixed';
	this.myCanvas.style.overflow = 'visible';

	return this.myCanvas;
};

/**
 * 描画するラインのスタイルを設定する
 *
 * @param {type} _color
 * @param {type} _width
 * @returns {undefined}
 */
TrailCanvas.prototype.setDrawStyleLine = function (_color, _width) {
	var ctx = this.getContext2d();
	if ( ! ctx) {
		return;
	}

	ctx.strokeStyle = _color;
	ctx.lineWidth   = _width;
};

/**
 * ジェスチャ用キャンバスの軌道を消す
 */
TrailCanvas.prototype.clearCanvas = function () {
	if ( ! this.myCanvas) {
		return;
	}
	var ctx = this.getContext2d();
	if ( ! ctx) {
		return;
	}

	ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
};

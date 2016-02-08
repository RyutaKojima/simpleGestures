/**
 * @constructor
 */
var LibGesture = function() {
	/** @const */
	this.COMMAND_MAX_LENGTH = 14;
	/** @const */
	this.GESTURE_START_DISTANCE = 10;

	this._nowX = -1;
	this._nowY = -1;
	this._lastX = -1;
	this._lastY = -1;
	this._lastVector = null;
	this._strGestureCommand = "";
	this._linkUrl = null;

	this.myCanvas = null;
};

LibGesture.prototype.getLastX = function() {	return this._lastX;	};
LibGesture.prototype.getLastY = function() {	return this._lastY;	};
LibGesture.prototype.getX = function() {	return this._nowX;	};
LibGesture.prototype.getY = function() {	return this._nowY;	};
LibGesture.prototype.getURL = function() {	return this._linkUrl;	};
LibGesture.prototype.getGestureString = function() {	return this._strGestureCommand;	};
LibGesture.prototype.getCanvas = function() {	return this.myCanvas;	};

LibGesture.prototype.clear = function() {
	this._nowX = -1;
	this._nowY = -1;
	this._lastX = -1;
	this._lastY = -1;
	this._lastVector = null;
	this._strGestureCommand = "";
	this._linkUrl = null;
};

/**
 * ジェスチャの開始時に呼ぶ
 * 
 * @param {type} x
 * @param {type} y
 * @param {type} url
 * @returns {undefined}
 */
LibGesture.prototype.startGestrue = function(x, y, url) {
	this.clear();

	this._nowX = x;
	this._nowY = y;
	this._lastX = x;
	this._lastY = y;
	this._linkUrl = url;
};

/**
 *
 * @param {type} x
 * @param {type} y
 * @returns {Boolean}
 */
LibGesture.prototype.registPoint = function(x, y) {
	if (this._lastX !== -1 && this._lastY !== -1) {
		var distance = Math.sqrt( Math.pow(x-this._lastX, 2) + Math.pow(y-this._lastY, 2) );
//		debug_log("distance: " + distance);
		if (distance > this.GESTURE_START_DISTANCE) {
			var radian = Math.atan2(y-this._lastY, x-this._lastX);
			var rot    = radian * 180 / Math.PI;
//			debug_log( "radian: " + radian + ", rotate: " + rot );

			var tmp_vector = null;
			if (rot >= -45.0 && rot < 45.0) {
				tmp_vector = "R";
			}
			else if (rot >= 45.0 && rot < 135.0) {
				tmp_vector = "D";
			}
			else if (rot >= -135.0 && rot < -45.0) {
				tmp_vector = "U";
			}
			else {
				tmp_vector = "L";
			}
//			debug_log(tmp_vector);

			if (this._lastVector !== tmp_vector) {
				this._lastVector = tmp_vector;

				if (this._strGestureCommand.length < this.COMMAND_MAX_LENGTH) {
					this._strGestureCommand += tmp_vector;
				}
				else {
					// gesture cancel
					this._strGestureCommand = "";
					for (var i=0; i < this.COMMAND_MAX_LENGTH; i++ ) {
						this._strGestureCommand += "-";
					}
				}
			}

			this._lastX = this._nowX;
			this._lastY = this._nowY;
			this._nowX = x;
			this._nowY = y;

			return true;
		}
	}

	return false;
};

/**
 * ジェスチャの終了時に呼ぶ
 *
 * @returns {undefined}
 */
LibGesture.prototype.endGesture = function () {
	this.clear();
	this.clearCanvas();
};

/**
 * ジェスチャの軌跡描画用のキャンパスインスタンスを作成する
 *
 * @param {type} _width
 * @param {type} _height
 * @param {type} _zIndex
 * @returns {this.myCanvas}
 */
LibGesture.prototype.createCanvas = function (_Id, _width, _height, _zIndex) {
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
LibGesture.prototype.setDrawStyleLine = function (_color, _width) {
	if (this.myCanvas) {
		var ctx = this.myCanvas.getContext('2d');
		ctx.strokeStyle = _color;
		ctx.lineWidth   = _width;
	}
};

/**
 * ジェスチャ用キャンバスの軌道を消す
 */
LibGesture.prototype.clearCanvas = function () {
	if (this.myCanvas) {
		this.myCanvas.width = this.myCanvas.width;

		var ctx = this.myCanvas.getContext('2d');
		ctx.clearRect(0, 0, this.myCanvas.width, this.myCanvas.height);
	}
};

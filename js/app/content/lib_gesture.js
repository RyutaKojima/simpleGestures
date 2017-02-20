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
};

LibGesture.prototype.getLastX = function() {	return this._lastX;	};
LibGesture.prototype.getLastY = function() {	return this._lastY;	};
LibGesture.prototype.getX = function() {	return this._nowX;	};
LibGesture.prototype.getY = function() {	return this._nowY;	};
LibGesture.prototype.getURL = function() {	return this._linkUrl;	};
LibGesture.prototype.getGestureString = function() {	return this._strGestureCommand;	};

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
//		console.log("distance: " + distance);
		if (distance > this.GESTURE_START_DISTANCE) {
			var radian = Math.atan2(y-this._lastY, x-this._lastX);
			var rot    = radian * 180 / Math.PI;
//			console.log( "radian: " + radian + ", rotate: " + rot );

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
//			console.log(tmp_vector);

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
LibGesture.prototype.endGesture = function () {};

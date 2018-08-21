/**
 * @constructor
 */
const LibGesture = function() {
	/** @const */
	this.COMMAND_MAX_LENGTH = 14;
	/** @const */
	this.GESTURE_START_DISTANCE = 10;

	this._nowX = -1;
	this._nowY = -1;
	this._lastX = -1;
	this._lastY = -1;
	this._lastDirection = null;
	this._strGestureCommand = '';
	this._linkUrl = null;
};

LibGesture.prototype.getLastX = function() { return this._lastX; };
LibGesture.prototype.getLastY = function() { return this._lastY; };
LibGesture.prototype.getX = function() { return this._nowX; };
LibGesture.prototype.getY = function() { return this._nowY; };
LibGesture.prototype.getURL = function() { return this._linkUrl; };
LibGesture.prototype.getGestureString = function() { return this._strGestureCommand; };

LibGesture.prototype.clear = function() {
	this._nowX = -1;
	this._nowY = -1;
	this._lastX = -1;
	this._lastY = -1;
	this._lastDirection = null;
	this._strGestureCommand = '';
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
LibGesture.prototype.startGesture = function(x, y, url) {
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
		const distance = this.calcDistance(x, y, this._lastX, this._lastY);
//		console.log('Distance: ' + distance);
		if (distance > this.GESTURE_START_DISTANCE) {
			const rotation = this.calcRotation(x, y, this._lastX, this._lastY);
			const charDirection = this.rotationToDirection(rotation);
//			console.log('Rotation: ' + rotation + ' Direction: ' + charDirection);

			if (this._lastDirection !== charDirection) {
				this._lastDirection = charDirection;

				if (this._strGestureCommand.length < this.COMMAND_MAX_LENGTH) {
					this._strGestureCommand += charDirection;
				}
				else {
					// gesture cancel
					this._strGestureCommand = '';
					for (let i = 0; i < this.COMMAND_MAX_LENGTH; i++) {
						this._strGestureCommand += '-';
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

/**
 * ２点の座標から距離を計算して返す
 * @param x
 * @param y
 * @param lastX
 * @param lastY
 * @returns {number}
 */
LibGesture.prototype.calcDistance = function (x, y, lastX, lastY) {
	return Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
};

/**
 * ２点の座標から角度を計算して返す
 * @param x
 * @param y
 * @param lastX
 * @param lastY
 * @returns {number}
 */
LibGesture.prototype.calcRotation = function (x, y, lastX, lastY) {
	const radian = Math.atan2(y - lastY, x - lastX);
	//console.log("rotate: " + rotation);
	return radian * 180 / Math.PI;
};

/**
 * 角度から上下左右の向き情報に変換して返す
 */
LibGesture.prototype.rotationToDirection = function (rotation) {
	if (rotation >= -45.0 && rotation < 45.0) {
		return 'R';
	}
	else if (rotation >= 45.0 && rotation < 135.0) {
		return 'D';
	}
	else if (rotation >= -135.0 && rotation < -45.0) {
		return 'U';
	}
	else {
		return 'L';
	}
};
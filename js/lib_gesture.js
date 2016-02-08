/**
 * @constructor
 */
var LibGesture = function() {
	/** @const */
	this.COMMAND_MAX_LENGTH = 14;
	/** @const */
	this.GESTURE_START_DISTANCE = 10;

	this.now_x = -1;
	this.now_y = -1;
	this.last_x = -1;
	this.last_y = -1;
	this.last_vector = null;
	this.gesture_command = "";
};

LibGesture.prototype.getLastX = function() {	return this.last_x;	};
LibGesture.prototype.getLastY = function() {	return this.last_y;	};
LibGesture.prototype.getX = function() {	return this.now_x;	};
LibGesture.prototype.getY = function() {	return this.now_y;	};

LibGesture.prototype.clear = function() {
	this.now_x = -1;
	this.now_y = -1;
	this.last_x = -1;
	this.last_y = -1;
	this.last_vector = null;
	this.gesture_command = "";
};

LibGesture.prototype.startGestrue = function(x, y) {
	this.clear();

	this.now_x = x;
	this.now_y = y;
	this.last_x = x;
	this.last_y = y;
};

LibGesture.prototype.registPoint = function(x, y) {
	if (this.last_x !== -1 && this.last_y !== -1) {
		var distance = Math.sqrt( Math.pow(x-this.last_x, 2) + Math.pow(y-this.last_y, 2) );
//		debug_log("distance: " + distance);
		if (distance > this.GESTURE_START_DISTANCE) {
			var radian = Math.atan2(y-this.last_y, x-this.last_x);
			var rot    = radian * 180 / Math.PI;
//				debug_log( "radian: " + radian + ", rotate: " + rot );

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
//				debug_log(tmp_vector);

			if (this.last_vector !== tmp_vector) {

				if (this.gesture_command.length < this.COMMAND_MAX_LENGTH) {
					this.gesture_command += tmp_vector;
				}
				else {
					// gesture cancel
					this.gesture_command = "";
					for (var i=0; i < this.COMMAND_MAX_LENGTH; i++ ) {
						this.gesture_command += "-";
					}
				}

				this.last_vector = tmp_vector;
			}

			this.last_x = this.now_x;
			this.last_y = this.now_y;
			this.now_x = x;
			this.now_y = y;

			return true;
		}
	}

	return false;
};

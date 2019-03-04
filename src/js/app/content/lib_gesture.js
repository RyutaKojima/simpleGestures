/**
 * ジェスチャの管理
 */
class LibGesture {
  /**
   * @return {number}
   */
  static get COMMAND_MAX_LENGTH() {
    return 14;
  }

  /**
   * @return {number}
   */
  static get GESTURE_START_DISTANCE() {
    return 10;
  }

  /**
   * @constructor
   */
  constructor() {
    this._nowX = -1;
    this._nowY = -1;
    this._lastX = -1;
    this._lastY = -1;
    this._lastDirection = null;
    this._strGestureCommand = '';
    this._linkUrl = null;
  }

  /**
   * @return {number|type|*}
   */
  getLastX() {
    return this._lastX;
  }

  /**
   * @return {number|type|*}
   */
  getLastY() {
    return this._lastY;
  }

  /**
   * @return {number|type}
   */
  getX() {
    return this._nowX;
  }

  /**
   * @return {number|type}
   */
  getY() {
    return this._nowY;
  }

  /**
   * @return {null|type}
   */
  getURL() {
    return this._linkUrl;
  }

  /**
   * Getter
   * @return {string|string}
   */
  getGestureString() {
    return this._strGestureCommand;
  }

  /**
   * 初期化
   */
  clear() {
    this._nowX = -1;
    this._nowY = -1;
    this._lastX = -1;
    this._lastY = -1;
    this._lastDirection = null;
    this._strGestureCommand = '';
    this._linkUrl = null;
  }


  /**
   * ジェスチャの開始時に呼ぶ
   *
   * @param {type} x
   * @param {type} y
   * @param {type} url
   * @return {undefined}
   */
  startGesture(x, y, url) {
    this.clear();

    this._nowX = x;
    this._nowY = y;
    this._lastX = x;
    this._lastY = y;
    this._linkUrl = url;
  }

  /**
   *
   * @param {type} x
   * @param {type} y
   * @return {Boolean}
   */
  registPoint(x, y) {
    if (this._lastX !== -1 && this._lastY !== -1) {
      const distance = LibGesture.calcDistance(x, y, this._lastX, this._lastY);
      //		console.log('Distance: ' + distance);
      if (distance > LibGesture.GESTURE_START_DISTANCE) {
        const rotation = LibGesture.calcRotation(x, y, this._lastX, this._lastY);
        const charDirection = LibGesture.rotationToDirection(rotation);
        //			console.log('Rotation: ' + rotation + ' Direction: ' + charDirection);

        if (this._lastDirection !== charDirection) {
          this._lastDirection = charDirection;

          if (this._strGestureCommand.length < LibGesture.COMMAND_MAX_LENGTH) {
            this._strGestureCommand += charDirection;
          } else {
            // gesture cancel
            this._strGestureCommand = '';
            for (let i = 0; i < LibGesture.COMMAND_MAX_LENGTH; i++) {
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
  }

  /**
   * ジェスチャの終了時に呼ぶ
   *
   * @return {undefined}
   */
  endGesture() {}

  /**
   * ２点の座標から距離を計算して返す
   * @param {number} x
   * @param {number} y
   * @param {number} lastX
   * @param {number} lastY
   * @return {number}
   */
  static calcDistance(x, y, lastX, lastY) {
    return Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
  }

  /**
   * ２点の座標から角度を計算して返す
   * @param {number} x
   * @param {number} y
   * @param {number} lastX
   * @param {number} lastY
   * @return {number}
   */
  static calcRotation(x, y, lastX, lastY) {
    const radian = Math.atan2(y - lastY, x - lastX);
    // console.log("rotate: " + rotation);
    return radian * 180 / Math.PI;
  }

  /**
   * 角度から上下左右の向き情報に変換して返す
   *
   * @param {float} rotation
   * @return {string}
   */
  static rotationToDirection(rotation) {
    if (rotation >= -45.0 && rotation < 45.0) {
      return 'R';
    } else if (rotation >= 45.0 && rotation < 135.0) {
      return 'D';
    } else if (rotation >= -135.0 && rotation < -45.0) {
      return 'U';
    } else {
      return 'L';
    }
  }
}

export default LibGesture;
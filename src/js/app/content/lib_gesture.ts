/**
 * ジェスチャの管理
 */
class LibGesture {
  _lastX: number;
  _lastY: number;
  _nowX: number;
  _nowY: number;
  _linkUrl: null|string;
  _strGestureCommand: string;
  _lastDirection: null|'R'|'D'|'U'|'L';

  static get COMMAND_MAX_LENGTH(): number {
    return 14;
  }

  static get GESTURE_START_DISTANCE(): number {
    return 10;
  }

  /**
   * @constructor
   */
  constructor() {
    this.clear();
  }

  getLastX(): number {
    return this._lastX;
  }

  getLastY(): number {
    return this._lastY;
  }

  getX(): number {
    return this._nowX;
  }

  getY(): number {
    return this._nowY;
  }

  getURL(): null|string {
    return this._linkUrl;
  }

  getGestureString(): string {
    return this._strGestureCommand;
  }

  /**
   * 初期化
   */
  clear(): void {
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
   */
  startGesture(x: number, y: number, url: null|string) {
    this.clear();

    this._nowX = x;
    this._nowY = y;
    this._lastX = x;
    this._lastY = y;
    this._linkUrl = url;
  }

  /**
   *
   * @param {number} x
   * @param {number} y
   * @return {Boolean}
   */
  registerPoint(x: number, y: number): boolean {
    if (this._lastX === -1 || this._lastY === -1) {
      return false;
    }

    if (!LibGesture.isDistanceThresholdExceeded(x, y, this._lastX, this._lastY)) {
      return false;
    }

    const charDirection: 'R'|'D'|'U'|'L' = LibGesture.getDirection(x, y, this._lastX, this._lastY);

    if (this._lastDirection !== charDirection) {
      this._lastDirection = charDirection;

      if (this._strGestureCommand.length < LibGesture.COMMAND_MAX_LENGTH) {
        this._strGestureCommand += charDirection;
      } else {
        // gesture cancel
        this._strGestureCommand = '-'.repeat(LibGesture.COMMAND_MAX_LENGTH);
      }
    }

    this._lastX = this._nowX;
    this._lastY = this._nowY;
    this._nowX = x;
    this._nowY = y;

    return true;
  }

  /**
   * ジェスチャの終了時に呼ぶ
   */
  endGesture(): void {
  }

  /**
   * ２点の距離が閾値を超えているか？
   */
  static isDistanceThresholdExceeded(x: number, y: number, lastX: number, lastY: number): boolean {
    const distance = LibGesture.calcDistance(x, y, lastX, lastY);
    // console.log('Distance: ' + distance);
    return distance > LibGesture.GESTURE_START_DISTANCE;
  }

  /**
   * ２点の座標から距離を計算して返す
   */
  static calcDistance(x: number, y: number, lastX: number, lastY: number): number {
    return Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
  }

  /**
   * ２点間の向きを返す
   */
  static getDirection(x: number, y: number, lastX: number, lastY: number): 'R'|'D'|'U'|'L' {
    const rotation: number = LibGesture.calcRotation(x, y, lastX, lastY);
    return LibGesture.rotationToDirection(rotation);
  }

  /**
   * ２点の座標から角度を計算して返す
   */
  static calcRotation(x: number, y: number, lastX: number, lastY: number): number {
    const radian: number = Math.atan2(y - lastY, x - lastX);
    // console.log("rotate: " + rotation);
    return radian * 180 / Math.PI;
  }

  /**
   * 角度から上下左右の向き情報に変換して返す
   */
  static rotationToDirection(rotation: number): 'R'|'D'|'U'|'L' {
    if (rotation >= -45.0 && rotation < 45.0) {
      return 'R';
    }
    if (rotation >= 45.0 && rotation < 135.0) {
      return 'D';
    }
    if (rotation >= -135.0 && rotation < -45.0) {
      return 'U';
    }

    return 'L';
  }
}

export default LibGesture;

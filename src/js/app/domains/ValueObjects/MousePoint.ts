/**
 *
 */
export default class MousePoint {
  public x: number;
  public y: number;

  /**
     *
     * @param {number} x
     * @param {number} y
     */
  constructor(x: number, y:number) {
    this.x = x;
    this.y = y;
  }

  /**
     *
     * @param {MousePoint} newPoint
     * @return {number}
     */
  public euclideanDistance(newPoint: MousePoint): number {
    // Avoid Math.pow for squared difference calculation on hot mousemove path
    const dx = newPoint.x - this.x;
    const dy = newPoint.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
     *
     * @param {MousePoint} newPoint
     * @return {'R'|'D'|'U'|'L'}
     */
  public direction(newPoint: MousePoint): 'R'|'D'|'U'|'L' {
    const radian: number = Math.atan2(newPoint.y - this.y, newPoint.x - this.x);
    const rotation = radian * 180 / Math.PI;

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

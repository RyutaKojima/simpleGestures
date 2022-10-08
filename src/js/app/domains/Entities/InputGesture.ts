import lang from '../../lang';
import LibOption from '../../lib_option';
import MousePoint from '../ValueObjects/MousePoint';
import Command from './Gestures/Command';

/**
 *
 */
export default class InputGesture {
  public isUpdateLine: boolean;

  public linkUrl: string|null;

  public latestConfirmedPoint: MousePoint|null;
  public trackingPoints: MousePoint[];

  public gestureCommands: Command;

  public gestureActionCode: string|null;

  /**
     * @return {number}
     */
  static get GESTURE_START_DISTANCE(): number {
    return 10;
  }

  /**
     *
     */
  constructor() {
    this.clear();
  }

  /**
     *
     */
  public clear():void {
    this.isUpdateLine = false;
    this.linkUrl = null;
    this.latestConfirmedPoint = null;
    this.trackingPoints = [];
    this.gestureCommands = new Command();
    this.gestureActionCode = null;
  }

  /**
     *
     * @param {string} linkUrl
     * @return {this}
     */
  public setLinkUrl(linkUrl: string):this {
    this.linkUrl = linkUrl;

    return this;
  }

  /**
     *
     * @param {MousePoint} point
     * @return {this}
     */
  public addPoint(point: MousePoint): this {
    this.isUpdateLine = false;

    if (this.latestConfirmedPoint === null) {
      this.latestConfirmedPoint = point;
      this.trackingPoints = [point];
      return this;
    }

    const distance = this.latestConfirmedPoint.euclideanDistance(point);
    if (distance > InputGesture.GESTURE_START_DISTANCE) {
      const newCommand = this.latestConfirmedPoint.direction(point);

      this.isUpdateLine = true;
      this.latestConfirmedPoint = point;
      this.trackingPoints.push(point);

      this.gestureCommands.add(newCommand);
    }

    return this;
  }

  /**
     *
     * @param {LibOption} option
     * @return {this}
     */
  public updateAction(option: LibOption): this {
    this.gestureActionCode = option.getGestureActionName(this.gestureCommands.rawString);
    return this;
  }

  /**
     * @return {MousePoint}
     */
  public get newLineFrom(): MousePoint {
    if (this.trackingPoints.length >= 2) {
      return this.trackingPoints[this.trackingPoints.length - 2];
    }
    return new MousePoint(0, 0);
  }

  /**
     * @return {MousePoint}
     */
  public get newLineTo(): MousePoint {
    if (this.trackingPoints.length >= 1) {
      return this.trackingPoints[this.trackingPoints.length - 1];
    }
    return new MousePoint(0, 0);
  }

  /**
     *
     * @param {LibOption} option
     * @return {string}
     */
  public gestureActionName(option: LibOption): string {
    return this.gestureActionCode ?
          lang.gesture['gesture_' + this.gestureActionCode][option.getLanguage()] :
          '';
  }
}

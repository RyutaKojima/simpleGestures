export interface HTMLChildElement extends HTMLLinkElement {
  parentElement: HTMLLinkElement;
}
export interface HTMLElementEvent<T extends HTMLElement> extends MouseEvent {
  target: T;
}

/**
 * マウスの状態を管理する
 */
class Mouse {
  btnBuffer: boolean[];

  /**
   * @constructor
   */
  constructor() {
    /**
     * マウスの入力状態を記録する配列
     */
    this.btnBuffer = [];
  }

  /**
   * @return {number}
   */
  static get LEFT_BUTTON(): number {
    return 1;
  }

  /**
   * @return {number}
   */
  static get RIGHT_BUTTON(): number {
    return 3;
  }

  /**
   * マウスイベントから、リンクURLを取得して返す
   *
   * @param {Object} mouseevent
   * @return {*}
   */
  static getHref(mouseevent: HTMLElementEvent<HTMLChildElement>): null|string {
    const target: HTMLChildElement = mouseevent.target;
    const parentLinkElement = target.closest('a');

    if (target.href) {
      return target.href;
    }

    if (parentLinkElement && parentLinkElement.href) {
      return parentLinkElement.href;
    }

    return null;
  }


  /**
   * 現在の入力状態をリセットする
   */
  reset(): void {
    this.btnBuffer = [];
  }

  /**
   * 基本操作メソッド
   * @param {numeric} btnCode
   * @return {*}
   */
  isOn(btnCode: number): boolean {
    return this.btnBuffer[btnCode];
  }

  /**
   *
   * @param {string|numeric} btnCode
   */
  setOn(btnCode: number): void {
    this.btnBuffer[btnCode] = true;
  }

  /**
   *
   * @param {number} btnCode
   */
  setOff(btnCode: number): void {
    this.btnBuffer[btnCode] = false;
  }

  /**
   * @return {boolean}
   */
  isLeft(): boolean {
    return this.btnBuffer[Mouse.LEFT_BUTTON];
  }

  /**
   * @param {boolean} _flg
   */
  setLeft(_flg: boolean): void {
    this.btnBuffer[Mouse.LEFT_BUTTON] = _flg;
  }

  /**
   * @return {boolean}
   */
  isRight(): boolean {
    return this.btnBuffer[Mouse.RIGHT_BUTTON];
  }

  /**
   * @param {boolean} _flg
   */
  setRight(_flg: boolean): void {
    this.btnBuffer[Mouse.RIGHT_BUTTON] = _flg;
  }
}

export default Mouse;

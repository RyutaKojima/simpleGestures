/**
 *
 */
export default class Command {
  private gestureCommands: string;

  /**
     * @return {number}
     */
  static get COMMAND_MAX_LENGTH(): number {
    return 14;
  }

  /**
     *
     */
  constructor() {
    this.clear();
  }

  /**
     * @return {this}
     */
  public clear(): this {
    this.gestureCommands = '';

    return this;
  }

  /**
     * @param {string} newCommand
     * @return {this}
     */
  public add(newCommand: string): this {
    if (newCommand === this.latestCommand()) {
      return this;
    }

    if (this.gestureCommands.length < Command.COMMAND_MAX_LENGTH) {
      this.gestureCommands += newCommand;
    } else {
      this.gestureCommands = '-'.repeat(Command.COMMAND_MAX_LENGTH);
    }

    return this;
  }


  /**
     * @return {string|null}
     */
  private latestCommand(): string|null {
    if (this.gestureCommands.length === 0) {
      return null;
    }
    return this.gestureCommands[this.gestureCommands.length - 1];
  }

  /**
     * @return {string}
     */
  public get rawString(): string {
    return this.gestureCommands;
  }

  /**
     * @return {string}
     */
  public get displayString(): string {
    return Command.replaceCommandToDisplay(this.rawString);
  }

  /**
     * ジェスチャコマンドを矢印表記に変換して返す D=>↓、U=>↑...
     * @param {string} commandString
     * @return {string}
     */
  public static replaceCommandToDisplay(commandString: string): string {
    if (!commandString) {
      return '';
    }

    return commandString.replace(/U/g, '<i class="flaticon-up-arrow"></i>').
        replace(/L/g, '<i class="flaticon-left-arrow"></i>').
        replace(/R/g, '<i class="flaticon-right-arrow"></i>').
        replace(/D/g, '<i class="flaticon-down-arrow"></i>');
  }
}

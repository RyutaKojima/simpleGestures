import Command from './Command';

describe('Command', () => {
  let command: Command;

  beforeEach(() => {
    command = new Command();
  });

  it('should add command and ignore consecutive duplicates', () => {
    command.add('R');
    expect(command.rawString).toBe('R');

    command.add('R');
    command.add('D');
    expect(command.rawString).toBe('RD');

    command.clear();
    expect(command.rawString).toBe('');
  });

  it('should handle COMMAND_MAX_LENGTH correctly', () => {
    for (let i = 0; i < 20; i++) {
      command.add(i % 2 === 0 ? 'R' : 'D');
    }
    expect(command.rawString).toBe('--------------');
  });

  it('should convert raw string to display arrows', () => {
    command.add('U');
    command.add('D');
    command.add('L');
    command.add('R');
    expect(command.displayString).toBe('\uf100\uf101\uf102\uf103');
    expect(Command.replaceCommandToDisplay('')).toBe('');
  });
});

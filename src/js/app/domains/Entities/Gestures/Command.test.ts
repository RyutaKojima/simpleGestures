import Command from './Command';

describe('Command', () => {
  let command: Command;

  beforeEach(() => {
    command = new Command();
  });

  it('should add command', () => {
    command.add('R');
    expect(command.rawString).toBe('R');
  });

  it('should ignore consecutive duplicate commands', () => {
    command.add('R');
    command.add('R');
    command.add('D');
    expect(command.rawString).toBe('RD');
  });

  it('should clear commands', () => {
    command.add('R');
    command.add('D');
    command.clear();
    expect(command.rawString).toBe('');
  });

  it('should handle COMMAND_MAX_LENGTH correctly', () => {
    for (let i = 0; i < 20; i++) {
        command.add(i % 2 === 0 ? 'R' : 'D');
    }
    expect(command.rawString).toBe('--------------');
  });
});

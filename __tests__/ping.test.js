const ping = require('../commands/fun/ping');

describe('ping command', () => {
  it('replies with Pong!', async () => {
    const interaction = { reply: jest.fn().mockResolvedValue() };
    await ping.execute(interaction);
    expect(interaction.reply).toHaveBeenCalledWith('Pong!');
  });
});

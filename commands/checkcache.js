module.exports = {
    name: 'checkcache',
    description: 'Check message cache',
    args: false,
    cooldown: 10,
    usage: '',
    execute(message, args) {
      if (!message.member) {
          message.channel.send('Not cached')
      } else {
        message.channel.send('Ready!')
      }
    }
  };
  
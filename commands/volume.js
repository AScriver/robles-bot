const play = require('./play.js');

module.exports = {
  name: 'volume',
  description: 'Change the bots volume',
  args: false,
  cooldown: 0,
  usage: '',
  execute(message, args) {
    const servers = play.servers;
    const server = servers[message.guild.id];

    /*if(!isNaN(args[0])) {
        message.channel.send('Please enter a valid number!')
        return
    }*/
    if (!server.dispatcher) {
        message.channel.send('Play a song first!')
        return
    }

    if (server.dispatcher) {
      server.dispatcher.setVolume(args[0]/100);
    }
  }
};

module.exports = {
  name: 'avatar',
  aliases: ['icon', 'pfp'],
  description: 'Get profile picture of a user',
  args: true,
  usage: '<user>',
  execute(message, args) {
    if (!message.mentions.users.size) {
      return message.channel.send(
        `Your avatar: ${message.author.displayAvatarURL}`
      );
    }
    const avatarList = message.mentions.users.map(user => {
      return `${user.toString()}'s avatar: ${user.displayAvatarURL}`;
    });
    // send the entire array of strings as a message
    // by default, discord.js will `.join()` the array with `\n`
    message.channel.send(avatarList);
  }
};

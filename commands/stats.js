const userController = require("../controllers/userController");

module.exports = {
  name: "stats",
  description: "Get Your Stats",
  args: false,
  cooldown: 0,
  usage: "<user>",
  execute(message, args) {
    console.log(message.mentions.users)
    /*if (!message.mentions.users.size) {
      return userController.getStats(message.author.id, stats => {
        console.log(stats)
        message.channel.send(`<@${stats.userId}>`, {
          embed: {
            color: 3447003,
            author: {
              name: message.author.username,
              icon_url: `${message.author.displayAvatarURL}`
            },
            title: `Server Stats For: @${message.author.username}#${message.author.discriminator
              }`,
            fields: [
              {
                name: "Discord ID:",
                value: `${stats.userId}`
              },
              {
                name: "Post Count: ",
                value: `${stats.postCount}`
              },
              {
                name: "Joined: ",
                value: `${stats.createdAt}`
              },
              {
                name: "Last Message: ",
                value: `${stats.updatedAt}`
              }
            ]
          }
        });
      });
    }*/

    message.mentions.users.map(user => {
      console.log(user)
      return userController.getStats(user.id, stats => {
        console.log(stats.dataValues)
        message.channel.send(`<@!${stats.dataValues.userID}>`, {
          embed: {
            color: 3447003,
            author: {
              name: user.username,
              icon_url: `${user.displayAvatarURL}`
            },
            title: `Server Stats For: @${user.username}#${user.discriminator}`,
            fields: [
              {
                name: "Discord ID:",
                value: `${stats.dataValues.userId}`
              },
              {
                name: "Post Count: ",
                value: `${stats.dataValues.postCount}`
              },
              {
                name: "Joined: ",
                value: `${stats.createdAt}`
              },
              {
                name: "Last Message: ",
                value: `${stats.updatedAt}`
              }
            ]
          }
        });
      });
    });
  }
};

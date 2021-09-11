const db = require('../models');

module.exports = {
    log: (message) => {
        const author = message.author
        db.User.upsert({
            user: author.username,
            userID: author.id,
            guildID: message.channel.guild ? message.channel.guild.id : "DM",
            discriminator: author.discriminator,
            avatar: author.avatar,
            bot: author.bot,
            lastMessageID: author.lastMessageID
        }).then(res => {
            db.Message.create({
                messageID: message.id,
                channelID: message.channel ? message.channel.id : "DM",
                guildID: message.channel.guild ? message.channel.guild.id : "DM",
                userID: message.author.id,
                deleted: message.deleted,
                type: message.type,
                content: message.content ? message.content : JSON.stringify(message.embeds[0]),
                pinned: message.pinned,
                tts: message.tts,
                nonce: message.nonce,
                system: message.system,
                createdTimestamp: message.createdTimestamp,
                editedTimestamp: message.editedTimestamp,
                webhookID: message.webhookID,
                hit: message.hit
            }).catch(err => {
                if (err) console.log('db.Message.create', err);
            });
        }).catch(err => {
            if (err) console.log('db.User.upsert', err);
        })

    }
};

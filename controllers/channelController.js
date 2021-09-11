const db = require('../models');

module.exports = {
    sync: (channel) => {
        db.Channel.upsert({
            channelID: channel.id,
            guildID: channel.guild.id,
            name: channel.name,
            position: channel.position,
            parentID: channel.parentID,
            topic: channel.topic,
            nsfw: channel.nsfw,
            lastMessageID: channel.lastMessageID,
            lastPinTimestamp: channel.lastPinTimestamp,
            rateLimitPerUser: channel.rateLimitPerUser
            }).catch(err => {
                if (err) console.log('db.Channel.upsert', err);
            })
    }
};

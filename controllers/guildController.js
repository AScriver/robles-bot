const db = require('../models');

module.exports = {
    sync: (guild) => {
        db.Guild.upsert({
            guildID: guild.id,
            name: guild.name,
            deleted: guild.deleted,
            available: guild.available,
            icon: guild.icon,
            region: guild.region,
            memberCount: guild.memberCount,
            large: guild.large,
            applicationID: guild.applicationID,
            afkTimeout: guild.afkTimeout,
            afkChannelID: guild.afkChannelID,
            systemChannelID: guild.systemChannelID,
            verificationLevel: guild.verificationLevel,
            explicitContentFilter: guild.explicitContentFilter,
            mfaLevel: guild.mfaLevel,
            joinedTimestamp: guild.joinedTimestamp,
            defaultMessageNotifications: guild.defaultMessageNotifications,
            ownerID: guild.ownerID
        }).catch(err => {
            if (err) console.log('db.Guild.upsert', err);
        })
    }
};

// Maps users to specific servers
module.exports = (sequelize, DataTypes) => {
    const Channel = sequelize.define('Channel', {
        channelID: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        guildID: {
            type: DataTypes.STRING
        },
        name: {
            type: DataTypes.STRING
        },
        position: {
            type: DataTypes.INTEGER
        },
        parentID: {
            type: DataTypes.STRING
        },
        topic: {
            type: DataTypes.STRING(2000)
        },
        nsfw: {
            type: DataTypes.STRING
        },
        lastMessageID: {
            type: DataTypes.STRING
        },
        lastPinTimestamp: {
            type: DataTypes.DATE
        },
        rateLimitPerUser: {
            type: DataTypes.INTEGER
        }
    });
    return Channel;
};

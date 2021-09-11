// Maps users to specific servers
module.exports = (sequelize, DataTypes) => {
    const Guild = sequelize.define('Guild', {
        guildID: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING
        },
        deleted: {
            type: DataTypes.BOOLEAN
        },
        available: {
            type: DataTypes.BOOLEAN
        },
        icon: {
            type: DataTypes.STRING
        },
        region: {
            type: DataTypes.STRING
        },
        memberCount: {
            type: DataTypes.INTEGER
        },
        large: {
            type: DataTypes.BOOLEAN
        },
        applicationID: {
            type: DataTypes.STRING
        },
        afkTimeout: {
            type: DataTypes.INTEGER
        },
        afkChannelID: {
            type: DataTypes.STRING
        },
        systemChannelID: {
            type: DataTypes.STRING
        },
        verificationLevel: {
            type: DataTypes.INTEGER
        },
        explicitContentFilter: {
            type: DataTypes.INTEGER
        },
        mfaLevel: {
            type: DataTypes.INTEGER
        },
        joinedTimestamp: {
            type: DataTypes.STRING
        },
        defaultMessageNotifications: {
            type: DataTypes.STRING
        },
        ownerID: {
            type: DataTypes.STRING
        }
    });
    return Guild;
};

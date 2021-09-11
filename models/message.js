module.exports = (sequelize, DataTypes) => {
    const Message = sequelize.define('Message', {
        messageID: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        userID: {
            type: DataTypes.STRING,
            foreignKey: true
        },
        channelID: {
            type: DataTypes.STRING
        },
        guildID: {
            type: DataTypes.STRING
        },
        deleted: {
            type: DataTypes.BOOLEAN
        },
        type: {
            type: DataTypes.STRING
        },
        content: {
            type: DataTypes.STRING(2000)
        },
        pinned: {
            type: DataTypes.BOOLEAN
        },
        tts: {
            type: DataTypes.BOOLEAN
        },
        nonce: {
            type: DataTypes.STRING
        },
        system: {
            type: DataTypes.BOOLEAN
        },
        createdTimestamp: {
            type: DataTypes.STRING
        },
        editedTimestamp: {
            type: DataTypes.STRING
        },
        webhookID: {
            type: DataTypes.STRING
        },
        hit: {
            type: DataTypes.STRING
        }
    });

    Message.associate = (models) => {
        Message.belongsTo(models.User, {
            foreignKey: 'userID'
        })
    }

    return Message;
};

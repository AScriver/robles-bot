// Maps users to specific servers
module.exports = (sequelize, DataTypes) => {
    const Member = sequelize.define('Member', {
      guildID: {
        type: DataTypes.STRING
      },
      userId: {
        type: DataTypes.STRING
      },
      joinedTimestamp: {
        type: DataTypes.STRING
      },
      roles: {
        type: DataTypes.STRING
      },
      nickname: {
        type: DataTypes.STRING
      },
      serverDeaf: {
        type: DataTypes.BOOLEAN
      },
      serverMute: {
        type: DataTypes.BOOLEAN
      },
      selfMute: {
        type: DataTypes.BOOLEAN
      },
      selfDeaf: {
        type: DataTypes.BOOLEAN
      },
      voiceSessionID: {
        type: DataTypes.STRING
      },
      voiceChannelID: {
        type: DataTypes.STRING
      },
      nickname: {
        type: DataTypes.STRING
      },
      lastMessageID: {
        type: DataTypes.STRING
      },
      deleted: {
        type: DataTypes.BOOLEAN
      }
    });
    return Member;
  };
  
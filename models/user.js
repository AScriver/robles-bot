module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user: {
      type: DataTypes.STRING
    },
    userID: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    guildID: {
      type: DataTypes.STRING
    },
    discriminator: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    bot: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    lastMessageID: {
      type: DataTypes.STRING
    }
  });

  User.associate = (models) => {
    User.hasMany(models.Message, {
      foreignKey: 'userID'
    })
  }

  return User;
};

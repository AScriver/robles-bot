const db = require("../models");

module.exports = {
  //sync: (users)
  // finds user by their discord ID in the database
  getStats: (id, cb) => {
    db.User.findOne({
      where: {
        userId: id
      }
    })
      .then(dbUser => {
        cb(dbUser);
      })
      .catch(err => {
        if (err) throw err;
      });
  },
  create: (member, cb) => {
    console.log(member)
    db.User.create({
      user: member.user.username,
      discriminator: member.user.discriminator,
      bot: member.user.bot ? true : false,
      avatar: member.user.avatar,
      userID: member.user.id
    }).then(dbUser => {
      cb(dbUser)
    }).catch(err => {
      if (err) throw err;
    })
  }
};

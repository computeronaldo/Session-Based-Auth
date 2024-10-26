const User = require("../models/user.models");

const userExists = async (username) => {
  try {
    const user = await User.findOne({ username });
    return user;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

module.exports = userExists;

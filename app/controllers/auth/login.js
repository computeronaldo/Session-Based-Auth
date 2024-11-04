const User = require("../../models/user.models");
const userExists = require("../../utils/userExists");

const loginController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const userExistence = await userExists(username);
    if (!userExistence) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    const user = await User.findOne({ username });
    const passwordMatched = await user.comparePassword(password);
    if (!passwordMatched) {
      return res.status(401).json({ error: "Invalid password" });
    }

    req.session.username = username;
    res.status(200).json({ message: "Logged in", sessionID: req.sessionID });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = loginController;

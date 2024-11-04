const User = require("../../models/user.models");

const signupController = async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = await User.NewUser({ username, password });
    if (!newUser) {
      throw new Error("Failed to create user");
    }
    const createdUser = new User(newUser);
    const result = await createdUser.save();
    if (!result) {
      throw new Error("Failed to create user");
    }
    res.status(200).json({ message: "Sign up successful" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = signupController;

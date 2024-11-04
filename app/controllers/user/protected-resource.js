const userExists = require("../../utils/userExists");

const protectedResourceController = async (req, res) => {
  const { username } = req.session;

  console.log(username);

  try {
    if (!userExists(username)) {
      return res.status(401).json({ error: "User doesn't exist" });
    }

    res.status(200).json({ message: "Super protected resource only for you!" });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

module.exports = protectedResourceController;

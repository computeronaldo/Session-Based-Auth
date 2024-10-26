const AuthMiddleware = (req, res, next) => {
  if (!req.session || !req.session.username) {
    return res.status(401).json({ error: "User not signed in" });
  } else {
    next();
  }
};

module.exports = AuthMiddleware;

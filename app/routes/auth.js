const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const loginController = require("../controllers/auth/login");
const logoutController = require("../controllers/auth/logout");
const signupController = require("../controllers/auth/signup");

router.post("/login", loginController);
router.post("/logout", AuthMiddleware, logoutController);
router.post("/signup", signupController);

module.exports = router;

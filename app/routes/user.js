const router = require("express").Router();
const AuthMiddleware = require("../middlewares/AuthMiddleware");

const protectedResourceController = require("../controllers/user/protected-resource");

router.get("/protected-resource", AuthMiddleware, protectedResourceController);

module.exports = router;

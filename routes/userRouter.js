var express = require("express");
var router = express.Router();
var userModule = require("../modules/userModule");
var authMiddleware = require("../middlewares/authMiddleware");

router.post("/register", userModule.register);
router.post("/login", userModule.login);
router.route("/").get(authMiddleware.protect,userModule.allUsers);


module.exports = router;
const express = require("express");
const router = express.Router();
const messageModule = require("../modules/messageModule");
const authMiddleware = require("../middlewares/authMiddleware");


router.route("/:chatId").get(authMiddleware.protect, messageModule.allMessages);
router.route("/").post(authMiddleware.protect, messageModule.sendMessage);

module.exports = router;

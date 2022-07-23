const express = require("express");
const router = express.Router();
const chatModule = require("../modules/chatModule");
const authMiddleware = require("../middlewares/authMiddleware");

router.route("/").post(authMiddleware.protect, chatModule.accessChat);
router.route("/").get(authMiddleware.protect, chatModule.fetchChats);
router.route("/group").post(authMiddleware.protect, chatModule.createGroupChat);
router.route("/rename").put(authMiddleware.protect, chatModule.renameGroup);
router.route("/groupadd").put(authMiddleware.protect, chatModule.addToGroup);
router
  .route("/groupremove")
  .put(authMiddleware.protect, chatModule.removeFromGroup);

module.exports = router;

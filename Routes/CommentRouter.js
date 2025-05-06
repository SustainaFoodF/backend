const express = require("express");
const router = express.Router();
const commentController = require("../Controllers/CommentController");
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary

// Route to create a post
router.post("/create", ensureAuthenticated, commentController.createComment);
router.post("/addResponse", ensureAuthenticated, commentController.addResponse);
router.put("/", ensureAuthenticated, commentController.updateComment); // pass commentId and postId on req.body

router.put(
  "/deleteComment",
  ensureAuthenticated,
  commentController.deleteComment
); // pass commentId and postId on req.body

module.exports = router;

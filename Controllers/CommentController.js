const commentService = require("../Services/commentService");

exports.createComment = async (req, res) => {
  try {
    const { postId, value } = req.body;
    const owner = req.user._id;
    const newComment = await commentService.addComment(postId, {
      value,
      owner,
    });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.addResponse = async (req, res) => {
  try {
    const { commentId, value, postId } = req.body;
    console.log(commentId);
    const owner = req.user._id;
    const newResponse = await commentService.addResponse(
      postId,
      commentId,
      value,
      owner
    );
    res.status(201).json(newResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
exports.updateComment = async (req, res) => {
  try {
    const { postId, commentId, value } = req.body;
    const updatedComment = await commentService.updateComment(
      postId,
      commentId,
      value
    );
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.body;
    const result = await commentService.deleteComment(postId, commentId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

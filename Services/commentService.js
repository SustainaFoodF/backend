const PostModel = require("../Models/Post");

module.exports.addComment = async (postId, commentData) => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post not found");

    post.comments.push(commentData);
    await post.save();

    return post.comments[post.comments.length - 1]; // Retourne le commentaire ajouté
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports.updateComment = async (postId, commentId, newValue) => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post not found");

    const comment = post.comments.id(commentId);
    if (!comment) throw new Error("Comment not found");

    comment.value = newValue; // Mise à jour du texte du commentaire
    await post.save();

    return comment;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports.deleteComment = async (postId, commentId) => {
  try {
    const post = await PostModel.findById(postId);
    if (!post) throw new Error("Post not found");

    post.comments = post.comments.filter((c) => c._id.toString() !== commentId);
    await post.save();

    return { message: "Comment deleted successfully" };
  } catch (error) {
    throw new Error(error.message);
  }
};

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
exports.addResponse = async (postId, commentId, value, owner) => {
  try {
    // Find the post that contains the comment
    const post = await PostModel.findById(postId);

    if (!post) {
      throw new Error("Post not found");
    }
    console.log(post, commentId);
    const commentIndex = post.comments.findIndex(
      (c) => c._id.toString() === commentId.toString()
    );

    // Find the specific comment by ID
    const comment = post.comments[commentIndex];

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Add the new response to the comment's responses array
    const newResponse = {
      value,
      owner,
      createdAt: new Date(),
    };

    // Push the new response into the comment's responses array
    comment.responses.push(newResponse);
    await comment.save();
    // Save the updated post
    await post.save();

    // Return the newly added response
    return newResponse;
  } catch (error) {
    throw new Error(error.message);
  }
};

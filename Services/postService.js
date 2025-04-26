const PostModel = require("../Models/Post");
const path = require("path");
const fs = require("fs");
const { sendNotificationToUser } = require("./notificationService");
// Create a new post
exports.createPost = async (title, text, user, files) => {
  console.log(user);
  const newPost = new PostModel({
    title,
    text,
    creator: user._id,
    files,
  });
  const role = user.role === "client" ? "business" : "client";
  await sendNotificationToUser(
    "📢 Nouvelle annonce !",
    "Un nouvel article a été ajouté à la plateforme. Consultez-le dès maintenant pour ne rien manquer !",
    role,
    "role"
  );

  return await newPost.save();
};

// Get all posts
exports.getAllPosts = async () => {
  return await PostModel.find()
    .populate("creator", "name")
    .populate("comments.owner", "name image");
};

// Get a post by ID
exports.getPostById = async (postId) => {
  return await PostModel.findById(postId).populate("creator", "name");
};

// Update a post
exports.updatePost = async (postId, title, text, files) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    { title, text, files },
    { new: true } // Returns the updated post
  );
};
function deleteFile(filename) {
  const filePath = path.join(__dirname, "../public/uploads", filename);

  return new Promise((resolve, reject) => {
    // Check if the file exists before attempting to delete
    fs.access(filePath, fs.constants.F_OK, (err) => {
      if (err) {
        // If the file doesn't exist, just resolve without error (do nothing)
        return resolve(`File ${filename} not found, nothing to delete.`);
      }

      // Delete the file
      fs.unlink(filePath, (err) => {
        if (err) {
          // If there is an error deleting the file, reject the promise
          return reject(new Error(`Error deleting file: ${err.message}`));
        }

        // Resolve the promise when the file is deleted successfully
        resolve(`File ${filename} deleted successfully`);
      });
    });
  });
}
exports.deletePost = async (postId) => {
  try {
    // Find the post by ID
    const post = await PostModel.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    // Check if the post has files and delete them
    if (post.files && post.files.length > 0) {
      for (const file of post.files) {
        await deleteFile(file); // Await the file deletion
      }
    }

    // Delete the post after the files have been deleted
    await PostModel.deleteOne({ _id: postId }); // Use deleteOne to remove the post
    // Return a success message
    return { message: "Post and its associated files deleted successfully" };
  } catch (error) {
    // Handle errors gracefully and return the error message
    return { error: `Failed to delete post: ${error.message}` };
  }
};
exports.addReview = async (postId, type, userId) => {
  try {
    if (!["like", "dislike"].includes(type)) {
      throw new Error("Invalid review type");
    }

    const updateQuery =
      type === "like"
        ? {
            $addToSet: { "reviews.likes": userId }, // Ajoute si non existant
            $pull: { "reviews.dislikes": userId }, // Supprime des dislikes
          }
        : {
            $addToSet: { "reviews.dislikes": userId },
            $pull: { "reviews.likes": userId },
          };

    const post = await PostModel.findByIdAndUpdate(postId, updateQuery, {
      new: true,
    });

    if (!post) {
      throw new Error("Post not found");
    }

    return { message: "Like/Dislike updated successfully", post };
  } catch (error) {
    return { error: `Failed to update like/dislike: ${error.message}` };
  }
};

exports.deleteReview = async (postId, type, userId) => {
  try {
    if (!["like", "dislike"].includes(type)) {
      throw new Error("Invalid review type");
    }

    const updateQuery =
      type === "like"
        ? {
            $pull: { "reviews.likes": userId }, // Supprime des dislikes
          }
        : {
            $pull: { "reviews.dislikes": userId },
          };

    const post = await PostModel.findByIdAndUpdate(postId, updateQuery);

    if (!post) {
      throw new Error("Post not found");
    }

    return { message: "Like/Dislike updated successfully" };
  } catch (error) {
    return { error: `Failed to update like/dislike: ${error.message}` };
  }
};

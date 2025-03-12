const PostModel = require("../Models/Post");

// Create a new post
exports.createPost = async (title, text, creator) => {
  const newPost = new PostModel({
    title,
    text,
    creator,
  });

  return await newPost.save();
};

// Get all posts
exports.getAllPosts = async () => {
  return await PostModel.find().populate("creator", "name"); // Populating creator with user info (like email)
};

// Get a post by ID
exports.getPostById = async (postId) => {
  return await PostModel.findById(postId).populate("creator", "name");
};

// Update a post
exports.updatePost = async (postId, title, text) => {
  return await PostModel.findByIdAndUpdate(
    postId,
    { title, text },
    { new: true } // Returns the updated post
  );
};

// Delete a post
exports.deletePost = async (postId) => {
  return await PostModel.findByIdAndDelete(postId);
};

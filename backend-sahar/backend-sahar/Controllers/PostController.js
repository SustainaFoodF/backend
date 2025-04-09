const postService = require("../Services/postService");

exports.createPost = async (req, res) => {
  const { title, text, files } = req.body;
  const { user } = req; // Assuming you're using authentication middleware and req.user contains the logged-in user

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  try {
    const newPost = await postService.createPost(title, text, user, files);
    res.status(201).json(newPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating post", error: error.message });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts(); // Populating the user name
    res.status(200).json(posts);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching posts", error: error.message });
  }
};
exports.getPostsForAdmin = async (req, res) => {
  try {
    const posts = await postService.getAllPostsForAdmin();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPostById = async (req, res) => {
  const { postId } = req.params;

  try {
    const post = await postService.getPostById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching post", error: error.message });
  }
};

exports.updatePost = async (req, res) => {
  const { postId } = req.params;
  const { title, text, files } = req.body;

  try {
    const updatedPost = await postService.updatePost(
      postId,
      title,
      text,
      files
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating post", error: error.message });
  }
};

exports.deletePost = async (req, res) => {
  const { postId } = req.params;

  try {
    // Call the service to delete the post
    const result = await postService.deletePost(postId);

    // If result contains an error message, return 400 status
    if (result.error) {
      console.log(result);
      return res.status(400).json({ message: result.error });
    }

    // If post deletion is successful, return success message
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    // If any unexpected error occurs, return 500 status with the error message
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

exports.addReview = async (req, res) => {
  const { postId } = req.params;
  const { type } = req.body;
  const { user } = req;
  try {
    // Call the service to delete the post
    const result = await postService.addReview(postId, type, user._id);

    // If result contains an error message, return 400 status
    if (result.error) {
      console.log(result);
      return res.status(400).json({ message: result.error });
    }

    // If post deletion is successful, return success message
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // If any unexpected error occurs, return 500 status with the error message
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  const { postId } = req.params;
  const { type } = req.body;
  const { user } = req;
  try {
    // Call the service to delete the post
    const result = await postService.deleteReview(postId, type, user._id);

    // If result contains an error message, return 400 status
    if (result.error) {
      console.log(result);
      return res.status(400).json({ message: result.error });
    }

    // If post deletion is successful, return success message
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    // If any unexpected error occurs, return 500 status with the error message
    res
      .status(500)
      .json({ message: "Error deleting post", error: error.message });
  }
};

const express = require("express");
const router = express.Router();
const postController = require("../Controllers/PostController");
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary

// Route to create a post
router.post("/create", ensureAuthenticated, postController.createPost);
// Route pour récupérer les posts pour l'administrateur
router.get("/",  postController.getPostsForAdmin);


// Route to get all posts
router.get("/", postController.getAllPosts);

// Route to get a post by ID
router.get("/:postId", ensureAuthenticated, postController.getPostById);

router.put("/:postId/review", ensureAuthenticated, postController.addReview);
router.put(
  "/:postId/delete-review",
  ensureAuthenticated,
  postController.deleteReview
);
router.put("/:postId", ensureAuthenticated, postController.updatePost);

// Route to delete a post by ID

router.delete("/:postId", ensureAuthenticated, postController.deletePost);

module.exports = router;

const express = require("express");

const { upload, uploadMemory } = require("../Middlewares/uploadMiddleware"); // Import the upload middleware
const router = express.Router();

const {
  createProduct,
  getProductsByOwner,
  getProductById,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getRecipes,
} = require("../Controllers/ProductController");
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary

// Routes
router.post(
  "/create",
  ensureAuthenticated,
  upload.single("image"),
  createProduct
);
router.get("/byUser", ensureAuthenticated, getProductsByOwner);
router.get("/byCategory/:categoryId", getProductsByCategory);
router.post("/recipes", uploadMemory.array("images", 10), getRecipes);

router.get("/:id", ensureAuthenticated, getProductById);
router.put("/:id", ensureAuthenticated, upload.single("image"), updateProduct);
router.delete("/:id", ensureAuthenticated, deleteProduct);

module.exports = router;

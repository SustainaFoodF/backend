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
  getPromoProducts,
  addReview,
  getProductReviews,
  deleteReview
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
// Route pour obtenir les produits en promotion
router.get("/promo-products", getPromoProducts);

// Nouvelles routes pour les avis
router.post("/:id/reviews", ensureAuthenticated, addReview);
router.get("/:id/reviews", getProductReviews);
router.delete("/:productId/reviews/:reviewId", ensureAuthenticated, deleteReview);


module.exports = router;

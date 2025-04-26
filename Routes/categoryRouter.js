const express = require("express");
const router = express.Router();
const categoryController = require("../Controllers/CategoryController");
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary

// Create a new category
router.post("/create", ensureAuthenticated, categoryController.createCategory);
router.get("/", categoryController.getAllCategories);

// Get all categories
router.get(
  "/byUser",
  ensureAuthenticated,
  categoryController.getAllCategoriesByUser
);

// Get category by ID
router.get("/:id", categoryController.getCategoryById);

// Update category by ID
router.put("/:id", categoryController.updateCategory);

// Delete category by ID
router.delete("/:id", categoryController.deleteCategory);

module.exports = router;

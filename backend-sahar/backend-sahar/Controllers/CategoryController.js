const CategoryModel = require("../Models/Category");

// CREATE: Add a new category
exports.createCategory = async (req, res) => {
  try {
    const { label, description } = req.body;
    const owner = req.user._id;
    const category = new CategoryModel({ label, description, owner });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create category", message: err.message });
  }
};

// READ: Get all categories
exports.getAllCategoriesByUser = async (req, res) => {
  try {
    const owner = req.user._id;
    const categories = await CategoryModel.find({ owner });

    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories", message: err.message });
  }
};
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.find();

    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories", message: err.message });
  }
};

// READ: Get a category by ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch category", message: err.message });
  }
};

// UPDATE: Update a category by ID
exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { label, description } = req.body;
  try {
    const category = await CategoryModel.findByIdAndUpdate(
      id,
      { label, description }, // Include description here
      { new: true } // Return the updated category
    );
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update category", message: err.message });
  }
};

// DELETE: Delete a category by ID
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete category", message: err.message });
  }
};

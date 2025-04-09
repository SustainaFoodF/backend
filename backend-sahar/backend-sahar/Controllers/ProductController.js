const Product = require("../Models/Product");

// Create a new product
exports.createProduct = async (req, res) => {
  try {
    const { label, description, category, quantity, prix, dateExp } = req.body;
    const image = req.file ? req.file.filename : null;

    const product = new Product({
      label,
      description,
      category,
      quantity,
      prix,
      dateExp,
      image,
      owner: req.user._id, // Owner is always req.user
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all products owned by the logged-in user
exports.getProductsByOwner = async (req, res) => {
  try {
    const owner = req.user._id;
    const products = await Product.find({ owner }).populate(
      "category",
      "label"
    );
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
exports.getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.categoryId;
    const products = await Product.find({ category });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get a single product by ID (only if owned by user)
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a product (only if owned by user)
exports.updateProduct = async (req, res) => {
  try {
    const { label, description, category, quantity, prix, dateExp } = req.body;
    const image = req.file ? req.file.filename : undefined;

    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user._id },
      {
        label,
        description,
        category,
        quantity,
        prix,
        dateExp,
        ...(image && { image }),
      },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a product (only if owned by user)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });
    }

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

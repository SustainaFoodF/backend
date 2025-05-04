const Product = require("../Models/Product");
const axios = require("axios");

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
// Contrôleur pour récupérer les produits en promotion et non expirés
exports.getPromoProducts = async (req, res) => {
  try {
    const today = new Date();

    // Rechercher les produits en promotion dont la date d'expiration est encore valide
    const promoProducts = await Product.find({
      isPromo: true,
      dateExp: { $gte: today }, // Produits non expirés
    });

    // Retourner les produits trouvés
    res.status(200).json(promoProducts);
  } catch (error) {
    console.error("Erreur dans getPromoProducts :", error);
    res.status(500).json({
      message: "Erreur lors de la récupération des produits en promotion.",
    });
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
const CLARIFAI_API_URL =
  "https://api.clarifai.com/v2/models/food-item-recognition/outputs";
const SPOONACULAR_API_URL =
  "https://api.spoonacular.com/recipes/findByIngredients";

exports.getRecipes = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "No images uploaded" });
  }

  try {
    let allDetectedIngredients = [];

    // Loop through each uploaded image
    for (const file of req.files) {
      const base64Image = file.buffer.toString("base64");

      const clarifaiResponse = await axios.post(
        CLARIFAI_API_URL,
        {
          inputs: [
            {
              data: {
                image: {
                  base64: base64Image,
                },
              },
            },
          ],
        },
        {
          headers: {
            Authorization: `Key ${process.env.CLARIFAI_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );

      const detected = clarifaiResponse.data.outputs[0].data.concepts
        .filter((concept) => concept.value > 0.8) // only confident predictions
        .map((concept) => concept.name);

      allDetectedIngredients = [...allDetectedIngredients, ...detected];
    }

    // Remove duplicates
    const uniqueIngredients = [...new Set(allDetectedIngredients)];

    if (uniqueIngredients.length === 0) {
      return res
        .status(404)
        .json({ error: "No ingredients detected in the images" });
    }

    const ingredientsQuery = uniqueIngredients.join(",");

    // Now call Spoonacular with the combined ingredients
    const spoonacularResponse = await axios.get(SPOONACULAR_API_URL, {
      params: {
        ingredients: ingredientsQuery,
        number: 5,
        apiKey: process.env.SPOONACULAR_API_KEY,
      },
    });

    res.json({
      detectedIngredients: uniqueIngredients,
      recipes: spoonacularResponse.data,
    });
  } catch (error) {
    console.error("Error:", error.response?.data || error.message);
    res
      .status(500)
      .json({ error: "An error occurred while processing the images" });
  }
};

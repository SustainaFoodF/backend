const CommandModel = require("../Models/Command");
const Product = require("../Models/Product");

module.exports.getProductStatsByShop = async (req, res) => {
  try {
    const user = req.user; // Logged-in business user

    // Fetch all commands that contain at least one product owned by the business
    const commands = await CommandModel.find().populate({
      path: "products.product",
      match: { owner: user._id }, // Only fetch products owned by the business
    });

    // Create a map to store product occurrences
    const productStats = {};

    // Loop through commands and count product occurrences
    commands.forEach((command) => {
      command.products.forEach((item) => {
        if (
          item.product &&
          item.product.owner.toString() === user._id.toString()
        ) {
          const productId = item.product._id.toString();
          const quantity = item.quantity;

          // If product already exists in stats, increase count
          if (productStats[productId]) {
            productStats[productId] += quantity;
          } else {
            productStats[productId] = quantity;
          }
        }
      });
    });

    // Convert to array and include product details
    const productStatsArray = await Promise.all(
      Object.keys(productStats).map(async (productId) => {
        const product = await Product.findById(productId);
        return {
          product,
          totalQuantitySold: productStats[productId],
        };
      })
    );

    res.status(200).json(productStatsArray);
  } catch (error) {
    console.error("Error fetching business stats:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

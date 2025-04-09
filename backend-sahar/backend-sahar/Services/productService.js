const Product = require("../Models/Product");

module.exports.updateProductQuantity = async (product, quantityToRemove) => {
  const productToUpdate = await Product.findById(product._id);
  if (productToUpdate) {
    productToUpdate.quantity = productToUpdate.quantity - quantityToRemove;
  }
  await productToUpdate.save();
};
module.exports.getAllExpiredProducts = async (lteDate, greaterThenDate) => {
  return await Product.find({
    dateExp: {
      $lte: lteDate,
      $gte: greaterThenDate, // Optional: avoid already expired ones
    },
  });
};

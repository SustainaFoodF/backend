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

module.exports.getProductReviews = async (productId) => {
  return await Product.findById(productId)
    .populate('reviews.user', 'username')
    .select('reviews averageRating');
};

module.exports.addProductReview = async (productId, userId, rating, comment) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');

  const review = {
    user: userId,
    rating,
    comment
  };

  product.reviews.push(review);
  await product.save();
  return product;
};

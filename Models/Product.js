const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "users", required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    category: {
      type: Schema.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    prix: {
      type: Number,
      required: true,
    },
    dateExp: {
      type: Date,
    },
    image: {
      type: String,
    },
    nouveauPrix: { 
      type: Number, 
      default: null, 
      min: [0, "Le nouveau prix doit être positif"] 
    },
    isPromo: {
      type: Boolean,
      default: false,
    },
    reviews: [ReviewSchema],
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    }
  },
  { timestamps: true }
);

// Méthode pour calculer la note moyenne
ProductSchema.methods.calculateAverageRating = function() {
  if (this.reviews.length === 0) {
    this.averageRating = 0;
    return;
  }
  
  const sum = this.reviews.reduce((acc, review) => acc + review.rating, 0);
  this.averageRating = parseFloat((sum / this.reviews.length).toFixed(1));
};

// Middleware pour calculer la note moyenne avant de sauvegarder
ProductSchema.pre('save', function(next) {
  this.calculateAverageRating();
  next();
});

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;
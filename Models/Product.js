const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    oldPrice: { type: Number },
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
    isPromo: {
      type: Boolean,
      default: false, // Par défaut, le produit n'est pas en promotion
    },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", ProductSchema);
module.exports = ProductModel;

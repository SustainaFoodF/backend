const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommandSchema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "users", required: true },
    products: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        priceOfProduct: {
          type: Number,
          required: true,
        },
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    dateLivraison: {
      type: Date,
    },
    location: {
      type: String,
    },
    phoneNumber: {
      type: String,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isPaidVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Commands", CommandSchema);

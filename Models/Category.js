const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
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
    owner: { type: Schema.Types.ObjectId, ref: "users" },
  },
  { timestamps: true }
);

const CategoryModel = mongoose.model("categories", CategorySchema);
module.exports = CategoryModel;

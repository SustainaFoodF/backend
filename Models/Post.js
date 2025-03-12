const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    text: {
      type: String,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "users", // This will reference the User model
      required: true, // Ensures every post has a creator
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", PostSchema);
module.exports = PostModel;

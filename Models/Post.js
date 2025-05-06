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
    files: {
      type: [String], // Array of strings to store file paths or URLs
      default: [],
    },
    reviews: {
      likes: [{ type: Schema.Types.ObjectId, ref: "users", default: [] }],
      dislikes: [{ type: Schema.Types.ObjectId, ref: "users", default: [] }],
    },
    comments: {
      type: [
        {
          value: String,
          owner: { type: Schema.Types.ObjectId, ref: "users" },
          createdAt: { type: Date, default: Date.now },
          responses: [
            {
              value: String,
              owner: { type: Schema.Types.ObjectId, ref: "users" },
              createdAt: { type: Date, default: Date.now },
            },
          ],
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

const PostModel = mongoose.model("posts", PostSchema);
module.exports = PostModel;

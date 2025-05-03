// models/Message.js
const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  responded: { type: Boolean, default: false }, // To track if the admin has responded
  response: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Message", messageSchema);
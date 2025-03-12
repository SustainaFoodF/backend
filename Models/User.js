const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the Address subdocument schema
const AddressSchema = new Schema({
  street: { type: String, required: true, trim: true }, // Combines AddressLine1 and AddressLine2
  postalCode: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

// Define the User schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["admin", "client", "business", "livreur"],
    default: "client",
  },
  image: { type: String }, // Path to the user's profile image
  addresses: [AddressSchema], // Array of addresses
  twoFactorSecret: { type: String }, // New field for two-factor authentication
  activationCode: {
    type: String,
  },
  accountStatus: {
    type: Boolean,
    default: false,
  },
  resetToken:{
    type:String,
    default:null
  }
  
});

const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const nodemailer = require("nodemailer"); // Ajoutez cette ligne

const { sendConfirmationEmail } = require("../config/nodemailer.config");
const { sendResetPasswordEmail} = require("../config/nodemailer.config");



// Mettez à jour le chemin selon votre structure de dossier
const mongoose = require("mongoose");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");

// Configuration de Nodemailer (à adapter selon votre fournisseur d'email)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});




exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    user.resetToken = resetToken;
    await user.save(); // Utiliser await pour s'assurer que la sauvegarde est terminée

    await sendResetPasswordEmail(user.email, resetToken);
    res.status(200).send("Vérifiez votre email !"); // Message de succès

  } catch (error) {
    console.error("Erreur lors de l'envoi de l'email de réinitialisation :", error);
    res.status(500).send("Erreur lors de l'envoi de l'email de réinitialisation");
  }
};

// Fonction pour réinitialiser le mot de passe
exports.resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await UserModel.findById(decoded.id); // Find user by ID

    if (!user) {
      return res.status(404).send("Utilisateur non trouvé");
    }

    user.password = await bcrypt.hash(password, 10); // Hash the new password
    await user.save();
    res.status(200).send({ message: "Mot de passe réinitialisé avec succès" }); // Return success message
  } catch (error) {
    res.status(400).send("Token invalide ou expiré");
  }
};
exports.enable2FA = async (req, res) => {
  const { userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const secret = speakeasy.generateSecret({ name: "VotreApp" });
    user.twoFactorSecret = secret.base32;
    await user.save();

    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      res.json({
        secret: secret.base32,
        qrCode: data_url,
      });
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'activation de la 2FA" });
  }
};

exports.verify2FA = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.twoFactorSecret) {
      return res
        .status(400)
        .json({ message: "2FA non activée pour cet utilisateur" });
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      res.json({ verified: true });
    } else {
      res.status(400).json({ verified: false });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la vérification" });
  }
};

exports.signup = async (req, res) => {
  console.log(req.body);

  // Validation des champs requis
  const { name, email, password, role, image } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const characters =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let activationCode = "";

  for (let i = 0; i < 25; i++) {
    activationCode += characters[Math.floor(Math.random() * characters.length)];
  }

  try {
    // Check if user already exists
    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      role,
      image, // Assume image is already in Base64 format
      activationCode,
    });

    const savedUser = await newUser.save();
    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_KEY, {
      expiresIn: 3600,
    });

    // Envoi de l'email de confirmation
    await sendConfirmationEmail(
      savedUser.name,
      savedUser.email,
      savedUser.activationCode,
      password
    );

    // Répondre au client après l'envoi de l'email
    res.status(200).json({
      savedUser,
      token: token,
    });
  } catch (e) {
    console.log(e); // Log des erreurs pour le débogage
    res.status(500).send({ error: e.message });
  }
};
// Login - Connexion d'un utilisateur
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });

    if (!user) {
      return res.status(403).json({
        message: "Auth failed: email or password is incorrect",
        success: false,
      });
    }

    const isPassEqual = await bcrypt.compare(password, user.password);
    if (!isPassEqual) {
      return res.status(403).json({
        message: "Auth failed: email or password is incorrect",
        success: false,
      });
    }
    if (user || password || user.isActive) {
      return res.send({
        accessToken: null,
        message: "veuillez vérifier votre email",
      });
    }

    const jwtToken = jwt.sign(
      { email: user.email, _id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.status(200).json({
      message: "Login Success",
      success: true,
      jwtToken,
      email: user.email,
      name: user.name,
      role: user.role,
      image: user.image,
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      success: false,
    });
  }
};

// Get all users - Récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find({}, "-password"); // Exclure le champ password
    res.status(200).json({ success: true, users });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get user by ID - Récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id, "-password");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete user by ID - Supprimer un utilisateur par son ID
exports.deleteUserById = async (req, res) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", success: true });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update user by ID - Mettre à jour un utilisateur
exports.updateUserById = async (req, res) => {
  try {
    const { name, email, role, image } = req.body;
    const user = await UserModel.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;
    user.image = image || user.image;

    await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully", success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get user by name - Récupérer un utilisateur par son nom
exports.getUserByName = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { name: req.params.name },
      "-password"
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Get user by email - Récupérer un utilisateur par son email
exports.getUserByEmail = async (req, res) => {
  try {
    const user = await UserModel.findOne(
      { email: req.params.email },
      "-password"
    );
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};
exports.updateUserByEmail = async (req, res) => {
  try {
    const { name, role, image } = req.body;
    const user = await UserModel.findOne({ email: req.params.email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.name = name || user.name;
    user.role = role || user.role;

    // Vérifier si une image est envoyée et si elle est en Base64
    if (image && image.startsWith("data:image")) {
      user.image = image; // Stocker directement l’image en Base64
    }

    await user.save();

    res
      .status(200)
      .json({ message: "User updated successfully", success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Add a new address for a user
exports.addAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const newAddress = req.body;

    // Validate input
    if (
      !newAddress.street ||
      !newAddress.postalCode ||
      !newAddress.city ||
      !newAddress.country
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing", success: false });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.addresses.push(newAddress);
    await user.save();

    res
      .status(201)
      .json({ message: "Address added successfully", success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// get addresses for a user
exports.getUserAddresses = async (req, res) => {
  try {
    const userId = req.params.userId;

    // Validate userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res
        .status(400)
        .json({ message: "Invalid user ID", success: false });
    }

    // Fetch user and their addresses
    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    // Log the addresses for debugging
    console.log("User addresses:", user.addresses);

    // Return the addresses
    res.status(200).json({ success: true, addresses: user.addresses });
  } catch (err) {
    console.error(err); // Log the error for debugging
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Update an address for a user
exports.updateAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;
    const updatedAddress = req.body;

    // Validate input
    if (
      !updatedAddress.street ||
      !updatedAddress.postalCode ||
      !updatedAddress.city ||
      !updatedAddress.country
    ) {
      return res
        .status(400)
        .json({ message: "Required fields are missing", success: false });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const address = user.addresses.id(addressId);
    if (!address) {
      return res
        .status(404)
        .json({ message: "Address not found", success: false });
    }

    address.set(updatedAddress);
    await user.save();

    res
      .status(200)
      .json({ message: "Address updated successfully", success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

// Delete an address for a user
exports.deleteAddress = async (req, res) => {
  try {
    const userId = req.params.userId;
    const addressId = req.params.addressId;

    const user = await UserModel.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    user.addresses.pull(addressId);
    await user.save();

    res
      .status(200)
      .json({ message: "Address deleted successfully", success: true, user });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", success: false });
  }
};

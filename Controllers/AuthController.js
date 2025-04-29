const express = require("express");
const mongoose = require("mongoose");

const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../Models/User");
const nodemailer = require("nodemailer");
const speakeasy = require("speakeasy");
const QRCode = require("qrcode");
const {
  sendConfirmationEmail,
  sendResetPasswordEmail,
} = require("../config/nodemailer.config");

// Middleware global pour la gestion des erreurs
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// 🔹 Oublie du mot de passe
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  user.resetToken = resetToken;
  await user.save();

  await sendResetPasswordEmail(user.email, resetToken);
  res.status(200).json({ message: "Vérifiez votre email !" });
});

// 🔹 Réinitialisation du mot de passe
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await UserModel.findById(decoded.id);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = null; // Supprime le token après utilisation
  await user.save();

  res.status(200).json({ message: "Mot de passe réinitialisé avec succès" });
});

// 🔹 Activation 2FA
exports.enable2FA = asyncHandler(async (req, res) => {
  const { userId } = req.body;
  const user = await UserModel.findById(userId);

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  const secret = speakeasy.generateSecret({ name: "VotreApp" });
  user.twoFactorSecret = secret.base32;
  await user.save();

  QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Erreur lors de la génération du QR Code" });
    }
    res.json({ secret: secret.base32, qrCode: data_url });
  });
});

// 🔹 Vérification 2FA
exports.verify2FA = asyncHandler(async (req, res) => {
  const { userId, token } = req.body;
  const user = await UserModel.findById(userId);

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

  res.json({ verified });
});

// 🔹 Inscription
exports.signup = asyncHandler(async (req, res) => {
  const { name, email, password, role, image } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Tous les champs sont requis." });
  }

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return res.status(409).json({ message: "L'utilisateur existe déjà." });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const activationCode = [...Array(25)]
    .map(
      () =>
        "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"[
          Math.floor(Math.random() * 62)
        ]
    )
    .join("");

  const newUser = new UserModel({
    name,
    email,
    password: hashedPassword,
    role,
    image,
    activationCode,
  });

  const savedUser = await newUser.save();
  await sendConfirmationEmail(
    savedUser.name,
    savedUser.email,
    savedUser.activationCode,
    password
  );

  const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({ user: savedUser, token });
});

// 🔹 Connexion
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email et mot de passe requis" });
    }

    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Utilisateur non trouvé" });
    }

    if (!user.accountStatus) {
      return res.status(403).json({ message: "Compte non activé" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Mot de passe incorrect" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, user });
  } catch (error) {
    console.error("Erreur lors de la connexion :", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

// 🔹 Récupération de tous les utilisateurs
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserModel.find().select("-password");
  res.status(200).json({ users });
});

// 🔹 Récupération d'un utilisateur par ID
exports.getUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  res.status(200).json({ user });
});

// 🔹 Suppression d'un utilisateur
exports.deleteUserById = asyncHandler(async (req, res) => {
  const user = await UserModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  res.status(200).json({ message: "Utilisateur supprimé avec succès" });
});

// 🔹 Mise à jour d'un utilisateur
exports.updateUserById = asyncHandler(async (req, res) => {
  const { name, email, role, image } = req.body;
  const user = await UserModel.findByIdAndUpdate(
    req.params.id,
    { name, email, role, image },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }

  res.status(200).json({ message: "Utilisateur mis à jour", user });
});

// 🔹 Récupération d'un utilisateur par son nom
exports.getUserByName = asyncHandler(async (req, res) => {
  const user = await UserModel.findOne({ name: req.params.name }).select(
    "-password"
  );
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  res.status(200).json({ user });
});

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
      console.log("User not found ");
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
exports.changePasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    // Vérifier si le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Vérifier la complexité du mot de passe (optionnel)
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Sauvegarder l'utilisateur avec le nouveau mot de passe
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
exports.changePasswordById = async (req, res) => {
  try {
    const { id } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    // Vérifier si le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Vérifier la complexité du mot de passe (optionnel)
    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Le mot de passe doit contenir au moins 6 caractères",
      });
    }

    // Hacher le nouveau mot de passe
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Sauvegarder l'utilisateur avec le nouveau mot de passe
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors du changement de mot de passe:", error);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};
// 🔹 Changer le mot de passe par email
exports.changePasswordByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    // Vérifier si l'utilisateur existe
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Vérifier si l'ancien mot de passe est correct
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Ancien mot de passe incorrect" });
    }

    // Vérifier si le nouveau mot de passe et la confirmation correspondent
    if (newPassword !== confirmPassword) {
      return res
        .status(400)
        .json({ message: "Les mots de passe ne correspondent pas" });
    }

    // Vérifier la longueur du nouveau mot de passe
    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Le mot de passe doit comporter au moins 8 caractères",
      });
    }

    // Hash du nouveau mot de passe
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur interne du serveur" });
  }
};

exports.tryToLoginWithGoogle = async (req, res) => {
  const { user } = req;
  if (!user) {
    return res
      .status(401)
      .json({ message: "Erreur lors de la connexion avec Google" });
  }
  const email = user.emails[0].value;
  const userFromDataBase = await UserModel.findOne({ email });
  if (!userFromDataBase) {
    return res.status(404).json({ message: "Utilisateur non trouvé" });
  }
  const token = jwt.sign(
    { id: userFromDataBase._id, email: userFromDataBase.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
  return res.redirect(`http://localhost:3001/login?token=${token}`);
};
exports.loginWithToken = async (req, res) => {
  try {
    // Récupérer le token depuis les paramètres de l'URL
    const { token } = req.params;
    if (!token) {
      return res.status(401).json({ message: "Token non fourni" });
    }

    // Vérifier et décoder le token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Récupérer l'utilisateur depuis la base de données
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    // Générer un nouveau token
    const newToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token: newToken, user });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Erreur serveur", error: error.message });
  }
};
exports.getAllDeliverers = async (req, res) => {
  try {
    const deliverers = await UserModel.find({ role: "livreur" });
    res.status(200).json(deliverers);
  } catch (error) {
    console.error("Erreur lors de la récupération des livreurs :", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

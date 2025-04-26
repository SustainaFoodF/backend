const express = require("express");
const {
  resetPassword,
  forgotPassword,
  loginWithToken,
  enable2FA,
  signup,
  getAllDeliverers,
  login,
} = require("../Controllers/AuthController");

const User = require("../Models/User");



const router = express.Router();

// Logger middleware for debugging
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Use logger middleware
router.use(logger);
router.post("/reset-password/:token", resetPassword);

router.post("/forgot-password", forgotPassword);

router.post("/enable-2fa", enable2FA);

//

router.get("/confirm_user/:activationCode", async (req, res) => {
  try {
    const user = await User.findOne({
      activationCode: req.params.activationCode,
    });

    if (!user) {
      return res.send({ message: "Le code d'activation semble être faux !" });
    }

    if (user.accountStatus === true) {
      return res.send({ message: "Votre compte est déjà activé !" });
    }

    user.accountStatus = true;
    await user.save(); // ✅ Utilisation de `await` pour éviter l'erreur

    return res.send({ message: "Votre compte est activé avec succès !" });
  } catch (error) {
    console.error("Erreur lors de l'activation :", error);
    return res.status(500).send({ message: "Une erreur est survenue." });
  }
});

router.post("/signup", signup);
// Route pour récupérer tous les livreurs
router.get("/livreurs", getAllDeliverers);

router.post("/login", login);
router.post("/loginWithToken/:token", loginWithToken);

router.post("/verify", async (req, res) => {
  const { activationCode } = req.body;
  console.log("Received activationCode:", activationCode); // Log the received code

  try {
    const user = await User.findOne({ activationCode });
    console.log("User found:", user); // Log the user found

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Code de confirmation invalide." });
    }

    user.accountStatus = true;
    await user.save();

    res.json({ success: true, message: "Compte vérifié avec succès." });
  } catch (err) {
    console.error("Error during verification:", err); // Log the error
    res
      .status(500)
      .json({ success: false, message: "Erreur lors de la vérification." });
  }
});

// Export the router
module.exports = router;

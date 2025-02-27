const express = require("express");
const {
  resetPassword,
  forgotPassword,
  

  enable2FA,
  verify2FA,
  signup,
  login,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getUserByName,
  getUserByEmail,
  updateUserByEmail,
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
  //changePassword
} = require("../Controllers/AuthController");
const nodemailer = require("nodemailer");

const User = require("../Models/User");

const router = express.Router();

// Logger middleware for debugging
const logger = (req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
};

// Use logger middleware
router.use(logger);

// Reset password route
router.post("/reset-password/:token", resetPassword);



router.post("/forgot-password", forgotPassword);


router.post("/enable-2fa", enable2FA);

//
//router.post("/change-password", changePassword); // Utiliser la fonction du contrôleur


router.get("/confirm_user/:activationCode", (req, res) => {
  User.findOne({
    activationCode: req.params.activationCode,
  })
    .then((user) => {
      if (!user) {
        return res.send({
          message: "le code d'activation semble étre faux !",
        });
      } else if (user && user.accountStatus == true) {
        return res.send({
          message: "Votre compte est déja activé !",
        });
      } else {
        user.accountStatus = true;
        user.save((err) => {
          return res.send({
            message: "Votre compte est activé avec succées !",
          });
        });
      }
    })
    .catch((e) => console.log("error", e));
});

router.post("/signup", signup);

router.post("/login", login);

router.get("/getAllUsers", getAllUsers);

router.get("/getUserById", getUserById);

router.post("/deleteUserById", deleteUserById);

router.post("/updateUserById", updateUserById);

router.get("/getUserByName", getUserByName);

router.get("/getUserByEmail", getUserByEmail);

router.post("/updateUserByEmail", updateUserByEmail);

router.post("/addAddress", addAddress);

router.get("/getUserAddresses", getUserAddresses);

router.post("/updateAddress", updateAddress);

router.post("/deleteAddress", deleteAddress);

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

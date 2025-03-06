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
  ChangePassword,
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


router.get("/confirm_user/:activationCode", async (req, res) => {
  try {
    const user = await User.findOne({ activationCode: req.params.activationCode });

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

router.post("/login", login);

router.get('/users', getAllUsers);
router.get('/users/name/:name', getUserByName); // This is where the new route is added
router.get('/user/email/:email',getUserByEmail);
router.put('/user/email/:email',updateUserByEmail);
router.post("/users/:userId/addresses", addAddress);
router.get("/users/:userId/addresses", getUserAddresses);
router.put("/users/:userId/address/:addressId", updateAddress);
router.delete("/users/:userId/address/:addressId", deleteAddress);


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id', deleteUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/users/:id', updateUserById);
// Email Verification

router.post("/addAddress", addAddress);

router.get("/getUserAddresses", getUserAddresses);

router.post("/updateAddress", updateAddress);

router.post("/deleteAddress", deleteAddress);

router.put('/change-password/:id', ChangePassword);

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

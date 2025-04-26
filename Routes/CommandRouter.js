const express = require("express");
const router = express.Router();
const commandController = require("../Controllers/CommandeController");
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary

// Create a new category
router.post("/create", ensureAuthenticated, commandController.createCommand);
router.put(
  "/:id/verifyPayment",
  ensureAuthenticated,
  commandController.updateCommandPayment
);

router.get("/", commandController.getAll);
router.get("/me", ensureAuthenticated, commandController.getCommandsByUser);
// Route pour affecter un livreur à une commande
router.post('/assign', ensureAuthenticated, commandController.assignDeliverer); // Assurez-vous d'ajouter l'authentification ici

module.exports = router;

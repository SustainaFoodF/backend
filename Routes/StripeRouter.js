const express = require("express");

const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary
const { createIntent } = require("../Controllers/StripeController.js");

router.post("/create-intent", createIntent);
module.exports = router;

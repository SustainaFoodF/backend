const express = require("express");

const router = express.Router();
const ensureAuthenticated = require("../Middlewares/Auth"); // Adjust path if necessary
const { getProductStatsByShop } = require("../Controllers/StatsController");

router.get("/commandByShop", ensureAuthenticated, getProductStatsByShop);
module.exports = router;

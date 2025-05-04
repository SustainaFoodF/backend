// backend/routes/nutritionRoutes.js
const express = require('express');
const router = express.Router();
const { fetchNutritionInfo } = require('../Controllers/nutritionController');

// Route API avec /api dans le chemin
router.get('/:foodName', fetchNutritionInfo);

module.exports = router;

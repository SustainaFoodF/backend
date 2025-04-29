// backend/controllers/nutritionController.js
const { getNutritionInfo } = require('../services/spoonacularService');

async function fetchNutritionInfo(req, res) {
  const foodName = req.params.foodName;
  
  if (!foodName) {
    return res.status(400).json({ message: 'Le nom de l\'aliment est requis' });
  }

  try {
    const nutritionInfo = await getNutritionInfo(foodName);
    if (!nutritionInfo) {
      return res.status(404).json({ message: 'Information nutritionnelle non trouvée' });
    }
    res.status(200).json(nutritionInfo);
  } catch (error) {
    console.error('Erreur dans fetchNutritionInfo:', error.message);
    res.status(500).json({ 
      message: 'Erreur lors de la récupération des informations nutritionnelles',
      error: error.message 
    });
  }
}

module.exports = { fetchNutritionInfo };
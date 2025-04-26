const express = require('express');
const router = express.Router();
const axios = require('axios');

router.get('/scan/:barcode', async (req, res) => {
  try {
    const { barcode } = req.params;
    
    // Validation du code-barres
    if (!/^\d+$/.test(barcode)) {
      return res.status(400).json({ error: 'Code-barres invalide' });
    }

    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );
    
    if (response.data.status === 0) {
      return res.status(404).json({ 
        error: 'Produit non trouvé',
        barcode: barcode // Retourne le code scanné pour débogage
      });
    }

    // Formatage robuste des données
    const product = {
      name: response.data.product.product_name || null,
      image: response.data.product.image_url || null,
      brand: response.data.product.brands || null,
      ecoScore: response.data.product.ecoscore_grade || null,
      nutrients: response.data.product.nutriments || {},
      ingredients: response.data.product.ingredients_text || null,
      barcode: barcode, // Ajout du code-barres original
      recommendation: generateRecommendation(response.data.product)
    };

    res.json(product);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      error: 'Erreur serveur',
      details: error.message 
    });
  }
});

// Fonction de recommandation améliorée
function generateRecommendation(product) {
  if (!product) return 'Non évalué';
  
  const score = product.nutriments?.['nutrition-score-fr'] || 0;
  const isOrganic = product.labels_tags?.includes('en:organic');
  const ecoScore = product.ecoscore_grade;

  if (score > 7) return 'À éviter - Score nutritionnel élevé';
  if (isOrganic) return 'Excellent choix - Produit bio';
  if (ecoScore === 'a') return 'Très bon - Impact écologique faible';
  
  return 'Bon choix';
}

module.exports = router;
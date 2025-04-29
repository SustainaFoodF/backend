const axios = require('axios');

class OpenFoodFactsService {
  static async getProductByBarcode(barcode) {
    try {
      // Validation basique du code-barres
      if (!/^\d+$/.test(barcode)) {
        throw new Error('Format de code-barres invalide');
      }

      const response = await axios.get(
        `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
      );

      if (response.data.status === 0) {
        throw new Error('Produit non trouvé');
      }

      return this.formatProductData(response.data.product);
    } catch (error) {
      console.error(`[OpenFoodFactsService] Erreur: ${error.message}`);
      throw error;
    }
  }

  static formatProductData(product) {
    return {
      name: product.product_name || 'Nom inconnu',
      nutrients: product.nutriments || {},
      ingredients: product.ingredients_text || 'Information non disponible',
      labels: product.labels_tags || [],
      image: product.image_url || '',
      brand: product.brands || '',
      ecoScore: product.ecoscore_grade || '?',
      recommendation: this.generateRecommendation(product)
    };
  }

  static generateRecommendation(product) {
    const score = product.nutriments?.['nutrition-score-fr'] || 0;
    
    if (score > 7) return "À donner - Produit trop transformé";
    if (product.labels_tags?.includes('en:organic')) return "À garder - Bio";
    if (product.ecoscore_grade === 'a') return "Excellent choix écologique";
    return "À consommer avec modération";
  }
}

module.exports = OpenFoodFactsService;
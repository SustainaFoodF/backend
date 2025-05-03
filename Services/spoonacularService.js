const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY || '6055481a724449548d23cf6be7288ab6';

async function getNutritionInfo(foodName) {
  try {
    console.log(`Fetching nutrition for: ${foodName}`); // Debug log
    
    // Solution de repli si l'API Spoonacular échoue
    const mockData = {
      calories: 52,
      proteins: 0.3,
      fats: 0.2,
      carbs: 14,
      rawData: { mock: true }
    };

    // 1. Essayez d'abord avec l'endpoint plus simple
    const quickResponse = await axios.get(`https://api.spoonacular.com/food/ingredients/guess`, {
      params: {
        query: foodName,
        apiKey: SPOONACULAR_API_KEY,
        number: 1
      },
      timeout: 3000
    }).catch(() => null);

    if (quickResponse?.data?.length > 0) {
      console.log('Used quick endpoint');
      return {
        calories: quickResponse.data[0].calories?.value || mockData.calories,
        proteins: quickResponse.data[0].protein?.value || mockData.proteins,
        fats: quickResponse.data[0].fat?.value || mockData.fats,
        carbs: quickResponse.data[0].carbs?.value || mockData.carbs,
        rawData: quickResponse.data[0]
      };
    }

    // 2. Si le premier endpoint échoue, essayez la méthode originale
    const searchResponse = await axios.get(`https://api.spoonacular.com/food/ingredients/search`, {
      params: {
        query: foodName,
        apiKey: SPOONACULAR_API_KEY,
        number: 1
      },
      timeout: 3000
    });

    if (!searchResponse.data?.results?.length) {
      console.log('No results, returning mock data');
      return mockData;
    }

    const ingredientId = searchResponse.data.results[0].id;
    const detailResponse = await axios.get(
      `https://api.spoonacular.com/food/ingredients/${ingredientId}/information`,
      {
        params: {
          amount: 100,
          unit: "g",
          apiKey: SPOONACULAR_API_KEY,
        },
        timeout: 3000
      }
    );

    const nutrients = detailResponse.data?.nutrition?.nutrients || [];
    return {
      calories: nutrients.find(n => n.name === 'Calories')?.amount || mockData.calories,
      proteins: nutrients.find(n => n.name === 'Protein')?.amount || mockData.proteins,
      fats: nutrients.find(n => n.name === 'Fat')?.amount || mockData.fats,
      carbs: nutrients.find(n => n.name === 'Carbohydrates')?.amount || mockData.carbs,
      rawData: detailResponse.data
    };

  } catch (error) {
    console.error('Full error in getNutritionInfo:', {
      message: error.message,
      config: error.config,
      response: error.response?.data
    });
    
    // Retourne des données mockées en cas d'erreur
    return {
      calories: 52,
      proteins: 0.3,
      fats: 0.2,
      carbs: 14,
      error: error.message,
      rawData: { error: true }
    };
  }
}

module.exports = { getNutritionInfo };
const express = require('express');
const router = express.Router();
const axios = require('axios');

const SPOONACULAR_API_KEY = process.env.SPOONACULAR_API_KEY;

router.get('/recipeStream', async (req, res) => {
  const { 
    ingredients, 
    mealType, 
    cuisine, 
    cookingTime, 
    complexity, 
    dietary,
    numberOfRecipes = 1
  } = req.query;

  // Set up Server-Sent Events
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Parse dietary restrictions
  const dietaryOptions = dietary ? dietary.split(',') : [];
  
  try {
    // First API call - search recipes
    const searchParams = {
      apiKey: SPOONACULAR_API_KEY,
      includeIngredients: ingredients || undefined,
      type: mealType || undefined,
      cuisine: cuisine || undefined,
      maxReadyTime: cookingTime === 'quick' ? 30 : cookingTime === 'medium' ? 60 : 120,
      number: parseInt(numberOfRecipes),
      instructionsRequired: true,
      addRecipeInformation: true,
      fillIngredients: true,
      sort: 'popularity',
    };
    
    // Add dietary filters
    if (dietaryOptions.includes('vegetarian')) searchParams.diet = 'vegetarian';
    if (dietaryOptions.includes('vegan')) searchParams.diet = 'vegan';
    if (dietaryOptions.includes('gluten-free')) searchParams.intolerances = 'gluten';
    if (dietaryOptions.includes('dairy-free')) {
      searchParams.intolerances = searchParams.intolerances 
        ? `${searchParams.intolerances},dairy` 
        : 'dairy';
    }
    
    // Adjust complexity via maxIngredients parameter
    if (complexity === 'easy') searchParams.maxIngredients = 5;
    if (complexity === 'complex') searchParams.minIngredients = 8;

    const searchResponse = await axios.get('https://api.spoonacular.com/recipes/complexSearch', {
      params: searchParams,
    });

    const recipes = searchResponse.data.results;

    if (!recipes.length) {
      res.write(`data: ${JSON.stringify({ chunk: "No recipes found with those criteria. Try different ingredients or fewer restrictions." })}\n\n`);
      res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
      res.end();
      return;
    }

    // Process each recipe
    for (let i = 0; i < recipes.length; i++) {
      const recipe = recipes[i];
      
      // If not the first recipe, indicate a new recipe is starting
      if (i > 0) {
        res.write(`data: ${JSON.stringify({ 
          newRecipe: true, 
          chunk: "\n\n-------- New Recipe --------\n\n",
          title: recipe.title 
        })}\n\n`);
        
        // Pause briefly between recipes for better UX
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Second API call - get detailed recipe information
      const infoResponse = await axios.get(`https://api.spoonacular.com/recipes/${recipe.id}/information`, {
        params: {
          apiKey: SPOONACULAR_API_KEY,
          includeNutrition: true,
        },
      });

      const { 
        title, 
        instructions, 
        extendedIngredients, 
        readyInMinutes, 
        servings, 
        nutrition, 
        image,
        sourceUrl, 
        creditsText,
        vegetarian,
        vegan,
        glutenFree,
        dairyFree,
        sustainable,
        healthScore
      } = infoResponse.data;

      // Start streaming recipe information
      const intro = `🍽 Recipe: ${title}\n\n`;
      res.write(`data: ${JSON.stringify({ chunk: intro })}\n\n`);
      
      // Add cooking time and servings info
      await streamWithDelay(res, `⏱ Ready in: ${readyInMinutes} minutes | 🍴 Servings: ${servings}\n\n`);
      
      // Add dietary info
      let dietaryInfo = '📋 Dietary Info: ';
      dietaryInfo += vegetarian ? 'Vegetarian ✓ ' : '';
      dietaryInfo += vegan ? 'Vegan ✓ ' : '';
      dietaryInfo += glutenFree ? 'Gluten-Free ✓ ' : '';
      dietaryInfo += dairyFree ? 'Dairy-Free ✓ ' : '';
      dietaryInfo += sustainable ? 'Sustainable ✓ ' : '';
      dietaryInfo += `| Health Score: ${healthScore}/100\n\n`;
      
      await streamWithDelay(res, dietaryInfo);

      // Stream ingredients with delay
      await streamWithDelay(res, "🥕 Ingredients:\n");
      
      for (const ingredient of extendedIngredients) {
        await streamWithDelay(res, `- ${ingredient.original}\n`, 50);
      }
      
      // Stream instructions
      await streamWithDelay(res, `\n🧑‍🍳 Instructions:\n`);
      
      // Process instructions - sometimes they're HTML, sometimes plain text
      let cleanInstructions = instructions || "No instructions provided.";
      
      // Remove HTML tags if present
      cleanInstructions = cleanInstructions.replace(/<[^>]*>/g, '');
      
      // Number the steps if they aren't already
      if (!cleanInstructions.match(/^\d+\.\s/m)) {
        const steps = cleanInstructions.split(/\n+/).filter(step => step.trim().length > 0);
        cleanInstructions = steps.map((step, index) => `${index + 1}. ${step}`).join('\n\n');
      }
      
      await streamWithDelay(res, cleanInstructions);
      
      // Add nutrition info if available
      if (nutrition && nutrition.nutrients) {
        await streamWithDelay(res, `\n\n📊 Nutrition Information (per serving):\n`);
        
        const keyCaloricInfo = nutrition.nutrients.filter(n => 
          ['Calories', 'Fat', 'Carbohydrates', 'Protein'].includes(n.name)
        );
        
        for (const info of keyCaloricInfo) {
          await streamWithDelay(res, `- ${info.name}: ${Math.round(info.amount)} ${info.unit}\n`, 50);
        }
      }
      
      // Add source information
      if (sourceUrl || creditsText) {
        await streamWithDelay(res, `\n📝 Source: ${creditsText || 'Unknown'}\n`);
      }
    }
    
    res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Error fetching recipe:', error.response ? error.response.data : error.message);
    res.write(`data: ${JSON.stringify({ 
      chunk: "⚠️ Error fetching recipe details. This might be due to API limits or invalid parameters." 
    })}\n\n`);
    res.write(`data: ${JSON.stringify({ action: "close" })}\n\n`);
    res.end();
  }
});

// Helper function to stream content with a delay
async function streamWithDelay(res, chunk, delay = 200) {
  res.write(`data: ${JSON.stringify({ chunk })}\n\n`);
  if (delay) {
    await new Promise(resolve => setTimeout(resolve, delay));
  }
}

module.exports = router;
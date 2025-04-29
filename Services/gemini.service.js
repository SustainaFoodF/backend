const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

module.exports.generateResponse = async (prompt) => {
  try {
    // Utilisez la configuration exacte qui fonctionne
    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-pro-latest", // Modèle actuellement supporté
    });

    const result = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: prompt }]
      }]
    });
    
    return result.response.text();
  } catch (error) {
    console.error("Erreur Gemini complète:", {
      message: error.message,
      stack: error.stack,
      request: error.config?.data // Log la requête envoyée
    });
    throw new Error("Problème de communication avec Gemini");
  }
};
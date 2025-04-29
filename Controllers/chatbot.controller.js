const { generateResponse } = require('../Services/gemini.service');

module.exports.chat = async (req, res) => {
  console.log("Requête reçue:", req.body); // Debug
  const { message } = req.body;
  
  if (!message) return res.status(400).json({ error: "Message required" });

  try {
    const response = await generateResponse(message);
    res.json({ response });
  } catch (error) {
    console.error("Erreur Gemini:", error);
    res.status(500).json({ error: error.message });
  }
};
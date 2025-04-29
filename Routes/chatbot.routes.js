const express = require('express');
const router = express.Router();
const { chat } = require('../controllers/chatbot.controller');

router.post('/gemini-chat', chat); // Pas de slash initial
module.exports = router;
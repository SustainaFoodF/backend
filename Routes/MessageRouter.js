// routes/messageRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../Controllers/MessageController");

router.post("/", messageController.saveMessage);       // POST /messages
router.get("/", messageController.getMessages);        // GET /messages
router.delete("/:id", messageController.deleteMessage); // DELETE /messages/:id
router.put("/:id", messageController.respondToMessage); // PUT /messages/:id


module.exports = router;
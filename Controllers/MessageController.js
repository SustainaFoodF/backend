// controllers/messageController.js
const Message = require("../Models/Message");

// Save new message
const saveMessage = async (req, res) => {
  try {
    const { fullName, email, message } = req.body;
    const newMessage = new Message({ fullName, email, message });
    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message!" });
  }
};

// Get all messages for admin
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages!" });
  }
};

// Delete message
const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.status(200).json({ message: "Message deleted!" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message!" });
  }
};

// Respond to message
const respondToMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { response } = req.body;
    const message = await Message.findByIdAndUpdate(id, { response, responded: true }, { new: true });
    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ error: "Failed to respond to message!" });
  }
};

module.exports = { saveMessage, getMessages, deleteMessage, respondToMessage };

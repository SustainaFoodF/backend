const Message = require("../Models/Message");

// Save a new message
exports.saveMessage = async (fullName, email, message) => {
  const newMessage = new Message({ fullName, email, message });
  return await newMessage.save();
};

// Get all messages
exports.getAllMessages = async () => {
  return await Message.find();
};

// Delete a message by ID
exports.deleteMessageById = async (messageId) => {
  const deletedMessage = await Message.findByIdAndDelete(messageId);
  if (!deletedMessage) {
    throw new Error("Message not found");
  }
  return { message: "Message deleted successfully!" };
};

// Respond to a message by ID
exports.respondToMessage = async (messageId, response) => {
  const updatedMessage = await Message.findByIdAndUpdate(
    messageId,
    { response, responded: true },
    { new: true }
  );

  if (!updatedMessage) {
    throw new Error("Message not found");
  }

  return updatedMessage;
};

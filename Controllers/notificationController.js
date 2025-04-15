const Notification = require("../Models/Notification");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get notifications for a specific livreur
exports.getLivreurNotifications = async (req, res) => {
  try {
    const livreurId = req.params.livreurId;
    
    // Validate livreur ID
    if (!ObjectId.isValid(livreurId)) {
      return res.status(400).json({ message: "Invalid livreur ID format" });
    }
    
    // Check authorization
    if (req.user.role !== "admin" && req.user._id.toString() !== livreurId) {
      return res.status(403).json({ message: "Not authorized to access these notifications" });
    }
    
    const notifications = await Notification.find({ recipient: livreurId })
      .populate("relatedTask", "_id pickup.address dropoff.address status")
      .sort({ createdAt: -1 });
    
    // Get unread count
    const unreadCount = await Notification.countDocuments({ 
      recipient: livreurId,
      isRead: false
    });
    
    res.status(200).json({
      success: true,
      count: notifications.length,
      unreadCount,
      data: notifications
    });
  } catch (error) {
    console.error("Error fetching livreur notifications:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    if (!ObjectId.isValid(notificationId)) {
      return res.status(400).json({ message: "Invalid notification ID format" });
    }
    
    const notification = await Notification.findById(notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found"
      });
    }
    
    // Check authorization
    if (req.user.role !== "admin" && req.user._id.toString() !== notification.recipient.toString()) {
      return res.status(403).json({ message: "Not authorized to update this notification" });
    }
    
    notification.isRead = true;
    await notification.save();
    
    res.status(200).json({
      success: true,
      data: notification,
      message: "Notification marked as read"
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

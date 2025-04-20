const express = require('express');
const router = express.Router();
const { 
  getLivreurNotifications, 
  markNotificationAsRead,
  markAllAsRead 
} = require('../Controllers/notificationController');
const verifyToken = require('../Middlewares/Auth');

// Get notifications for a specific livreur
router.get('/livreur/:livreurId', verifyToken, getLivreurNotifications);

// Mark a notification as read
router.post('/:notificationId/read', verifyToken, markNotificationAsRead);

// Mark all notifications as read
router.post('/mark-all-read', verifyToken, markAllAsRead); 

module.exports = router;
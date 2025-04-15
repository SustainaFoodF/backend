const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
  recipient: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  type: {
    type: String,
    enum: ['Task Assignment', 'Status Update', 'System Message', 'Issue Response'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  relatedTask: {
    type: Schema.Types.ObjectId,
    ref: 'tasks'
  },
  isRead: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

const NotificationModel = mongoose.models.notifications || mongoose.model("notifications", NotificationSchema);

module.exports = NotificationModel;

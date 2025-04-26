const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const IssueSchema = new Schema({
  task: {
    type: Schema.Types.ObjectId,
    ref: 'tasks',
    required: true
  },
  reportedBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  type: {
    type: String,
    enum: ['Delivery Problem', 'Customer Issue', 'Restaurant Issue', 'App Problem', 'Other'],
    required: true
  },
  details: {
    type: String,
    required: true
  },
  image: {
    type: String // Path to uploaded image
  },
  status: {
    type: String,
    enum: ['Open', 'Under Review', 'Resolved', 'Closed'],
    default: 'Open'
  }
}, { timestamps: true });

const IssueModel = mongoose.models.issues || mongoose.model("issues", IssueSchema);

module.exports = IssueModel;

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  pickup: {
    address: { type: String, required: true },
    businessName: { type: String, required: true },
    contactPerson: { type: String, required: true },
    contactPhone: { type: String, required: true },
    pickupTime: { type: Date, required: true }
  },
  dropoff: {
    address: { type: String, required: true },
    clientName: { type: String, required: true },
    contactPhone: { type: String, required: true },
    deliveryInstructions: { type: String }
  },
  details: {
    orderItems: [{ 
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      notes: { type: String }
    }],
    totalValue: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['Prepaid', 'Cash on Delivery'], default: 'Prepaid' },
    specialInstructions: { type: String }
  },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Picked Up', 'Completed', 'Cancelled'],
    default: 'Pending'
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },
  statusHistory: [{
    status: { type: String },
    timestamp: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'users' }
  }],
  estimatedDeliveryTime: {
    type: Date,
    required: true
  },
  distance: {
    type: Number, // in kilometers
    required: true
  }  ,
  relatedCommand: {
    type: Schema.Types.ObjectId,
    ref: 'Commands' // Command model name
  }
}, { timestamps: true });

const TaskModel = mongoose.models.tasks || mongoose.model("tasks", TaskSchema);

module.exports = TaskModel;

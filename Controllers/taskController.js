const Task = require("../Models/Task");
const Notification = require("../Models/Notification");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Get tasks for a specific livreur
exports.getLivreurTasks = async (req, res) => {
  try {
    const livreurId = req.params.livreurId;
    
    // Validate the livreur ID
    if (!ObjectId.isValid(livreurId)) {
      return res.status(400).json({ message: "Invalid livreur ID format" });
    }
    
    // Check if the requesting user is either the livreur or an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== livreurId) {
      return res.status(403).json({ message: "Not authorized to access these tasks" });
    }
    
    const tasks = await Task.find({ assignedTo: livreurId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-__v");
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error("Error fetching livreur tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// Get tasks for a specific business

exports.getBusinessTasks = async (req, res) => {
  try {
    const businessId = req.params.businessId;
    
    // Validate the business ID
    if (!ObjectId.isValid(businessId)) {
      return res.status(400).json({ message: "Invalid business ID format" });
    }
    
    // Check if the requesting user is either the business owner or an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== businessId) {
      return res.status(403).json({ message: "Not authorized to access these tasks" });
    }
    
    const tasks = await Task.find({ createdBy: businessId })
      .sort({ createdAt: -1 }) // Sort by newest first
      .select("-__v");
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    console.error("Error fetching business tasks:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// Get a specific task by ID
exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    
    if (!ObjectId.isValid(taskId)) {
      return res.status(400).json({ message: "Invalid task ID format" });
    }
    
    const task = await Task.findById(taskId)
      .populate("assignedTo", "name email")
      .populate("createdBy", "name email");
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }
    
    // Check authorization
    if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo._id.toString()) {
      return res.status(403).json({ message: "Not authorized to access this task" });
    }
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Update task status
exports.updateTaskStatus = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { status } = req.body;
    
    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }
    
    // Validate status
    const validStatuses = ['Pending', 'In Progress', 'Picked Up', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status. Must be one of: Pending, In Progress, Picked Up, Completed, Cancelled"
      });
    }
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }
    
    // Check if the requesting user is the assigned livreur or an admin
    if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }
    
    // Update task status
    task.status = status;
    
    // Add to status history
    task.statusHistory.push({
      status,
      timestamp: new Date(),
      updatedBy: req.user._id
    });
    
    await task.save();
    
    // Create notification for status update
    await Notification.create({
      recipient: task.createdBy,
      type: 'Status Update',
      title: 'Task Status Updated',
      message: `Task #${task._id.toString().slice(-6)} status updated to ${status}`,
      relatedTask: task._id
    });
    
    res.status(200).json({
      success: true,
      data: task,
      message: `Task status updated to ${status}`
    });
  } catch (error) {
    console.error("Error updating task status:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

// Report an issue with a task
exports.reportTaskIssue = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { type, details } = req.body;
    
    if (!type || !details) {
      return res.status(400).json({
        success: false,
        message: "Type and details are required fields"
      });
    }
    
    const task = await Task.findById(taskId);
    
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found"
      });
    }
    
    // Check authorization
    if (req.user.role !== "admin" && req.user._id.toString() !== task.assignedTo.toString()) {
      return res.status(403).json({ message: "Not authorized to report an issue for this task" });
    }
    
    // Create issue
    const Issue = require("../Models/Issue");
    const issue = await Issue.create({
      task: taskId,
      reportedBy: req.user._id,
      type,
      details,
      image: req.file ? `/uploads/issues/${req.file.filename}` : null
    });
    
    // Create notification
    await Notification.create({
      recipient: task.createdBy,
      type: 'Issue Response',
      title: 'New Issue Reported',
      message: `A new issue has been reported for Task #${task._id.toString().slice(-6)}`,
      relatedTask: task._id
    });
    
    res.status(201).json({
      success: true,
      data: issue,
      message: "Issue reported successfully"
    });
  } catch (error) {
    console.error("Error reporting task issue:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};
// Create a new task
exports.createTask = async (req, res) => {
  try {
    const {
      pickup,
      dropoff,
      details,
      assignedTo,
      estimatedDeliveryTime,
      distance
    } = req.body;

    // Validate required fields
    if (!pickup || !dropoff || !details || !assignedTo || !estimatedDeliveryTime || !distance) {
      return res.status(400).json({
        success: false,
        message: "All fields are required: pickup, dropoff, details, assignedTo, estimatedDeliveryTime, distance"
      });
    }

    // Validate assignedTo is a valid User ID
    const User = require("../Models/User"); // Import the User model
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || assignedUser.role !== 'livreur') {
      return res.status(400).json({
        success: false,
        message: "Invalid assignedTo: User not found or is not a livreur."
      });
    }

    // Create the task
    const task = await Task.create({
      pickup,
      dropoff,
      details,
      assignedTo,
      createdBy: req.user._id,
      estimatedDeliveryTime,
      distance
    });

    // Create notification for assigned livreur
    await Notification.create({
      recipient: assignedTo,
      type: 'Task Assignment',
      title: 'New Delivery Task',
      message: `You have been assigned a new delivery to ${dropoff.clientName}.`,
      relatedTask: task._id
    });

    res.status(201).json({
      success: true,
      data: task,
      message: "Task created successfully"
    });
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
}
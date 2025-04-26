const express = require("express");
const router = express.Router();
const {
  getLivreurTasks,
  getTaskById,
  updateTaskStatus,
  reportTaskIssue,
  createTask, // Add createTask
} = require("../Controllers/taskController");
const verifyToken = require("../Middlewares/Auth");
const { upload } = require("../Middlewares/uploadMiddleware");

// Create a new task (Admin only)
router.post("/", verifyToken, createTask);

// Get tasks for a specific livreur
router.get("/livreur/:livreurId", verifyToken, getLivreurTasks);

// Get a specific task by ID
router.get("/:taskId", verifyToken, getTaskById);

// Update task status
router.post("/:taskId/status", verifyToken, updateTaskStatus);

// Report an issue with a task
router.post(
  "/:taskId/issue",
  verifyToken,
  upload.single("image"),
  reportTaskIssue
);

module.exports = router;

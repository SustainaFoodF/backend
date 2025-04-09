const express = require("express");
const upload = require("../Middlewares/uploadMiddleware"); // Import the upload middleware
const path = require("path");
const router = express.Router();
const fs = require("fs");
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  res.json({ filename: req.file.filename });
});
router.delete("/delete/:filename", (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, "../public/uploads", filename);
  // Check if the file exists before attempting to delete
  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // If the file doesn't exist, return an error response
      return res.status(404).json({ error: `File ${filename} not found` });
    }

    // Delete the file
    fs.unlink(filePath, (err) => {
      if (err) {
        // If there is an error deleting the file, return an error response
        return res
          .status(500)
          .json({ error: "Error deleting file", details: err.message });
      }

      // Respond with a success message if file is deleted successfully
      res.json({ message: `File ${filename} deleted successfully` });
    });
  });
});
module.exports = router;

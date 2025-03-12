const express = require("express");
const router = express.Router();

// Import required controllers
const { 
    getUserByEmail,
    updateUserByEmail
} = require("../Controllers/AuthController");

/**
 * @swagger
 * /users/user/email/{email}:
 *   get:
 *     summary: Get user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: user@example.com
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/email/:email', getUserByEmail);

/**
 * @swagger
 * /users/user/email/{email}:
 *   put:
 *     summary: Update user by email
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: user@example.com
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               phone:
 *                 type: string
 *                 example: "+123456789"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/email/:email', updateUserByEmail);
module.exports = router;


const {
    changePasswordById,
  changePasswordByEmail,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  addAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
    getUserByName,
} = require("../Controllers/AuthController");
const express = require("express");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for user management
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
 *       500:
 *         description: Server error
 */
router.get('/', getAllUsers);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/:id', deleteUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update user information
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
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
 *               email:
 *                 type: string
 *                 example: john.doe@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.put('/:id', updateUserById);

/**
 * @swagger
 * /users/{id}/change-password:
 *   post:
 *     summary: Change user password by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: oldpass123
 *               newPassword:
 *                 type: string
 *                 example: newpass456
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid old password
 */
router.post("/:id/change-password", changePasswordById);

/**
 * @swagger
 * /users/change-password/{email}:
 *   post:
 *     summary: Change user password by email
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
 *               newPassword:
 *                 type: string
 *                 example: newpassword123
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       404:
 *         description: User not found
 */
router.post("/change-password/:email", changePasswordByEmail);

/**
 * @swagger
 * /users/name/{name}:
 *   get:
 *     summary: Get user by name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: JohnDoe
 *     responses:
 *       200:
 *         description: User found
 *       404:
 *         description: User not found
 */
router.get('/name/:name', getUserByName);
 
/**
 * @swagger
 * /users/{userId}/addresses:
 *   post:
 *     summary: Add a new address to a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: "123 Main St"
 *               city:
 *                 type: string
 *                 example: "Paris"
 *     responses:
 *       201:
 *         description: Address added successfully
 */
router.post("/:userId/addresses", addAddress);

/**
 * @swagger
 * /users/{userId}/addresses:
 *   get:
 *     summary: Get addresses of a user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
 *     responses:
 *       200:
 *         description: List of user addresses
 */
router.get("/:userId/addresses", getUserAddresses);

/**
 * @swagger
 * /users/{userId}/address/{addressId}:
 *   put:
 *     summary: Update a user's address
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: 60d0fe4f5311236168a109ca
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         example: 507f1f77bcf86cd799439011
 *     responses:
 *       200:
 *         description: Address updated successfully
 */
router.put("/:userId/address/:addressId", updateAddress);

/**
 * @swagger
 * /users/{userId}/address/{addressId}:
 *   delete:
 *     summary: Delete a user's address
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Address deleted successfully
 */
router.delete("/:userId/address/:addressId", deleteAddress);

module.exports = router;
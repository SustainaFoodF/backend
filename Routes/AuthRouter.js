const {
    signup,
    login,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserByName,
    getUserByEmail,
    updateUserByEmail,
    addAddress,
    updateAddress,
    deleteAddress,
    getUserAddresses
} = require('../Controllers/AuthController');

const { signupValidation, loginValidation } = require('../Middlewares/AuthValidation');
const router = require('express').Router();

/**
 * @swagger
 * tags:
 *   name: Utilisateurs
 *   description: Gestion des utilisateurs
 */

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Inscription d'un utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Erreur de validation
 *       409:
 *         description: L'utilisateur existe déjà
 */
router.post('/signup', signupValidation, signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     tags: [Utilisateurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *       403:
 *         description: Identifiants invalides
 */
router.post('/login', loginValidation, login);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer la liste des utilisateurs
 *     tags: [Utilisateurs]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get('/users', getAllUsers);

/**
 * @swagger
 * /users/name/{name}:
 *   get:
 *     summary: Récupérer un utilisateur par nom
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         example: "John Doe"
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/name/:name', getUserByName);

/**
 * @swagger
 * /user/email/{email}:
 *   get:
 *     summary: Récupérer un utilisateur par email
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: "john.doe@example.com"
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/user/email/:email', getUserByEmail);

/**
 * @swagger
 * /user/email/{email}:
 *   put:
 *     summary: Mettre à jour un utilisateur par email
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *         example: "john.doe@example.com"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "admin"
 *               image:
 *                 type: string
 *                 example: "base64encodedimage"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/user/email/:email', updateUserByEmail);

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Récupérer un utilisateur par ID
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés
 *       404:
 *         description: Utilisateur non trouvé
 */
router.get('/users/:id', getUserById);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 */
router.delete('/users/:id', deleteUserById);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Modifier un utilisateur
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Jane Doe"
 *               email:
 *                 type: string
 *                 example: "jane.doe@example.com"
 *               role:
 *                 type: string
 *                 enum: ["admin", "user"]
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour
 *       404:
 *         description: Utilisateur non trouvé
 */
router.put('/users/:id', updateUserById);


/**
 * @swagger
 * /users/{userId}/addresses:
 *   get:
 *     summary: Get addresses for a user
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *     responses:
 *       200:
 *         description: Addresses fetched successfully
 *       404:
 *         description: User not found
 */
router.get('/users/:userId/addresses', getUserAddresses);


/**
 * @swagger
 * /users/{userId}/addresses:
 *   post:
 *     summary: Add a new address for a user
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
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
 *               postalCode:
 *                 type: string
 *                 example: "12345"
 *               city:
 *                 type: string
 *                 example: "New York"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       201:
 *         description: Address added successfully
 *       400:
 *         description: Required fields are missing
 *       404:
 *         description: User not found
 */
router.post('/users/:userId/addresses', addAddress);

/**
 * @swagger
 * /users/{userId}/addresses/{addressId}:
 *   put:
 *     summary: Update an address for a user
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c4"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               street:
 *                 type: string
 *                 example: "456 Elm St"
 *               postalCode:
 *                 type: string
 *                 example: "67890"
 *               city:
 *                 type: string
 *                 example: "Los Angeles"
 *               country:
 *                 type: string
 *                 example: "USA"
 *     responses:
 *       200:
 *         description: Address updated successfully
 *       400:
 *         description: Required fields are missing
 *       404:
 *         description: User or address not found
 */
router.put('/users/:userId/addresses/:addressId', updateAddress);

/**
 * @swagger
 * /users/{userId}/addresses/{addressId}:
 *   delete:
 *     summary: Delete an address for a user
 *     tags: [Utilisateurs]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c3"
 *       - in: path
 *         name: addressId
 *         required: true
 *         schema:
 *           type: string
 *         example: "64b8e3a2e5f1b7a87b0b12c4"
 *     responses:
 *       200:
 *         description: Address deleted successfully
 *       404:
 *         description: User or address not found
 */
router.delete('/users/:userId/addresses/:addressId', deleteAddress);

module.exports = router;
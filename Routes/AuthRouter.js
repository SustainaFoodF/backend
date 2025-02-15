const { signup, login , getAllUsers, getUserById, deleteUserById, updateUserById, getUserByName,getUserByEmail,updateUserByEmail} = require('../Controllers/AuthController');
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
router.get('/users/name/:name', getUserByName); // This is where the new route is added
router.get('/user/email/:email',getUserByEmail);
router.put('/user/email/:email',updateUserByEmail);


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
// Email Verification



module.exports = router;

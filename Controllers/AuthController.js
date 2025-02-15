const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const UserModel = require("../Models/User");
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// Signup - Enregistrement d'un utilisateur avec image en base64
const signup = async (req, res) => {
    try {
        const { name, email, password, role, image } = req.body;
        const userExists = await UserModel.findOne({ email });

        if (userExists) {
            return res.status(409).json({ message: 'User already exists', success: false });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        // Enregistrer l’image Base64
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            role,
            image // L'image est déjà en Base64 côté frontend
        });

        await newUser.save();

        res.status(201).json({ message: "Signup successful", success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};



// Login - Connexion d'un utilisateur
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(403).json({ message: 'Auth failed: email or password is incorrect', success: false });
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            return res.status(403).json({ message: 'Auth failed: email or password is incorrect', success: false });
        }

        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: "Login Success",
            success: true,
            jwtToken,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image
        });
    } catch (err) {
        res.status(500).json({
            message: "Internal server error",
            success: false
        });
    }
};

// Get all users - Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({}, '-password'); // Exclure le champ password
        res.status(200).json({ success: true, users });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get user by ID - Récupérer un utilisateur par son ID
const getUserById = async (req, res) => {
    try {
        const user = await UserModel.findById(req.params.id, '-password');
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Delete user by ID - Supprimer un utilisateur par son ID
const deleteUserById = async (req, res) => {
    try {
        const user = await UserModel.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ message: "User deleted successfully", success: true });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Update user by ID - Mettre à jour un utilisateur
const updateUserById = async (req, res) => {
    try {
        const { name, email, role, image } = req.body;
        const user = await UserModel.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        user.role = role || user.role;
        user.image = image || user.image;

        await user.save();

        res.status(200).json({ message: "User updated successfully", success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get user by name - Récupérer un utilisateur par son nom
const getUserByName = async (req, res) => {
    try {
        const user = await UserModel.findOne({ name: req.params.name }, '-password');
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

// Get user by email - Récupérer un utilisateur par son email
const getUserByEmail = async (req, res) => {
    try {
        const user = await UserModel.findOne({ email: req.params.email }, '-password');
        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }
        res.status(200).json({ success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};
// Update user by email - Mettre à jour un utilisateur par son email
const updateUserByEmail = async (req, res) => {
    try {
        const { name, role, image } = req.body;
        const user = await UserModel.findOne({ email: req.params.email });

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        user.name = name || user.name;
        user.role = role || user.role;

        // Vérifier si une image est envoyée et si elle est en Base64
        if (image && image.startsWith("data:image")) {
            user.image = image; // Stocker directement l’image en Base64
        }

        await user.save();

        res.status(200).json({ message: "User updated successfully", success: true, user });
    } catch (err) {
        res.status(500).json({ message: "Internal server error", success: false });
    }
};


module.exports = {
    signup,
    login,
    getAllUsers,
    getUserById,
    deleteUserById,
    updateUserById,
    getUserByName,
    getUserByEmail, 
    updateUserByEmail
};

const UserModel = require("../Models/User");

const getUsers = async (req, res) => {
    try {
        const allData = await UserModel.find();
        res.json(allData);
    } catch (err) {
        if (err instanceof Error) {
            res.status(500).json({ message: err.message });
        } else {
            res.status(500).json({ message: 'Unknown error' });
        }
    }
};



const getUserByEmail = async (req, res) => {
    const email = req.query.email;
    try {
        const users = await UserModel.find({ email });
        if (users.length > 0) {
            res.json(users);
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};


const registerUserFace = async (req, res) => {
    try {
        console.log("Received request to register user:", req.body);

        const pictureUrl = req.file ? `http://localhost:5001/${req.file.path}` : null;
        console.log("Picture URL:", pictureUrl);

        const userData = {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            role: req.body.role || "client", // Default to "client" if not provided
            image: pictureUrl,
            addresses: req.body.addresses || [], // Ensure addresses is an array
            twoFactorSecret: req.body.twoFactorSecret || null, // Optional field
            activationCode: req.body.activationCode || null,
            accountStatus: req.body.accountStatus || false,
            resetToken: req.body.resetToken || null
        };

        console.log("User data to be created:", userData);

        const user = await UserModel.create(userData);
        console.log("User created successfully:", user);

        res.status(201).json(user);
    } catch (e) {
        console.error("Error registering user:", e);
        if (e instanceof Error) {
            res.status(400).json({ error: e.message });
        } else {
            res.status(400).json({ error: 'Unknown error' });
        }
    }
};







module.exports = {
    registerUserFace,
    getUsers,
    getUserByEmail,
};
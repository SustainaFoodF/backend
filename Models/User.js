const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["admin", "client", "business","livreur"],
        default: "client"
    },
    image: { type: String } // Stockage du chemin de l'image

});

const UserModel = mongoose.model('users', UserSchema);
module.exports = UserModel;
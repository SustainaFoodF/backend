const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the ChangePassword schema (sans enregistrement dans la base de données)
const ChangePasswordSchema = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assure-toi de faire référence au modèle User
        required: true
    },
    oldPassword: {
        type: String,
        required: true,
        minlength: 8 // Par exemple, tu peux mettre une longueur minimale
    },
    newPassword: {
        type: String,
        required: true,
        minlength: 8
    }
});

// On peut utiliser des middlewares si nécessaire pour valider avant enregistrement
ChangePasswordSchema.pre('save', function(next) {
    if (this.newPassword === this.oldPassword) {
        return next(new Error('Le nouveau mot de passe doit être différent de l\'ancien'));
    }
    next();
});

const ChangePasswordModel = mongoose.model('ChangePassword', ChangePasswordSchema);
module.exports = ChangePasswordModel;
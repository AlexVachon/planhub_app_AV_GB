const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserModel = new mongoose.Schema({
    first_name: {
        type: String,
        required: [true, "Vous devez fournir un prénom"],
        trim: true,
        maxlength: [50, "Votre prénom ne peut pas dépasser 50 caractères"],
        minlength: [3, "Votre prénom doit contenir au minimum 3 caractères"]
    },
    last_name: {
        type: String,
        required: [true, "Vous devez fournir un nom"],
        trim: true,
        maxlength: [50, "Votre nom ne peut pas dépasser 50 caractères"],
        minlength: [3, "Votre nom doit contenir au minimum 3 caractères"]
    },
    username: {
        type: String,
        required: [true, "Vous devez fournir un Username"],
        trim: true,
        maxlength: [20, "Votre Username ne peut pas dépasser 20 caractères"],
        minlength: [8, "Votre Username doit contenir au minimum 8 caractères"],
        unique: [true, "Nom d'utilisateur existant"]
    },
    email: {
        type: String,
        required: [true, "Vous devez fournir une adresse courriel"],
        maxlength: [100, "Votre adresse courriel ne peut pas dépasser 100 caractères."],
        trim: true,
        unique: [true, "Adresse courriel existante"]
    },
    password: {
        type: String,
        required: [true, "Vous devez fournir un mot de passe"],
        trim: true,
        maxlength: [20, "Votre mot de passe ne peut pas dépasser 20 caractères"],
        minlength: [8, "Votre mot de passe doit contenir au minimum 8 caractères"]
    },
    projects: {
        type: Array
    },
    created_at: {
        type: Date,
        default: Date.now
    }
})


UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;

        next();

    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Users', UserModel)
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const UserModel = new mongoose.Schema({
    "first_name":{
        type: String,
        required: [true, "Vous devez fournir un prénom"],
        trim: true,
        maxlength: [50, "Votre prénom ne peut pas dépasser 50 caractères"]
    },
    "last_name":{
        type: String,
        required: [true, "Vous devez fournir un nom"],
        trim: true,
        maxlength: [50, "Votre nom ne peut pas dépasser 50 caractères"]
    },
    "username": {
        type: String,
        required: [true, "Vous devez fournir un Username"],
        trim: true,
        maxlength: [15, "Votre Username ne peut pas dépasser 15 caractères"],
        unique: [true, "Nom d'utilisateur existant"]
    },
    "email":{
        type:String,
        required: [true, "Vous devez un adresse courriel"],
        maxlength: [100, "Votre adresse courriel ne peut pas dépasser 100 caractères."],
        trim: true,
        unique: [true, "Adresse courriel existante"]
    },
    "password":{
        type: String,
        required: [true, "Vous devez fournir un mot de passe"],
        trim: true,
        maxlength: [15, "Votre mot de passe ne peut pas dépasser 15 caractères"]
    },
    "projects":{
        type: Array
    },
    "created_at": {
        type: Date,
        default: Date.now
    }
})

// Fonction de hachage du mot de passe avant la sauvegarde
UserModel.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    try {
        // Générer un sel (salt) pour le hachage
        const salt = await bcrypt.genSalt(10); // Le chiffre 10 est le coût du hachage

        // Hacher le mot de passe avec le sel
        const hashedPassword = await bcrypt.hash(this.password, salt);

        // Remplacer le mot de passe non chiffré par le mot de passe chiffré
        this.password = hashedPassword;

        next();

    } catch (error) {
        return next(error);
    }
});

module.exports = mongoose.model('Users', UserModel)
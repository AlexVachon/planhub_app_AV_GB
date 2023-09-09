const mongoose = require('mongoose')
//May need npm install bcrypt for password

const UserModel = new mongoose.Schema({
    "first_name":{
        type: String,
        required: [true, "Vous devez fournir un prénom"],
        trim: true,
        maxlength: [50, "Votre prénom ne peut dépasser 50 caractères"]
    },
    "last_name":{
        type: String,
        required: [true, "Vous devez fournir un nom"],
        trim: true,
        maxlength: [50, "Votre nom ne peut dépasser 50 caractères"]
    },
    "username": {
        type: String,
        required: [true, "Vous devez fournir un Username"],
        trim: true,
        maxlength: [15, "Votre Username ne peut dépasser 15 caractères"]
    },
    "password":{
        type: String,
        required: [true, "Vous devez fournir un mot de passe"],
        trim: true,
        maxlength: [15, "Votre mot de passe ne peut dépasser 15 caractères"]
    },
    "projects":{
        type: Array
    },
    "created_at": {
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Users', UserModel)
const mongoose = require('mongoose')

const TeamsModel = mongoose.Schema({
    "team_name": {
        type: String,
        maxlength: [25, "Le nom de l'équipe ne peut pas dépasser 25 caractères"],
        required: [true, "Vous devez saisir un nom pour l'équipe"],
        trim: true
    },
    "team_owners": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: [true, "Vous devez appointer un chef d'équipe"]
    }],
    "team_members":[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    "created_by":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    "created_at":{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Teams', TeamsModel)
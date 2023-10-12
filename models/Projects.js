const mongoose = require('mongoose')

const ProjectsModel = mongoose.Schema({

    "project_name": {
        type: String,
        required: [true, "Vous devez fournir un nom de projet"],
        trim: true,
        maxlenght: [25, "Votre nom de projet ne peut pas dépasser 25 caractères"],
        minlenght: [4, "Votre nom de projet doit être constituer d'au moins 4 caractères"]
    },
    "created_by":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    "admins": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    }],
    "users": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    "tasks": [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks'
    }],
    "teams":[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teams'
    }],
    "created_at": {
        type: Date,
        default: Date.now
    }

})

module.exports = mongoose.model('Projects', ProjectsModel)
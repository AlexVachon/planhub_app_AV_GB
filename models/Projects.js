const mongoose = require('mongoose')

const ProjectsModel = mongoose.Schema({

    "project_name": {
        type: String,
        required: [true, "Vous devez fournir un nom de projet"],
        trim: true,
        maxlenght: [50, "Votre nom de projet ne peut pas dépasser 50 caractères"]
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

module.exports = mongoose.Model('Projects', ProjectsModel)git
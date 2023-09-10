const mongoose = require('mongoose')

const TasksModel = mongoose.Schema({
    "task_name":{
        type: String,
        maxlength: [25, 'Le nom de la tâche ne peut pas dépasser 25 caractères'],
        required: true
    },
    "task_description":{
        type: String
    },
    "task_type":{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TypesTask',
        required: true
    },
    "created_by":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Users',
        required: true
    },
    "assigned_to":[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users'
    }],
    "created_at":{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.Model('Tasks', TasksModel)
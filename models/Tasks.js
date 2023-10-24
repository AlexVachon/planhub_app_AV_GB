const mongoose = require('mongoose')

// Change id needed
const taskEtatOptions = ['À faire','En cours','En attente','À vérifier','En pause','Complété', 'Annulé']
const taskTypeOptions = ['Bug', 'Correction', 'Sprint', 'Tester', 'Travail', 'Urgence']

//Check if value is in taskEtatOptions
const validateTaskEtat = (value) => {
    return value >= 0 && value < taskEtatOptions.length;
}

const validateTaskType = (value) => {
    return value >= 0 && value < taskTypeOptions.length;
}

const TasksModel = mongoose.Schema({
    "task_name":{
        type: String,
        maxlength: [25, 'Le nom de la tâche ne peut pas dépasser 25 caractères'],
        required: [true, 'Le nom de la tâche est requis'],
        trim: true
    },
    "task_etat":{
        type: Number,
        required: [true, "Le champ type est requis"],
        validate: {
          validator: validateTaskEtat,
          message: "La valeur 'etat' de la tâche n'est pas valide",
        }
    },
    "task_type":{
        type: Number,
        required: [true, "Le champ type est requis"],
        validate: {
          validator: validateTaskType,
          message: "La valeur 'type' de la tâche n'est pas valide",
        }
    },
    "task_description":{
        type: String,
        trim: true
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
    "task_project":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Projects',
        required: true
    },
    "task_subtasks":[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Subtasks'
    }],
    "task_comments":[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Comments'
    }],
    "created_at":{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('Tasks', TasksModel)
const mongoose = require('mongoose')

// Change id needed
const subtaskEtatOptions = ['À faire','En cours','En attente','À vérifier','En pause','Complété', 'Annulé']
const subtaskTypeOptions = ['Bug', 'Correction', 'Sprint', 'Tester', 'Travail']

//Check if value is in taskEtatOptions
const validateSubtaskEtat = (value) => {
    return subtaskEtatOptions.includes(value)
}

const validateSubtaskType = (value) => {
    return subtaskTypeOptions.includes(value)
}

const TasksModel = mongoose.Schema({
    "subtask_name":{
        type: String,
        maxlength: [25, 'Le nom de la sous-tâche ne peut pas dépasser 25 caractères'],
        required: [true, 'Le nom de la tâche est requis'],
        trim: true
    },
    "subtask_etat":{
        type: String,
        required: [true, "Le champ etat est requis"],
        validate: {
          validator: validateSubtaskEtat,
          message: "La valeur 'etat' de la sous-tâche n'est pas valide",
        }
    },
    "subtask_type":{
        type: String,
        required: [true, "Le champ type est requis"],
        validate: {
          validator: validateSubtaskType,
          message: "La valeur 'type' de la sous-tâche n'est pas valide",
        }
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
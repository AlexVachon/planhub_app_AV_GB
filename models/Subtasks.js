const mongoose = require('mongoose')

// Change id needed
const subtaskEtatOptions = ['À faire','En cours','En attente','À vérifier','En pause','Complété', 'Annulé']
const subtaskTypeOptions = ['Bug', 'Correction', 'Sprint', 'Tester', 'Travail']

//Check if value is in taskEtatOptions
const validateSubtaskEtat = (value) => {
    return value >= 0 && value < subtaskEtatOptions.length;
}

const validateSubtaskType = (value) => {
    return value >= 0 && value < subtaskTypeOptions.length;
}

const SubtasksModel = mongoose.Schema({
    "subtask_name":{
        type: String,
        maxlength: [25, 'Le nom de la sous-tâche ne peut pas dépasser 25 caractères'],
        required: [true, 'Le nom de la tâche est requis'],
        trim: true
    },
    "subtask_etat":{
        type: Number,
        required: [true, "Le champ etat est requis"],
        validate: {
          validator: validateSubtaskEtat,
          message: "La valeur 'etat' de la sous-tâche n'est pas valide",
        }
    },
    "subtask_type":{
        type: Number,
        required: [true, "Le champ type est requis"],
        validate: {
          validator: validateSubtaskType,
          message: "La valeur 'type' de la sous-tâche n'est pas valide",
        }
    },
    "subtask_task":{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Tasks',
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

module.exports = mongoose.model('Subtasks', SubtasksModel)
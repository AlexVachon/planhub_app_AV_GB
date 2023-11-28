const mongoose = require('mongoose')

const CommentsModel = mongoose.Schema({
    "created_at":{
        type: Date,
        default: Date.now
    },
    "comment_user": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    "comment_message": {
        type: String,
        required: [true, "Vous devez saisir un contenu dans le commentaire"],
        trim: true
    },
    "comment_task": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tasks',
        required: true
    }
})

module.exports = mongoose.model('Comments', CommentsModel)
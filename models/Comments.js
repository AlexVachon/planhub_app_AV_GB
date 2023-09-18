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
    }
})

module.exports = mongoose.Model('Teams', TeamsModel)
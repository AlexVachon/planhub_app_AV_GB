const Comments = require('../models/Comments')
const Tasks = require('../models/Tasks')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const createComment = async (req, res) => {
    const userID = req.session.user;
    console.log("userId : " + userID)

    if (!userID) {
        return res.status(401).json({ error: "Vous devez d'abord être connecté" });
    } else {
        const { comment_message, comment_user, comment_task } = req.body;
        
        console.log("comment)_message : " + comment_message)
        
        console.log("taskId : " + comment_task)

        try {
            const task = await Tasks.findOne({ _id: comment_task || taskId });
            console.log("task : " + task)

            if (!task) {
                res.status(404).json({ message: "Tâche introuvable" });
            } else {
                const comment = new Comments({
                    _id: new mongoose.Types.ObjectId(),
                    comment_message: comment_message,
                    comment_user: userID,
                    comment_task: comment_task
                });

                await comment.save();

                task.task_comments.push(comment._id);
                await task.save();

                res.status(201).json({ message: 'Commentaire créé avec succès' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Erreur lors de la création du commentaire' });
        }
    }
};

const getCommentsTask = async (req, res) => {
    const { taskId } = req.params;
    try {
        if (req.session.authenticated) {
            const comments = await Comments
                .find({ comment_task: taskId })
                .populate('comment_user')
                .populate('comment_task');

            return res.status(200).json(comments);
        }
        return res.status(403).json({ message: "Vous devez être connecté" });
    } catch (error) {
        console.error("Erreurs lors du chargement des commentaires: ", error);
        return res.status(500).json({ message: "Erreur interne du serveur" });
    }
};


module.exports = {
    createComment,
    getCommentsTask
}
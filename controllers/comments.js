const Comments = require('../models/Comments')
const Tasks = require('../models/Tasks')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const createComment = async (req, res) => {
    const userID = req.session.user;

    if (!userID) {
        return res.status(401).json({ error: "Vous devez d'abord être connecté" });
    } else {
        const { comment_message, comment_user, comment_task } = req.body;
        const { taskId } = req.params;

        try {
            const task = await Tasks.findOne({ _id: comment_task || taskId });

            if (!task) {
                res.status(404).json({ message: "Tâche introuvable" });
            } else {
                const comment = new Comments({
                    _id: new mongoose.Types.ObjectId(),
                    comment_message: comment_message,
                    comment_user: userID || comment_user,
                    comment_task: taskId || comment_task
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
      if (req.session.authenticated){
          const comments = await Comments.find({comment_task: taskId})
          return res.status(200).json(comments)
      }
      return res.status(403).json({message: "Vous devez être connecté"})
    } catch (error) {
      console.error("Erreurs lors du chargement des commentaires: ", error);
    }
  };
  

module.exports = {
    createComment,
    getCommentsTask
}
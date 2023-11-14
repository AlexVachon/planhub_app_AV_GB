const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');
const Subtasks = require('../models/Subtasks');
const mongoose = require('mongoose');

const getOneSubtask = async (req, res) => {
    const { id_subtask } = req.body;
    try {
        const subtask = await Subtasks.findOne({ '_id': id_subtask });
        if (!subtask) {
            return res.status(400).json({ message: 'Sous-tâche inexistante' });
        }
        return res.status(200).json({ subtask });
    } catch (err) {
        console.error("Erreur lors de la recherche de la sous-tâche :", err);
        return res.status(500).json({ error: "Erreur lors de la recherche de la sous-tâche" });
    }
}

const getAllSubtasks = async (req, res) => {
    try {
        const subtasks = await Subtasks.find({});
        return res.status(200).json({ subtasks });
    } catch (err) {
        console.error("Erreur lors de la recherche des sous-tâches :", err);
        return res.status(500).json({ error: "Erreur lors de la recherche des sous-tâches" });
    }
}

const createSubtask = async (req, res) => {
    // if (req.session.authenticated) {
    //     const userID = req.session.user
    //     const { projectId, taskId } = req.params
         const { subtask_name, subtask_etat, subtask_type,subtask_task, created_by,  assigned_to } = req.body;

         try {
    //         const projet = await Projects.findOne({ _id: projectId })
    //         if (!projet) {
    //             res.status(404).json({ message: "Projet introuvable" });
    //         }
    //         const tache = await projet.tasks.findOne({ _id: taskId})
    //         if (!tache) {
    //             res.status(404).json({ message: "Tâche introuvable" });
    //         }
    //         const users = projet.users

            //if (users.includes(userID)) {
                const subtask = new Subtasks({
                    _id: new mongoose.Types.ObjectId(),
                    subtask_name: subtask_name,
                    subtask_etat: subtask_etat,
                    subtask_type: subtask_type,
                    subtask_task: subtask_task,//taskId,
                    created_by: created_by//userID
                });

                const savedSubtask = await subtask.save()

                //await Tasks.updateOne({ _id: taskId}, { $push: { subtasks: savedSubtask._id } }).exec();
                res.status(201).json(savedSubtask);
            // } else {
            //     res.status(403).json({ message: "Accès non autorisé" });
            // }

        } catch (err) {
            if (err.name === 'ValidationError') {

                    const validationErrors = {};

                for (const key in err.errors) {
                    validationErrors[key] = err.errors[key].message;

                    }

                    console.error(validationErrors);

                    res.status(400).json({ errors: validationErrors });

                } else {

                console.error(err);
                res.status(400).json({ message: 'Erreur lors de la création de la sous-tâche' });
            }
        }
    // } else {
    //     console.error("Vous devez d'abord être connecté");
    //     res.status(401).json({ message: "Vous devez d'abord être connecté" });
    // }
}

module.exports = {
    getOneSubtask,
    getAllSubtasks,
    createSubtask
}

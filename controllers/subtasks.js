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
    const userID = req.session.userID;
    if (!userID) {
        return res.status(401).json({ error: "Vous devez d'abord être connecté" });
    }

    const { subtask_name, subtask_etat, subtask_type, created_by, assigned_to } = req.body;

    try {
        const task = new Tasks({
            _id: new mongoose.Types.ObjectId(),
            subtask_name,
            subtask_etat,
            subtask_type,
            created_by,
            assigned_to
        });

        task.save()
            .then(savedSubtask => {
                Users.updateOne({ _id: created_by }, { $push: { tasks: savedSubtask._id } });
                res.status(201).json({ task: savedSubtask });
            })
            .catch(error => {
                if (error.name === 'ValidationError') {

                    const validationErrors = {};

                    for (const key in error.errors) {

                        validationErrors[key] = error.errors[key].message;

                    }

                    console.error(validationErrors);

                    res.status(400).json({ errors: validationErrors });

                } else {

                    console.error(error);

                    res.status(500).json({ message: 'Erreur lors de la création de la sous-tâche' });

                }
            });


    } catch (err) {
        console.error("Erreur lors de la création de la sous-tâche :", err);
        return res.status(500).json({ error: "Erreur lors de la création de la sous-tâche" });
    }
}

module.exports = {
    getOneSubtask,
    getAllSubtasks,
    createSubtask
}

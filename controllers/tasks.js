const Tasks = require('../models/Tasks')
const Projects = require("../models/Projects")

const mongoose = require('mongoose');

const getOneTask = async (req, res) => {
    const { id_task } = req.body;
    try {
        const task = await Tasks.findOne({ '_id': id_task });
        if (!task) {
            return res.status(400).json({ message: 'Tâche inexistante' });
        }
        return res.status(200).json({ task });
    } catch (err) {
        console.error("Erreur lors de la recherche de la tâche :", err);
        return res.status(500).json({ error: "Erreur lors de la recherche de la tâche" });
    }
}

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Tasks.find({});
        return res.status(200).json({ tasks });
    } catch (err) {
        console.error("Erreur lors de la recherche des tâches :", err);
        return res.status(500).json({ error: "Erreur lors de la recherche des tâches" });
    }
}

const createTask = async (req, res) => {

    if (req.session.authenticated) {
        const userID = req.session.user
        const { projectId } = req.params
        const { task_name, task_type, task_description } = req.body;

        try {
            const projet = await Projects.findOne({ _id: projectId })
            if (!projet) {
                res.status(404).json({ message: "Projet introuvable" });
            }

            const users = projet.users

            if (users.includes(userID)) {
                const task = new Tasks({
                    _id: new mongoose.Types.ObjectId(),
                    task_name: task_name,
                    task_type: task_type,
                    task_description: task_description,
                    task_project: projectId,
                    created_by: userID
                });

                const savedTask = await task.save()

                await Projects.updateOne({ _id: projectId }, { $push: { tasks: savedTask._id } })
                res.status(201).json(savedTask);
            } else {
                res.status(403).json({ message: "Accès non autorisé" });
            }

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
                res.status(400).json({ message: 'Erreur lors de la création de la tâche' });
            }
        }
    } else {
        console.error("Vous devez d'abord être connecté");
        res.status(401).json({ message: "Vous devez d'abord être connecté" });
    }

}

const editTask = async (req, res) => {
    if (req.session.authenticated) {
        const { projectId, taskId } = req.params
        const { task_name, task_description, task_type } = req.body

        try {
            const projet = await Projects.findById(projectId)
            const users = projet.users

            if (users.includes(req.session.user)) {

                const updatedData = {
                    task_name: task_name,
                    task_type: task_type,
                    task_description: task_description
                }

                const tache = await Tasks.findOneAndUpdate(
                    { _id: taskId },
                    { $set: updatedData },
                    { new: true }
                )

                if (tache){
                    res.status(200).json(tache)
                }else{
                    res.status(400).json({message: "Aucune tâche correspondant n'a été trouvé."})
                }

            } else {
                res.status(403).json({ message: "Accès non autorisé" })
            }


        } catch (error) {
            if (err.name === 'ValidationError') {

                const validationErrors = {};
                for (const key in err.errors) {
                    validationErrors[key] = err.errors[key].message;
                }

                console.error(validationErrors);
                res.status(400).json({ errors: validationErrors });

            } else {
                console.error(err);
                res.status(400).json({ message: 'Erreur lors de la modification de la tâche' });
            }
        }
    } else {
        res.status(403).redirect('/join')
    }
}

module.exports = {
    getOneTask,
    getAllTasks,
    createTask,
    editTask
}

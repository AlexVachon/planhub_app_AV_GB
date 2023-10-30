const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');
const Users = require("../models/Users")

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
    const userID = req.session.userID;
    if (!userID) {
        return res.status(401).json({ error: "Vous devez d'abord être connecté" });
    }

    const { task_name, task_etat, task_type, task_description, task_project, created_by, assigned_to } = req.body;

    try {
        const task = new Tasks({
            _id: new mongoose.Types.ObjectId(),
            task_name,
            task_etat,
            task_type,
            task_description,
            task_project,
            created_by,
            assigned_to
        });

        task.save()
            .then(savedTask => {
                Users.updateOne({ _id: created_by }, { $push: { tasks: savedTask._id } });
                res.status(201).json({ task: savedTask });
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

                    res.status(500).json({ message: 'Erreur lors de la création de la tâche' });

                }
            });


    } catch (err) {
        console.error("Erreur lors de la création de la tâche :", err);
        return res.status(500).json({ error: "Erreur lors de la création de la tâche" });
    }
}

const getTasksProject = async (req, res) => {
    const { projectId, userId } = req.params;

    if (req.session.authenticated && userId == req.session.user) {
        try {
            const project = await Projects.findById(projectId)

            if (!project) {
                res.status(404).json({ "error": "Projet non trouvé" })
            }
            const taskIds = project.tasks

            const tasks = await Tasks.find({ _id: { $in: taskIds } })
            res.status(201).json(tasks)

        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    } else {
        res.status(403).redirect('/join')
    }
}

const getUsersProjects = async (req, res) => {
    const { projectId } = req.params;
    const userId = req.session.user;

    if (req.session.authenticated && userId == req.session.user) {
        try {
            const project = await Projects.findById(projectId)

            if (!project) {
                res.status(404).json({ "error": "Projet non trouvé" })
                return
            }

            const usersIds = project.Users

            const users = await Users.find({ _id: { $in: usersIds } })

            res.status(201).json(users)

        } catch (error) {
            console.error(error)
            res.status(500).json({ error })
        }
    } else {
        res.status(403).redirect('/join')
    }
}


const getAdminsProjects = async (req, res) => {
    
}



module.exports = {
    getOneTask,
    getAllTasks,
    createTask,
    getTasksProject,
    getUsersProjects,
    getAdminsProjects
}

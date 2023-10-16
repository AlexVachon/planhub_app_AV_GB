const Projects = require('../models/Projects')
const Users = require('../models/Users')
const mongoose = require('mongoose')
const { updateOne } = require('../models/Users')


const getOneProject = async (req, res) => {
    //Valeur des champs dans le formulaire **FAIRE EN POST**
    const { id_project } = req.body
    try {
        const project = await Projects.findOne({ '_id': id_project })
        if (!project) {
            res.status(400).json({ message: 'Projet inexistant' })
        }

    } catch (err) {
        console.error("Erreur de la recherche du projet :", err)
    }

}

const getAllProjects = async (req, res) => {
    try {
        const projects = await Projects.find({})

        res.status(201).json({ projects })

    } catch (err) {
        console.error("Erreur de la recherche des projets :", err)
    }
}

const createProject = async (req, res) => {
    userID = req.session.userID
    created_by = userID // created_by current session userID
    if (!userID) {
        const { project_name } = req.body // admins, users ?

        try {
            const project = new Projects({
                _id: new mongoose.Types.ObjectId(),
                project_name: project_name,
                created_by: created_by
            });

            project.save()
                .then(savedProject => {
                    console.log('Projet créé :', savedProject);

                    return Users.updateOne({ _id: created_by }, { $push: { projects: savedProject._id } });
                })
                .then(() => {
                    res.status(201).json({ project });
                })
                .catch(err => {
                    console.error(err, "Il y a une erreur dans la création du projet");
                    res.status(500).json({ error: "Erreur lors de la création du projet" });
                });
        } catch (err) {
            console.error(err, "Il y a une erreur dans la création du projet");
            res.status(500).json({ error: "Erreur lors de la création du projet" });
        }

    } else {
        console.error("Vous devez d'abord être connecté")
    }
}

module.exports = {
    getOneProject,
    getAllProjects,
    createProject
}
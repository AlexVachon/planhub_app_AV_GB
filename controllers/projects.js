const Projects = require("../models/Projects");
const Users = require("../models/Users");
const Tasks = require("../models/Tasks");
const Subtasks = require("../models/Subtasks");
const Comments = require("../models/Comments");
const mongoose = require("mongoose");

const getOneProject = async (req, res) => {
  //Valeur des champs dans le formulaire **FAIRE EN POST**
  const { id_project } = req.body;
  try {
    const project = await Projects.findOne({ _id: id_project });
    if (!project) {
      res.status(400).json({ message: "Projet inexistant" });
    }
  } catch (err) {
    console.error("Erreur de la recherche du projet :", err);
  }
};

const getAllProjects = async (req, res) => {
  try {
    const projects = await Projects.find({});

    res.status(201).json({ projects });
  } catch (err) {
    console.error("Erreur de la recherche des projets :", err);
  }
};

const createProject = async (req, res) => {
  const userID = req.session.user;
  const created_by = userID;

  if (req.session.authenticated) {
    const { project_name } = req.body;

    try {
      const project = new Projects({
        _id: new mongoose.Types.ObjectId(),
        project_name: project_name,
        created_by: created_by,
        admins: [created_by],
        users: [created_by],
      });

      const savedProject = await project.save();

      await Users.updateOne(
        { _id: created_by },
        { $push: { projects: savedProject._id } }
      );

      res.status(201).json(savedProject);
    } catch (err) {
      if (err.name === "ValidationError") {
        const validationErrors = {};
        for (const key in err.errors) {
          validationErrors[key] = err.errors[key].message;
        }
        console.error(validationErrors);
        res.status(400).json({ errors: validationErrors });
      } else {
        console.error(err);
        res
          .status(500)
          .json({ message: "Erreur lors de la création du projet" });
      }
    }
  } else {
    console.error("Vous devez d'abord être connecté");
    res.status(401).json({ message: "Vous devez d'abord être connecté" });
  }
};

const getProjectsUser = async (req, res) => {
  const { id } = req.params;

  if (req.session.authenticated && id == req.session.user) {
    try {
      const user = await Users.findById(id);

      if (!user) {
        res.status(404).json({ error: "Utilisateur non trouvé" });
        return;
      }

      const projectIds = user.projects;

      const projects = await Projects.find({ _id: { $in: projectIds } }).sort({
        project_name: 1,
      });

      res.status(201).json(projects);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const editProject = async (req, res) => {
  try {
    const { userID, projectID } = req.params;
    const { name } = req.body;
    if (req.session.authenticated && req.session.user == userID) {
      const project = await Projects.findOne({ _id: projectID });
      if (project) {
        const created_by = project.created_by;
        if (created_by == userID) {
          const updatedProject = await Projects.findByIdAndUpdate(
            projectID,
            { $set: { project_name: name } },
            { new: true }
          );
          return res.status(201).json({
            status: "ok",
            message: `Le projet: '${updatedProject.project_name}' a bien été modifié!`,
          });
        } else {
          return res.status(403).json({
            message: "Vous devez être le créateur du projet pour le modifier!",
          });
        }
      } else {
        return res
          .status(404)
          .json({ message: `Projet: "${projectID}" non trouvé!` });
      }
    } else {
      return res.status(403).json({ message: "Vous devez être connecté!" });
    }
  } catch (err) {
    if (err.name === "ValidationError") {
      const validationErrors = {};
      for (const key in err.errors) {
        validationErrors[key] = err.errors[key].message;
      }
      console.error(validationErrors);
      res.status(400).json({ errors: validationErrors });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ message: "Erreur lors de la modification du projet" });
    }
  }
};

const deleteProject = async (req, res) => {
  try {
    const { projectID } = req.params;
    if (req.session.authenticated) {
      if (!projectID) {
        return res.status(400).json({ message: "Project ID est requis" });
      }

      const project = await Projects.findOne({ _id: projectID });

      if (!project) {
        return res
          .status(404)
          .json({ message: "Aucune projet trouvé avec cet ID!" });
      }

      if (!project.created_by.equals(req.session.user)) {
        return res.status(403).json({
          message: "Vous n'avez pas les permissions pour supprimer ce projet",
        });
      }

      const taskIds = project.tasks;

      const subtaskIds = await Tasks.find({ _id: { $in: taskIds } }).distinct(
        "task_subtasks"
      );

      // Supprimer les sous-tâches
      await Subtasks.deleteMany({ _id: { $in: subtaskIds } });

      // Supprimer les commentaires des tâches
      await Comments.deleteMany({
        comment_task: { $in: taskIds },
      });

      // Supprimer les tâches
      await Tasks.deleteMany({ _id: { $in: taskIds } });

      // Mettre à jour l'utilisateur en supprimant l'ID du projet du tableau projects
      await Users.updateOne(
        { _id: req.session.user },
        { $pull: { projects: projectID } }
      );

      // Supprimer le projet
      const deletedProject = await Projects.findByIdAndDelete(projectID);

      if (deletedProject) {
        return res.status(200).json({
          status: "ok",
          message: `Projet: "${project.project_name}" supprimé avec succès!`,
        });
      } else {
        return res
          .status(404)
          .json({ message: `Projet: "${projectID}" non trouvé!` });
      }
    } else {
      return res.status(403).json({ message: "Vous devez être connecté!" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression du projet", error });
  }
};

module.exports = {
  getOneProject,
  getAllProjects,
  createProject,
  getProjectsUser,
  editProject,
  deleteProject,
};

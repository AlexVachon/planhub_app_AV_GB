const Projects = require("../models/Projects");
const Tasks = require("../models/Tasks");
const Users = require("../models/Users");
const Subtasks = require("../models/Subtasks");
const Comments = require("../models/Comments");

const mongoose = require("mongoose");

const getOneTask = async (req, res) => {
  const { id_task } = req.body;
  try {
    const task = await Tasks.findOne({ _id: id_task });
    if (!task) {
      return res.status(400).json({ message: "Tâche inexistante" });
    }
    return res.status(200).json({ task });
  } catch (err) {
    console.error("Erreur lors de la recherche de la tâche :", err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la recherche de la tâche" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await Tasks.find({});
    return res.status(200).json({ tasks });
  } catch (err) {
    console.error("Erreur lors de la recherche des tâches :", err);
    return res
      .status(500)
      .json({ error: "Erreur lors de la recherche des tâches" });
  }
};

const createTask = async (req, res) => {
  if (req.session.authenticated) {
    const userID = req.session.user;
    const { projectId } = req.params;
    const { task_name, task_type, task_description } = req.body;

    try {
      const projet = await Projects.findOne({ _id: projectId });
      if (!projet) {
        res.status(404).json({ message: "Projet introuvable" });
      }

      const users = projet.users;

      if (users.includes(userID)) {
        const task = new Tasks({
          _id: new mongoose.Types.ObjectId(),
          task_name: task_name,
          task_type: task_type,
          task_description: task_description,
          task_project: projectId,
          created_by: userID,
        });

        const savedTask = await task.save();

        await Projects.updateOne(
          { _id: projectId },
          { $push: { tasks: savedTask._id } }
        );
        res.status(201).json(savedTask);
      } else {
        res.status(403).json({ message: "Accès non autorisé" });
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
          .status(400)
          .json({ message: "Erreur lors de la création de la tâche" });
      }
    }
  } else {
    console.error("Vous devez d'abord être connecté");
    res.status(401).json({ message: "Vous devez d'abord être connecté" });
  }
};

const getTasksProject = async (req, res) => {
  const { projectId, userId } = req.params;

  if (req.session.authenticated && userId == req.session.user) {
    try {
      const project = await Projects.findById(projectId);

      if (!project) {
        res.status(404).json({ error: "Projet non trouvé" });
      }
      const taskIds = project.tasks;

      const tasks = await Tasks.find({ _id: { $in: taskIds } });
      res.status(201).json(tasks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const getUsersProjects = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.session.user;

  if (req.session.authenticated && userId == req.session.user) {
    try {
      const project = await Projects.findById(projectId);

      if (!project) {
        res.status(404).json({ error: "Projet non trouvé" });
      }

      const usersIds = project.users;

      const users = await Users.find({ _id: { $in: usersIds } });

      res.status(201).json(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const getAdminsProjects = async (req, res) => {
  const { projectId } = req.params;
  const userId = req.session.user;

  if (req.session.authenticated && userId == req.session.user) {
    try {
      const project = await Projects.findById(projectId);

      if (!project) {
        res.status(404).json({ error: "Projet non trouvé" });
      }

      const adminsIds = project.admins;

      const admins = await Users.find({ _id: { $in: adminsIds } });

      res.status(201).json(admins);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const getRecherche = async (req, res) => {
  if (req.session.authenticated) {
    const { projectId, searchTerm, type, etat, tri } = req.query;
    try {
      const projet = await Projects.findById(projectId);
      if (!projet) {
        res.status(404).json({ message: "Projet introuvable" });
      }

      // On vérifie si l'utilisateur est dans le projet
      const userId = req.session.user;
      if (projet.users.includes(userId)) {
        const query = {
          task_project: projectId,
        };

        if (searchTerm) {
          query.task_name = { $regex: searchTerm, $options: "i" };
        }

        if (type && type !== "aucun") {
          query.task_type = parseInt(type);
        }

        if (etat && etat !== "aucun") {
          query.task_etat = parseInt(etat);
        }

        let sortOption;
        switch (parseInt(tri)) {
          case 1:
            sortOption = { created_at: 1 }; // Tri par date de création
            break;
          case 2:
            sortOption = { task_type: 1 }; // Tri par type de tâche
            break;
          case 3:
            sortOption = { task_etat: 1 }; // Tri par état de la tâche
            break;
          default:
            sortOption = { task_name: 1 }; // Tri par défaut (alphabétique)
            break;
        }

        const tasks = await Tasks.find(query).sort(sortOption);

        res.status(200).json({ tasks });
      } else {
        res.status(403).json({ message: "Accès non autorisé" });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ error: "Erreur lors de la recherche de la tâche" });
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const editTask = async (req, res) => {
  if (req.session.authenticated) {
    const { projectId, taskId } = req.params;
    const { task_name, task_description, task_type } = req.body;

    try {
      if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
        return res
          .status(400)
          .json({ message: "Vous devez fournir un projetId valide!" });
      } else if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res
          .status(400)
          .json({ message: "Vous devez fournir un taskId valide!" });
      }
      const projet = await Projects.findById(projectId);
      if (!projet) {
        return res
          .status(404)
          .json({ message: "Aucun projet ne correspond à cet ID!" });
      }
      const users = projet.users;

      if (users.includes(req.session.user)) {
        const updatedData = {
          task_name: task_name,
          task_type: task_type,
          task_description: task_description,
        };

        const tache = await Tasks.findOneAndUpdate(
          { _id: taskId },
          { $set: updatedData },
          { new: true }
        );

        if (tache) {
          res
            .status(200)
            .json({ message: "Tâche mise à jour avec succès.", task: tache });
        } else {
          res
            .status(400)
            .json({ message: "Aucune tâche correspondant n'a été trouvé." });
        }
      } else {
        res.status(403).json({ message: "Accès non autorisé" });
      }

    } catch (error) {

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
          .status(400)
          .json({ message: "Erreur lors de la modification de la tâche" });
      }
    }
  } else {
    res.status(403).redirect("/join");
  }
};

const deleteTask = async (req, res) => {
  if (req.session.authenticated) {
    try {
      const { taskId, projectId } = req.params;

      if (!taskId || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res
          .status(400)
          .json({ message: "Vous devez fournir un taskID valide!" });
      }

      const task = await Tasks.findOne({ _id: taskId });

      if (!task) {
        return res
          .status(404)
          .json({ message: "Aucune tâche trouvée avec cet ID!" });
      }

      const subtaskIds = await Subtasks.find({
        subtask_task: taskId,
      }).distinct("_id");

      await Subtasks.deleteMany({ _id: { $in: subtaskIds } });
      await Comments.deleteMany({ comment_task: taskId });

      await Projects.updateOne(
        { task_project: projectId },
        { $pull: { tasks: taskId } }
      );

      const deletedTask = await Tasks.findByIdAndDelete(taskId);

      if (deletedTask) {
        return res.status(200).json({
          status: "ok",
          message: `Tâche: "${task.task_name}" supprimée avec succès!`,
        });
      } else {
        return res
          .status(404)
          .json({ message: `Tâche: "${taskId}" non trouvé!` });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la suppression de la tâche", error });
    }
  } else {
    return res.status(403).json({ message: "Vous devez être connecté!" });
  }
};

module.exports = {
  getOneTask,
  getAllTasks,
  createTask,
  getTasksProject,
  getUsersProjects,
  getAdminsProjects,
  getRecherche,
  editTask,
  deleteTask,
};

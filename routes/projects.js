const express = require("express");
const router = express.Router();

//Get path from controllers
const {
  getOneProject,
  getAllProjects,
  createProject,
  getProjectsUser,
  editProject,
  deleteProject,
} = require("../controllers/projects");

router.route("/").post(getOneProject).get(getAllProjects);
router.route("/create").post(createProject);
router.route("/:id/projects").get(getProjectsUser);
router.route("/:userID/projects/:projectID/edit").post(editProject);
router.route("/projects/:projectID/delete").delete(deleteProject);

module.exports = router;

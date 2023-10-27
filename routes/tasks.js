const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneTask, getAllTasks, createTask, getTasksProject, getUsersProjects, getAdminsProjects } = require('../controllers/tasks')

router.route('/').post(getOneTask);
router.route('/').get(getAllTasks);
router.route('/create').post(createTask);
router.route('/:userId/:projectId/tasks').get(getTasksProject);
router.route('/:userId/:projectId/users').get(getUsersProjects);
router.route('/:userId/:projectId/admins').get(getAdminsProjects);

module.exports = router;
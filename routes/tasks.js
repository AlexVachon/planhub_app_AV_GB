const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneTask, getAllTasks, createTask, editTask} = require('../controllers/tasks')

router.route('/').post(getOneTask)
router.route('/').get(getAllTasks);
router.route('/:projectId/create').post(createTask);
router.route('/:projectId/:taskId/edit').post(editTask)

module.exports = router;
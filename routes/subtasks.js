const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneSubtask, getAllSubtasks, createSubtask, getTaskSubtasks } = require('../controllers/subtasks')

router.route('/').post(getOneSubtask);
router.route('/').get(getAllSubtasks);
router.route('/:taskId').get(getTaskSubtasks)
router.route('/create').post(createSubtask)

module.exports = router
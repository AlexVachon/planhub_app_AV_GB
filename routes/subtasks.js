const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneSubtask, getAllSubtasks, createSubtask } = require('../controllers/subtasks')

router.route('/').get(getAllSubtasks);
router.route('/:id_subtask').get(getOneSubtask);
router.route('/create').post(createSubtask);

module.exports = router;
const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneSubtask, getAllSubtasks, createSubtask } = require('../controllers/subtasks')

router.route('/').post(getOneSubtask);
router.route('/').get(getAllSubtasks);
router.route('/create').post(createSubtask)
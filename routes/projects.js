const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneProject, getAllProjects, createProject, getProjectsUser } = require('../controllers/projects')

router.route('/').post(getOneProject).get(getAllProjects)
router.route('/create').post(createProject)
router.route('/:id/projects').get(getProjectsUser)

module.exports = router;
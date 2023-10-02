const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneProject, getAllProjects, createProject } = require('../controllers/projects')

router.route('/').post(getOneProject)
router.route('/').get(getAllProjects)
router.route('/create').post(createProject)

module.exports = router;
const express = require('express');
const router = express.Router();

//Get path from controllers
const {getAllUsers} = require('../controllers/users')


router.route('/').get(getAllUsers)


module.exports = router;
const express = require('express');
const router = express.Router();

//Get path from controllers
const {getOneUser} = require('../controllers/users')


router.route('/').post(getOneUser)


module.exports = router;
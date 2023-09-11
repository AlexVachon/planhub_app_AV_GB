const express = require('express');
const router = express.Router();

//Get path from controllers
const {getOneUser, getAllUsers} = require('../controllers/users')


router.route('/getOneUser').post(getOneUser)
router.route('/').get(getAllUsers)



module.exports = router;
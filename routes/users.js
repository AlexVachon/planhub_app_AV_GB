const express = require('express');
const router = express.Router();

//Get path from controllers
const { getOneUser, getAllUsers, createUser } = require('../controllers/users')


router.route('/connect').post(getOneUser)
router.route('/').get(getAllUsers)
router.route('/create').post(createUser)



module.exports = router;
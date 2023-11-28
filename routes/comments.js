const express = require('express');
const router = express.Router();

//Get path from controllers
const { createComment } = require('../controllers/comments')

router.route('/create').post(createComment);

module.exports = router;
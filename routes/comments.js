const express = require('express');
const router = express.Router();

//Get path from controllers
const { createComment, getCommentsTask } = require('../controllers/comments')

router.route('/create').post(createComment);
router.route('/:taskId').get(getCommentsTask)

module.exports = router;
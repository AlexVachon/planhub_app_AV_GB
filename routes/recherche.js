// routes/tasks.js

const express = require('express');
const router = express.Router();
const { searchTasks } = require('../controllers/tasks');

router.route('/search').get(searchTasks);

module.exports = router;

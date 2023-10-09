const express = require('express')
const router = express.Router()

const { loadPage } = require('../controllers/taches')

router.route('/:projet/:tache').get(loadPage)
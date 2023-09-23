const express = require('express')
const router = express.Router()

const {loadPage, setSession, createUser} = require('../controllers/join')


router.route('/').get(loadPage)
router.route('/login').post(setSession)
router.route('/sign').post(createUser)



module.exports = router
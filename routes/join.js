const express = require('express')
const router = express.Router()

const {loadPage, setSession} = require('../controllers/join')


router.route('/').get(loadPage)
router.route('/login').post(setSession)
router.route('/sign').post()



module.exports = router
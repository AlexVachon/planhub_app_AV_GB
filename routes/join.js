const express = require('express')
const router = express.Router()

const {loadPage, setSession, createUser, loadCreate, confirmEmail} = require('../controllers/join')


router.route('/').get(loadPage)
router.route('/confirm/email').post(confirmEmail)
router.route('/login').post(setSession)
router.route('/sign').get(loadCreate).post(createUser)



module.exports = router
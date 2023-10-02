const express = require('express')
const router = express.Router()

const { loadPage, setSession, loadCreate, confirmEmail, isEmailUsed, isUserNameUsed } = require('../controllers/join')
const { createUser } = require('../controllers/users')


router.route('/').get(loadPage)
router.route('/confirm/email').post(confirmEmail)
router.route('/confirm/email_used').post(isEmailUsed)
router.route('/confirm/username_used').post(isUserNameUsed)
router.route('/login').post(setSession)
router.route('/sign').get(loadCreate).post(createUser)

module.exports = router
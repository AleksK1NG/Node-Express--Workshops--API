const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middlewares/authMiddleware')

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/forgotpassword', authController.forgotPassword)
router.get('/me', auth.authMiddleware, authController.getCurrentUser)

module.exports = router

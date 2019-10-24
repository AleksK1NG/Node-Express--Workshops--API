const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const auth = require('../middlewares/authMiddleware')

router.post('/register', authController.registerUser)
router.post('/login', authController.loginUser)
router.post('/forgotpassword', authController.forgotPassword)
router.get('/me', auth.authMiddleware, authController.getCurrentUser)
router.get('/logout', authController.logout)
router.put('/updatedata', auth.authMiddleware, authController.updateUserData)
router.put('/updatepassword', auth.authMiddleware, authController.updatePassword)
router.put('/resetpassword/:resettoken', authController.resetPassword)

module.exports = router

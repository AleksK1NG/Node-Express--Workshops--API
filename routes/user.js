const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const auth = require('../middlewares/authMiddleware')
const reqResMiddleware = require('../middlewares/reqResMiddleware')
const User = require('../models/User')

// admin always auth middlewares
router.use(auth.authMiddleware)
router.use(auth.roleAuthMiddleware('admin'))

router
  .route('/')
  .get(reqResMiddleware(User), userController.getAllUsers)
  .post(userController.createUser)

router
  .route('/:id')
  .get(userController.getUserById)
  .put(userController.updateUser)
  .delete(userController.deleteUser)

module.exports = router

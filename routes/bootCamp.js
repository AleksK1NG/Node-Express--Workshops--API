const express = require('express')
const router = express.Router()

const reqResMiddleware = require('../middlewares/reqResMiddleware')
const auth = require('../middlewares/authMiddleware')
const BootCamp = require('../models/BootCamp')

const bootcampController = require('../controllers/bootCampController')
const workShopsRouter = require('./workShops')

// redirect requests to workShopController
router.use('/:bootcampId/workshops', workShopsRouter)

router
  .route('/')
  // .get(reqResMiddleware(BootCamp, 'workshops'), bootcampController.getAllBootCamps)
  .get(
    reqResMiddleware(BootCamp, {
      path: 'workshops',
      select: 'title'
    }),
    bootcampController.getAllBootCamps
  )
  .post(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), bootcampController.createBootCamp)

router
  .route('/:id')
  .put(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), bootcampController.updateBootCamp)
  .get(bootcampController.getBootCampById)
  .delete(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), bootcampController.deleteBootCamp)

router.route('/radius/:zipcode/:distance').get(bootcampController.getBootCampsByRadius)

router.route('/:id/photo').put(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), bootcampController.uploadBootCampPhoto)

module.exports = router

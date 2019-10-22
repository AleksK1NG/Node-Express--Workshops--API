const express = require('express')
const router = express.Router()

const reqResMiddleware = require('../middlewares/reqResMiddleware')
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
  .post(bootcampController.createBootCamp)

router
  .route('/:id')
  .put(bootcampController.updateBootCamp)
  .get(bootcampController.getBootCampById)
  .delete(bootcampController.deleteBootCamp)

router.route('/radius/:zipcode/:distance').get(bootcampController.getBootCampsByRadius)

router.route('/:id/photo').put(bootcampController.uploadBootCampPhoto)

module.exports = router

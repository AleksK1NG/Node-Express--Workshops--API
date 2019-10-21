const express = require('express')
const router = express.Router()

const bootcampController = require('../controllers/bootcampController')

router
  .route('/')
  .get(bootcampController.getAllBootCamps)
  .post(bootcampController.createBootCamp)

router
  .route('/:id')
  .put(bootcampController.updateBootCamp)
  .get(bootcampController.getBootCampById)
  .delete(bootcampController.deleteBootCamp)

module.exports = router

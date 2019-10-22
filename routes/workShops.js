const express = require('express')
const router = express.Router({ mergeParams: true })

const workShopController = require('../controllers/workShopController')

router
  .route('/')
  .get(workShopController.getWorkShops)
  .post(workShopController.createWorkShop)

router.route('/:id').get(workShopController.getWorkShopById)

module.exports = router

const express = require('express')
const router = express.Router({ mergeParams: true })

const reqResMiddleware = require('../middlewares/reqResMiddleware')
const Workshop = require('../models/Workshop')

const workShopController = require('../controllers/workShopController')

router
  .route('/')
  .get(
    reqResMiddleware(Workshop, {
      path: 'bootcamp',
      select: 'name description'
    }),
    workShopController.getWorkShops
  )
  .post(workShopController.createWorkShop)

router
  .route('/:id')
  .get(workShopController.getWorkShopById)
  .put(workShopController.updateWorkShop)
  .delete(workShopController.deleteWorkShop)

module.exports = router

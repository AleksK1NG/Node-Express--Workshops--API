const express = require('express')
const router = express.Router({ mergeParams: true })

const reqResMiddleware = require('../middlewares/reqResMiddleware')
const auth = require('../middlewares/authMiddleware')

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
  .post(auth.authMiddleware, workShopController.createWorkShop)

router
  .route('/:id')
  .get(workShopController.getWorkShopById)
  .put(auth.authMiddleware, workShopController.updateWorkShop)
  .delete(auth.authMiddleware, workShopController.deleteWorkShop)

module.exports = router


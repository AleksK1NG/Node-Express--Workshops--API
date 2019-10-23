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
  .post(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), workShopController.createWorkShop)

router
  .route('/:id')
  .get(workShopController.getWorkShopById)
  .put(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), workShopController.updateWorkShop)
  .delete(auth.authMiddleware, auth.roleAuthMiddleware('admin', 'publisher'), workShopController.deleteWorkShop)

module.exports = router

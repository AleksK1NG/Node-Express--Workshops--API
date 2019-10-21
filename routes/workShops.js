const express = require('express')
const router = express.Router()

const workShopController = require('../controllers/workShopController')

router
  .route('/')
  .get(workShopController.getWorkShops)

module.exports = router
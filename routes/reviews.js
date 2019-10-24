const express = require('express')
const Review = require('../models/Review')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const auth = require('../middlewares/authMiddleware')
const reqResMiddleware = require('../middlewares/reqResMiddleware')
const reviewsController = require('../controllers/reviewsController')

const router = express.Router({ mergeParams: true })

router
  .route('/')
  .get(
    reqResMiddleware(Review, {
      path: 'bootcamp',
      select: 'name description'
    }),
    reviewsController.getAllReviews
  )
  .post(auth.authMiddleware, auth.roleAuthMiddleware('user', 'admin'), reviewsController.createReview)

router
  .route('/:id')
  .get(reviewsController.getReviewById)
  .put(auth.authMiddleware, auth.roleAuthMiddleware('user', 'admin'), reviewsController.updateReview)

module.exports = router

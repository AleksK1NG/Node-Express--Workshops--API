const Review = require('../models/Review')
const BootCamp = require('../models/BootCamp')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorsResponse = require('../utils/errorsResponse')

// @GET Get all reviews | Public
// Route:  api/v1/reviews | /api/v1/bootcamps/:bootcampId/reviews
exports.getAllReviews = asyncMiddleware(async (req, res) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId })

    return res.status(200).json({ count: reviews.length, data: reviews })
  }

  res.status(200).json(res.results)
})

// @GET Get review by id | Public
// Route:  api/v1/reviews/:id
exports.getReviewById = asyncMiddleware(async (req, res, next) => {
  const review = await Review.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!review) return next(new ErrorsResponse(`Review with id ${req.params.id} not found `, 404))

  res.status(200).json(review)
})

// @POST Create review | Private
// Route: /api/v1/bootcamps/:bootcampId/reviews
exports.createReview = asyncMiddleware(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  // Check for exists BootCamp
  const bootCamp = await BootCamp.findById(req.params.bootcampId)
  if (!bootCamp) return next(new ErrorsResponse(`BootCamp with id ${req.params.id} not found `, 404))

  // Crate review
  const review = await Review.create(req.body)

  res.status(201).json(review)
})

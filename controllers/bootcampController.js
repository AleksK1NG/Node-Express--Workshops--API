const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const geocoder = require('../utils/geocoder')

// @GET /api/v1/bootcamps public
exports.getAllBootCamps = asyncMiddleware(async (req, res) => {
  let query

  // Make copy of query
  const reqQueryCopy = { ...req.query }

  // Fields to remove from query
  const removeFields = ['select', 'sort', 'page', 'limit']

  // Loop over removeFields and delete them from reqQueryCopy
  removeFields.forEach((param) => delete reqQueryCopy[param])

  // Create query string
  let queryString = JSON.stringify(reqQueryCopy)

  // Create operators ($gt, $gte, etc)
  queryString = queryString.replace(/\b(gt|gte|lt|lte|in)\b/g, (match) => `$${match}`)

  query = Bootcamp.find(JSON.parse(queryString))

  // Add select BootCamp.find().select()
  if (req.query.select) {
    const selectParams = req.query.select.split(',').join(' ')
    query = query.select(selectParams)
  }

  // Add sort BootCamp.find().sort()
  if (req.query.sort) {
    const sortParams = req.query.sort.split(',').join(' ')
    query = query.sort(sortParams)
  } else {
    query = query.sort('-createdAt')
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Bootcamp.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // make db request
  const bootCamps = await query

  // Pagination result for response data only
  const pagination = {}

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    }
  }

  res.status(200).json({ count: bootCamps.length, pagination, data: bootCamps })
})

// @GET /api/v1/bootcamps/:id public
exports.getBootCampById = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findById(req.params.id)

  if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

  res.status(200).json(bootCamp)
})

// @POST /api/v1/bootcamps Private
exports.createBootCamp = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.create(req.body)

  res.status(201).json(bootCamp)
})

// @PUT /api/v1/bootcamps/:id Private
exports.updateBootCamp = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

  res.status(200).json(bootCamp)
})

// @DELETE /api/v1/bootcamps/:id Private
exports.deleteBootCamp = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id)

  if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

  res.status(200).json(bootCamp)
})

// @GET Get BootCamps with radius params, /api/v1/bootcamps/:zipcode/:distance
exports.getBootCampsByRadius = asyncMiddleware(async (req, res) => {
  const { zipcode, distance } = req.params

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude
  const lng = loc[0].longitude

  // Calc radius using radians
  // Divide dist by radius of Earth
  // Earth Radius = 3,963 mi / 6,378 km
  const radius = distance / 3963

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
  })

  res.status(200).json({
    count: bootcamps.length,
    data: bootcamps
  })
})

const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')

// @GET /api/v1/bootcamps public
exports.getAllBootCamps = asyncMiddleware(async (req, res, next) => {
  const bootCamps = await Bootcamp.find()

  res.status(200).json({ count: bootCamps.length, data: bootCamps })
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

// 6 add mongoose middlewares
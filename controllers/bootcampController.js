const Bootcamp = require('../models/Bootcamp')
const ErrorResponse = require('../utils/errorsResponse')

// @GET /api/v1/bootcamps public
exports.getAllBootCamps = async (req, res, next) => {
  try {
    const bootCamps = await Bootcamp.find()

    res.status(200).json({ count: bootCamps.length, data: bootCamps })
  } catch (error) {
    console.error(error)
    next(error)
  }
}

// @GET /api/v1/bootcamps/:id public
exports.getBootCampById = async (req, res, next) => {
  try {
    const bootCamp = await Bootcamp.findById(req.params.id)

    if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

// @POST /api/v1/bootcamps Private
exports.createBootCamp = async (req, res, next) => {
  try {
    const bootCamp = await Bootcamp.create(req.body)

    res.status(201).json(bootCamp)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

// @PUT /api/v1/bootcamps/:id Private
exports.updateBootCamp = async (req, res, next) => {
  try {
    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

// @DELETE /api/v1/bootcamps/:id Private
exports.deleteBootCamp = async (req, res, next) => {
  try {
    const bootCamp = await Bootcamp.findByIdAndDelete(req.params.id)

    if (!bootCamp) return next(new ErrorResponse(`BootCamp with id ${req.params.id} not found `, 400))

    res.status(200).json(bootCamp)
  } catch (error) {
    console.error(error)
    next(error)
  }
}

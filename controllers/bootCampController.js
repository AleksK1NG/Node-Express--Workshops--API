const Bootcamp = require('../models/BootCamp')
const ErrorsResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const geocoder = require('../utils/geocoder')
const path = require('path')

// @GET Get all bootCamps | Public
// api/v1/bootcamps
exports.getAllBootCamps = asyncMiddleware(async (req, res) => {
  // res.results comes from reqResMiddleware
  res.status(200).json(res.results)
})

// @GET Get bootCamp by id | Public
// /api/v1/bootcamps/:id
exports.getBootCampById = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findById(req.params.id)

  if (!bootCamp) return next(new ErrorsResponse(`BootCamp with id ${req.params.id} not found `, 404))

  res.status(200).json({ data: bootCamp })
})

// @POST Create bootcamp | Private
// /api/v1/bootcamps
exports.createBootCamp = asyncMiddleware(async (req, res, next) => {
  // Add user to request body
  req.body.user = req.user.id

  // Check for already published bootCamp
  const createdBootCamp = await Bootcamp.findOne({ user: req.user.id })

  if (createdBootCamp && req.user.role !== 'admin')
    return next(new ErrorsResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400))

  // Create new bootCamp
  const bootCamp = await Bootcamp.create(req.body)

  res.status(201).json({ data: bootCamp })
})

// @PUT Update bootcamp | Private
// /api/v1/bootcamps/:id
exports.updateBootCamp = asyncMiddleware(async (req, res, next) => {
  let bootCamp = await Bootcamp.findById(req.params.id)

  // Check bootCam is exists
  if (!bootCamp) return next(new ErrorsResponse(`BootCamp with id ${req.params.id} not found `, 404))

  // Check user is owner
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorsResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))

  // Update bootCamp
  bootCamp = await Bootcamp.findOneAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  res.status(200).json({ data: bootCamp })
})

// @DELETE Delete bootcamp | Private
// /api/v1/bootcamps/:id
exports.deleteBootCamp = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findById(req.params.id)

  if (!bootCamp) return next(new ErrorsResponse(`BootCamp with id ${req.params.id} not found `, 404))

  // Check user is owner
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorsResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))

  await bootCamp.remove()
  res.status(200).json({ data: bootCamp })
})

// @GET Get BootCamps with radius params | Public
// Route: /api/v1/bootcamps/:zipcode/:distance
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

// @PUT Upload photo | Public
// Route: /api/v1/bootcamps/:bootcampId/photo
exports.uploadBootCampPhoto = asyncMiddleware(async (req, res, next) => {
  const bootCamp = await Bootcamp.findById(req.params.id)

  if (!bootCamp) return next(new ErrorsResponse(`BootCamp with id ${req.params.id} not found `, 404))
  if (!req.files) return next(new ErrorsResponse(`Please upload some file`, 400))

  const file = req.files.file

  // Validate file type is image
  if (!file.mimetype.startsWith('image')) return next(new ErrorResponse(`Please upload image file`, 400))

  // Check file size
  if (file.size > process.env.MAX_FILE_UPLOAD)
    return next(new ErrorsResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`, 400))

  // Create custom file name for prevent names collisions, path.parse().ext for get *.extension name
  file.name = `photo_${bootCamp._id}${path.parse(file.name).ext}`

  // Move file and upload to DB
  file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async (error) => {
    if (error) {
      console.error(error)
      return next(new ErrorsResponse(`Problem with file upload`, 500))
    }

    const bootCamp = await Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name }, { new: true })

    res.status(200).json({
      file: file.name,
      data: bootCamp
    })
  })
})

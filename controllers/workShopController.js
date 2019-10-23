const Workshop = require('../models/Workshop')
const BootCamp = require('../models/BootCamp')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorsResponse = require('../utils/errorsResponse')

// @ GET Get All WorkShops | Public
// Route: /api/v1/bootcamps/:bootcampId/workshops
exports.getWorkShops = asyncMiddleware(async (req, res, next) => {
  if (req.params.bootcampId) {
    const workShops = await Workshop.find({ bootcamp: req.params.bootcampId }).populate('bootcamp')
    return res.status(200).json({ count: workShops.length, data: workShops })
  }
  res.status(200).json(res.results)
})

// @ GET Get WorkShop by Id | Public
// Route: /api/v1/workshops/:id
exports.getWorkShopById = asyncMiddleware(async (req, res, next) => {
  const workShop = await Workshop.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  return res.status(200).json({ data: workShop })
})

// @ POST Create WorkShop | Private
// Route: /api/v1/workshops
exports.createWorkShop = asyncMiddleware(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId
  req.body.user = req.user.id

  // Check bootCamp exists
  const bootCamp = await BootCamp.findById(req.params.bootcampId)

  if (!bootCamp) return next(new ErrorsResponse(`Bad request, wrong bootCamp id ${req.params.bootcampId}`, 404))

  // Check user is owner
  if (bootCamp.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401))

  // Create workShop
  const workShop = await Workshop.create(req.body)

  res.status(201).json(workShop)
})

// @ PUT Update WorkShop | Private
// Route: /api/v1/workshops/:id
exports.updateWorkShop = asyncMiddleware(async (req, res, next) => {
  let workShop = await Workshop.findById(req.params.id)

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  // Check user is owner
  if (workShop.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorsResponse(`User ${req.params.id} is not authorized to update this workshop`, 401))

  workShop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  res.status(200).json(workShop)
})

// @ DELETE Delete WorkShop | Private
// Route: /api/v1/workshops/:id
exports.deleteWorkShop = asyncMiddleware(async (req, res, next) => {
  const workShop = await Workshop.findById(req.params.id)

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  // Check user is owner
  if (workShop.user.toString() !== req.user.id && req.user.role !== 'admin')
    return next(new ErrorsResponse(`User ${req.params.id} is not authorized to delete this workshop`, 401))

  const deletedWorkShop = await workShop.remove()

  res.status(200).json(deletedWorkShop)
})

const Workshop = require('../models/Workshop')
const BootCamp = require('../models/BootCamp')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorsResponse = require('../utils/errorsResponse')

// @ GET Get All WorkShops
// Route: /api/v1/bootcamps && /api/v1/bootcamps/:bootcampId/workshops
exports.getWorkShops = asyncMiddleware(async (req, res, next) => {
  if (req.params.bootcampId) {
    const workShops = await Workshop.find({ bootcamp: req.params.bootcampId }).populate('bootcamp')
    return res.status(200).json({ count: workShops.length, data: workShops })
  }
  res.status(200).json(res.results)
})

// @ GET Get WorkShop by Id
// Route: /api/v1/workshops
exports.getWorkShopById = asyncMiddleware(async (req, res, next) => {
  const workShop = await Workshop.findById(req.params.id).populate({
    path: 'bootcamp',
    select: 'name description'
  })

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  return res.status(200).json({ data: workShop })
})

// @ POST Create WorkShop by Id Private
// Route: /api/v1/workshops && /api/v1/bootcamps/:bootcampId/workshops
exports.createWorkShop = asyncMiddleware(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId

  const bootCamp = await BootCamp.findById(req.params.bootcampId)

  if (!bootCamp) return next(new ErrorsResponse(`Bad request, wrong bootCamp id ${req.params.bootcampId}`, 404))

  const workShop = await Workshop.create(req.body)

  res.status(201).json(workShop)
})

// @ PUT Update WorkShop by Id Private
// Route: /api/v1/workshops/:id
exports.updateWorkShop = asyncMiddleware(async (req, res, next) => {
  let workShop = await Workshop.findById(req.params.id)

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  workShop = await Workshop.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  res.status(200).json(workShop)
})

// @ DELETE Delete WorkShop by Id Private
// Route: /api/v1/workshops/:id
exports.deleteWorkShop = asyncMiddleware(async (req, res, next) => {
  const workShop = await Workshop.findById(req.params.id)

  if (!workShop) return next(new ErrorsResponse(`Bad request, wrong workShop id ${req.params.id}`, 404))

  data = await workShop.remove()
  console.log(data)
  res.status(200).json(data)
})

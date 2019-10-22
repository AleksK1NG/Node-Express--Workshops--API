const Workshop = require('../models/Workshop')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorsResponse = require('../utils/errorsResponse')

// @ GET Get All WorkShops
// Route: /api/v1/bootcamps && /api/v1/bootcamps/:bootcampId/workshops
exports.getWorkShops = asyncMiddleware(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Workshop.find({ bootcamp: req.params.bootcampId }).populate('bootcamp')
  } else {
    query = Workshop.find().populate({
      path: 'bootcamp',
      select: 'name description'
    })
  }
  const workShops = await query

  return res.status(200).json({ count: workShops.length, data: workShops })
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


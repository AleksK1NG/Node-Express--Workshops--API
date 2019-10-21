const Workshop = require('../models/Workshop')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorsResponse = require('../utils/errorsResponse')

// @ GET Get All WorkShops
// Route: /api/v1/bootcamps && /api/v1/bootcamps/:bootcampId/workshops
exports.getWorkShops = asyncMiddleware(async (req, res, next) => {
  let query

  if (req.params.bootcampId) {
    query = Workshop.find({ bootcamp: req.params.bootcampId })
  } else {
    query = Workshop.find()
  }

  const workShops = await query

  return res.status(200).json({ count: workShops.length, data: workShops })
})

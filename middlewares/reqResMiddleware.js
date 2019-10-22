const reqResMiddleware = (model, populate) => async (req, res, next) => {
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

  query = model.find(JSON.parse(queryString))

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
  const total = await model.countDocuments()

  query = query.skip(startIndex).limit(limit)

  // Add populate to query
  if (populate) {
    query = query.populate(populate)
  }

  // Exec db request
  const results = await query

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

  res.results = {
    count: results.length,
    pagination,
    data: results
  }

  next()
}

module.exports = reqResMiddleware

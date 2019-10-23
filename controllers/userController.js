const User = require('../models/User')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')

// @GET Get all users | Private, admin route
// Route: /api/v1/users
exports.getAllUsers = asyncMiddleware(async (req, res, next) => {
  // get results from reqResMiddleware
  res.status(200).json(res.results)
})

// @GET Get user by id  | Private, admin route
// Route: /api/v1/users/:id
exports.getUserById = asyncMiddleware(async (req, res, next) => {
  const user = await User.findById(req.params.id)

  if (!user) return next(new ErrorResponse('Invalid credentials', 401))

  res.status(200).json(user)
})

// @POST Create user  | Private, admin route
// Route: /api/v1/users
exports.createUser = asyncMiddleware(async (req, res, next) => {
  const user = await User.create(req.body)

  if (!user) return next(new ErrorResponse('Invalid credentials', 400))

  res.status(201).json(user)
})

// @PUT Update user | Private, admin route
// Route: /api/v1/users/:id
exports.updateUser = asyncMiddleware(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

  if (!user) return next(new ErrorResponse('Invalid credentials', 400))

  res.status(200).json(user)
})

// @DELETE Delete user | Private, admin route
// Route: /api/v1/users/:id
exports.deleteUser = asyncMiddleware(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id)

  res.status(200).json({ message: 'User deleted' })
})

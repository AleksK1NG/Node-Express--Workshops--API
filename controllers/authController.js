const User = require('../models/User')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const tokenResponse = require('../utils/tokenResponse')

// @POST Register user
// Route: /api/v1/auth/register
exports.registerUser = asyncMiddleware(async (req, res, next) => {
  const { email, password, role, name } = req.body

  const checkUser = await User.findOne({ email })

  if (checkUser) return next(new ErrorResponse('Invalid credentials', 401))

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role
  })

  tokenResponse(user, 200, res)
})

// @POST Login user
// Route: /api/v1/auth/register
exports.loginUser = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body

  // Validate email and password
  if (!email || !password) return next(new ErrorResponse('Invalid email or password', 400))

  // Check for usex exists
  const user = await User.findOne({ email }).select('+password')

  if (!user) return next(new ErrorResponse('Invalid credentials', 401))

  // Compare passwords
  const isMatch = await user.matchPassword(password)
  if (!isMatch) return next(new ErrorResponse('Invalid email or password', 400))

  tokenResponse(user, 200, res)
})

// @GET Get current logged in user
// Route: /api/v1/auth/register
exports.getCurrentUser = asyncMiddleware(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse('Invalid credentials', 401))
  res.status(200).json(req.user)
})

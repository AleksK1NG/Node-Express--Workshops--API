const JWT = require('jsonwebtoken')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const ErrorResponse = require('../utils/errorsResponse')
const User = require('../models/User')

// Auth protect middleware
exports.authMiddleware = asyncMiddleware(async (req, res, next) => {
  let token

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]
  } else if (!req.headers.authorization && req.cookies.token) {
    token = req.cookies.token
  }

  // Make sure token exists
  if (!token) return next(new ErrorResponse('Not authorized', 401))

  try {
    // Verify token
    const decodedToken = JWT.verify(token, process.env.JWT_SECRET)

    // Find user by id decoded from token
    req.user = await User.findById(decodedToken.id)

    next()
  } catch (error) {
    console.error(error)
    next(new ErrorResponse('Not authorized', 401))
  }
})

// Role authentication
exports.roleAuthMiddleware = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role))
    return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403))
  next()
}

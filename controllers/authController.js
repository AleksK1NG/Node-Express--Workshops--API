const User = require('../models/User')
const ErrorResponse = require('../utils/errorsResponse')
const asyncMiddleware = require('../middlewares/asyncMiddleware')
const tokenResponse = require('../utils/tokenResponse')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')

// @POST Register user | Public
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

// @POST Login user | Public
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

// @GET Get current logged in user | Private
// Route: /api/v1/auth/me
exports.getCurrentUser = asyncMiddleware(async (req, res, next) => {
  if (!req.user) return next(new ErrorResponse('Invalid credentials', 401))
  res.status(200).json(req.user)
})

// @POST Forgot Password | Public
// Route: /api/v1/auth/forgotpassword
exports.forgotPassword = asyncMiddleware(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email })

  // Check exists
  if (!user) return next(new ErrorResponse('Invalid email', 404))

  // Get reset token
  const resetToken = user.getResetPasswordToken()

  await user.save({ validateBeforeSave: false })

  // Create reset url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/auth/resetpassword/${resetToken}`

  // Create message
  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`

  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset token',
      message
    })

    res.status(200).json({ success: true, data: 'Email sent' })
  } catch (error) {
    console.error(error)
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save({ validateBeforeSave: false })

    return next(new ErrorResponse('Email could not be sent', 500))
  }

  res.status(200).json({ message: 'Success', data: user })
})

// @PUT Reset password | Public
// Route: /api/v1/auth/resetpassword/:resettoken
exports.resetPassword = asyncMiddleware(async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex')

  // Find user by resetPasswordToken and not expired
  const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })

  if (!user) return next(new ErrorResponse('Invalid token', 400))

  // Set new password
  user.password = req.body.password
  user.resetPasswordToken = undefined
  user.resetPasswordExpire = undefined

  // Save user
  await user.save()

  tokenResponse(user, 200, res)
})

// @PUT Update user | Private
// Route: /api/v1/auth/updatedata
exports.updateUserData = asyncMiddleware(async (req, res, next) => {
  const fieldsToUpdate = {
    email: req.body.email,
    name: req.body.name
  }

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  })

  if (!user) return next(new ErrorResponse('Invalid credentials', 401))

  res.status(200).json(user)
})

// @PUT Update Password | Private
// Route: /api/v1/auth/updatepassword
exports.updatePassword = asyncMiddleware(async (req, res, next) => {
  // Get user with password
  const user = await User.findById(req.user.id).select('+password')

  if (!user) return next(new ErrorResponse('Invalid credentials', 401))

  // Check match password
  const isMatch = await user.matchPassword(req.body.currentPassword)
  if (!isMatch) return next(new ErrorResponse('Invalid password', 401))

  // set user new password
  user.password = req.body.newPassword
  await user.save()

  // response with new user and token
  tokenResponse(user, 200, res)
})

// @GET Logout | Private
// Route: /api/v1/auth/logout
exports.logout = asyncMiddleware(async (req, res, next) => {
  res.cookie('token', 'none', { expires: new Date(Date.now() + 10 * 1000), httpOnly: true })

  res.status(200).json({ message: 'You are logged out', data: {} })
})

const tokenResponse = (user, statusCode, res) => {
  // Create token
  const token = user.getSignedJwtToken()

  // options for cookie
  const options = {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000),
    httpOnly: true
  }

  // secure cookie for production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true
  }

  // Response
  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({
      token,
      data: user
    })
}

module.exports = tokenResponse

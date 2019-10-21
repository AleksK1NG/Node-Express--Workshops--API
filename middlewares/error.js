const ErrorResponse = require('../utils/errorsResponse')

const errorMiddleware = (err, req, res, next) => {
  let error = { ...err }

  error.message = err.message

  // Log to console for dev
  console.log('Error middleware error ', err)

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found`
    error = new ErrorResponse(message, 404)
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const message = 'Duplicate field value entered'
    error = new ErrorResponse(message, 400)
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message)
    error = new ErrorResponse(message, 400)
  }

  res.status(error.statusCode || 500).json({
    error: error.message || 'Server Error'
  })
}

module.exports = errorMiddleware

// http://www.acuriousanimal.com/2018/02/15/express-async-middleware.html

const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')
const xss = require('xss-clean')
const rateLimit = require('express-rate-limit')
const hpp = require('hpp')
const cors = require('cors')
const morgan = require('morgan')
const colors = require('colors')
const errorMiddleware = require('./middlewares/error')
const fileupload = require('express-fileupload')
const connectDB = require('./db/db')

// Load .env files
dotenv.config({ path: './config/config.env' })

// Connect DB
connectDB()

// Routes
const bootcampRoutes = require('./routes/bootCamp')
const workShopsRoutes = require('./routes/workShops')
const authRoutes = require('./routes/auth')

// Init Express
const app = express()

// Body parser
app.use(express.json())

// Cookie parser
app.use(cookieParser())

// File uploading
app.use(fileupload())

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

// Sanitize data
app.use(mongoSanitize())

// Set security headers
app.use(helmet())

// Prevent XSS attacks
app.use(xss())

// Rate limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 mins
  max: 100
})
app.use(limiter)

// Prevent http param pollution
app.use(hpp())

// Enable CORS
app.use(cors())

// Set static folder
app.use(express.static(path.join(__dirname, 'public')))

// User Routes
app.use('/api/v1/bootcamps', bootcampRoutes)
app.use('/api/v1/workshops', workShopsRoutes)
app.use('/api/v1/auth', authRoutes)

// Error middleware
app.use(errorMiddleware)

const PORT = process.env.PORT || 5000
// Run Server
const server = app.listen(PORT, () =>
  console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
)

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`.red)
  // Close server & exit process
  server.close(() => process.exit(1))
})

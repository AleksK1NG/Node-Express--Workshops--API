const dotenv = require('dotenv')
const express = require('express')

// Load .env files
dotenv.config({ path: './config/config.env' })

// Init Express
const app = express()

const PORT = process.env.PORT || 5000
// Run Server
app.listen(PORT, () => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`))

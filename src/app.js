const express = require('express')
const boom = require('http-errors')
const logger = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const databaseLoader = require('./loaders/database')
const movieRouter = require('./routes/movieRouter')

const app = express()

databaseLoader()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(cors())
app.use(movieRouter)

// if no route matches
app.use((req, res, next) => {
  next(new boom.NotFound('route not found'))
})

// catch ALL errors here
app.use((err, req, res, next) => {
  const isProduction = app.get('env') === 'production'
  if (isProduction) err = {}
  console.error(err)
  res.status(err.status || 500).json({
    message: isProduction ? 'internal server error' : err.message
  })
})

module.exports = app

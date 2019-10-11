const movieRouter = require('express').Router()
const jwt = require('express-jwt')
const jwks = require('jwks-rsa')
const movieController = require('../controllers/movieController')

const catchErrors = require('../catchErrors')

const jwtCheck = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: 'https://dev-4tdiw17w.auth0.com/.well-known/jwks.json'
  }),
  audience: 'https://movies-api.com',
  issuer: 'https://dev-4tdiw17w.auth0.com/',
  algorithms: ['RS256']
})

movieRouter.get('/movies', catchErrors(movieController.getMovies))
movieRouter.get('/movies/:id', catchErrors(movieController.getMovieById))
movieRouter.delete(
  '/movies/:id',
  jwtCheck,
  catchErrors(movieController.deleteMovieById)
)
movieRouter.put(
  '/movies/:id',
  jwtCheck,
  catchErrors(movieController.editMovieById)
)
movieRouter.get(
  '/movies/:id/countries',
  catchErrors(movieController.getCountriesByMovieId)
)
movieRouter.get(
  '/movies/:id/writers',
  catchErrors(movieController.getWritersByMovieId)
)

module.exports = movieRouter

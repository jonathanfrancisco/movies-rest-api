const movieRouter = require('express').Router()

const movieController = require('../controllers/movieController')
const catchErrors = require('../catchErrors')

movieRouter.get('/movies', catchErrors(movieController.getMovies))
movieRouter.get('/movies/:id', catchErrors(movieController.getMovieById))
movieRouter.delete('/movies/:id', catchErrors(movieController.deleteMovieById))
movieRouter.get(
  '/movies/:id/countries',
  catchErrors(movieController.getCountriesByMovieId)
)
movieRouter.get(
  '/movies/:id/writers',
  catchErrors(movieController.getWritersByMovieId)
)

module.exports = movieRouter

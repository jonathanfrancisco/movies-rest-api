const Joi = require('@hapi/joi')
const movieService = require('../services/movieService')

const movieController = {}

movieController.getMovies = async (req, res) => {
  const { searchBy, searchValue, page, limit } = req.query
  return res
    .status(200)
    .json(await movieService.getMovies(searchBy, searchValue, page, limit))
}

movieController.getTopTenMovies = async (req, res) => {
  return res.status(200).json(await movieService.getTopTenMovies())
}

movieController.getRandomMovies = async (req, res) => {
  return res.status(200).json(await movieService.getRandomMovies())
}

movieController.getMovieById = async (req, res) => {
  const { id } = req.params
  return res.status(200).json(await movieService.getMovieById(id))
}

movieController.deleteMovieById = async (req, res) => {
  const { id } = req.params
  return res.status(204).json(await movieService.deleteMovieById(id))
}

movieController.editMovieById = async (req, res) => {
  const { id } = req.params
  const update = {
    poster: req.body.poster,
    title: req.body.title,
    year: req.body.year,
    actors: req.body.actors,
    plot: req.body.plot,
    rated: req.body.rated,
    director: req.body.director,
    writers: req.body.writers
  }
  return res.status(200).json(await movieService.editMovieById(id, update))
}

movieController.getCountriesByMovieId = async (req, res) => {
  const { id } = req.params
  return res.status(200).json(await movieService.getCountriesByMovieId(id))
}

movieController.getWritersByMovieId = async (req, res) => {
  const { id } = req.params
  return res.status(200).json(await movieService.getWritersByMovieId(id))
}

module.exports = movieController

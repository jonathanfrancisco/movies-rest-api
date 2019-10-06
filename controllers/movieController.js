const movieService = require('../services/movieService')

const movieController = {}

movieController.getMovies = async (req, res) => {
  return res.status(200).json(await movieService.getMovies())
}

movieController.getMovieById = async (req, res) => {
  const { id } = req.params
  return res.status(200).json(await movieService.getMovieById(id))
}

movieController.deleteMovieById = async (req, res) => {
  const { id } = req.params
  return res.status(204).json(await movieService.deleteMovieById(id))
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

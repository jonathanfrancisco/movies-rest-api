const boom = require('http-errors')
const movieRepository = require('../repositories/movieRepository')

const movieService = {}

movieService.getMovies = async (searchBy, searchValue) => {
  let movies = []
  if (
    (searchBy && searchValue === undefined) ||
    (searchBy === undefined && searchValue)
  )
    throw boom.BadRequest()
  else if (searchBy === 'title')
    movies = await movieRepository.findAllMoviesContainsTitle(searchValue)
  else if (searchBy === 'plot')
    movies = await movieRepository.findAllMoviesContainsPlot(searchValue)
  else if (searchBy === 'actor')
    movies = await movieRepository.findAllMoviesContainsActor(searchValue)
  else if (searchBy === 'all') {
    const [byTitle, byPlot, byActor] = await Promise.all([
      movieRepository.findAllMoviesContainsTitle(searchValue),
      movieRepository.findAllMoviesContainsPlot(searchValue),
      movieRepository.findAllMoviesContainsActor(searchValue)
    ])
    movies = [...byTitle, ...byPlot, ...byActor]
  } else movies = await movieRepository.findAllMovies()

  const moviesDTO = {
    movies: movies.map(movie => ({
      id: movie._id,
      poster: movie.poster,
      title: movie.title,
      year: movie.year,
      genre: movie.genre
    }))
  }
  return moviesDTO
}

movieService.getMovieById = async id => {
  const movie = await movieRepository.findMovieById(id)
  if (!movie) throw boom.NotFound()
  const movieDTO = {
    id: movie._id,
    poster: movie.poster,
    title: movie.title,
    year: movie.year,
    actors: movie.actors,
    plot: movie.plot,
    rated: movie.rated,
    genre: movie.genre,
    director: movie.director,
    writers: movie.writers
  }
  return movieDTO
}

movieService.deleteMovieById = async id => {
  const movieToDelete = await movieRepository.findMovieById(id)
  if (!movieToDelete) throw boom.NotFound()
  await movieRepository.removeMovieById(id)
  return {}
}

movieService.getCountriesByMovieId = async id => {
  const movie = await movieRepository.findMovieById(id)
  if (!movie) throw boom.NotFound()
  const countriesByMovieDTO = {
    countries: movie.countries
  }
  return countriesByMovieDTO
}

movieService.getWritersByMovieId = async id => {
  const movie = await movieRepository.findMovieById(id)
  if (!movie) throw boom.NotFound()
  const writersByMovieDTO = {
    writers: movie.writers
  }
  return writersByMovieDTO
}

module.exports = movieService

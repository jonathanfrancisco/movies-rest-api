const boom = require('http-errors')
const movieRepository = require('../repositories/movieRepository')

const movieService = {}

movieService.getMovies = async (
  searchBy,
  searchValue,
  page = 1,
  limit = 15
) => {
  const intPage = parseInt(page, 10)
  const intLimit = parseInt(limit, 10)
  const offset = (intPage - 1) * intLimit
  let movies = []
  if (
    (searchBy && searchValue === undefined) ||
    (searchBy === undefined && searchValue)
  )
    throw boom.BadRequest()
  else if (searchBy === 'title')
    movies = await movieRepository.findAllMoviesContainsTitle(
      searchValue,
      offset,
      intLimit
    )
  else if (searchBy === 'plot')
    movies = await movieRepository.findAllMoviesContainsPlot(
      searchValue,
      offset,
      intLimit
    )
  else if (searchBy === 'actor')
    movies = await movieRepository.findAllMoviesContainsActor(
      searchValue,
      offset,
      intLimit
    )
  else if (searchBy === 'all') {
    const [byTitle, byPlot, byActor] = await Promise.all([
      movieRepository.findAllMoviesContainsTitle(searchValue, offset, intLimit),
      movieRepository.findAllMoviesContainsPlot(searchValue, offset, intLimit),
      movieRepository.findAllMoviesContainsActor(searchValue, offset, intLimit)
    ])
    movies = [...byTitle, ...byPlot, ...byActor]
  } else movies = await movieRepository.findAllMovies(offset, intLimit)
  const moviesDTO = {
    movies: movies.map(movie => ({
      id: movie._id,
      poster:
        movie.poster === null ? null : movie.poster.replace(/^http/, 'https'),
      title: movie.title,
      year: movie.year,
      genre: movie.genre
    })),
    currentPage: intPage,
    size: movies.length
  }

  return moviesDTO
}

movieService.getMovieById = async id => {
  const movie = await movieRepository.findMovieById(id)
  if (!movie) throw boom.NotFound()
  const movieDTO = {
    movie: {
      id: movie._id,
      poster:
        movie.poster === null ? null : movie.poster.replace(/^http/, 'https'),
      title: movie.title,
      year: movie.year,
      actors: movie.actors,
      plot: movie.plot,
      rated: movie.rated,
      genre: movie.genre,
      director: movie.director,
      writers: movie.writers
    }
  }
  return movieDTO
}

movieService.deleteMovieById = async id => {
  const movieToDelete = await movieRepository.findMovieById(id)
  if (!movieToDelete) throw boom.NotFound()
  await movieRepository.removeMovieById(id)
  return {}
}

movieService.editMovieById = async (id, update) => {
  const movieToUpdate = await movieRepository.findMovieById(id)
  if (!movieToUpdate) throw boom.NotFound()

  const updatedMovie = await movieRepository.updateMovieById(id, {
    ...movieToUpdate,
    ...update
  })
  const updatedMovieDTO = {
    movie: {
      poster:
        updatedMovie.poster === null
          ? null
          : updatedMovie.poster.replace(/^http/, 'https'),
      title: updatedMovie.title,
      year: updatedMovie.year,
      actors: updatedMovie.actors,
      plot: updatedMovie.plot,
      rated: updatedMovie.rated,
      genre: updatedMovie.genre,
      director: updatedMovie.director,
      writers: updatedMovie.writers
    },
    update: true
  }

  return updatedMovieDTO
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

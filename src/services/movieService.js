const boom = require('http-errors')
const movieRepository = require('../repositories/movieRepository')

const movieService = {}

movieService.getMovies = async (
  searchBy,
  searchValue,
  page = 1,
  limit = 15
) => {
  const FILTER_BY_ENUM = ['title', 'plot', 'actors', 'genres', 'countries']
  const intPage = parseInt(page, 10)
  const intLimit = parseInt(limit, 10)
  const offset = (intPage - 1) * intLimit
  let totalPages = 0
  let totalSize = 0
  let movies = []

  if (
    (searchBy && searchValue === undefined) ||
    (searchBy === undefined && searchValue)
  )
    throw boom.BadRequest()
  else if (FILTER_BY_ENUM.includes(searchBy)) {
    const [moviesResult, moviesTotalCount] = await Promise.all([
      movieRepository.findAllMoviesByProperty(
        searchBy,
        searchValue,
        offset,
        intLimit
      ),
      movieRepository.getAllMoviesTotalCountByProperty(searchBy, searchValue)
    ])
    movies = moviesResult
    totalPages = Math.ceil(moviesTotalCount / intLimit)
    totalSize = moviesTotalCount
  } else if (searchBy === 'all') {
    const [moviesResult, moviesTotalCount] = await Promise.all([
      movieRepository.findAllMoviesBySetOfProperties(
        FILTER_BY_ENUM,
        searchValue,
        offset,
        intLimit
      ),
      movieRepository.getAllMoviesCountBySetOfProperties(
        FILTER_BY_ENUM,
        searchValue
      )
    ])
    movies = moviesResult
    totalPages = Math.ceil(moviesTotalCount / intLimit)
    totalSize = moviesTotalCount
  } else {
    const [moviesResult, moviesTotalCount] = await Promise.all([
      movieRepository.findAllMovies(offset, intLimit),
      movieRepository.getAllMoviesTotalCount()
    ])
    movies = moviesResult
    totalPages = Math.ceil(moviesTotalCount / intLimit)
    totalSize = moviesTotalCount
  }

  const moviesDTO = {
    movies: movies.map(movie => ({
      id: movie._id,
      poster: movie.poster ? movie.poster : null,
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      genres: movie.genres,
      rated: movie.rated,
      imdb: movie.imdb
    })),
    currentPage: intPage,
    size: movies.length,
    totalPages,
    totalSize
  }
  return moviesDTO
}

movieService.getMovieById = async id => {
  const movie = await movieRepository.findMovieById(id)
  if (!movie) throw boom.NotFound()
  const movieDTO = {
    movie: {
      id: movie._id,
      poster: movie.poster ? movie.poster : null,
      title: movie.title,
      year: movie.year,
      actors: movie.actors,
      plot: movie.plot,
      genres: movie.genres,
      director: movie.director,
      writers: movie.writers,
      rated: movie.rated,
      imdb: movie.imdb
    }
  }
  return movieDTO
}

movieService.getTopTenMovies = async () => {
  const movies = await movieRepository.findTopTenMovies()
  const moviesDTO = {
    movies: movies.map(movie => ({
      id: movie._id,
      poster: movie.poster ? movie.poster : null,
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      genres: movie.genres,
      rated: movie.rated,
      imdb: movie.imdb
    }))
  }
  return moviesDTO
}

movieService.getRandomMovies = async () => {
  const movies = await movieRepository.findRandomMovies()
  const moviesDTO = {
    movies: movies.map(movie => ({
      id: movie._id,
      poster: movie.poster ? movie.poster : null,
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      genres: movie.genres,
      rated: movie.rated,
      imdb: movie.imdb
    }))
  }
  return moviesDTO
}

movieService.deleteMovieById = async id => {
  const movieToDelete = await movieRepository.findMovieById(id)
  if (!movieToDelete) throw boom.NotFound()
  await movieRepository.removeMovieById(id)
  return {}
}

movieService.patchMovieById = async (id, patch) => {
  const movieToPatch = await movieRepository.findMovieById(id)
  if (!movieToPatch) throw boom.NotFound()

  const patchedMovie = await movieRepository.patchMovieById(id, patch)
  const patchedMovieDTO = {
    movie: {
      poster: patchedMovie.poster ? patchedMovie.poster : null,
      title: patchedMovie.title,
      year: patchedMovie.year,
      actors: patchedMovie.actors,
      plot: patchedMovie.plot,
      genres: patchedMovie.genres,
      director: patchedMovie.director,
      writers: patchedMovie.writers,
      rated: patchedMovie.rated,
      imdb: patchedMovie.imdb
    },
    update: true
  }

  return patchedMovieDTO
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

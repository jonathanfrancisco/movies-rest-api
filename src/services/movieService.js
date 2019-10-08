const boom = require('http-errors')
const movieRepository = require('../repositories/movieRepository')

const movieService = {}

movieService.getMovies = async (
  searchBy,
  searchValue,
  page = 1,
  limit = 15
) => {
  const FILTER_BY_ENUM = ['title', 'plot', 'actors', 'genres']
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
    totalPages = Math.ceil(moviesTotalCount / intLimit, 10)
    totalSize = moviesTotalCount
  }
  // } else if (searchBy === 'all') {
  //   const moviesByFilterArrayPromise = []
  //   FILTER_BY_ENUM.forEach(filterBy => {
  //     moviesByFilterArrayPromise.push(
  //       movieRepository.findAllMoviesByProperty(
  //         filterBy,
  //         searchValue,
  //         offset,
  //         intLimit
  //       )
  //     )
  //   })
  //   const moviesByFilterArray = await Promise.all(moviesByFilterArrayPromise)
  //   const allMovies = moviesByFilterArray.reduce(
  //     (arr, moviesByFilter) => [...arr, ...moviesByFilter],
  //     []
  //   )

  //   console.log(allMovies.length)

  //   // movies = allMovies
  //   // totalPages = Math.floor(allMoviesCount / intLimit)
  //   // totalSize = allMoviesCount
  // }
  else {
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
      poster:
        movie.poster === null ? null : movie.poster.replace(/^http/, 'https'),
      title: movie.title,
      year: movie.year,
      plot: movie.plot,
      genres: movie.genres
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
      poster:
        movie.poster === null ? null : movie.poster.replace(/^http/, 'https'),
      title: movie.title,
      year: movie.year,
      actors: movie.actors,
      plot: movie.plot,
      rated: movie.rated,
      genres: movie.genres,
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
      genres: updatedMovie.genres,
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

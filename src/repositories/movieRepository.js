const mongoose = require('mongoose')

const { connection } = mongoose
const { ObjectId } = mongoose.Types

const movieRepository = {}

movieRepository.getAllMoviesTotalCount = async () => {
  const allMoviesTotalCount = await connection.db
    .collection('movieDetails')
    .find()
    .count()
  return allMoviesTotalCount
}

movieRepository.findAllMovies = async (offset, limit) => {
  const movies = await connection.db
    .collection('movieDetails')
    .find()
    .skip(offset)
    .limit(limit)
    .toArray()
  return movies
}

movieRepository.getAllMoviesTotalCountByProperty = async (
  searchBy,
  searchValue
) => {
  const filter = {}
  filter[searchBy] = { $regex: `.*${searchValue}.*`, $options: 'i' }
  const allMoviesTotalCountByProperty = await connection.db
    .collection('movieDetails')
    .find(filter)
    .count()
  return allMoviesTotalCountByProperty
}

movieRepository.findAllMoviesByProperty = async (
  searchBy,
  searchValue,
  offset,
  limit
) => {
  const filter = {}
  filter[searchBy] = { $regex: `.*${searchValue}.*`, $options: 'i' }
  const movies = await connection.db
    .collection('movieDetails')
    .find(filter)
    .skip(offset)
    .limit(limit)
    .toArray()
  return movies
}

movieRepository.findMovieById = async id => {
  const movie = await connection.db
    .collection('movieDetails')
    .findOne({ _id: ObjectId(id) })
  return movie
}

movieRepository.removeMovieById = async id => {
  const deleted = await connection.db
    .collection('movieDetails')
    .findOneAndDelete({ _id: ObjectId(id) })
  return deleted
}

movieRepository.updateMovieById = async (id, update) => {
  const updated = await connection.db
    .collection('movieDetails')
    .findOneAndUpdate(
      { _id: ObjectId(id) },
      { $set: update },
      { returnOriginal: false }
    )
  return updated.value
}

module.exports = movieRepository

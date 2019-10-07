const mongoose = require('mongoose')

const { connection } = mongoose
const { ObjectId } = mongoose.Types

const movieRepository = {}

movieRepository.getMoviesTotalCount = async () => {
  const moviesTotalCount = await connection.db
    .collection('movieDetails')
    .find()
    .count()
  return moviesTotalCount
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

movieRepository.findAllMoviesContainsTitle = async (
  searchValue,
  offset,
  limit
) => {
  const movies = await connection.db
    .collection('movieDetails')
    .find({ title: { $regex: `.*${searchValue}.*`, $options: 'i' } })
    .skip(offset)
    .limit(limit)
    .toArray()
  return movies
}

movieRepository.findAllMoviesContainsPlot = async (
  searchValue,
  offset,
  limit
) => {
  const movies = await connection.db
    .collection('movieDetails')
    .find({ plot: { $regex: `.*${searchValue}.*`, $options: 'i' } })
    .skip(offset)
    .limit(limit)
    .toArray()
  return movies
}

movieRepository.findAllMoviesContainsActor = async (
  searchValue,
  offset,
  limit
) => {
  const movies = await connection.db
    .collection('movieDetails')
    .find({ actors: { $regex: `.*${searchValue}.*`, $options: 'i' } })
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

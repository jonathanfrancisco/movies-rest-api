const mongoose = require('mongoose')
const { connection } = mongoose
const { ObjectId } = mongoose.Types

const movieRepository = {}

movieRepository.findAllMovies = async () => {
  const movies = await connection.db
    .collection('movieDetails')
    .find()
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

module.exports = movieRepository

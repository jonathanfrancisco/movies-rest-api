const mongoose = require('mongoose')
const { DATABASE_URL } = require('../../config/database')

module.exports = () => {
  mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  mongoose.connection.once('open', () =>
    console.log('db successfully connected')
  )
}

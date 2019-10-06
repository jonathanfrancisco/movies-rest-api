const mongoose = require('mongoose')
const { DATABASE_URL } = require('../../config/database')
mongoose.connection.on('connected', () => {
  console.log('connection to the database established!')
})
module.exports = async () => {
  await mongoose.connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
}

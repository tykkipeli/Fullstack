const mongoose = require('mongoose')
const config = require('./config')
const logger = require('./logger')

const connect = () => {
  mongoose.connect(config.MONGODB_URI)
    .then(() => {
      logger.info('connected to MongoDB')
    })
    .catch((error) => {
      logger.error('error connecting to MongoDB:', error.message)
    })
}

module.exports = { connect }

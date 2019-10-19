const mongoose = require('mongoose')
const consola = require('consola')
const { mongodb_uri } = require('../../config')
const editorSchema = require('./editor')
const poemSchema = require('./poem')
const poetSchema = require('./poet')

// Setup MongoDB with mongoose
const options = {
  retryWrites: true,
  useNewUrlParser: true,
  autoIndex: false,
  useFindAndModify: false,
  useCreateIndex: true,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
  useUnifiedTopology: true
}
// connect to db
const conn = mongoose.createConnection(mongodb_uri, options)
conn.on('error', (err) => {
  consola.error({
    message: `App DB connection is failed → ${err.message}`,
    badge: true
  })
  // force to terminate
  process.exit(1)
})
conn.on('connected', () => {
  consola.success({
    message: 'App DB connection is successfull',
    badge: true
  })
})

// create db collections
conn.model('Editor', editorSchema, 'editors')
conn.model('Poem', poemSchema, 'poems')
conn.model('Poet', poetSchema, 'poets')


module.exports = conn

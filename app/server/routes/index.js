const editorRoutes = require('./editor')
const poetRoutes = require('./poet')
const poemRoutes = require('./poem')

// Import Routes
module.exports = (app) => {
  app.use('/api/editors', editorRoutes)
  app.use('/api/poets', poetRoutes)
  app.use('/api/poems', poemRoutes)
}
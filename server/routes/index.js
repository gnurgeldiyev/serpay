const editorRoutes = require('./editor')

// Import Routes
module.exports = (app) => {
  app.use('/api/editors', editorRoutes)
}
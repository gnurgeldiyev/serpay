const editorRoutes = require('./editor')
const poetRoutes = require('./poet')

// Import Routes
module.exports = (app) => {
  app.use('/api/editors', editorRoutes)
  app.use('/api/poets', poetRoutes)
}
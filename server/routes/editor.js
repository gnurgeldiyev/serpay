const router = require('express').Router()
const editorController = require('../controllers/editor')

/**
 * GET requests
*/
router.get('/', editorController.getAll)

/**
 * POST requests
*/
router.post('/', editorController.add)

/**
 * PUT requests
*/
router.put('/:id', editorController.update)
router.put('/:id/deactivate', editorController.deactivate)
router.put('/:id/reset', editorController.resetPassword)

/**
 * DELETE requests
*/

module.exports = router
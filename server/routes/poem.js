const router = require('express').Router()
const poemController = require('../controllers/poem')

/**
 * GET requests
 */
router.get('/', poemController.getAll)
router.get('/:id', poemController.getOne)

/**
 * POST requests
 */
router.post('/', poemController.add)

/**
 * PUT requests
 */
router.put('/:id', poemController.update)
router.put('/:id/approve', poemController.approve)

/**
 * DELETE requests
 */
router.delete('/:id', poemController.delete)

module.exports = router

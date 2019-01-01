const router = require('express').Router()
const poetController = require('../controllers/poet')

/**
 * GET requests
*/
router.get('/', poetController.getAll)
router.get('/:id', poetController.getOne)

/**
 * POST requests
*/
router.post('/', poetController.add)

/**
 * PUT requests
*/
router.put('/:id', poetController.update)
router.put('/:id/delete', poetController.delete)

/**
 * DELETE requests
*/

module.exports = router
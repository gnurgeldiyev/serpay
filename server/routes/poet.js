const router = require('express').Router()
const poetController = require('../controllers/poet')
const multer = require('multer')
const uuid = require('uuid')

/** 
 * file upload 
*/
const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './static/')
  },
  filename(req, file, cb) {
    const ext = file.mimetype.split('/')[1]
    cb(null, `${uuid.v4()}.${ext}`)
  }
})
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype.startsWith('image/')) {
    cb(null, true)
  } else {
    cb(null, false)
  }
}
const upload = multer({
  storage,
  limits: {
    fileSize: 1024 * 1024 * 2
  },
  fileFilter
})

/**
 * GET requests
*/
router.get('/', poetController.getAll)
router.get('/:url', poetController.getOne)

/**
 * POST requests
*/
router.post('/', poetController.add)
router.post('/upload', 
  upload.single('file'),
  (req, res) => {
    return res.status(201).json({ file: req.file })
  }
)

/**
 * PUT requests
*/
router.put('/:id', poetController.update)
router.put('/:id/delete', poetController.delete)

/**
 * DELETE requests
*/

module.exports = router
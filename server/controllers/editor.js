const Editor = require('../models/editor')
const { isMongoId } = require('validator')
const {
  validateData,
  hashPassword
} = require('../helpers/editor')

/** 
 * GET | get all active editors
*/
exports.getAll = (req, res) => {
  Editor.find({ is_active: true }).sort({ role: 1, created_at: 1 })
    .then((editors) => {
      if (!editors.length) {
        return res.status(404).json({
          data: {},
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'There is no any editor' }
          } 
        })
      }
      let e = []
      editors.map((editor) => {
        e.push(editor.toPublic())
      })
      res.status(200).json({
        data: e,
        meta: {
          code: 200,
          error: {}
        }
      })
    })
    .catch((err) => {
      return res.status(500).json({ 
        data: {}, 
        meta: { 
          code: 500, 
          error: { code: err.code, message: err.message }
        } 
      })
    })
}


/** 
 * POST | Add new user
*/
exports.add = async (req, res) => {
  let result
  const d = req.body
  // request body data validation
  result = await validateData('add', d)
  if (!result.status) {
    return res.status(400).json({ 
      data: {}, 
      meta: { code: 400, error: result.error } 
    })
  }
  // hash user password
  result = hashPassword(d.password)
  if (!result.status) {
    return res.status(400).json({ 
      data: {}, 
      meta: { code: 400, error: result.error } 
    })
  }
  // set returned hash password
  const hashedPassword = result.data
  // add new editor
  let editor = new Editor({
    email: d.email,
    firstname: d.firstname,
    lastname: d.lastname,
    role: d.role,
    password: hashedPassword
  })
  editor.save()
    .then((editor) => {
      return res.status(201).json({
        data: editor.toPublic(),
        meta: { code: 201, error: {} }
      })
    })
    .catch((err) => {
      return res.status(400).json({ 
        data: {}, 
        meta: { 
          code: 400, 
          error: { code: err.code, message: err.message }
        } 
      })
    })
}

/** 
 * PUT | update user by id
*/
exports.update = async (req, res) => {
  const id = req.params.id
  let d = req.body
  // ObjectID validation
  if (!isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  // set id for the validation
  d.id = id
  let result = await validateData('update', d)
  if (!result.status) {
    return res.status(400).json({ 
      data: {}, 
      meta: { code: 400, error: result.error } 
    })
  }
  Editor.findByIdAndUpdate(id, {
    $set: {
      firstname: d.firstname,
      lastname: d.lastname,
      email: d.email,
      role: d.role
    }
  }, { new: true })
    .then((editor) => {
      if (!editor) {
        return res.status(404).json({ 
          data: {}, 
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'Editor not found' }
          } 
        })
      }
      return res.status(200).json({
        data: editor.toPublic(),
        meta: { code: 200, error: {} }
      })
    })
    .catch((err) => {
      return res.status(400).json({ 
        data: {}, 
        meta: { 
          code: 400, 
          error: { code: err.code, message: err.message }
        }
      })
    })
}

/** 
 * PUT | deactivate user by id
*/
exports.deactivate = (req, res) => {
  const id = req.params.id
  const query = req.query.d
  // ObjectID validation
  if (!isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  // deactivate or activate based on query 'd' value
  Editor.findByIdAndUpdate(id, {
    $set: { is_active: query === 'false' ? true : false }
  }, { new: true })
    .then((editor) => {
      if (!editor) {
        return res.status(404).json({ 
          data: {}, 
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'Editor not found' }
          } 
        })
      }
      return res.status(200).json({
        data: editor.toPublic(),
        meta: { code: 200, error: {} }
      })
    })
    .catch((err) => {
      return res.status(400).json({ 
        data: {}, 
        meta: { 
          code: 400, 
          error: { code: err.code, message: err.message }
        }
      })
    })
}
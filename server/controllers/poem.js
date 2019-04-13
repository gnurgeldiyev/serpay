const conn = require('../models')
const Poem = conn.model('Poem')
const { escape, ltrim, isMongoId } = require('validator')
const {
  validateData,
  toPublic
} = require('../helpers/poem')

/**
 * GET | get all by poet id, approved state queries
*/
exports.getAll = (req, res) => {
  const poetId = req.query.poet
  const title = req.query.title
  const approved = req.query.approved
  if (title) {
    const url = encodeURI(title)
    return Poem.findOne({ url, is_approved: true })
      .populate('author').populate('added_by')
      .then((poem) => {
        if (!poem) {
          return res.status(404).json({
            data: {},
            meta: {
              code: 404,
              error: { code: 'NOT_FOUND', message: 'There is no any poem' }
            }
          })
        }
        return res.status(200).json({
          data: toPublic(poem),
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
  // ObjectID validation
  if (poetId && !isMongoId(poetId)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  // returns deleted poets, is_deleted = true
  if (poetId) {
    let is_approved = true
    if (approved && approved === 'false') {
      is_approved = false
    }
    Poem.find({ author: poetId, is_approved })
      .sort({ title: 1, created_at: 1 })
      .populate('author').populate('added_by')
      .then((poems) => {
        if (!poems.length) {
          return res.status(404).json({
            data: {},
            meta: {
              code: 404,
              error: { code: 'NOT_FOUND', message: 'There is no any poem' }
            }
          })
        }
        let p = []
        poems.map((poem) => {
          p.push(toPublic(poem))
        })
        return res.status(200).json({
          data: p,
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
  } else {
    let is_approved = true
    if (approved && approved === 'false') {
      is_approved = false
    }
    Poem.find({ is_approved })
      .sort({ title: 1, created_at: 1 })
      .populate('author').populate('added_by')
      .limit(100)
      .then((poems) => {
        if (!poems.length) {
          return res.status(404).json({
            data: {},
            meta: {
              code: 404,
              error: { code: 'NOT_FOUND', message: 'There is no any poem' }
            }
          })
        }
        let p = []
        poems.map((poem) => {
          p.push(toPublic(poem))
        })
        return res.status(200).json({
          data: p,
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
}

/**
 * GET | get one by id, approved state queries
*/
exports.getOne = (req, res) => {
  const id = req.params.id
  const approved = req.query.approved
  // ObjectID validation
  if (id && !isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  let is_approved = true
  if (approved && approved === 'false') {
    is_approved = false
  }
  Poem.findOne({ _id: id, is_approved })
    .populate('author').populate('added_by')
    .then((poem) => {
      if (!poem) {
        return res.status(404).json({
          data: {},
          meta: {
            code: 404,
            error: { code: 'NOT_FOUND', message: 'There is no any poem' }
          }
        })
      }
      return res.status(200).json({
        data: toPublic(poem),
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
 * POST | add new poem
*/
exports.add = async (req, res) => {
  let result
  const d = req.body
  // request body data validation
  result = await validateData(d)
  if (!result.status) {
    return res.status(400).json({
      data: {},
      meta: { code: 400, error: result.error }
    })
  }
  // add new poem
  let poem = new Poem({
    title: ltrim(d.title),
    url: encodeURI(d.title.toLowerCase().replace(' ', '-')),
    author: d.author,
    year: d.year,
    content: escape(d.content),
    notes: ltrim(d.notes),
    youtube_link: d.youtube_link,
    category: d.category,
    added_by: d.added_by
  })
  poem.save()
    .then((poem) => {
      Poem.findById(poem._id).populate('author').populate('added_by')
        .then((poem) => {
          return res.status(201).json({
            data: toPublic(poem),
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
 * PUT | update poem by id
*/
exports.update = async (req, res) => {
  let result
  const d = req.body
  const id = req.params.id
  // ObjectID validation
  if (id && !isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  // request body data validation
  result = await validateData(d)
  if (!result.status) {
    return res.status(400).json({
      data: {},
      meta: { code: 400, error: result.error }
    })
  }
  // update poem
  Poem.findByIdAndUpdate(id, {
    $set: {
      title: ltrim(d.title),
      url: encodeURI(d.title.toLowerCase().replace(' ', '-')),
      author: d.author,
      year: d.year,
      content: escape(d.content),
      notes: ltrim(d.notes),
      youtube_link: d.youtube_link,
      category: d.category,
      added_by: d.added_by
    }
  }, { new: true })
    .then((poem) => {
      if (!poem) {
        return res.status(404).json({
          data: {},
          meta: {
            code: 404,
            error: { code: 'NOT_FOUND', message: 'Editor not found' }
          }
        })
      }
      return res.status(200).json({
        data: toPublic(poem),
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
 * PUT | poem approve state toggle
*/
exports.approve = (req, res) => {
  const id = req.params.id
  const approved = req.query.approved
  // ObjectID validation
  if (id && !isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  let is_approved = true
  if (approved && approved === 'false') {
    is_approved = false
  }
  // set approve state
  Poem.findByIdAndUpdate(id, {
    $set: {
      is_approved
    }
  }, { new: true })
    .then((poem) => {
      if (!poem) {
        return res.status(404).json({
          data: {},
          meta: {
            code: 404,
            error: { code: 'NOT_FOUND', message: 'Editor not found' }
          }
        })
      }
      return res.status(200).json({
        data: toPublic(poem),
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
 * DELETE | delete poem, only for approved state is false
*/
exports.delete = (req, res) => {
  const id = req.params.id
  // ObjectID validation
  if (id && !isMongoId(id)) {
    return res.status(400).json({
      data: {},
      meta: {
        code: 400,
        error: { code: 'BAD_REQUEST', message: 'ID validation error' }
      }
    })
  }
  // delete poem
  Poem.findOneAndDelete({ _id: id, is_approved: false })
    .then((poem) => {
      if (!poem) {
        return res.status(404).json({
          data: {},
          meta: {
            code: 404,
            error: { code: 'NOT_FOUND', message: 'Editor not found' }
          }
        })
      }
      return res.status(200).json({
        data: {},
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

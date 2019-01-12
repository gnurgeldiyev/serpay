const Poet = require('../models/poet')
const { isMongoId } = require('validator')
const {
  validateData
} = require('../helpers/poet')

/** 
 * GET | get all non deleted poets
*/
exports.getAll = (req, res) => {
  const q = req.query.d
  // returns deleted poets, is_deleted = true
  if (q && q === 'true') {
    Poet.find({ is_deleted: true }).sort({ firstname: 1, created_at: 1 })
      .then((poets) => {
        if (!poets.length) {
          return res.status(404).json({
            data: {},
            meta: { 
              code: 404, 
              error: { code: 'NOT_FOUND', message: 'There is no any poet' }
            } 
          })
        }
        let p = []
        poets.map((poet) => {
          p.push(poet.toPublic())
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
  Poet.find({ is_deleted: false }).sort({ firstname: 1, created_at: 1 })
    .then((poets) => {
      if (!poets.length) {
        return res.status(404).json({
          data: {},
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'There is no any poet' }
          } 
        })
      }
      let p = []
      poets.map((poet) => {
        p.push(poet.toPublic())
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

/** 
 * GET | get one poet by id
*/
exports.getOne = (req, res) => {
  const id = req.params.id
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
  Poet.findOne({ _id: id, is_deleted: false })
    .then((poet) => {
      if (!poet) {
        return res.status(404).json({ 
          data: {}, 
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'Poet not found' }
          } 
        })
      }
      return res.status(200).json({
        data: poet.toPublic(),
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
 * POST | add new poet
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
  // add new poet
  let poet = new Poet({
    fullname: d.fullname,
    url: d.fullname.toLowerCase().replace(' ', '-'),
    birth_date: d.birth_date,
    death_date: d.death_date,
    bio: d.bio,
    wiki_link: d.wiki_link,
    avatar: d.avatar
  })
  poet.save()
    .then((poet) => {
      return res.status(201).json({
        data: poet.toPublic(),
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
 * PUT | update poet by id
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
  // request body data validation
  let result = await validateData(d)
  if (!result.status) {
    return res.status(400).json({ 
      data: {}, 
      meta: { code: 400, error: result.error } 
    })
  }
  Poet.findOneAndUpdate({ _id: id, is_deleted: false }, {
    $set: {
      fullname: d.fullname,
      url: d.fullname.toLowerCase().replace(' ', '-'),
      birth_date: d.birth_date,
      death_date: d.death_date,
      bio: d.bio,
      wiki_link: d.wiki_link,
      avatar: d.avatar
    }
  }, { new: true })
    .then((poet) => {
      if (!poet) {
        return res.status(404).json({ 
          data: {}, 
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'Poet not found' }
          } 
        })
      }
      return res.status(200).json({
        data: poet.toPublic(),
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
 * PUT | delete poet by id
*/
exports.delete = (req, res) => {
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
  // delete or restore based on query 'd' value
  Poet.findByIdAndUpdate(id, {
    $set: { is_deleted: query === 'false' ? false : true }
  }, { new: true })
    .then((poet) => {
      if (!poet) {
        return res.status(404).json({ 
          data: {}, 
          meta: { 
            code: 404, 
            error: { code: 'NOT_FOUND', message: 'Poet not found' }
          } 
        })
      }
      // set data if is_deleted false
      return res.status(200).json({
        data: query === 'false' ? poet.toPublic() : {},
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
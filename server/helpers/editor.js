const Editor = require('../models/editor')
const jwt = require('jsonwebtoken')
const { isEmail, isLength, isEmpty } = require('validator')
const { password_salt } = require('../../config')

/**
 * t: validation type | add, update
 * d: request body data
*/
exports.validateData = async (t, d) => {
  try {
    if (t === 'add') {
      if (
        (!d.firstname || isEmpty(d.firstname))
        || (!d.lastname || isEmpty(d.lastname))
        || (!d.email || isEmpty(d.email)) 
        || !isEmail(d.email)
        || (!d.password || isEmpty(d.password))
        || !isLength(d.password, { min: 8 })
        || (!d.role || isEmpty(d.role))
        || !((d.role === 'editor') || (d.role === 'admin'))
      ) { 
        return {
          status: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Data validation error'
          }
        }
      }
      // email check, email field must be unique
      let editor = await Editor.findOne({ email: d.email })
      if (!editor) {
        return {
          status: true,
          data: {}
        }
      }
      return {
        status: false,
        error: {
          code: 'EXISTING_EMAIL',
          message: 'Email exists'
        }
      }
    } else if (t === 'update') {
      if (
        (!d.firstname || isEmpty(d.firstname))
        || (!d.lastname || isEmpty(d.lastname))
        || (!d.email || isEmpty(d.email)) 
        || !isEmail(d.email)
        || (!d.role || isEmpty(d.role))
        || !((d.role === 'editor') || (d.role === 'admin'))
      ) { 
        return {
          status: false,
          error: {
            code: 'BAD_REQUEST',
            message: 'Data validation error'
          }
        }
      }
      // email check, email field must be unique
      let editor = await Editor.findById(d.id)
      if (editor && editor.email === d.email) {
        return {
          status: true,
          data: {}
        }
      }
      editor = await Editor.findOne({ email: d.email })
      if (!editor) {
        return {
          status: true,
          data: {}
        }
      }
      return {
        status: false,
        error: {
          code: 'EXISTING_EMAIL',
          message: 'Email exists'
        }
      }
    } else {
      return {
        status: false,
        error: {
          code: 'TYPE_MISSING',
          message: 'Validation type missing'
        }
      }
    }
  } catch (err) {
    return {
      status: false,
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}

/**
 * p: raw password string | hashes password (HMAC SHA256)
*/
exports.hashPassword = (p) => {
  try {
    const hashed = jwt.sign({ password: p }, password_salt)
    return {
      status: true,
      data: hashed
    }
  } catch (err) {
    return {
      status: false,
      error: {
        code: err.code,
        message: err.message
      }
    }
  }
}
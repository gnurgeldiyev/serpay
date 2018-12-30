const Editor = require('../models/editor')
const jwt = require('jsonwebtoken')
const { isEmail, isLength, isEmpty } = require('validator')
const { password_salt } = require('../../config')

/**
 * t: validation type | add, update
 * d: request body data
*/
exports.validateData = async (t, d) => {
  if (t === 'add') {
    if (
      isEmpty(d.firstname) // false
      || isEmpty(d.lastname) // false
      || isEmpty(d.email) // false
      || !isEmail(d.email) // !true => false
      || isEmpty(d.password) // false
      || !isLength(d.password, { min: 8 }) // !true => false
      || isEmpty(d.role) // false
      || !((d.role === 'editor') || (d.role === 'admin')) // !true => false
    ) { 
      return {
        status: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Data validation error'
        }
      }
    }
    try {
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
    } catch (err) {
      return {
        status: false,
        error: {
          code: err.code,
          message: err.message
        }
      }
    }
  } else if (t === 'update') {
    if (
      isEmpty(d.firstname) // false
      || isEmpty(d.lastname) // false
      || isEmpty(d.email) // false
      || !isEmail(d.email) // !true => false
      || isEmpty(d.role) // false
      || !((d.role === 'editor') || (d.role === 'admin')) // !true => false
    ) { 
      return {
        status: false,
        error: {
          code: 'BAD_REQUEST',
          message: 'Data validation error'
        }
      }
    }
    try {
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
    } catch (err) {
      return {
        status: false,
        error: {
          code: err.code,
          message: err.message
        }
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
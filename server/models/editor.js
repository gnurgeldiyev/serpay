const { Schema } = require('mongoose')

const editorSchema = Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 64
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 64
  },
  role: {
    type: String,
    lowercase: true,
    default: 'editor'
  },
  password: {
    type: String,
    required: true
  },
  is_active: {
    type: Boolean,
    default: true
  },
  token: {
    type: String,
    default: null
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

editorSchema.methods.toPublic = function () {
  return {
    id: this._id,
    firstname: this.firstname,
    lastname: this.lastname,
    email: this.email,
    role: this.role,
    is_active: this.is_active,
    token: this.token,
    created_at: this.created_at
  }
}

module.exports = editorSchema

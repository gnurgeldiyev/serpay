const mongoose = require('mongoose')

const editorSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, 'can\'t be blank'],
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
    required: [true, 'can\'t be blank']
  },
  is_active: {
    type: Boolean,
    default: true
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
    role: this.role,
    created_at: this.created_at
  }
}

const Editor = mongoose.model('Editor', editorSchema)

module.exports = Editor
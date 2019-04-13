const mongoose = require('mongoose')

const poemSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'can\'t be blank']
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Poet',
    required: true
  },
  year: {
    type: String,
    default: null
  },
  content: {
    type: String,
    required: true
  },
  notes: {
    type: String,
    default: null
  },
  youtube_link: {
    type: String,
    default: null
  },
  category: {
    type: Array,
    default: null
  },
  added_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Editor',
    required: true
  },
  is_approved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

module.exports = poemSchema

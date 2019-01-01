const mongoose = require('mongoose')

const poetSchema = mongoose.Schema({
  fullname: {
    type: String,
    required: [true, 'can\'t be blank'],
    unique: true
  },
  birth_date: {
    type: String
  },
  death_date: {
    type: String,
  },
  bio: {
    type: String
  },
  wiki_link: {
    type: String
  },
  avatar: {
    type: String
  },
  is_deleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
})

poetSchema.methods.toPublic = function () {
  return {
    id: this._id,
    fullname: this.fullname,
    birth_date: this.birth_date,
    death_date: this.death_date,
    bio: this.bio,
    wiki_link: this.wiki_link,
    avatar: this.avatar,
    created_at: this.created_at
  }
}

const Poet = mongoose.model('Poet', poetSchema)

module.exports = Poet
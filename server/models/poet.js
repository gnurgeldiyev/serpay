const { Schema } = require('mongoose')

const poetSchema = Schema({
  fullname: {
    type: String,
    required: true,
    unique: true
  },
  url: {
    type: String,
    required: true
  },
  birth_date: {
    type: String,
    default: null
  },
  death_date: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: null
  },
  wiki_link: {
    type: String,
    default: null
  },
  avatar: {
    type: String,
    default: null
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
    url: this.url,
    birth_date: this.birth_date,
    death_date: this.death_date,
    bio: this.bio,
    wiki_link: this.wiki_link,
    avatar: this.avatar,
    created_at: this.created_at
  }
}

module.exports = poetSchema

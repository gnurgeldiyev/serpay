import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IPoet extends Document {
  fullname: string
  url: string
  birth_date?: string
  death_date?: string
  bio?: string
  wiki_link?: string
  avatar?: string
  is_deleted: boolean
  created_at: Date
  updated_at: Date
  toPublic(): {
    id: string
    fullname: string
    url: string
    birth_date?: string
    death_date?: string
    bio?: string
    wiki_link?: string
    avatar?: string
    created_at: Date
  }
}

const poetSchema = new Schema<IPoet>({
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

poetSchema.methods.toPublic = function() {
  return {
    id: this._id.toString(),
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

const Poet: Model<IPoet> = mongoose.models.Poet || mongoose.model<IPoet>('Poet', poetSchema)

export default Poet
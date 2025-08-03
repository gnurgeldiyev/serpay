import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IPoem extends Document {
  title: string
  url: string
  author: mongoose.Types.ObjectId
  year?: string
  content: string
  notes?: string
  youtube_link?: string
  category?: string[]
  added_by: mongoose.Types.ObjectId
  is_approved: boolean
  created_at: Date
  updated_at: Date
}

const poemSchema = new Schema<IPoem>({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
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
    type: [String],
    default: null
  },
  added_by: {
    type: Schema.Types.ObjectId,
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

const Poem: Model<IPoem> = mongoose.models.Poem || mongoose.model<IPoem>('Poem', poemSchema)

export default Poem
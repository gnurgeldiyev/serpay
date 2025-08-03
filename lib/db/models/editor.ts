import mongoose, { Document, Model, Schema } from 'mongoose'

export interface IEditor extends Document {
  fullname: string
  email: string
  password: string
  recovery_code?: string
  is_deleted: boolean
  created_at: Date
  updated_at: Date
}

const editorSchema = new Schema<IEditor>({
  fullname: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  recovery_code: {
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

const Editor: Model<IEditor> = mongoose.models.Editor || mongoose.model<IEditor>('Editor', editorSchema)

export default Editor
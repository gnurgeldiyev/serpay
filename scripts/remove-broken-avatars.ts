import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!

async function removeBrokenAvatars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    const poetsCollection = db.collection('poets')

    // Remove avatar field from all poets since images are broken
    const result = await poetsCollection.updateMany(
      {},
      { $unset: { avatar: "" } }
    )
    
    console.log(`✅ Updated ${result.modifiedCount} poets - removed broken avatar URLs`)

  } catch (error) {
    console.error('❌ Error updating poets:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📊 Disconnected from MongoDB')
  }
}

removeBrokenAvatars()
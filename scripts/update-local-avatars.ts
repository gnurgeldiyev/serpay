import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!

const poetAvatars: Record<string, string> = {
  'çary-ýegenmyradow': '/images/poets/çary-ýegenmyradow.svg',
  'kerim-gurbannepesow': '/images/poets/kerim-gurbannepesow.svg',
  'gurbannazar-ezizow': '/images/poets/gurbannazar-ezizow.svg'
}

async function updateLocalAvatars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    const poetsCollection = db.collection('poets')

    // Update each poet with their local avatar
    for (const [poetUrl, avatarUrl] of Object.entries(poetAvatars)) {
      const result = await poetsCollection.updateOne(
        { url: poetUrl },
        { $set: { avatar: avatarUrl } }
      )
      
      if (result.modifiedCount > 0) {
        console.log(`✅ Updated avatar for ${poetUrl}`)
      } else {
        console.log(`⚠️  No poet found with URL: ${poetUrl}`)
      }
    }

    console.log('✅ Local avatar update complete!')
  } catch (error) {
    console.error('❌ Error updating avatars:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📊 Disconnected from MongoDB')
  }
}

updateLocalAvatars()
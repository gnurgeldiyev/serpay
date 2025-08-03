import mongoose from 'mongoose'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const MONGODB_URI = process.env.MONGODB_URI!

// Avatar URLs extracted from the scraped data
const poetAvatars: Record<string, string> = {
  'çary-ýegenmyradow': 'https://serpay.penjire.com/5403615d-c113-4e0c-be2a-dc6dc8f4a580.jpeg',
  'kerim-gurbannepesow': 'https://serpay.penjire.com/e1e21c9a-a5c3-46f2-82f5-6b8f11ea43fb.jpeg',
  'gurbannazar-ezizow': 'https://serpay.penjire.com/d03cc2da-3f2f-4c1f-8bb7-e4ba67cbfc09.jpeg'
}

async function updateAvatars() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')

    const db = mongoose.connection.db
    const poetsCollection = db.collection('poets')

    // Update each poet with their avatar
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

    console.log('✅ Avatar update complete!')
  } catch (error) {
    console.error('❌ Error updating avatars:', error)
  } finally {
    await mongoose.disconnect()
    console.log('📊 Disconnected from MongoDB')
  }
}

updateAvatars()
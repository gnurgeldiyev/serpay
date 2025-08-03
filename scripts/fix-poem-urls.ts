import mongoose from 'mongoose'
import Poem from '../lib/db/models/poem'
import dbConnect from '../lib/db/mongodb'

async function fixPoemUrls() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Find all poems
    const poems = await Poem.find({})
    console.log(`Found ${poems.length} poems`)

    let updatedCount = 0
    
    for (const poem of poems) {
      // Check if URL has trailing/leading spaces
      const trimmedUrl = poem.url.trim()
      
      if (poem.url !== trimmedUrl) {
        console.log(`Fixing URL for: "${poem.title}"`)
        console.log(`  Old URL: "${poem.url}"`)
        console.log(`  New URL: "${trimmedUrl}"`)
        
        poem.url = trimmedUrl
        await poem.save()
        updatedCount++
      }
    }

    console.log(`\nFixed ${updatedCount} poem URLs`)
  } catch (error) {
    console.error('Error fixing poem URLs:', error)
  } finally {
    await mongoose.connection.close()
  }
}

fixPoemUrls()
import mongoose from 'mongoose'
import Poet from '../lib/db/models/poet'
import dbConnect from '../lib/db/mongodb'

// Map poet URLs to their respective images
const poetImageMap: { [key: string]: string } = {
  'gurbannazar-ezizow': '/5403615d-c113-4e0c-be2a-dc6dc8f4a580.jpeg',
  'kerim-gurbannepesow': '/52514fa7-f26a-4d23-9e27-29a545a84342.jpeg',
  'çary-ýegenmyradow': '/1de311d7-7e84-4e2e-b212-ef2eb5ede496.jpeg'
}

async function updatePoetImages() {
  try {
    await dbConnect()
    console.log('Connected to database')

    for (const [poetUrl, imagePath] of Object.entries(poetImageMap)) {
      const poet = await Poet.findOneAndUpdate(
        { url: poetUrl },
        { avatar: imagePath },
        { new: true }
      )
      
      if (poet) {
        console.log(`Updated ${poet.fullname} with image: ${imagePath}`)
      } else {
        console.log(`Poet with URL ${poetUrl} not found`)
      }
    }

    console.log('All poet images updated successfully')
  } catch (error) {
    console.error('Error updating poet images:', error)
  } finally {
    await mongoose.connection.close()
  }
}

updatePoetImages()
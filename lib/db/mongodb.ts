import mongoose, { Connection } from 'mongoose'

interface CachedConnection {
  conn: Connection | null
  promise: Promise<Connection> | null
}

declare global {
  var mongoose: CachedConnection | undefined
}

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/serpay'

if (!MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect(): Promise<Connection> {
  if (cached!.conn) {
    return cached!.conn
  }

  if (!cached!.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached!.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection
    })
  }

  try {
    cached!.conn = await cached!.promise
  } catch (e) {
    cached!.promise = null
    throw e
  }

  return cached!.conn
}

export default dbConnect
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI || ''

// Graceful fallback when MongoDB is not available
let isMockMode = false

let cached = (global as any).mongoose

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null }
}

async function connectDB() {
  // If already in mock mode, just return null
  if (isMockMode) {
    return null
  }

  if (!MONGODB_URI) {
    console.warn('No MONGODB_URI set, running in mock mode')
    isMockMode = true
    return null
  }

  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    }).catch((err) => {
      console.warn('MongoDB connection failed, switching to mock mode:', err.message)
      isMockMode = true
      cached.promise = null
      return null
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    console.warn('MongoDB connection error, running in mock mode')
    isMockMode = true
    cached.promise = null
    return null
  }

  return cached.conn
}

export function isDBMockMode() {
  return isMockMode
}

export default connectDB

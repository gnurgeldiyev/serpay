import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import Editor from '../lib/db/models/editor'
import dbConnect from '../lib/db/mongodb'

async function seedAdmin() {
  try {
    await dbConnect()
    console.log('Connected to database')

    // Check if admin already exists
    const existingAdmin = await Editor.findOne({ email: 'admin@serpay.com' })
    
    if (existingAdmin) {
      console.log('Admin user already exists')
      return
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10)
    
    const admin = await Editor.create({
      fullname: 'Administrator',
      email: 'admin@serpay.com',
      password: hashedPassword,
      is_deleted: false
    })

    console.log('Admin user created successfully:')
    console.log('Email: admin@serpay.com')
    console.log('Password: admin123')
    console.log('\nPlease change the password after first login!')
  } catch (error) {
    console.error('Error seeding admin:', error)
  } finally {
    await mongoose.connection.close()
  }
}

seedAdmin()
import 'dotenv/config'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/serpay'

console.log('📊 MongoDB URI:', MONGODB_URI.replace(/:[^:]*@/, ':****@'))

// Define schemas inline
const poetSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  url: { type: String, required: true, unique: true },
  birth_date: String,
  death_date: String,
  bio: String,
  wiki_link: String,
  avatar: String,
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

const poemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'Poet', required: true },
  year: String,
  content: { type: String, required: true },
  notes: String,
  youtube_link: String,
  category: [String],
  added_by: { type: mongoose.Schema.Types.ObjectId, ref: 'Editor' },
  is_approved: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

const editorSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  is_deleted: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
})

// Create models
const Poet = mongoose.model('Poet', poetSchema)
const Poem = mongoose.model('Poem', poemSchema)
const Editor = mongoose.model('Editor', editorSchema)

// Function to clean HTML content
function cleanHtmlContent(html: string): string {
  let text = html
    .replace(/<\/p>/g, '\n\n')
    .replace(/<br\s*\/?>/g, '\n')
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  
  return text
}

// Extract categories
function extractCategories(html: string): string[] {
  const categories: string[] = []
  const categoryRegex = /<div class="poem_category_item">\s*([^<]+)\s*<\/div>/g
  let match
  
  while ((match = categoryRegex.exec(html)) !== null) {
    categories.push(match[1].trim())
  }
  
  return categories
}

// Extract notes
function extractNotes(html: string): string | undefined {
  const notesMatch = html.match(/<div class="poem_notes">([\s\S]*?)<\/div>/)
  if (notesMatch && notesMatch[1]) {
    return cleanHtmlContent(notesMatch[1])
  }
  return undefined
}

// Extract poem content
function extractPoemContent(html: string): string {
  const poemBodyMatch = html.match(/<div class="poem_body">([\s\S]*?)<\/div>/)
  if (poemBodyMatch && poemBodyMatch[1]) {
    return cleanHtmlContent(poemBodyMatch[1])
  }
  return ''
}

async function seed() {
  try {
    console.log('🔄 Starting database seed...')
    
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI)
    console.log('✅ Connected to MongoDB')
    
    // Clear existing data
    await Poet.deleteMany({})
    await Poem.deleteMany({})
    await Editor.deleteMany({})
    console.log('✅ Cleared existing data')
    
    // Create default editor
    const editorPassword = await bcrypt.hash('admin123', 10)
    const editor = await Editor.create({
      fullname: 'Admin User',
      email: 'admin@serpay.com',
      password: editorPassword,
      is_deleted: false
    })
    console.log('✅ Created editor:', editor.email)
    
    // Load scraped data
    const dataDir = path.join(process.cwd(), 'data', 'complete')
    const allPoetsFile = path.join(dataDir, 'all-poets-complete.json')
    
    const poetsData = JSON.parse(await fs.readFile(allPoetsFile, 'utf-8'))
    console.log(`📚 Loading ${poetsData.length} poets...`)
    
    // Import poets and poems
    for (const poetData of poetsData) {
      // Clean up URL encoding
      const cleanUrl = decodeURIComponent(poetData.url)
      
      // Create poet
      const poet = await Poet.create({
        fullname: poetData.fullname,
        url: cleanUrl,
        birth_date: poetData.birth_date || undefined,
        death_date: poetData.death_date || undefined,
        bio: poetData.bio || undefined,
        wiki_link: poetData.wiki_link || undefined,
        avatar: poetData.avatar || undefined,
        is_deleted: false
      })
      
      console.log(`\n✅ Created poet: ${poet.fullname}`)
      
      // Create poems
      if (poetData.poems && poetData.poems.length > 0) {
        let poemCount = 0
        
        for (const poemData of poetData.poems) {
          try {
            // Clean the title (remove numbering if present)
            const cleanTitle = poemData.title.replace(/^\d+\.\s*/, '')
            
            // Extract clean content
            const content = extractPoemContent(poemData.content)
            
            // Skip if no content
            if (!content) {
              console.log(`  ⚠️  Skipped poem (no content): ${cleanTitle}`)
              continue
            }
            
            // Extract categories and notes
            const categories = extractCategories(poemData.content)
            const notes = extractNotes(poemData.content)
            
            await Poem.create({
              title: cleanTitle,
              url: decodeURIComponent(poemData.url),
              content: content,
              year: poemData.year || undefined,
              notes: notes,
              youtube_link: poemData.youtube_link || undefined,
              category: categories,
              author: poet._id,
              added_by: editor._id,
              is_approved: true
            })
            
            poemCount++
          } catch (error) {
            console.error(`  ❌ Failed to create poem: ${poemData.title}`, error)
          }
        }
        
        console.log(`  ✅ Created ${poemCount} poems`)
      }
    }
    
    // Final summary
    const poetCount = await Poet.countDocuments()
    const poemCount = await Poem.countDocuments()
    
    console.log('\n✨ Seeding completed!')
    console.log(`📊 Summary:`)
    console.log(`   Poets: ${poetCount}`)
    console.log(`   Poems: ${poemCount}`)
    console.log(`   Editors: 1`)
    console.log(`\n🔑 Admin credentials:`)
    console.log(`   Email: admin@serpay.com`)
    console.log(`   Password: admin123`)
    
  } catch (error) {
    console.error('❌ Error seeding database:', error)
  } finally {
    await mongoose.disconnect()
    process.exit()
  }
}

// Run the seed
seed()
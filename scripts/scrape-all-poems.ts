import { chromium } from 'playwright'
import fs from 'fs/promises'
import path from 'path'

const BASE_URL = 'https://serpay.penjire.com'
const DATA_DIR = path.join(process.cwd(), 'data', 'complete')

interface Poet {
  fullname: string
  url: string
  birth_date?: string
  death_date?: string
  bio?: string
  wiki_link?: string
  avatar?: string
  poems: Poem[]
}

interface Poem {
  title: string
  url: string
  content: string
  year?: string
  notes?: string
  youtube_link?: string
  category?: string[]
}

async function scrapeAllPoems() {
  await fs.mkdir(DATA_DIR, { recursive: true })
  
  const browser = await chromium.launch({ 
    headless: true,
    timeout: 60000
  })
  
  try {
    const page = await browser.newPage()
    page.setDefaultTimeout(30000)
    
    // Navigate to homepage
    console.log('📖 Loading homepage...')
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    
    // Get all poet links
    const poetLinks = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/p/"]'))
      return links
        .filter(link => {
          const href = link.getAttribute('href') || ''
          return href.split('/').length === 3
        })
        .map(link => ({
          url: link.getAttribute('href') || '',
          name: link.textContent?.trim() || ''
        }))
    })
    
    console.log(`✅ Found ${poetLinks.length} poets`)
    
    // Process each poet
    for (let i = 0; i < poetLinks.length; i++) {
      const poet = poetLinks[i]
      console.log(`\n📝 [${i + 1}/${poetLinks.length}] Processing: ${poet.name}`)
      
      try {
        const poetData = await scrapePoetComplete(page, poet)
        
        if (poetData) {
          // Save poet data
          const filename = `${poetData.url}.json`
          await fs.writeFile(
            path.join(DATA_DIR, filename),
            JSON.stringify(poetData, null, 2)
          )
          console.log(`💾 Saved: ${filename} (${poetData.poems.length} poems)`)
        }
      } catch (error) {
        console.error(`❌ Failed to process poet: ${poet.name}`, error)
      }
    }
    
  } finally {
    await browser.close()
  }
  
  // Create combined file
  await createFinalData()
}

async function scrapePoetComplete(page: any, poet: { url: string; name: string }): Promise<Poet | null> {
  try {
    // Navigate to poet page
    await page.goto(`${BASE_URL}${poet.url}`, { waitUntil: 'domcontentloaded' })
    await page.waitForTimeout(2000)
    
    // Extract poet info and all poem links
    const { poetInfo, poemLinks } = await page.evaluate((poetUrl) => {
      const data: any = {
        fullname: '',
        url: poetUrl.split('/').pop() || ''
      }
      
      // Get poet name
      const nameEl = document.querySelector('h1') || document.querySelector('.poet-name')
      if (nameEl) data.fullname = nameEl.textContent?.trim() || ''
      
      // Get bio
      const bioEl = document.querySelector('.prose') || document.querySelector('[class*="bio"]')
      if (bioEl) data.bio = bioEl.textContent?.trim()
      
      // Get dates
      const pageText = document.body.innerText
      const dateMatch = pageText.match(/(\d{4})\s*[-–]\s*(\d{4})/)
      if (dateMatch) {
        data.birth_date = dateMatch[1]
        data.death_date = dateMatch[2]
      }
      
      // Get all poem links
      const links = Array.from(document.querySelectorAll('a'))
        .filter(a => {
          const href = a.getAttribute('href') || ''
          return href.includes(`${poetUrl}/`) && href.split('/').length > 3
        })
        .map(a => ({
          url: a.getAttribute('href') || '',
          title: a.textContent?.trim() || ''
        }))
      
      return { poetInfo: data, poemLinks: links }
    }, poet.url)
    
    // Set poet name if not found
    if (!poetInfo.fullname) {
      poetInfo.fullname = poet.name
    }
    
    console.log(`  Found ${poemLinks.length} poems to scrape`)
    
    // Scrape all poems with progress indicator
    const poems: Poem[] = []
    const batchSize = 5 // Process in batches to show progress
    
    for (let i = 0; i < poemLinks.length; i += batchSize) {
      const batch = poemLinks.slice(i, i + batchSize)
      const progress = Math.min(i + batchSize, poemLinks.length)
      console.log(`  📄 Scraping poems ${i + 1}-${progress} of ${poemLinks.length}`)
      
      for (const poemLink of batch) {
        try {
          await page.goto(`${BASE_URL}${poemLink.url}`, { waitUntil: 'domcontentloaded' })
          await page.waitForTimeout(1000)
          
          const poemData = await page.evaluate(() => {
            const content = document.querySelector('article') || 
                          document.querySelector('.poem-content') || 
                          document.querySelector('[class*="poem"]') ||
                          document.querySelector('main')
            
            return {
              content: content?.innerHTML || ''
            }
          })
          
          if (poemData.content) {
            poems.push({
              title: poemLink.title.replace(/^\d+\.\s*/, ''), // Remove numbering
              url: poemLink.url.split('/').pop() || '',
              content: poemData.content
            })
          }
        } catch (error) {
          console.error(`    ❌ Failed: ${poemLink.title}`)
        }
      }
      
      // Small delay between batches
      await page.waitForTimeout(500)
    }
    
    return {
      ...poetInfo,
      poems
    }
    
  } catch (error) {
    console.error(`Failed to scrape poet: ${poet.name}`, error)
    return null
  }
}

async function createFinalData() {
  try {
    const files = await fs.readdir(DATA_DIR)
    const jsonFiles = files.filter(f => f.endsWith('.json') && f !== 'all-poets-complete.json')
    
    if (jsonFiles.length === 0) {
      console.log('⚠️  No poet files found')
      return
    }
    
    const allPoets = []
    let totalPoems = 0
    
    for (const file of jsonFiles) {
      const content = await fs.readFile(path.join(DATA_DIR, file), 'utf-8')
      const poet = JSON.parse(content)
      allPoets.push(poet)
      totalPoems += poet.poems.length
    }
    
    // Save combined file
    await fs.writeFile(
      path.join(DATA_DIR, 'all-poets-complete.json'),
      JSON.stringify(allPoets, null, 2)
    )
    
    console.log(`\n✨ Scraping Complete!`)
    console.log(`📊 Final Summary:`)
    console.log(`   Poets: ${allPoets.length}`)
    console.log(`   Total Poems: ${totalPoems}`)
    console.log(`   Average Poems per Poet: ${Math.round(totalPoems / allPoets.length)}`)
    console.log(`   Output: ${DATA_DIR}`)
    
    // Create import script
    const importScript = `// MongoDB import script for complete data
import dbConnect from '@/lib/db/mongodb'
import Poet from '@/lib/db/models/poet'
import Poem from '@/lib/db/models/poem'
import Editor from '@/lib/db/models/editor'
import bcrypt from 'bcryptjs'
import fs from 'fs/promises'
import path from 'path'

// Run: npx tsx scripts/import-complete-data.ts

const dataFile = path.join(process.cwd(), 'data', 'complete', 'all-poets-complete.json')

async function importData() {
  await dbConnect()
  
  try {
    // Clear existing data
    await Poet.deleteMany({})
    await Poem.deleteMany({})
    await Editor.deleteMany({})
    
    // Create default editor
    const editor = await Editor.create({
      fullname: 'Admin User',
      email: 'admin@serpay.com',
      password: await bcrypt.hash('admin123', 10),
      is_deleted: false
    })
    
    // Load data
    const poetsData = JSON.parse(await fs.readFile(dataFile, 'utf-8'))
    
    // Import poets and poems
    for (const poetData of poetsData) {
      const poet = await Poet.create({
        fullname: poetData.fullname,
        url: decodeURIComponent(poetData.url),
        birth_date: poetData.birth_date,
        death_date: poetData.death_date,
        bio: poetData.bio,
        is_deleted: false
      })
      
      // Import poems
      for (const poemData of poetData.poems) {
        // Extract clean content from HTML
        const content = poemData.content
          .replace(/<\\/p>/g, '\\n\\n')
          .replace(/<br\\s*\\/?>/g, '\\n')
          .replace(/<[^>]*>/g, '')
          .replace(/&nbsp;/g, ' ')
          .trim()
        
        await Poem.create({
          title: poemData.title,
          url: decodeURIComponent(poemData.url),
          content: content,
          author: poet._id,
          added_by: editor._id,
          is_approved: true
        })
      }
    }
    
    console.log('✅ Import completed!')
    console.log('Poets:', await Poet.countDocuments())
    console.log('Poems:', await Poem.countDocuments())
    
  } catch (error) {
    console.error('Error:', error)
  } finally {
    process.exit()
  }
}

importData()
`

    await fs.writeFile(
      path.join(process.cwd(), 'scripts', 'import-complete-data.ts'),
      importScript
    )
    console.log('📝 Created import-complete-data.ts')
    
  } catch (error) {
    console.error('Failed to create final data:', error)
  }
}

// Run the scraper
console.log('🚀 Starting complete poem scraper...')
console.log('📌 This will scrape ALL poems for each poet')
console.log('⏱️  This may take several minutes...')
console.log('---')

scrapeAllPoems().catch(console.error)
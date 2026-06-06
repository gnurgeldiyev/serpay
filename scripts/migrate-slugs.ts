import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { slugify } from '../lib/utils'
import Poet from '../lib/db/models/poet'
import Poem from '../lib/db/models/poem'

/**
 * Backfill a clean, URL-safe ASCII `slug` for every poet and poem.
 *
 * Idempotent and additive: it only sets `slug` where missing/empty and never
 * touches `title`, `url`, or `content`. Safe to re-run.
 *
 *   npm run migrate:slugs
 */

// Next.js auto-loads .env.local; standalone scripts don't, so load it manually
// (falling back to whatever dotenv/config already put on process.env).
function loadEnvLocal() {
  if (process.env.MONGODB_URI) return
  const file = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    const key = m[1]
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = val
  }
}

async function migrate() {
  loadEnvLocal()

  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error('MONGODB_URI is not set (.env.local or environment)')
  }

  await mongoose.connect(uri)
  console.log('Connected to MongoDB')

  let poetCount = 0
  for (const poet of await Poet.find({})) {
    const slug = slugify(poet.url || poet.fullname)
    if (slug && poet.slug !== slug) {
      poet.slug = slug
      await poet.save()
      poetCount++
      console.log(`poet: ${poet.fullname} -> ${slug}`)
    }
  }

  let poemCount = 0
  for (const poem of await Poem.find({})) {
    const slug = slugify(poem.title || poem.url)
    if (slug && poem.slug !== slug) {
      poem.slug = slug
      await poem.save()
      poemCount++
    }
  }

  console.log(`\nDone. Updated ${poetCount} poets and ${poemCount} poems.`)
  await mongoose.connection.close()
}

migrate().catch((err) => {
  console.error('Migration failed:', err)
  process.exit(1)
})

import { config } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Poet from '../lib/db/models/poet'
import Poem from '../lib/db/models/poem'
import { slugify } from '../lib/utils'

config({ path: '.env.local', quiet: true })

interface ExistingPoem {
  _id: mongoose.Types.ObjectId
  title: string
  url: string
  created_at: Date
  updated_at: Date
}

const APPLY = process.argv.includes('--apply')
const POET_URL = 'gurbannazar-ezizow'
const EXPECTED_POEM_COUNT = 245
const BACKUP_FILE = path.join(
  process.cwd(),
  'data',
  'backups',
  'gurbannazar-ezizow-before-ascii-url-sync-2026-08-15.json',
)

function comparisonKey(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[ä]/g, 'a')
    .replace(/[ç]/g, 'c')
    .replace(/[ň]/g, 'n')
    .replace(/[ö]/g, 'o')
    .replace(/[ş]/g, 's')
    .replace(/[ü]/g, 'u')
    .replace(/[ý]/g, 'y')
    .replace(/[ž]/g, 'z')
    .replace(/[^a-z0-9]/g, '')
}

function uniqueUrl(title: string, usedUrls: Set<string>): string {
  const base = slugify(title)
  if (!base) {
    throw new Error(`Cannot create a URL slug for title: ${title}`)
  }

  let candidate = base
  let suffix = 2
  while (usedUrls.has(comparisonKey(candidate))) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  usedUrls.add(comparisonKey(candidate))
  return candidate
}

async function writeBackup(poems: ExistingPoem[]): Promise<void> {
  await fs.mkdir(path.dirname(BACKUP_FILE), { recursive: true })
  try {
    await fs.access(BACKUP_FILE)
    console.log(`Backup already exists: ${path.relative(process.cwd(), BACKUP_FILE)}`)
  } catch {
    await fs.writeFile(BACKUP_FILE, `${JSON.stringify(poems, null, 2)}\n`, 'utf8')
    console.log(`Backup written: ${path.relative(process.cwd(), BACKUP_FILE)}`)
  }
}

async function run(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured')
  }
  await mongoose.connect(mongoUri)

  const poet = await Poet.findOne({
    url: POET_URL,
    is_deleted: { $ne: true },
  }).lean()
  if (!poet) {
    throw new Error(`Poet not found: ${POET_URL}`)
  }

  const poems = await Poem.find({
    author: poet._id,
    is_deleted: { $ne: true },
  })
    .select('title url created_at updated_at')
    .sort({ created_at: 1, _id: 1 })
    .lean<ExistingPoem[]>()
  if (poems.length !== EXPECTED_POEM_COUNT) {
    throw new Error(`Expected ${EXPECTED_POEM_COUNT} active poems, found ${poems.length}`)
  }

  const usedUrls = new Set<string>()
  const desired = poems.map((poem) => ({
    poem,
    url: uniqueUrl(poem.title, usedUrls),
  }))
  const changes = desired.filter(({ poem, url }) => poem.url !== url)

  console.log(`Poems audited: ${poems.length}`)
  console.log(`Unique canonical slugs: ${usedUrls.size}`)
  console.log(`Slugs needing cleanup: ${changes.length}`)
  for (const { poem, url } of changes) {
    console.log(`- ${poem.url} -> ${url}`)
  }

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to normalize the URL slugs.')
    return
  }
  if (changes.length === 0) {
    console.log('\nNothing to update.')
    return
  }

  await writeBackup(poems)
  const now = new Date()
  const result = await Poem.bulkWrite(
    changes.map(({ poem, url }) => ({
      updateOne: {
        filter: { _id: poem._id, url: poem.url },
        update: { $set: { url, updated_at: now } },
      },
    })),
    { ordered: true },
  )
  if (result.matchedCount !== changes.length) {
    throw new Error(`Expected ${changes.length} matched updates, database reported ${result.matchedCount}`)
  }

  const verified = await Poem.find({
    author: poet._id,
    is_deleted: { $ne: true },
  })
    .select('title url created_at')
    .sort({ created_at: 1, _id: 1 })
    .lean<ExistingPoem[]>()
  const verificationUrls = new Set<string>()
  const failures = verified.filter((poem) => poem.url !== uniqueUrl(poem.title, verificationUrls))
  if (verified.length !== EXPECTED_POEM_COUNT || verificationUrls.size !== EXPECTED_POEM_COUNT || failures.length > 0) {
    throw new Error(`Post-update verification failed for ${failures.length} URL slugs`)
  }

  console.log(`\nUpdated and verified ${changes.length} URL slugs.`)
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })

import { config } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Poet from '../lib/db/models/poet'
import Poem from '../lib/db/models/poem'

config({ path: '.env.local', quiet: true })

interface AliasMapPoem {
  _id: string
  url: string
  aliases: string[]
}

interface ExistingPoem {
  _id: mongoose.Types.ObjectId
  title: string
  url: string
  url_aliases?: string[] | null
}

const APPLY = process.argv.includes('--apply')
const POET_URL = 'gurbannazar-ezizow'
const EXPECTED_POEM_COUNT = 245
const ALIAS_MAP_FILE = path.join(
  process.cwd(),
  'data',
  'migrations',
  'gurbannazar-ezizow-url-aliases.json',
)
const ALIAS_BACKUP_FILE = path.join(
  process.cwd(),
  'data',
  'backups',
  'gurbannazar-ezizow-before-url-alias-backfill-2026-08-15.json',
)

function aliasesForUrl(url: string): string[] {
  return [...new Set([url, url.normalize('NFC'), url.normalize('NFD')])]
}

async function writeBackup(poems: ExistingPoem[]): Promise<void> {
  try {
    await fs.access(ALIAS_BACKUP_FILE)
    console.log(`Backup already exists: ${path.relative(process.cwd(), ALIAS_BACKUP_FILE)}`)
  } catch {
    await fs.writeFile(ALIAS_BACKUP_FILE, `${JSON.stringify(poems, null, 2)}\n`, 'utf8')
    console.log(`Backup written: ${path.relative(process.cwd(), ALIAS_BACKUP_FILE)}`)
  }
}

async function run(): Promise<void> {
  const aliasesById = new Map<string, Set<string>>()
  const aliasMap = JSON.parse(await fs.readFile(ALIAS_MAP_FILE, 'utf8')) as AliasMapPoem[]
  for (const poem of aliasMap) {
    const aliases = aliasesById.get(poem._id) || new Set<string>()
    for (const legacyUrl of poem.aliases) {
      for (const alias of aliasesForUrl(legacyUrl)) {
        aliases.add(alias)
      }
    }
    aliasesById.set(poem._id, aliases)
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured')
  }
  await mongoose.connect(mongoUri)

  const poet = await Poet.findOne({ url: POET_URL, is_deleted: { $ne: true } }).lean()
  if (!poet) {
    throw new Error(`Poet not found: ${POET_URL}`)
  }
  const poems = await Poem.find({ author: poet._id, is_deleted: { $ne: true } })
    .select('title url url_aliases')
    .lean<ExistingPoem[]>()
  if (poems.length !== EXPECTED_POEM_COUNT) {
    throw new Error(`Expected ${EXPECTED_POEM_COUNT} active poems, found ${poems.length}`)
  }

  const desired = poems.map((poem) => {
    const aliases = new Set(poem.url_aliases || [])
    for (const alias of aliasesById.get(poem._id.toString()) || []) {
      if (alias !== poem.url) {
        aliases.add(alias)
      }
    }
    aliases.delete(poem.url)
    return { poem, aliases: [...aliases].sort() }
  })

  const aliasOwners = new Map<string, string>()
  for (const { poem, aliases } of desired) {
    for (const alias of aliases) {
      const normalizedAlias = alias.normalize('NFC')
      const owner = aliasOwners.get(normalizedAlias)
      if (owner && owner !== poem._id.toString()) {
        throw new Error(`Legacy URL alias collision: ${normalizedAlias}`)
      }
      aliasOwners.set(normalizedAlias, poem._id.toString())
    }
  }

  const changes = desired.filter(({ poem, aliases }) => (
    JSON.stringify([...(poem.url_aliases || [])].sort()) !== JSON.stringify(aliases)
  ))
  console.log(`Poems audited: ${poems.length}`)
  console.log(`Unique legacy aliases: ${aliasOwners.size}`)
  console.log(`Poems needing alias backfill: ${changes.length}`)

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to save the legacy URL aliases.')
    return
  }
  if (changes.length === 0) {
    console.log('\nNothing to update.')
    return
  }

  await writeBackup(poems)
  const result = await Poem.bulkWrite(
    changes.map(({ poem, aliases }) => ({
      updateOne: {
        filter: { _id: poem._id, url: poem.url },
        update: { $set: { url_aliases: aliases, updated_at: new Date() } },
      },
    })),
    { ordered: true },
  )
  if (result.matchedCount !== changes.length) {
    throw new Error(`Expected ${changes.length} matched updates, database reported ${result.matchedCount}`)
  }

  const verified = await Poem.countDocuments({
    author: poet._id,
    url_aliases: 'adamlary-söýmek-ýeňil-iş-däldir-adamlary-söýmek-uly-hünärdir',
  })
  if (verified !== 1) {
    throw new Error(`Expected the reported legacy URL to resolve once, found ${verified}`)
  }

  console.log(`\nBackfilled and verified aliases for ${changes.length} poems.`)
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })

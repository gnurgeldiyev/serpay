import { config } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Poet from '../lib/db/models/poet'
import Poem from '../lib/db/models/poem'
import { slugify } from '../lib/utils'

config({ path: '.env.local', quiet: true })

type Category = 'Durmuş' | 'Söýgi' | 'Tebigat' | 'Watan' | 'Dostluk' | 'Çaga'

interface ExtractedPoem {
  position: number
  title: string
  content: string
  notes?: string | null
  year?: string | null
  source_book_page: number
}

interface ExtractedBook {
  poet: {
    fullname: string
    url: string
  }
  poems: ExtractedPoem[]
}

interface ExistingPoem {
  _id: mongoose.Types.ObjectId
  title: string
  url: string
  content: string
  notes?: string | null
  year?: string | null
  category?: string[] | null
  created_at: Date
  updated_at: Date
  [key: string]: unknown
}

const DATA_FILE = path.join(
  process.cwd(),
  'data',
  'pdf',
  'gurbannazar-ezizow-saylanan-eserler.json',
)
const BACKUP_FILE = path.join(
  process.cwd(),
  'data',
  'backups',
  'gurbannazar-ezizow-before-editorial-sync-2026-08-15.json',
)
const APPLY = process.argv.includes('--apply')
const FIRST_IMPORTED_POSITION = 102
const LAST_IMPORTED_POSITION = 244
const IMPORT_DATE = '2026-08-15'

const categoriesByPosition: Record<number, Category[]> = {
  102: ['Tebigat', 'Durmuş'],
  103: ['Tebigat', 'Durmuş'],
  104: ['Durmuş', 'Dostluk', 'Tebigat'],
  105: ['Durmuş', 'Tebigat'],
  106: ['Tebigat', 'Durmuş'],
  107: ['Tebigat', 'Watan', 'Durmuş'],
  108: ['Söýgi', 'Tebigat', 'Durmuş'],
  109: ['Söýgi', 'Durmuş'],
  110: ['Tebigat', 'Durmuş'],
  111: ['Tebigat', 'Watan', 'Durmuş'],
  112: ['Tebigat'],
  113: ['Tebigat', 'Durmuş'],
  114: ['Tebigat', 'Durmuş'],
  115: ['Durmuş', 'Tebigat'],
  116: ['Tebigat', 'Durmuş'],
  117: ['Durmuş', 'Tebigat'],
  118: ['Tebigat', 'Durmuş'],
  119: ['Durmuş', 'Tebigat'],
  120: ['Tebigat'],
  121: ['Durmuş'],
  122: ['Durmuş', 'Watan'],
  123: ['Durmuş'],
  124: ['Durmuş'],
  125: ['Durmuş'],
  126: ['Durmuş', 'Dostluk'],
  127: ['Durmuş'],
  128: ['Durmuş'],
  129: ['Durmuş'],
  130: ['Durmuş', 'Watan'],
  131: ['Dostluk', 'Durmuş'],
  132: ['Durmuş'],
  133: ['Durmuş'],
  134: ['Durmuş', 'Çaga'],
  135: ['Watan', 'Durmuş'],
  136: ['Durmuş'],
  137: ['Durmuş'],
  138: ['Durmuş'],
  139: ['Durmuş'],
  140: ['Durmuş'],
  141: ['Durmuş'],
  142: ['Tebigat', 'Durmuş'],
  143: ['Watan', 'Durmuş'],
  144: ['Watan', 'Durmuş', 'Çaga'],
  145: ['Watan', 'Durmuş', 'Çaga'],
  146: ['Söýgi'],
  147: ['Söýgi'],
  148: ['Söýgi'],
  149: ['Söýgi'],
  150: ['Söýgi'],
  151: ['Watan', 'Tebigat', 'Durmuş'],
  152: ['Tebigat', 'Durmuş'],
  153: ['Tebigat'],
  154: ['Durmuş'],
  155: ['Watan', 'Durmuş'],
  156: ['Çaga', 'Durmuş'],
  157: ['Watan', 'Tebigat'],
  158: ['Durmuş'],
  159: ['Dostluk', 'Durmuş'],
  160: ['Dostluk', 'Durmuş'],
  161: ['Durmuş', 'Tebigat'],
  162: ['Söýgi', 'Durmuş'],
  163: ['Durmuş'],
  164: ['Çaga', 'Durmuş'],
  165: ['Durmuş', 'Tebigat'],
  166: ['Dostluk', 'Söýgi', 'Durmuş'],
  167: ['Durmuş'],
  168: ['Dostluk', 'Durmuş'],
  169: ['Durmuş'],
  170: ['Watan', 'Durmuş'],
  171: ['Söýgi', 'Durmuş'],
  172: ['Durmuş'],
  173: ['Durmuş'],
  174: ['Durmuş'],
  175: ['Durmuş'],
  176: ['Durmuş'],
  177: ['Durmuş', 'Tebigat'],
  178: ['Durmuş', 'Dostluk', 'Söýgi'],
  179: ['Durmuş'],
  180: ['Durmuş', 'Dostluk'],
  181: ['Watan', 'Durmuş'],
  182: ['Durmuş', 'Çaga'],
  183: ['Watan', 'Durmuş'],
  184: ['Tebigat', 'Durmuş'],
  185: ['Durmuş'],
  186: ['Söýgi', 'Durmuş'],
  187: ['Durmuş'],
  188: ['Durmuş'],
  189: ['Durmuş'],
  190: ['Durmuş'],
  191: ['Dostluk', 'Durmuş'],
  192: ['Durmuş'],
  193: ['Durmuş', 'Çaga'],
  194: ['Söýgi', 'Durmuş'],
  195: ['Durmuş'],
  196: ['Durmuş', 'Tebigat'],
  197: ['Durmuş'],
  198: ['Durmuş'],
  199: ['Durmuş'],
  200: ['Durmuş'],
  201: ['Durmuş'],
  202: ['Durmuş'],
  203: ['Durmuş'],
  204: ['Durmuş', 'Tebigat'],
  205: ['Durmuş'],
  206: ['Watan', 'Durmuş'],
  207: ['Durmuş', 'Dostluk'],
  208: ['Dostluk', 'Durmuş'],
  209: ['Söýgi'],
  210: ['Durmuş'],
  211: ['Durmuş'],
  212: ['Durmuş'],
  213: ['Watan', 'Tebigat', 'Durmuş'],
  214: ['Durmuş'],
  215: ['Durmuş'],
  216: ['Durmuş', 'Watan'],
  217: ['Tebigat', 'Durmuş'],
  218: ['Durmuş'],
  219: ['Durmuş'],
  220: ['Durmuş'],
  221: ['Durmuş'],
  222: ['Durmuş', 'Watan'],
  223: ['Dostluk', 'Durmuş'],
  224: ['Durmuş'],
  225: ['Watan', 'Durmuş'],
  226: ['Durmuş'],
  227: ['Watan', 'Durmuş'],
  228: ['Watan', 'Durmuş', 'Çaga'],
  229: ['Watan', 'Durmuş', 'Çaga'],
  230: ['Watan', 'Söýgi', 'Durmuş'],
  231: ['Watan', 'Durmuş'],
  232: ['Watan', 'Söýgi', 'Durmuş'],
  233: ['Watan', 'Durmuş'],
  234: ['Watan', 'Durmuş', 'Çaga'],
  235: ['Watan', 'Durmuş'],
  236: ['Durmuş', 'Watan'],
  237: ['Watan', 'Durmuş'],
  238: ['Watan', 'Durmuş'],
  239: ['Durmuş', 'Dostluk'],
  240: ['Watan', 'Durmuş'],
  241: ['Söýgi', 'Durmuş'],
  242: ['Watan', 'Durmuş'],
  243: ['Söýgi', 'Durmuş'],
  244: ['Tebigat', 'Durmuş'],
}

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

function uniqueUrl(title: string, sourcePage: number, usedUrls: Set<string>): string {
  const base = slugify(title) || `gosgy-${sourcePage}`
  let candidate = base
  let suffix = 2

  while (usedUrls.has(comparisonKey(candidate))) {
    candidate = `${base}-${suffix}`
    suffix += 1
  }
  usedUrls.add(comparisonKey(candidate))
  return candidate
}

function sameArray(left: string[] | null | undefined, right: string[]): boolean {
  return JSON.stringify(left || []) === JSON.stringify(right)
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
  const book = JSON.parse(await fs.readFile(DATA_FILE, 'utf8')) as ExtractedBook
  const imported = book.poems.filter(
    (poem) => poem.position >= FIRST_IMPORTED_POSITION
      && poem.position <= LAST_IMPORTED_POSITION,
  )

  if (book.poems.length !== 245 || imported.length !== 143) {
    throw new Error(`Expected 245 source poems and 143 imported poems; found ${book.poems.length} and ${imported.length}`)
  }
  const mappedPositions = Object.keys(categoriesByPosition).map(Number).sort((a, b) => a - b)
  if (
    mappedPositions.length !== imported.length
    || mappedPositions.some((position, index) => position !== imported[index].position)
  ) {
    throw new Error('The editorial category map does not cover source positions 102-244 exactly')
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured')
  }
  await mongoose.connect(mongoUri)

  const poet = await Poet.findOne({
    url: book.poet.url,
    is_deleted: { $ne: true },
  }).lean()
  if (!poet) {
    throw new Error(`Poet not found: ${book.poet.url}`)
  }

  const existing = await Poem.find({
    author: poet._id,
    is_deleted: { $ne: true },
  }).lean<ExistingPoem[]>()
  if (existing.length !== 245) {
    throw new Error(`Expected 245 active database poems, found ${existing.length}`)
  }

  const byContent = new Map<string, ExistingPoem[]>()
  for (const poem of existing) {
    const key = comparisonKey(poem.content)
    byContent.set(key, [...(byContent.get(key) || []), poem])
  }

  const matched = imported.map((source) => {
    const candidates = byContent.get(comparisonKey(source.content)) || []
    if (candidates.length !== 1) {
      throw new Error(`Expected one exact content match for source #${source.position} ${source.title}; found ${candidates.length}`)
    }
    const current = candidates[0]
    const createdDate = new Date(current.created_at).toISOString().slice(0, 10)
    if (createdDate !== IMPORT_DATE) {
      throw new Error(`Refusing to edit ${current.title}: created ${createdDate}, not on import date ${IMPORT_DATE}`)
    }
    return { source, current }
  })

  const uniqueIds = new Set(matched.map(({ current }) => current._id.toString()))
  if (uniqueIds.size !== imported.length) {
    throw new Error('Imported source poems did not map one-to-one to database records')
  }

  const targetIds = uniqueIds
  const usedUrls = new Set(
    existing
      .filter((poem) => !targetIds.has(poem._id.toString()))
      .map((poem) => comparisonKey(poem.url)),
  )
  const desired = matched.map(({ source, current }) => ({
    source,
    current,
    title: source.title,
    url: uniqueUrl(source.title, source.source_book_page, usedUrls),
    content: source.content,
    notes: source.notes || null,
    year: source.year || null,
    category: categoriesByPosition[source.position],
  }))

  const changes = desired.filter(({ current, title, url, content, notes, year, category }) => (
    current.title !== title
    || current.url !== url
    || current.content !== content
    || (current.notes || null) !== notes
    || (current.year || null) !== year
    || !sameArray(current.category, category)
  ))
  const categoryCounts = new Map<Category, number>()
  for (const poem of desired) {
    for (const category of poem.category) {
      categoryCounts.set(category, (categoryCounts.get(category) || 0) + 1)
    }
  }

  console.log(`Database poems: ${existing.length}`)
  console.log(`Safely matched imported poems: ${matched.length}`)
  console.log(`Records needing editorial sync: ${changes.length}`)
  console.log(`Imported poems with notes: ${desired.filter((poem) => poem.notes).length}`)
  console.log(`Imported poems with written dates/years: ${desired.filter((poem) => poem.year).length}`)
  console.log(`Category assignments: ${JSON.stringify(Object.fromEntries(categoryCounts))}`)

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to update the imported records.')
    return
  }
  if (changes.length === 0) {
    console.log('\nNothing to update.')
    return
  }

  await writeBackup(matched.map(({ current }) => current))
  const now = new Date()
  const result = await Poem.bulkWrite(
    changes.map(({ current, title, url, content, notes, year, category }) => ({
      updateOne: {
        filter: { _id: current._id, created_at: current.created_at },
        update: {
          $set: {
            title,
            url,
            content,
            notes,
            year,
            category,
            updated_at: now,
          },
        },
      },
    })),
    { ordered: true },
  )
  if (result.matchedCount !== changes.length) {
    throw new Error(`Expected ${changes.length} matched updates, database reported ${result.matchedCount}`)
  }

  const verified = await Poem.find({ _id: { $in: [...targetIds] } })
    .select('title url content notes year category')
    .lean<ExistingPoem[]>()
  const verifiedById = new Map(verified.map((poem) => [poem._id.toString(), poem]))
  const failures = desired.filter(({ current, title, url, content, notes, year, category }) => {
    const poem = verifiedById.get(current._id.toString())
    return !poem
      || poem.title !== title
      || poem.url !== url
      || poem.content !== content
      || (poem.notes || null) !== notes
      || (poem.year || null) !== year
      || !sameArray(poem.category, category)
  })
  if (failures.length > 0) {
    throw new Error(`Post-update verification failed for ${failures.length} records`)
  }

  console.log(`\nUpdated and verified ${changes.length} imported records.`)
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })

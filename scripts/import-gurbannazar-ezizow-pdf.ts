import 'dotenv/config'
import { config } from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import mongoose from 'mongoose'
import Poet from '../lib/db/models/poet'
import Poem from '../lib/db/models/poem'
import Editor from '../lib/db/models/editor'
import { slugify } from '../lib/utils'

config({ path: '.env.local', quiet: true })

interface ExtractedPoem {
  position: number
  title: string
  title_type: 'named' | 'first_line'
  content: string
  notes?: string | null
  year?: string | null
  source_book_page: number
  source_pdf_page: number
}

interface ExtractedBook {
  poet: {
    fullname: string
    url: string
  }
  extraction: {
    work_count: number
  }
  poems: ExtractedPoem[]
}

interface ExistingPoem {
  _id: mongoose.Types.ObjectId
  title: string
  url: string
  content: string
  is_deleted?: boolean
}

const DATA_FILE = path.join(
  process.cwd(),
  'data',
  'pdf',
  'gurbannazar-ezizow-saylanan-eserler.json',
)
const APPLY = process.argv.includes('--apply')

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

function contentKey(value: string): string {
  return comparisonKey(value).slice(0, 160)
}

function editDistance(left: string, right: string): number {
  const row = Array.from({ length: right.length + 1 }, (_, index) => index)
  for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
    let diagonal = row[0]
    row[0] = leftIndex
    for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
      const previous = row[rightIndex]
      row[rightIndex] = Math.min(
        row[rightIndex] + 1,
        row[rightIndex - 1] + 1,
        diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
      )
      diagonal = previous
    }
  }
  return row[right.length]
}

function isSamePoem(extracted: ExtractedPoem, existing: ExistingPoem): boolean {
  const extractedTitle = comparisonKey(extracted.title)
  const existingTitle = comparisonKey(existing.title)
  const shorterTitleLength = Math.min(extractedTitle.length, existingTitle.length)
  if (
    shorterTitleLength >= 20
    && extractedTitle.slice(0, shorterTitleLength) === existingTitle.slice(0, shorterTitleLength)
  ) {
    return true
  }

  const extractedContent = contentKey(extracted.content)
  const existingContent = contentKey(existing.content)
  if (extractedContent.length < 40 || existingContent.length < 40) {
    return comparisonKey(extracted.title) === comparisonKey(existing.title)
  }

  const commonLength = Math.min(extractedContent.length, existingContent.length, 120)
  const extractedStart = extractedContent.slice(0, commonLength)
  const existingStart = existingContent.slice(0, commonLength)
  return editDistance(extractedStart, existingStart) / commonLength <= 0.03
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

async function run(): Promise<void> {
  const book = JSON.parse(await fs.readFile(DATA_FILE, 'utf8')) as ExtractedBook
  if (book.poems.length !== book.extraction.work_count || book.poems.length !== 245) {
    throw new Error(`Expected 245 extracted works, found ${book.poems.length}`)
  }

  const mongoUri = process.env.MONGODB_URI
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not configured')
  }
  await mongoose.connect(mongoUri)
  const poet = await Poet.findOne({
    url: book.poet.url,
    is_deleted: { $ne: true },
  })
  if (!poet) {
    throw new Error(`Poet not found: ${book.poet.url}`)
  }

  const existing = await Poem.find({
    author: poet._id,
    is_deleted: { $ne: true },
  })
    .select('title url content is_deleted')
    .lean<ExistingPoem[]>()

  const matched: Array<{ extracted: ExtractedPoem; existing: ExistingPoem }> = []
  const missing: ExtractedPoem[] = []
  const matchedExistingIds = new Set<string>()
  for (const extracted of book.poems) {
    const match = existing.find(
      (candidate) => !matchedExistingIds.has(candidate._id.toString())
        && isSamePoem(extracted, candidate),
    )
    if (match) {
      matchedExistingIds.add(match._id.toString())
      matched.push({ extracted, existing: match })
    } else {
      missing.push(extracted)
    }
  }

  console.log(`PDF works: ${book.poems.length}`)
  console.log(`Existing database poems for ${poet.fullname}: ${existing.length}`)
  console.log(`Matched as existing: ${matched.length}`)
  console.log(`Missing: ${missing.length}`)

  if (missing.length > 0) {
    console.log('\nMissing works:')
    for (const poem of missing) {
      console.log(`- [book p. ${poem.source_book_page}] ${poem.title}`)
    }
  }

  if (!APPLY) {
    console.log('\nDry run only. Re-run with --apply to insert the missing works.')
    return
  }
  if (missing.length === 0) {
    console.log('\nNothing to insert.')
    return
  }

  const editor = await Editor.findOne({ is_deleted: { $ne: true } }).sort({ created_at: 1 })
  if (!editor) {
    throw new Error('No active editor exists for the required added_by field')
  }

  const usedUrls = new Set(existing.map((poem) => comparisonKey(poem.url)))
  const now = new Date()
  const documents = missing.map((poem) => ({
    title: poem.title,
    url: uniqueUrl(poem.title, poem.source_book_page, usedUrls),
    author: poet._id,
    content: poem.content,
    notes: poem.notes || undefined,
    year: poem.year || undefined,
    category: [],
    added_by: editor._id,
    is_approved: true,
    created_at: now,
    updated_at: now,
  }))

  const inserted = await Poem.insertMany(documents, { ordered: true })
  console.log(`\nInserted ${inserted.length} missing works.`)
}

run()
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
  .finally(async () => {
    await mongoose.disconnect()
  })

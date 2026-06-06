import 'dotenv/config'
import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import Poem from '../lib/db/models/poem'

/** READ-ONLY. Classify each poem's newline format to design a safe fix. */

function loadEnvLocal() {
  if (process.env.MONGODB_URI) return
  const file = path.resolve(process.cwd(), '.env.local')
  if (!fs.existsSync(file)) return
  for (const line of fs.readFileSync(file, 'utf8').split('\n')) {
    const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/)
    if (!m) continue
    let val = m[2].trim()
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1)
    if (!(m[1] in process.env)) process.env[m[1]] = val
  }
}

async function main() {
  loadEnvLocal()
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is not set')
  await mongoose.connect(uri)
  console.log('Connected.\n')

  const poems = await Poem.find({ is_deleted: { $ne: true } }).select('title content').lean()

  const classes: Record<string, string[]> = {
    'B: doubled (has run>=4)': [],
    'A?: only run<=2 (run2=stanza?)': [],
    'single-spaced (only run1)': [],
    'flat (no newlines)': [],
    other: [],
  }

  for (const p of poems) {
    const c = String(p.content ?? '')
    const runs = (c.match(/\n+/g) || []).map((r) => r.length)
    const has = (pred: (n: number) => boolean) => runs.some(pred)
    if (runs.length === 0) classes['flat (no newlines)'].push(p.title)
    else if (has((n) => n >= 4)) classes['B: doubled (has run>=4)'].push(p.title)
    else if (has((n) => n === 2)) classes['A?: only run<=2 (run2=stanza?)'].push(p.title)
    else if (runs.every((n) => n === 1)) classes['single-spaced (only run1)'].push(p.title)
    else classes.other.push(p.title)
  }

  console.log('=== NEWLINE FORMAT CLASSES (counts) ===')
  for (const [k, v] of Object.entries(classes)) console.log(`${k}: ${v.length}`)

  // Show the worrying class in full + a raw sample
  const worry = classes['A?: only run<=2 (run2=stanza?)']
  console.log(`\n=== Class "A?" titles (${worry.length}) ===`)
  console.log(worry.join(' | ') || '(none)')

  // Raw dump: one from each non-empty class
  for (const [k, v] of Object.entries(classes)) {
    if (!v.length) continue
    const p = poems.find((x) => x.title === v[0])!
    console.log(`\n=== RAW [${k}] "${p.title}" (first 320 chars) ===`)
    console.log(JSON.stringify(String(p.content ?? '').slice(0, 320)))
  }

  await mongoose.connection.close()
}

main().catch((e) => { console.error(e); process.exit(1) })

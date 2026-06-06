import dbConnect from '@/lib/db/mongodb'
import { Poet } from '@/lib/db/models'
import { lifeYears } from '@/lib/utils'

const SITE_URL = 'https://serpay.penjire.com'

export const revalidate = 86400 // Rebuild once per day

type PoetRow = {
  fullname: string
  url: string
  birth_date?: string
  death_date?: string
  count: number
}

/**
 * llms.txt — a plain-text map of the site for AI crawlers and answer engines.
 * Spec: https://llmstxt.org — H1 title, blockquote summary, then link sections.
 */
export async function GET() {
  await dbConnect()

  const poets: PoetRow[] = await Poet.aggregate([
    { $match: { is_deleted: { $ne: true } } },
    {
      $lookup: {
        from: 'poems',
        let: { poetId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$author', '$$poetId'] },
                  { $ne: ['$is_deleted', true] },
                ],
              },
            },
          },
          { $project: { _id: 1 } },
        ],
        as: 'poems',
      },
    },
    {
      $project: {
        _id: 0,
        fullname: 1,
        url: { $ifNull: ['$slug', '$url'] },
        birth_date: { $ifNull: ['$birth_date', null] },
        death_date: { $ifNull: ['$death_date', null] },
        count: { $size: '$poems' },
      },
    },
    { $sort: { fullname: 1 } },
  ])

  const poetLines = poets
    .map((p) => {
      const years = lifeYears(p.birth_date, p.death_date)
      const meta = [years, `${p.count} goşgy`].filter(Boolean).join(', ')
      return `- [${p.fullname}](${SITE_URL}/p/${p.url}): ${meta}`
    })
    .join('\n')

  const body = `# Serpaý — Goşgular Çemeni

> Serpaý türkmen edebiýatynyň klassyk we häzirki zaman şahyrlarynyň goşgularyny bir ýere jemleýän açyk, mugt arhiwdir. Her şahyryň öz sahypasy (ömri, ýyllary we ähli goşgulary) we her goşgynyň aýratyn sahypasy bar. Web sahypanyň ähli mazmuny serwer tarapyndan render edilýär (SSR), şonuň üçin JavaScript bolmasa-da okalýar.

Serpaý is an open, free archive of Turkmen poetry — classic and contemporary poets and their poems. Each poet has a page (life, dates, complete works) and each poem has its own page. All content is server-rendered.

## Şahyrlar (Poets)
${poetLines}

## Sahypalar (Key pages)
- [Baş sahypa / Home](${SITE_URL}): şahyrlaryň sanawy, gözleg we günüň goşgusy (poet directory, poem search, poem of the day)
- [Sitemap](${SITE_URL}/sitemap.xml): ähli şahyr we goşgy sahypalary (all poet and poem URLs)
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=172800',
    },
  })
}

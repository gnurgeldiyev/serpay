# Serpaý — Goşgular Çemeni

A modern, open archive of Turkmen poetry — classic and contemporary poets and their poems, in one place.

> Türkmen edebiýatyndan goşgular çemeni. A [Penjire](https://penjire.com) project.

**Live:** [serpay.penjire.com](https://serpay.penjire.com)

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack), React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (light theme), Radix UI primitives
- **Motion:** Motion (Framer Motion)
- **Fonts:** Inria Serif (poetry) + Bricolage Grotesque (UI), via `next/font`
- **Database:** MongoDB with Mongoose 9
- **Hosting:** Vercel (Node 24)

## Features

- **Poet directory** — searchable grid with life years and poem counts
- **Poet pages** — bio, life dates, and the full body of work, indexed A–Z
- **Poem pages** — centered, serif reading experience
- **Poem of the day** — a date-seeded pick that rotates daily
- **Poem search** — matches poem **titles first, then content**, with snippets
  and match highlighting (accent-insensitive for Turkmen letters)
- **Clean URLs** — Turkmen characters (ç, ý, ş, ž, ň, ö, ü, ä) are transliterated
  to ASCII slugs, so URLs never need percent-encoding (legacy links still resolve)
- **SEO + AI search (GEO)** — server-rendered content, `robots.txt`, dynamic
  `sitemap.xml`, `llms.txt`, JSON-LD (WebSite/Person/CreativeWork/BreadcrumbList)
- **Admin area** — cookie-session-gated content management (`/admin`)

## Getting Started

### Prerequisites

- Node.js 24 (see `.nvmrc`)
- A MongoDB connection (local or Atlas)

### Setup

```bash
git clone <repository-url>
cd serpay
npm install
cp .env.example .env.local   # then edit it
```

Set the connection string in `.env.local`:

```
MONGODB_URI=your_mongodb_connection_string
```

Run the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

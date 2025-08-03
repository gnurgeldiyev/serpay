# Serpaý - Türkmen Goşgular Çemeni

A modern web application for Turkmen poetry built with Next.js 15, Tailwind CSS v4, and MongoDB.

> A digital turkmen poetry archive library. A Penjire.com project

Project link: [serpay.penjire.com](http://serpay.penjire.com "serpay.penjire.com")

## Tech Stack

- **Frontend**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **UI Components**: shadcn/ui
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd serpay
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret_here
```

**Important**: Generate a secure JWT secret for production use. You can use:
```bash
openssl rand -base64 32
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run scrape:all` - Scrape all poems from the original site
- `npm run seed` - Seed database with scraped data
- `npm run update:avatars` - Update poet avatars in database

## Project Structure

```
serpay/
├── app/                  # Next.js app directory
│   ├── api/             # API routes
│   ├── admin/           # Admin panel pages
│   └── p/               # Poet and poem pages
├── components/          # React components
│   └── ui/             # shadcn/ui components
├── lib/                 # Utility functions and database
│   └── db/             # Database models and connection
├── scripts/             # Data scraping and seeding scripts
└── public/             # Static assets
```

## Features

- Browse poets and their poems
- Admin panel for content management
- Responsive design
- Light mode only (optimized for readability)
- Server-side rendering for SEO
- API endpoints for data access
- Apple-like UI design

## Security Considerations

- **Environment Variables**: Never commit `.env.local` or any file containing secrets
- **JWT Secret**: Always use a strong, randomly generated JWT secret in production
- **Database Credentials**: Use environment variables for database connection strings
- **Admin Credentials**: Change default admin passwords immediately after deployment
- **Session Security**: Sessions are stored in HTTP-only cookies

## Deployment

The application is deployed on Vercel. To deploy your own instance:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Set up environment variables in Vercel dashboard
4. Deploy

> Help us for a new UI design. [Contact](https://docs.google.com/forms/d/e/1FAIpQLSd5K8ZYsrCkoLvUQOlnbZGsIJfmD-pdgWeJv3ZEl4feLvG14w/viewform "Contact")
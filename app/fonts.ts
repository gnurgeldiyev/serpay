import { Fraunces, Bricolage_Grotesque } from 'next/font/google'

// Default UI / sans font — used everywhere except poems.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'], // latin-ext covers Turkmen ý ş ž ň
  variable: '--font-bricolage',
  display: 'swap',
})

// Serif font for the poem reading experience (titles + content).
export const fraunces = Fraunces({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-fraunces',
  display: 'swap',
})

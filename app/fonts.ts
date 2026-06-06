import { Bricolage_Grotesque, Inria_Serif } from 'next/font/google'

// Default UI / sans font — used everywhere except poems.
export const bricolage = Bricolage_Grotesque({
  subsets: ['latin', 'latin-ext'], // latin-ext covers Turkmen ý ş ž ň
  variable: '--font-bricolage',
  display: 'swap',
})

// Serif font for the poem reading experience (titles + content).
// Inria Serif is not a variable font, so weights are explicit (regular + bold).
export const inriaSerif = Inria_Serif({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '700'],
  variable: '--font-inria-serif',
  display: 'swap',
})

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a clean, URL-safe ASCII slug from arbitrary text.
 *
 * Turkmen letters (ç, ý, ş, ž, ň, ö, ü, ä …) are transliterated to their base
 * ASCII letter via Unicode NFKD normalization + combining-mark stripping, so
 * slugs never need percent-encoding in URLs:
 *   "Sen hakda oýlara batanymda, gel..." -> "sen-hakda-oylara-batanymda-gel"
 *   "Çary Ýegenmyradow"                  -> "cary-yegenmyradow"
 */
export function slugify(input: string): string {
  return (input || "")
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip combining diacritical marks
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // non-alphanumerics -> single hyphen
    .replace(/^-+|-+$/g, "") // trim leading/trailing hyphens
}

/** Pull the first 4-digit year out of a free-form date string ("1940", "1940-05-12"). */
function extractYear(value?: string | null): string | null {
  if (!value) return null
  const match = value.match(/\d{4}/)
  return match ? match[0] : null
}

/**
 * Format a poet's lifespan as "1940–1976", "1940–", or "" when unknown.
 * Uses an en-dash; gracefully handles a missing birth or death date.
 */
export function lifeYears(birth?: string | null, death?: string | null): string {
  const b = extractYear(birth)
  const d = extractYear(death)
  if (b && d) return `${b}–${d}`
  if (b) return `${b}–`
  if (d) return `–${d}`
  return ""
}

/**
 * Turn Tiptap/HTML poem content into a short plain-text excerpt.
 * Block tags become line breaks so stanzas don't run together, then tags are
 * stripped, entities decoded, and the result clamped to `maxChars`.
 */
export function excerpt(html?: string | null, maxChars = 180): string {
  if (!html) return ""
  const text = html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|div|h[1-6]|li|blockquote)\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/[ \t]+/g, " ")
    .replace(/\n{2,}/g, "\n")
    .replace(/[ \t]*\n[ \t]*/g, "\n")
    .trim()
  if (text.length <= maxChars) return text
  const clipped = text.slice(0, maxChars)
  const lastSpace = clipped.lastIndexOf(" ")
  return (lastSpace > maxChars * 0.6 ? clipped.slice(0, lastSpace) : clipped).trimEnd() + "…"
}

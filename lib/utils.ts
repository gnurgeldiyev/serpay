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

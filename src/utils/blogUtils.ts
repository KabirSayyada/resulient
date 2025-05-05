
/**
 * Calculates the reading time of content in minutes
 * @param content The text content to calculate reading time for
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Average reading speed (words per minute)
  const wordsPerMinute = 200;
  
  // Count words (split by spaces and filter empty strings)
  const words = content.split(/\s+/).filter(Boolean).length;
  
  // Calculate reading time in minutes, with a minimum of 1 minute
  const readingTime = Math.max(1, Math.ceil(words / wordsPerMinute));
  
  return readingTime;
}

/**
 * Generates a slug from a title
 * @param title The title to generate a slug from
 * @returns A URL-friendly slug
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .trim();
}

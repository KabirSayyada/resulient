
/**
 * Calculate estimated reading time in minutes
 * Average reading speed: 200-250 words per minute
 * @param content HTML content of the blog post
 * @returns estimated reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  // Strip HTML tags
  const text = content.replace(/<[^>]*>/g, '');
  
  // Count words (split by spaces)
  const words = text.split(/\s+/).filter(Boolean).length;
  
  // Calculate reading time (assume 225 words per minute)
  const readingTimeMinutes = Math.ceil(words / 225);
  
  // Return at least 1 minute
  return Math.max(1, readingTimeMinutes);
}

/**
 * Generate a clean, SEO-friendly URL slug from a string
 * @param text The text to convert to a slug
 * @returns A URL-friendly slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Remove consecutive hyphens
    .trim();                  // Trim whitespace
}

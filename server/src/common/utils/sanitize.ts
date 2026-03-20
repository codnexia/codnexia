/**
 * Strip HTML tags from a string to prevent stored XSS.
 * This is a defense-in-depth measure — the frontend renders as text,
 * but we sanitize on ingestion to be safe.
 */
export function stripHtmlTags(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

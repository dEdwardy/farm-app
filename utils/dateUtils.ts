/**
 * Converts a JavaScript ISO 8601 string (e.g., from new Date().toISOString())
 * to PostgreSQL timestamptz format: "YYYY-MM-DD HH:MM:SS.mmmmmm+00"
 * The input must be in UTC with 'Z' timezone indicator.
 */
export function isoToPostgresTimestamptz(isoString: string): string {
  // Replace 'T' with space, 'Z' with '+00', and remove milliseconds
  return isoString
    .replace('T', ' ')
    .replace(/\.\d{3}Z/, '+00');
}

/**
 * Gets the current timestamp in PostgreSQL timestamptz format.
 */
export function getCurrentPostgresTimestamptz(): string {
  return isoToPostgresTimestamptz(new Date().toISOString());
}
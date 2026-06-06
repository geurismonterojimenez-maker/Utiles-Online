/**
 * Helper to obtain Date info in Atlantic Standard Time (AST)
 */
export function getASTDateInfo(): Date {
  const utc = new Date().getTime() + (new Date().getTimezoneOffset() * 60000);
  return new Date(utc + (3600000 * -4));
}

/**
 * Returns today's date in AST as a YYYY-MM-DD string
 */
export function getTodayDateASTString(): string {
  const d = getASTDateInfo();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Converts a text string to a URL-friendly slug
 */
export function toSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

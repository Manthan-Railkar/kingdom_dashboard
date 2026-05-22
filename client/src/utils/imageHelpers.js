/**
 * Check if a value is an actual image path (file upload or URL).
 * Returns false for emojis, empty strings, or other non-path values.
 */
export const isImagePath = (val) =>
  Boolean(val && (val.startsWith('/uploads/') || val.startsWith('http')));

/**
 * Resolve an image path to a full URL.
 * - If it's already an absolute URL (http/https), return as-is.
 * - If it's a relative /uploads/ path, return as-is (Vite proxy handles it).
 */
export const resolveImageUrl = (val) => {
  if (!val) return '';
  if (val.startsWith('http')) return val;
  const API_URL = import.meta.env.VITE_API_URL || '';
  if (val.startsWith('/uploads/')) return `${API_URL}${val}`;
  return val;
};

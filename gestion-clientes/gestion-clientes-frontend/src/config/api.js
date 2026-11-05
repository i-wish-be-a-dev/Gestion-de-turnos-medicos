const removeTrailingSlash = (value) => value.replace(/\/+$/, '');

export const API_BASE_URL = removeTrailingSlash(
  import.meta.env.VITE_API_BASE_URL || ''
);

export function buildApiUrl(path) {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${API_BASE_URL}${normalizedPath}`;
}
/** Empty string in dev uses Vite proxy → local backend (see vite.config.ts). */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`
}

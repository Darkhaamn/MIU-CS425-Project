import type { ApiError } from '../types'
import { API_BASE_URL } from './index'

export class ApiClientError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function parseError(response: Response): Promise<string> {
  try {
    const data = (await response.json()) as ApiError
    return data.message || response.statusText
  } catch {
    return response.statusText || 'Request failed'
  }
}

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  })

  if (response.status === 204) {
    return undefined as T
  }

  if (!response.ok) {
    const message = await parseError(response)
    throw new ApiClientError(message, response.status)
  }

  const text = await response.text()
  return text ? (JSON.parse(text) as T) : (undefined as T)
}

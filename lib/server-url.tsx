export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3050/api/v1'

export const AUTH_TOKEN_STORAGE_KEY = 'token'

export const buildApiUrl = (endpoint: string) => {
  if (/^https?:\/\//.test(endpoint)) {
    return endpoint
  }

  if (endpoint.startsWith('/')) {
    return `${API_BASE_URL}${endpoint}`
  }

  return `${API_BASE_URL}/${endpoint}`
}

export const LOGIN_URL = 'auth/login'

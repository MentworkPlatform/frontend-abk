import { AUTH_TOKEN_STORAGE_KEY, buildApiUrl } from '@/lib/server-url'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

type ErrorWithMessage = {
  message?: string
  error?: string
}

export type ApiRequestOptions<TBody = unknown> = Omit<
  RequestInit,
  'method' | 'body' | 'headers'
> & {
  body?: TBody
  headers?: HeadersInit
  token?: string | null
  withAuth?: boolean
  tokenStorageKey?: string
}

export class ApiError<TData = unknown> extends Error {
  status: number
  data: TData | null

  constructor(message: string, status: number, data: TData | null = null) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.data = data
  }
}

const isFormData = (value: unknown): value is FormData =>
  typeof FormData !== 'undefined' && value instanceof FormData

const isErrorWithMessage = (value: unknown): value is ErrorWithMessage =>
  typeof value === 'object' &&
  value !== null &&
  ('message' in value || 'error' in value)

export const getAuthToken = (tokenStorageKey = AUTH_TOKEN_STORAGE_KEY) => {
  if (typeof window === 'undefined') {
    return null
  }

  return localStorage.getItem(tokenStorageKey)
}

export const setAuthToken = (
  token: string,
  tokenStorageKey = AUTH_TOKEN_STORAGE_KEY,
) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.setItem(tokenStorageKey, token)
}

export const clearAuthToken = (tokenStorageKey = AUTH_TOKEN_STORAGE_KEY) => {
  if (typeof window === 'undefined') {
    return
  }

  localStorage.removeItem(tokenStorageKey)
}

const parseResponse = async (response: Response) => {
  const contentType = response.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    return response.json()
  }

  if (contentType.includes('text/')) {
    return response.text()
  }

  return null
}

const request = async <TResponse, TBody = unknown>(
  method: HttpMethod,
  endpoint: string,
  options: ApiRequestOptions<TBody> = {},
) => {
  const {
    body,
    headers,
    token,
    withAuth = true,
    tokenStorageKey = AUTH_TOKEN_STORAGE_KEY,
    ...requestInit
  } = options

  const finalHeaders = new Headers(headers)
  const shouldSerializeBody = body !== undefined && !isFormData(body)

  if (shouldSerializeBody && !finalHeaders.has('Content-Type')) {
    finalHeaders.set('Content-Type', 'application/json')
  }

  if (withAuth) {
    const resolvedToken = token ?? getAuthToken(tokenStorageKey)

    if (resolvedToken) {
      finalHeaders.set('Authorization', `Bearer ${resolvedToken}`)
    }
  }

  const response = await fetch(buildApiUrl(endpoint), {
    ...requestInit,
    method,
    headers: finalHeaders,
    body:
      body === undefined
        ? undefined
        : shouldSerializeBody
          ? JSON.stringify(body)
          : (body as BodyInit),
  })

  const data = await parseResponse(response)

  if (!response.ok) {
    const message =
      isErrorWithMessage(data) && typeof data.message === 'string'
        ? data.message
        : isErrorWithMessage(data) && typeof data.error === 'string'
          ? data.error
          : `Request failed with status ${response.status}`

    throw new ApiError(message, response.status, data)
  }

  return data as TResponse
}

export const apiClient = {
  get: <TResponse>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'body'> = {},
  ) => request<TResponse>('GET', endpoint, options),

  post: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<ApiRequestOptions<TBody>, 'body'> = {},
  ) => request<TResponse, TBody>('POST', endpoint, { ...options, body }),

  put: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<ApiRequestOptions<TBody>, 'body'> = {},
  ) => request<TResponse, TBody>('PUT', endpoint, { ...options, body }),

  patch: <TResponse, TBody = unknown>(
    endpoint: string,
    body?: TBody,
    options: Omit<ApiRequestOptions<TBody>, 'body'> = {},
  ) => request<TResponse, TBody>('PATCH', endpoint, { ...options, body }),

  delete: <TResponse>(
    endpoint: string,
    options: Omit<ApiRequestOptions, 'body'> = {},
  ) => request<TResponse>('DELETE', endpoint, options),
}

import { getAuthToken } from '@/lib/api-client'

export type CurrentUserDetails = {
  id: string | null
  name: string | null
  email: string | null
}

const asObject = (value: unknown): Record<string, unknown> | null => {
  if (typeof value === 'object' && value !== null) {
    return value as Record<string, unknown>
  }

  return null
}

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim().length > 0) {
      return value.trim()
    }

    if (typeof value === 'number' && Number.isFinite(value)) {
      return String(value)
    }
  }

  return null
}

const parseTokenPayload = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const token = getAuthToken()

  if (!token) {
    return null
  }

  try {
    const tokenPayload = token.split('.')[1] ?? ''
    const normalizedPayload = tokenPayload.replace(/-/g, '+').replace(/_/g, '/')
    const paddedPayload =
      normalizedPayload + '='.repeat((4 - (normalizedPayload.length % 4)) % 4)

    return asObject(JSON.parse(window.atob(paddedPayload)))
  } catch {
    return null
  }
}

const extractFromRecord = (record: Record<string, unknown> | null) => {
  const userRecord = asObject(record?.user)
  const dataRecord = asObject(record?.data)

  const id =
    pickString(
      record?.id,
      record?.userId,
      record?.mentorId,
      record?.trainerId,
      userRecord?.id,
      dataRecord?.id,
    ) ?? null
  const name =
    pickString(
      record?.name,
      record?.fullName,
      record?.full_name,
      record?.firstName && record?.lastName
        ? `${String(record.firstName)} ${String(record.lastName)}`
        : null,
      userRecord?.name,
      userRecord?.fullName,
      dataRecord?.name,
    ) ?? null
  const email =
    pickString(
      record?.email,
      record?.upn,
      record?.preferred_username,
      userRecord?.email,
      dataRecord?.email,
    ) ??
    (typeof record?.sub === 'string' && record.sub.includes('@')
      ? record.sub
      : null)

  return { id, name, email } satisfies CurrentUserDetails
}

export const getCurrentUserDetails = (): CurrentUserDetails => {
  if (typeof window === 'undefined') {
    return { id: null, name: null, email: null }
  }

  const fromToken = extractFromRecord(parseTokenPayload())

  if (fromToken.id || fromToken.name || fromToken.email) {
    return fromToken
  }

  const candidates = ['user', 'profile', 'authUser']

  for (const key of candidates) {
    const rawValue = window.localStorage.getItem(key)

    if (!rawValue) {
      continue
    }

    try {
      const parsed = JSON.parse(rawValue)
      const parsedRecord = asObject(parsed)
      const fromStorage = extractFromRecord(parsedRecord)

      if (fromStorage.id || fromStorage.name || fromStorage.email) {
        return fromStorage
      }
    } catch {
      continue
    }
  }

  return { id: null, name: null, email: null }
}

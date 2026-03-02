import { apiClient } from '@/lib/api-client'

export type WalletTransactionType = 'CREDIT' | 'DEBIT'

export type WalletTransactionReason =
  | 'TOPUP'
  | 'MENTOR_PAYOUT'
  | 'ADJUSTMENT'
  | 'REVERSAL'

export type WalletTransactionsQuery = {
  page?: number
  limit?: number
  type?: WalletTransactionType
  reason?: WalletTransactionReason
}

export type WalletTopupPayload = {
  amount: number
  currency?: string
  paymentMethod?: string
  email?: string
  reference?: string
  status?: 'PENDING' | 'SUCCESS' | 'FAILED' | 'CANCELLED'
  gateway?: string
  gatewayResponse?: string
  metadata?: Record<string, unknown>
}

export type WalletMentorPaymentPayload = {
  mentorId?: string | number
  mentorIds?: Array<string | number>
  amount?: number
  payouts?: Array<{
    mentorId: string | number
    amount: number
    topicId?: string | number
    programId?: string | number
  }>
  narration?: string
}

const buildTransactionsQuery = (query: WalletTransactionsQuery = {}) => {
  const params = new URLSearchParams()

  if (typeof query.page === 'number' && Number.isFinite(query.page)) {
    params.set('page', `${query.page}`)
  }

  if (typeof query.limit === 'number' && Number.isFinite(query.limit)) {
    params.set('limit', `${query.limit}`)
  }

  if (query.type) {
    params.set('type', query.type)
  }

  if (query.reason) {
    params.set('reason', query.reason)
  }

  return params.toString()
}

export const walletApi = {
  getMyWallet: <TResponse = unknown>() => apiClient.get<TResponse>('/wallets/me'),

  getMyWalletTransactions: <TResponse = unknown>(
    query: WalletTransactionsQuery = {},
  ) => {
    const qs = buildTransactionsQuery(query)
    const endpoint = qs
      ? `/wallets/me/transactions?${qs}`
      : '/wallets/me/transactions'

    return apiClient.get<TResponse>(endpoint)
  },

  topUp: <TResponse = unknown>(payload: WalletTopupPayload) =>
    apiClient.post<TResponse, WalletTopupPayload>('/wallets/topup', payload),

  payMentors: <TResponse = unknown>(payload: WalletMentorPaymentPayload) =>
    apiClient.post<TResponse, WalletMentorPaymentPayload>(
      '/wallets/payments/mentors',
      payload,
    ),
}

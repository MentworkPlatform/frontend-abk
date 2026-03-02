import { apiClient } from '@/lib/api-client'

export type PaymentDetailsPayload = {
  bankName: string
  bankCode: string
  accountNumber: string
  accountName: string
  currency: string
  country: string
  provider: string
  providerRecipientCode: string
  isDefault: boolean
}

const PAYOUT_ACCOUNT_ENDPOINT = '/wallets/payout-accounts/me'

export const paymentDetailsApi = {
  getMyPaymentDetails: <TResponse = unknown>() =>
    apiClient.get<TResponse>(PAYOUT_ACCOUNT_ENDPOINT),

  saveMyPaymentDetails: <TResponse = unknown>(payload: PaymentDetailsPayload) =>
    apiClient.post<TResponse, PaymentDetailsPayload>(
      PAYOUT_ACCOUNT_ENDPOINT,
      payload,
    ),
}

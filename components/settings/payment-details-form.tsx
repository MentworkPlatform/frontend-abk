'use client'

import { useEffect, useMemo, useState } from 'react'
import { CheckCircle2, Info, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { ApiError } from '@/lib/api-client'
import { PaymentDetailsPayload, paymentDetailsApi } from '@/lib/payment-details'

type FormErrors = Partial<Record<keyof PaymentDetailsPayload, string>>

type BankOption = {
  name: string
  code: string
}

const NIGERIA_FALLBACK_BANKS: BankOption[] = [
  { name: 'Access Bank', code: '044' },
  { name: 'Citibank Nigeria', code: '023' },
  { name: 'Ecobank Nigeria', code: '050' },
  { name: 'Fidelity Bank', code: '070' },
  { name: 'First Bank of Nigeria', code: '011' },
  { name: 'First City Monument Bank', code: '214' },
  { name: 'Globus Bank', code: '103' },
  { name: 'Guaranty Trust Bank', code: '058' },
  { name: 'Keystone Bank', code: '082' },
  { name: 'Kuda Bank', code: '50211' },
  { name: 'Polaris Bank', code: '076' },
  { name: 'Providus Bank', code: '101' },
  { name: 'Stanbic IBTC Bank', code: '221' },
  { name: 'Sterling Bank', code: '232' },
  { name: 'Union Bank', code: '032' },
  { name: 'United Bank for Africa', code: '033' },
  { name: 'Unity Bank', code: '215' },
  { name: 'Wema Bank', code: '035' },
  { name: 'Zenith Bank', code: '057' },
]

const EMPTY_FORM: PaymentDetailsPayload = {
  bankName: '',
  bankCode: '',
  accountNumber: '',
  accountName: '',
  currency: 'NGN',
  country: 'NG',
  provider: 'paystack',
  providerRecipientCode: '',
  isDefault: true,
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

const pickBoolean = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'boolean') {
      return value
    }

    if (typeof value === 'string') {
      const normalized = value.toLowerCase().trim()

      if (normalized === 'true') {
        return true
      }

      if (normalized === 'false') {
        return false
      }
    }
  }

  return null
}

const resolvePaymentRecordFromCandidates = (candidates: unknown[]) => {
  for (const candidate of candidates) {
    const candidateRecord = asObject(candidate)

    if (!candidateRecord) {
      continue
    }

    if (
      pickString(
        candidateRecord.bankName,
        candidateRecord.bank_name,
        candidateRecord.bankCode,
        candidateRecord.bank_code,
        candidateRecord.accountNumber,
        candidateRecord.account_number,
      )
    ) {
      return candidateRecord
    }

    const nestedCandidates: unknown[] = [
      candidateRecord.data,
      candidateRecord.payoutAccount,
      candidateRecord.payout_account,
      candidateRecord.paymentDetails,
      candidateRecord.payment_details,
      candidateRecord.details,
      candidateRecord.payment,
      candidateRecord.account,
      candidateRecord.payout,
    ]

    for (const nestedCandidate of nestedCandidates) {
      const nestedRecord = asObject(nestedCandidate)

      if (!nestedRecord) {
        continue
      }

      if (
        pickString(
          nestedRecord.bankName,
          nestedRecord.bank_name,
          nestedRecord.bankCode,
          nestedRecord.bank_code,
          nestedRecord.accountNumber,
          nestedRecord.account_number,
        )
      ) {
        return nestedRecord
      }
    }

    const accountsCollection =
      (Array.isArray(candidateRecord.accounts)
        ? candidateRecord.accounts
        : null) ??
      (Array.isArray(candidateRecord.payoutAccounts)
        ? candidateRecord.payoutAccounts
        : null) ??
      (Array.isArray(candidateRecord.payout_accounts)
        ? candidateRecord.payout_accounts
        : null) ??
      null

    if (accountsCollection) {
      const defaultAccount =
        accountsCollection.find((account) => {
          const accountRecord = asObject(account)
          const isActive =
            accountRecord?.isActive !== false &&
            accountRecord?.is_active !== false

          return (
            isActive &&
            (accountRecord?.isDefault === true ||
              accountRecord?.is_default === true)
          )
        }) ??
        accountsCollection.find((account) => {
          const accountRecord = asObject(account)

          return (
            accountRecord?.isActive !== false &&
            accountRecord?.is_active !== false
          )
        }) ??
        accountsCollection[0]

      const defaultAccountRecord = asObject(defaultAccount)

      if (defaultAccountRecord) {
        return defaultAccountRecord
      }
    }
  }

  return null
}

type MappedPaymentDetails = {
  form: PaymentDetailsPayload
  accountNumberLast4: string | null
}

const mapResponseToForm = (payload: unknown): MappedPaymentDetails | null => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const paymentRecord = resolvePaymentRecordFromCandidates([
    payload,
    root,
    dataRecord,
    root?.payoutAccount,
    root?.payout_account,
    dataRecord?.payoutAccount,
    dataRecord?.payout_account,
    root?.account,
    dataRecord?.account,
    root?.paymentDetails,
    dataRecord?.paymentDetails,
    root?.details,
    dataRecord?.details,
    root?.payment,
    dataRecord?.payment,
  ])

  if (!paymentRecord) {
    return null
  }

  const accountNumberLast4 =
    pickString(
      paymentRecord.accountNumberLast4,
      paymentRecord.account_number_last4,
    ) ?? null

  return {
    form: {
      bankName: pickString(paymentRecord.bankName, paymentRecord.bank_name) ?? '',
      bankCode: pickString(paymentRecord.bankCode, paymentRecord.bank_code) ?? '',
      accountNumber:
        pickString(paymentRecord.accountNumber, paymentRecord.account_number) ??
        '',
      accountName:
        pickString(paymentRecord.accountName, paymentRecord.account_name) ?? '',
      currency: pickString(paymentRecord.currency) ?? 'NGN',
      country: pickString(paymentRecord.country) ?? 'NG',
      provider: pickString(paymentRecord.provider) ?? 'paystack',
      providerRecipientCode:
        pickString(
          paymentRecord.providerRecipientCode,
          paymentRecord.provider_recipient_code,
        ) ?? '',
      isDefault:
        pickBoolean(paymentRecord.isDefault, paymentRecord.is_default) ?? true,
    },
    accountNumberLast4,
  }
}

const mapBanksFromPayload = (payload: unknown): BankOption[] => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)
  const rootBanks = Array.isArray(root?.banks) ? root?.banks : null
  const dataBanks = Array.isArray(dataRecord?.banks) ? dataRecord?.banks : null
  const candidates = rootBanks ?? dataBanks ?? []

  const mapped = candidates
    .map((bank) => {
      const bankRecord = asObject(bank)
      const code = pickString(bankRecord?.code, bankRecord?.bankCode)
      const name = pickString(bankRecord?.name, bankRecord?.bankName)

      if (!code || !name) {
        return null
      }

      return {
        name,
        code,
      } satisfies BankOption
    })
    .filter((bank): bank is BankOption => Boolean(bank))

  return mapped
}

const resolveAccountNameFromPayload = (payload: unknown) => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)

  return (
    pickString(root?.accountName, dataRecord?.accountName) ??
    pickString(root?.account_name, dataRecord?.account_name)
  )
}

const resolveErrorMessage = (payload: unknown, fallback: string) => {
  const root = asObject(payload)
  const dataRecord = asObject(root?.data)

  return (
    pickString(root?.message, root?.error, dataRecord?.message, dataRecord?.error) ??
    fallback
  )
}

const validateForm = (
  payload: PaymentDetailsPayload,
  options: {
    isPaystackNigeria: boolean
    lastResolvedAccountKey: string
    accountResolveError: string | null
    requireProviderRecipientCode: boolean
  },
): FormErrors => {
  const errors: FormErrors = {}
  const currentResolveKey = `${payload.bankCode.trim()}:${payload.accountNumber.trim()}`

  if (!payload.bankName.trim()) {
    errors.bankName = 'Bank name is required.'
  }

  if (!payload.bankCode.trim()) {
    errors.bankCode = 'Bank code is required.'
  } else if (!/^\d{3,6}$/.test(payload.bankCode.trim())) {
    errors.bankCode = 'Bank code should be 3 to 6 digits.'
  }

  if (!payload.accountNumber.trim()) {
    errors.accountNumber = 'Account number is required.'
  } else if (options.isPaystackNigeria) {
    if (!/^\d{10}$/.test(payload.accountNumber.trim())) {
      errors.accountNumber = 'Account number must be exactly 10 digits.'
    } else if (options.accountResolveError) {
      errors.accountNumber = options.accountResolveError
    } else if (options.lastResolvedAccountKey !== currentResolveKey) {
      errors.accountNumber =
        'Please validate account number against selected bank.'
    }
  } else if (!/^\d{8,20}$/.test(payload.accountNumber.trim())) {
    errors.accountNumber = 'Account number should be 8 to 20 digits.'
  }

  if (!payload.accountName.trim()) {
    errors.accountName = 'Account name is required.'
  }

  if (!payload.currency.trim()) {
    errors.currency = 'Currency is required.'
  }

  if (!payload.country.trim()) {
    errors.country = 'Country is required.'
  }

  if (!payload.provider.trim()) {
    errors.provider = 'Provider is required.'
  }

  if (
    options.requireProviderRecipientCode &&
    !payload.providerRecipientCode.trim()
  ) {
    errors.providerRecipientCode = 'Provider recipient code is required.'
  }

  return errors
}

const errorClass = (hasError: boolean) =>
  hasError ? 'border-destructive focus-visible:ring-destructive' : ''

type PaymentDetailsFormProps = {
  showProviderRecipientCode?: boolean
}

export function PaymentDetailsForm({
  showProviderRecipientCode = true,
}: PaymentDetailsFormProps) {
  const { toast } = useToast()
  const [form, setForm] = useState<PaymentDetailsPayload>(EMPTY_FORM)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [banks, setBanks] = useState<BankOption[]>(NIGERIA_FALLBACK_BANKS)
  const [isBanksLoading, setIsBanksLoading] = useState(false)
  const [isResolvingAccount, setIsResolvingAccount] = useState(false)
  const [accountResolveError, setAccountResolveError] = useState<string | null>(
    null,
  )
  const [lastResolvedAccountKey, setLastResolvedAccountKey] = useState('')
  const [loadedAccountNumberLast4, setLoadedAccountNumberLast4] = useState('')

  const isPaystackNigeria =
    form.provider.trim().toLowerCase() === 'paystack' &&
    form.country.trim().toUpperCase() === 'NG'

  useEffect(() => {
    let isMounted = true

    const loadPaymentDetails = async () => {
      setIsLoading(true)

      try {
        const response = await paymentDetailsApi.getMyPaymentDetails<unknown>()
        const mapped = mapResponseToForm(response)

        if (!isMounted || !mapped) {
          return
        }

        setForm(mapped.form)
        setLoadedAccountNumberLast4(mapped.accountNumberLast4 ?? '')
      } catch (error) {
        if (!isMounted) {
          return
        }

        if (error instanceof ApiError && error.status !== 404) {
          toast({
            variant: 'destructive',
            title: 'Unable to load payment details',
            description: error.message,
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadPaymentDetails()

    return () => {
      isMounted = false
    }
  }, [toast])

  useEffect(() => {
    if (!isPaystackNigeria) {
      setIsResolvingAccount(false)
      setAccountResolveError(null)
      setLastResolvedAccountKey('')
      return
    }

    let isMounted = true

    const loadBanks = async () => {
      setIsBanksLoading(true)

      try {
        const response = await fetch('/api/paystack/banks?country=NG', {
          method: 'GET',
          cache: 'no-store',
        })
        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            resolveErrorMessage(payload, 'Unable to fetch bank list.'),
          )
        }

        const mappedBanks = mapBanksFromPayload(payload)

        if (isMounted && mappedBanks.length > 0) {
          setBanks(mappedBanks)
        }
      } catch (error) {
        if (!isMounted) {
          return
        }

        toast({
          variant: 'destructive',
          title: 'Unable to refresh bank list',
          description:
            error instanceof Error
              ? error.message
              : 'Using fallback list. Please retry later.',
        })
      } finally {
        if (isMounted) {
          setIsBanksLoading(false)
        }
      }
    }

    void loadBanks()

    return () => {
      isMounted = false
    }
  }, [isPaystackNigeria, toast])

  useEffect(() => {
    if (!isPaystackNigeria) {
      return
    }

    if (!form.bankCode || form.bankName) {
      return
    }

    const matchedBank = banks.find((bank) => bank.code === form.bankCode)

    if (!matchedBank) {
      return
    }

    setForm((previous) => ({
      ...previous,
      bankName: matchedBank.name,
    }))
  }, [banks, form.bankCode, form.bankName, isPaystackNigeria])

  useEffect(() => {
    if (!isPaystackNigeria) {
      return
    }

    const accountNumber = form.accountNumber.trim()
    const bankCode = form.bankCode.trim()

    if (!bankCode || !/^\d{10}$/.test(accountNumber)) {
      setIsResolvingAccount(false)
      setAccountResolveError(null)
      return
    }

    const resolveKey = `${bankCode}:${accountNumber}`
    let isMounted = true
    const timeoutId = setTimeout(async () => {
      setIsResolvingAccount(true)
      setAccountResolveError(null)

      try {
        const response = await fetch(
          `/api/paystack/resolve-account?accountNumber=${encodeURIComponent(
            accountNumber,
          )}&bankCode=${encodeURIComponent(bankCode)}`,
          {
            method: 'GET',
            cache: 'no-store',
          },
        )
        const payload = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(
            resolveErrorMessage(payload, 'Account number validation failed.'),
          )
        }

        const accountName = resolveAccountNameFromPayload(payload)

        if (!accountName) {
          throw new Error('Unable to resolve account name for this account.')
        }

        if (!isMounted) {
          return
        }

        setForm((previous) => ({
          ...previous,
          accountName,
        }))
        setLastResolvedAccountKey(resolveKey)
        setErrors((previous) => ({
          ...previous,
          accountNumber: undefined,
          accountName: undefined,
        }))
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Account number validation failed.'

        setAccountResolveError(message)
        setLastResolvedAccountKey('')
        setForm((previous) => ({
          ...previous,
          accountName: '',
        }))
        setErrors((previous) => ({
          ...previous,
          accountNumber: message,
        }))
      } finally {
        if (isMounted) {
          setIsResolvingAccount(false)
        }
      }
    }, 450)

    return () => {
      isMounted = false
      clearTimeout(timeoutId)
    }
  }, [form.accountNumber, form.bankCode, isPaystackNigeria])

  const payloadPreview = useMemo(
    () =>
      JSON.stringify(
        {
          ...form,
          bankName: form.bankName.trim(),
          bankCode: form.bankCode.trim(),
          accountNumber: form.accountNumber.trim(),
          accountName: form.accountName.trim(),
          currency: form.currency.trim().toUpperCase(),
          country: form.country.trim().toUpperCase(),
          provider: form.provider.trim().toLowerCase(),
          providerRecipientCode: form.providerRecipientCode.trim(),
        },
        null,
        2,
      ),
    [form],
  )

  const bankOptions = useMemo(() => {
    if (!form.bankCode || banks.some((bank) => bank.code === form.bankCode)) {
      return banks
    }

    return [
      ...banks,
      {
        name: form.bankName || `Bank (${form.bankCode})`,
        code: form.bankCode,
      },
    ]
  }, [banks, form.bankCode, form.bankName])

  const updateField = <K extends keyof PaymentDetailsPayload>(
    field: K,
    value: PaymentDetailsPayload[K],
  ) => {
    setForm((previous) => ({ ...previous, [field]: value }))
    setErrors((previous) => ({ ...previous, [field]: undefined }))
  }

  const onBankChange = (bankCode: string) => {
    const matchedBank = bankOptions.find((bank) => bank.code === bankCode)

    setForm((previous) => ({
      ...previous,
      bankCode,
      bankName: matchedBank?.name ?? previous.bankName,
      accountName: isPaystackNigeria ? '' : previous.accountName,
    }))

    setErrors((previous) => ({
      ...previous,
      bankCode: undefined,
      bankName: undefined,
      accountNumber: undefined,
      accountName: undefined,
    }))
    setLoadedAccountNumberLast4('')
    setAccountResolveError(null)
    setLastResolvedAccountKey('')
  }

  const onAccountNumberChange = (rawValue: string) => {
    const normalizedDigits = rawValue.replace(/\D/g, '')
    const maxLength = isPaystackNigeria ? 10 : 20
    const nextValue = normalizedDigits.slice(0, maxLength)

    setForm((previous) => ({
      ...previous,
      accountNumber: nextValue,
      accountName: isPaystackNigeria ? '' : previous.accountName,
    }))

    setErrors((previous) => ({
      ...previous,
      accountNumber: undefined,
      accountName: isPaystackNigeria ? undefined : previous.accountName,
    }))
    setLoadedAccountNumberLast4('')
    setAccountResolveError(null)
    setLastResolvedAccountKey('')
  }

  const onSave = async () => {
    const normalizedPayload: PaymentDetailsPayload = {
      bankName: form.bankName.trim(),
      bankCode: form.bankCode.trim(),
      accountNumber: form.accountNumber.trim(),
      accountName: form.accountName.trim(),
      currency: form.currency.trim().toUpperCase(),
      country: form.country.trim().toUpperCase(),
      provider: form.provider.trim().toLowerCase(),
      providerRecipientCode: form.providerRecipientCode.trim(),
      isDefault: Boolean(form.isDefault),
    }

    const validationErrors = validateForm(normalizedPayload, {
      isPaystackNigeria,
      lastResolvedAccountKey,
      accountResolveError,
      requireProviderRecipientCode: showProviderRecipientCode,
    })

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      toast({
        variant: 'destructive',
        title: 'Validation failed',
        description: 'Please fix the highlighted fields before saving.',
      })
      return
    }

    setIsSaving(true)
    setErrors({})

    try {
      await paymentDetailsApi.saveMyPaymentDetails(normalizedPayload)
      setForm(normalizedPayload)
      toast({
        title: 'Payment details saved',
        description: 'Your payout configuration has been updated successfully.',
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Unable to save payment details',
        description:
          error instanceof ApiError
            ? error.message
            : 'An unexpected error occurred while saving.',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader className='p-4 sm:p-6'>
        <CardTitle className='text-base sm:text-lg'>Payment Details</CardTitle>
        <CardDescription className='text-xs sm:text-sm'>
          Configure payout details for your account. Paystack bank validation is
          enabled for Nigeria.
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-5 p-4 sm:p-6 pt-0'>
        <div className='rounded-lg border bg-blue-50 border-blue-200 p-3 sm:p-4'>
          <div className='flex items-start gap-2'>
            <Info className='h-4 w-4 text-blue-700 mt-0.5 shrink-0' />
            <p className='text-xs sm:text-sm text-blue-700'>
              Select your bank, enter account number, and the account name will be
              validated via Paystack account resolver.
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className='rounded-lg border border-dashed p-4 text-sm text-muted-foreground'>
            Loading payment details...
          </div>
        ) : null}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
          {isPaystackNigeria ? (
            <>
              <div className='space-y-2'>
                <Label htmlFor='bank-name'>Bank Name</Label>
                <Select
                  value={form.bankCode}
                  onValueChange={(value) => onBankChange(value)}
                >
                  <SelectTrigger
                    id='bank-name'
                    className={errorClass(
                      Boolean(errors.bankName || errors.bankCode),
                    )}
                  >
                    <SelectValue
                      placeholder={
                        isBanksLoading
                          ? 'Loading banks...'
                          : 'Select bank name'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {bankOptions.map((bank) => (
                      <SelectItem key={bank.code} value={bank.code}>
                        {bank.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.bankName || errors.bankCode ? (
                  <p className='text-xs text-destructive'>
                    {errors.bankName ?? errors.bankCode}
                  </p>
                ) : null}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bank-code'>Bank Code</Label>
                <Input
                  id='bank-code'
                  value={form.bankCode}
                  disabled
                  readOnly
                  placeholder='Auto-filled from bank selection'
                  className={errorClass(Boolean(errors.bankCode))}
                />
                {errors.bankCode ? (
                  <p className='text-xs text-destructive'>{errors.bankCode}</p>
                ) : (
                  <p className='text-xs text-muted-foreground'>
                    Bank code is automatically populated.
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div className='space-y-2'>
                <Label htmlFor='bank-name'>Bank Name</Label>
                <Input
                  id='bank-name'
                  value={form.bankName}
                  onChange={(event) => updateField('bankName', event.target.value)}
                  placeholder='Enter bank name'
                  className={errorClass(Boolean(errors.bankName))}
                />
                {errors.bankName ? (
                  <p className='text-xs text-destructive'>{errors.bankName}</p>
                ) : null}
              </div>

              <div className='space-y-2'>
                <Label htmlFor='bank-code'>Bank Code</Label>
                <Input
                  id='bank-code'
                  value={form.bankCode}
                  onChange={(event) => updateField('bankCode', event.target.value)}
                  placeholder='Enter bank code'
                  className={errorClass(Boolean(errors.bankCode))}
                />
                {errors.bankCode ? (
                  <p className='text-xs text-destructive'>{errors.bankCode}</p>
                ) : null}
              </div>
            </>
          )}

          <div className='space-y-2'>
            <Label htmlFor='account-number'>Account Number</Label>
            <Input
              id='account-number'
              value={form.accountNumber}
              onChange={(event) => onAccountNumberChange(event.target.value)}
              placeholder={isPaystackNigeria ? '0123456789' : 'Enter account number'}
              maxLength={isPaystackNigeria ? 10 : 20}
              className={errorClass(Boolean(errors.accountNumber))}
            />
            {isPaystackNigeria && isResolvingAccount ? (
              <p className='text-xs text-muted-foreground inline-flex items-center gap-1'>
                <Loader2 className='h-3.5 w-3.5 animate-spin' />
                Validating account number...
              </p>
            ) : null}
            {!isResolvingAccount &&
            !accountResolveError &&
            isPaystackNigeria &&
            form.accountName &&
            lastResolvedAccountKey ===
              `${form.bankCode.trim()}:${form.accountNumber.trim()}` ? (
              <p className='text-xs text-green-600'>Account number validated.</p>
            ) : null}
            {errors.accountNumber ? (
              <p className='text-xs text-destructive'>{errors.accountNumber}</p>
            ) : loadedAccountNumberLast4 &&
              form.accountNumber.trim().length === 0 ? (
              <p className='text-xs text-muted-foreground'>
                Current saved account ends with {loadedAccountNumberLast4}.
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='account-name'>Account Name</Label>
            <Input
              id='account-name'
              value={form.accountName}
              onChange={(event) => updateField('accountName', event.target.value)}
              placeholder='Resolved account name'
              readOnly={isPaystackNigeria}
              className={errorClass(Boolean(errors.accountName))}
            />
            {errors.accountName ? (
              <p className='text-xs text-destructive'>{errors.accountName}</p>
            ) : isPaystackNigeria ? (
              <p className='text-xs text-muted-foreground'>
                Account name is auto-populated after successful validation.
              </p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='currency'>Currency</Label>
            <Select
              value={form.currency}
              onValueChange={(value) => updateField('currency', value)}
            >
              <SelectTrigger
                id='currency'
                className={errorClass(Boolean(errors.currency))}
              >
                <SelectValue placeholder='Select currency' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='NGN'>NGN</SelectItem>
                <SelectItem value='USD'>USD</SelectItem>
                <SelectItem value='GBP'>GBP</SelectItem>
              </SelectContent>
            </Select>
            {errors.currency ? (
              <p className='text-xs text-destructive'>{errors.currency}</p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='country'>Country</Label>
            <Select
              value={form.country}
              onValueChange={(value) => updateField('country', value)}
            >
              <SelectTrigger
                id='country'
                className={errorClass(Boolean(errors.country))}
              >
                <SelectValue placeholder='Select country' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='NG'>Nigeria (NG)</SelectItem>
                <SelectItem value='GH'>Ghana (GH)</SelectItem>
                <SelectItem value='KE'>Kenya (KE)</SelectItem>
                <SelectItem value='US'>United States (US)</SelectItem>
              </SelectContent>
            </Select>
            {errors.country ? (
              <p className='text-xs text-destructive'>{errors.country}</p>
            ) : null}
          </div>

          <div className='space-y-2'>
            <Label htmlFor='provider'>Provider</Label>
            <Select
              value={form.provider}
              onValueChange={(value) => updateField('provider', value)}
            >
              <SelectTrigger
                id='provider'
                className={errorClass(Boolean(errors.provider))}
              >
                <SelectValue placeholder='Select provider' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='paystack'>Paystack</SelectItem>
                <SelectItem value='flutterwave'>Flutterwave</SelectItem>
                <SelectItem value='stripe'>Stripe</SelectItem>
                <SelectItem value='other'>Other</SelectItem>
              </SelectContent>
            </Select>
            {errors.provider ? (
              <p className='text-xs text-destructive'>{errors.provider}</p>
            ) : null}
          </div>

          {showProviderRecipientCode ? (
            <div className='space-y-2'>
              <Label htmlFor='provider-recipient-code'>
                Provider Recipient Code
              </Label>
              <Input
                id='provider-recipient-code'
                value={form.providerRecipientCode}
                onChange={(event) =>
                  updateField('providerRecipientCode', event.target.value)
                }
                placeholder='RCP_abc123xyz'
                className={errorClass(Boolean(errors.providerRecipientCode))}
              />
              {errors.providerRecipientCode ? (
                <p className='text-xs text-destructive'>
                  {errors.providerRecipientCode}
                </p>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-lg border p-3 sm:p-4'>
          <div>
            <Label htmlFor='default-payout' className='text-sm font-medium'>
              Set as default payout account
            </Label>
            <p className='text-xs text-muted-foreground mt-1'>
              This account will be used for payout settlements.
            </p>
          </div>
          <Switch
            id='default-payout'
            checked={form.isDefault}
            onCheckedChange={(checked) => updateField('isDefault', checked)}
          />
        </div>

        <div className='rounded-lg border bg-muted/30 p-3 sm:p-4'>
          <div className='flex items-center gap-2 mb-2'>
            <CheckCircle2 className='h-4 w-4 text-green-600' />
            <p className='text-sm font-medium'>Payload Preview</p>
          </div>
          <pre className='text-xs overflow-auto whitespace-pre-wrap break-words text-muted-foreground'>
            {payloadPreview}
          </pre>
        </div>

        <Button
          onClick={() => {
            void onSave()
          }}
          disabled={isLoading || isSaving || isResolvingAccount}
          className='bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto'
        >
          {isSaving ? 'Saving...' : 'Save Payment Details'}
        </Button>
      </CardContent>
    </Card>
  )
}

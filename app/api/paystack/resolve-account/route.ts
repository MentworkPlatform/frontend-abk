import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

export async function GET(request: NextRequest) {
  const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY

  if (!paystackSecretKey) {
    return NextResponse.json(
      {
        success: false,
        message: 'PAYSTACK_SECRET_KEY is not configured.',
      },
      { status: 500 },
    )
  }

  const accountNumber =
    request.nextUrl.searchParams.get('accountNumber')?.trim() ?? ''
  const bankCode = request.nextUrl.searchParams.get('bankCode')?.trim() ?? ''

  if (!/^\d{10}$/.test(accountNumber)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Account number must be exactly 10 digits.',
      },
      { status: 400 },
    )
  }

  if (!/^\d{3,6}$/.test(bankCode)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Bank code is invalid.',
      },
      { status: 400 },
    )
  }

  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/bank/resolve?account_number=${encodeURIComponent(
        accountNumber,
      )}&bank_code=${encodeURIComponent(bankCode)}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${paystackSecretKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      },
    )

    const payload = await response.json().catch(() => null)

    if (!response.ok || !payload?.status) {
      return NextResponse.json(
        {
          success: false,
          message:
            payload?.message ??
            'Unable to validate account number with Paystack.',
        },
        { status: response.status || 500 },
      )
    }

    return NextResponse.json({
      success: true,
      accountName: String(payload?.data?.account_name ?? ''),
      accountNumber: String(payload?.data?.account_number ?? accountNumber),
      bankCode,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to validate account number with Paystack.',
      },
      { status: 500 },
    )
  }
}

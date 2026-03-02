import { NextRequest, NextResponse } from 'next/server'

const PAYSTACK_BASE_URL = 'https://api.paystack.co'

const COUNTRY_MAP: Record<string, string> = {
  NG: 'nigeria',
  GH: 'ghana',
  KE: 'kenya',
  ZA: 'south africa',
}

const resolveCountry = (rawCountry: string | null) => {
  if (!rawCountry) {
    return 'nigeria'
  }

  const normalized = rawCountry.trim().toUpperCase()
  return COUNTRY_MAP[normalized] ?? normalized.toLowerCase()
}

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

  const country = resolveCountry(request.nextUrl.searchParams.get('country'))

  try {
    const response = await fetch(
      `${PAYSTACK_BASE_URL}/bank?country=${encodeURIComponent(country)}&perPage=500`,
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
          message: payload?.message ?? 'Unable to fetch bank list from Paystack.',
        },
        { status: response.status || 500 },
      )
    }

    const banks = (Array.isArray(payload.data) ? payload.data : [])
      .filter((bank) => bank && bank.active !== false)
      .map((bank) => ({
        name: String(bank.name ?? ''),
        code: String(bank.code ?? ''),
      }))
      .filter((bank) => bank.name && bank.code)

    return NextResponse.json({
      success: true,
      banks,
    })
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: 'Unable to fetch bank list from Paystack.',
      },
      { status: 500 },
    )
  }
}

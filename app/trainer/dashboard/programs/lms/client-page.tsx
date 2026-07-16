"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import ProgramLMSPage from "../[id]/lms/client-page"

function ProgramLmsContent() {
  const searchParams = useSearchParams()
  const programId = searchParams.get("id") ?? ""

  return <ProgramLMSPage programId={programId} />
}

export default function ProgramLmsStaticPage() {
  return (
    <Suspense fallback={null}>
      <ProgramLmsContent />
    </Suspense>
  )
}

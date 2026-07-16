"use client"

import { Suspense } from "react"
import { useSearchParams } from "next/navigation"

import ProgramManagementPage from "../[id]/client-page"

function ProgramViewContent() {
  const searchParams = useSearchParams()
  const programId = searchParams.get("id") ?? ""

  return <ProgramManagementPage programId={programId} />
}

export default function ProgramViewPage() {
  return (
    <Suspense fallback={null}>
      <ProgramViewContent />
    </Suspense>
  )
}

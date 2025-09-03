import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5]">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-[#FFD500]" />
        <p className="mt-4 text-lg font-medium">Loading...</p>
      </div>
    </div>
  )
}

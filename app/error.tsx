"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
          </div>
          <div className="flex justify-center mb-4">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center">Something went wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 mb-6">
            We're sorry, but there was an error processing your request. Please try again or contact support if the
            problem persists.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button onClick={reset} className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">
            Try Again
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Go to Homepage</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

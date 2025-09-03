import Link from "next/link"
import { ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F5F5] p-4">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
          </div>
          <CardTitle className="text-2xl text-center">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-gray-500 mb-6">The page you're looking for doesn't exist or has been moved.</p>
          <img
            src="/placeholder.svg?height=200&width=300"
            alt="Not Found Illustration"
            className="mx-auto mb-6 rounded-lg"
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">
            <Link href="/">Go to Homepage</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/programs">
              <ArrowLeft className="mr-2 h-4 w-4" /> Browse Programs
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

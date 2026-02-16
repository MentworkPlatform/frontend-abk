"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { ArrowLeft, CreditCard, Calendar, CheckCircle, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Ensure all programs have the necessary data
const allPrograms = Array.from({ length: 6 }).map((_, index) => ({
  id: index + 1,
  title: index === 0 ? "Startup Funding Masterclass" : `Program ${index + 1}`,
  description:
    "Learn how to secure funding for your startup with proven strategies from an experienced investor. This comprehensive program covers everything from pitch deck creation to investor negotiations.",
  mentor: {
    name: index === 0 ? "Dr. Amina Diallo" : `Mentor ${index + 1}`,
    title: "Tech Entrepreneur & Investor",
    image: "/placeholder.svg?height=200&width=200",
  },
  category: "Business Growth",
  industry: "Technology",
  type: index % 2 === 0 ? "Group Program" : "1:1 Program",
  sessions: 8,
  freeSessionsIncluded: 1,
  price: 1200 + index * 100,
  startDate: "June 15, 2025",
  image: "/placeholder.svg?height=500&width=800",
}))

export default function JoinProgramPage() {
  const params = useParams()
  const router = useRouter()
  const [enrollmentType, setEnrollmentType] = useState<"free-trial" | "full-program">("full-program")
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  // Find the program based on the ID from the URL
  const programId = Number(params.id)
  const program = allPrograms.find((p) => p.id === programId)

  // If program not found, show error or redirect
  if (!program) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f5]">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>Program Not Found</CardTitle>
            <CardDescription>The program you're looking for doesn't exist.</CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/programs">Browse Programs</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // Simulate payment processing or free trial enrollment
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/mentee/dashboard")
    }, 2000)
  }

  const handleFreeTrialEnroll = () => {
    setIsProcessing(true)
    // Simulate free trial enrollment
    setTimeout(() => {
      setIsProcessing(false)
      router.push("/mentee/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      {/* Header */}
      <header className="sticky top-0 z-30 w-full border-b border-white/20 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/80">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl">
            <Link href="/">
              <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8" />
            </Link>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/mentee/dashboard">Dashboard</Link>
            </Button>
        </div>
      </header>

      <div className="container py-8">
        <Button
          variant="ghost"
          size="sm"
          className="mb-4 flex items-center gap-2"
          onClick={() => router.push(`/programs/${program.id}`)}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Program
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Complete Your Enrollment</CardTitle>
                <CardDescription>
                  You're joining {program.title} with {program.mentor.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    {/* Enrollment Type Selection */}
                    <div>
                      <h3 className="text-lg font-bold mb-4">Enrollment Option</h3>
                      <RadioGroup
                        value={enrollmentType}
                        onValueChange={(value) => setEnrollmentType(value as "free-trial" | "full-program")}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        {program.freeSessionsIncluded > 0 && (
                          <div>
                            <RadioGroupItem value="free-trial" id="free-trial" className="peer sr-only" />
                            <Label
                              htmlFor="free-trial"
                              className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#FFD500] peer-data-[state=checked]:bg-[#FFFBEB] [&:has([data-state=checked])]:border-[#FFD500] [&:has([data-state=checked])]:bg-[#FFFBEB] cursor-pointer h-full"
                            >
                              <div className="w-full">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="font-bold">Free Trial</p>
                                  <Badge className="bg-green-500 text-white">FREE</Badge>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                  Try {program.freeSessionsIncluded} session{program.freeSessionsIncluded > 1 ? 's' : ''} free
                                </p>
                                <ul className="text-xs text-gray-500 space-y-1">
                                  <li>✓ Experience the program value</li>
                                  <li>✓ No payment required</li>
                                  <li>✓ Upgrade anytime</li>
                                </ul>
                              </div>
                            </Label>
                          </div>
                        )}

                        <div>
                          <RadioGroupItem value="full-program" id="full-program" className="peer sr-only" />
                          <Label
                            htmlFor="full-program"
                            className="flex flex-col items-start justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#FFD500] peer-data-[state=checked]:bg-[#FFFBEB] [&:has([data-state=checked])]:border-[#FFD500] [&:has([data-state=checked])]:bg-[#FFFBEB] cursor-pointer h-full"
                          >
                            <div className="w-full">
                              <div className="flex items-center justify-between mb-2">
                                <p className="font-bold">Full Program</p>
                                <Badge className="bg-[#FFD500] text-black">RECOMMENDED</Badge>
                              </div>
                              <p className="text-sm text-gray-600 mb-3">
                                Get access to all {program.sessions} sessions
                              </p>
                              <ul className="text-xs text-gray-500 space-y-1">
                                <li>✓ All program materials</li>
                                <li>✓ Certificate of completion</li>
                                <li>✓ 30-day money-back guarantee</li>
                              </ul>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {enrollmentType === "full-program" && (
                      <>
                    <div>
                      <h3 className="text-lg font-bold mb-4">Payment Method</h3>
                      <RadioGroup
                        value={paymentMethod}
                        onValueChange={setPaymentMethod}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                      >
                        <div>
                          <RadioGroupItem value="credit-card" id="credit-card" className="peer sr-only" />
                          <Label
                            htmlFor="credit-card"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#FFD500] peer-data-[state=checked]:bg-[#FFFBEB] [&:has([data-state=checked])]:border-[#FFD500] [&:has([data-state=checked])]:bg-[#FFFBEB]"
                          >
                            <CreditCard className="mb-3 h-6 w-6" />
                            <div className="text-center">
                              <p className="font-medium">Credit Card</p>
                              <p className="text-sm text-gray-500">Pay with Visa, Mastercard, etc.</p>
                            </div>
                          </Label>
                        </div>

                        <div>
                          <RadioGroupItem value="mobile-money" id="mobile-money" className="peer sr-only" />
                          <Label
                            htmlFor="mobile-money"
                            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-white p-4 hover:bg-gray-50 hover:border-gray-300 peer-data-[state=checked]:border-[#FFD500] peer-data-[state=checked]:bg-[#FFFBEB] [&:has([data-state=checked])]:border-[#FFD500] [&:has([data-state=checked])]:bg-[#FFFBEB]"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="mb-3 h-6 w-6"
                            >
                              <rect width="14" height="20" x="5" y="2" rx="2" ry="2" />
                              <path d="M12 18h.01" />
                            </svg>
                            <div className="text-center">
                              <p className="font-medium">Mobile Money</p>
                              <p className="text-sm text-gray-500">Pay with M-Pesa, MTN, etc.</p>
                            </div>
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {paymentMethod === "credit-card" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="card-number">Card Number</Label>
                          <Input id="card-number" placeholder="1234 5678 9012 3456" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <Input id="expiry" placeholder="MM/YY" required />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" required />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Name on Card</Label>
                          <Input id="name" placeholder="John Doe" required />
                        </div>
                      </div>
                    )}

                    {paymentMethod === "mobile-money" && (
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input id="phone" placeholder="+254 712 345 678" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="provider">Mobile Money Provider</Label>
                          <select
                            id="provider"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            required
                          >
                            <option value="">Select provider</option>
                            <option value="mpesa">M-Pesa</option>
                            <option value="mtn">MTN Mobile Money</option>
                            <option value="airtel">Airtel Money</option>
                            <option value="orange">Orange Money</option>
                          </select>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center p-4 bg-[#FFFBEB] rounded-lg border border-[#FFD500]">
                      <Lock className="h-5 w-5 text-[#FFD500] mr-3" />
                      <p className="text-sm">
                        Your payment information is secure. We use industry-standard encryption to protect your data.
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                            `Pay ₦${(program.price * 1500).toLocaleString()} and Enroll`
                          )}
                        </Button>
                      </>
                    )}

                    {enrollmentType === "free-trial" && (
                      <div className="space-y-4">
                        <div className="p-6 bg-green-50 rounded-lg border-2 border-green-200">
                          <h4 className="font-bold text-lg mb-2 text-green-900">What's Included in Your Free Trial</h4>
                          <ul className="space-y-2 text-sm text-green-800">
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                              <span>Access to {program.freeSessionsIncluded} free session{program.freeSessionsIncluded > 1 ? 's' : ''}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                              <span>Meet your {program.type === "Group Program" ? "facilitator and cohort" : "mentor"}</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                              <span>Experience the program structure and content</span>
                            </li>
                            <li className="flex items-start gap-2">
                              <CheckCircle className="h-5 w-5 shrink-0 mt-0.5" />
                              <span>Upgrade to full program anytime</span>
                            </li>
                          </ul>
                        </div>

                        <Button
                          type="button"
                          onClick={handleFreeTrialEnroll}
                          className="w-full bg-green-600 text-white hover:bg-green-700"
                          disabled={isProcessing}
                        >
                          {isProcessing ? (
                            <>
                              <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                ></circle>
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                              </svg>
                              Enrolling...
                            </>
                          ) : (
                            "Start Free Trial - No Payment Required"
                      )}
                    </Button>

                        <p className="text-xs text-center text-gray-500">
                          You can upgrade to the full program at any time during or after the trial
                        </p>
                      </div>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <Card>
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="relative h-16 w-16 rounded-md overflow-hidden">
                      <img
                        src={program.image || "/placeholder.svg"}
                        alt={program.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{program.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={program.mentor.image || "/placeholder.svg"} alt={program.mentor.name} />
                          <AvatarFallback>
                            {program.mentor.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-sm text-gray-500">{program.mentor.name}</p>
                      </div>
                      <div className="flex gap-2 mt-2">
                        <Badge className="bg-[#FFD500] text-black">{program.type}</Badge>
                        <Badge variant="outline">{program.sessions} sessions</Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Starts {program.startDate}</span>
                  </div>

                  <Separator />

                  {enrollmentType === "full-program" ? (
                    <>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Program Price</span>
                          <span>₦{(program.price * 1500).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-green-600">
                      <span>Free Sessions</span>
                      <span>{program.freeSessionsIncluded} included</span>
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-between font-bold">
                    <span>Total</span>
                        <span>₦{(program.price * 1500).toLocaleString()}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span>Free Trial Access</span>
                          <span className="text-green-600 font-semibold">FREE</span>
                        </div>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>{program.freeSessionsIncluded} session{program.freeSessionsIncluded > 1 ? 's' : ''}</span>
                          <span>₦0</span>
                        </div>
                      </div>

                      <Separator />

                      <div className="flex justify-between font-bold">
                        <span>Total</span>
                        <span className="text-green-600">₦0</span>
                  </div>

                      <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800">
                          After your free trial, you can upgrade to the full program for ₦{(program.price * 1500).toLocaleString()}
                        </p>
                      </div>
                    </>
                  )}

                  <div className="space-y-2 pt-4">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">30-day money-back guarantee if you're not satisfied</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Access to all program materials and recordings</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span className="text-sm">Certificate of completion after finishing the program</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

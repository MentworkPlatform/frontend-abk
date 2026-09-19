"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { 
  ArrowLeft, 
  Check, 
  Calendar, 
  CreditCard, 
  ShieldCheck, 
  Lock, 
  AlertCircle, 
  RotateCcw, 
  Loader2, 
  Building2, 
  Smartphone,
  Sparkles
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"

type PaymentStatus = "idle" | "processing" | "success" | "failed" | "cancelled"

export default function JoinProgramPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const isFreeClaim = searchParams.get("type") === "free"
  
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "bank" | "ussd">("card")
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>("idle")
  const [failureReason, setFailureReason] = useState("Your card issuer declined the transaction (Insufficient funds or limit exceeded).")
  const [addToCalendar, setAddToCalendar] = useState(true)

  const program = {
    id: params.id || "1",
    title: "Complete Digital Marketing Bootcamp",
    mentor: "Emily Rodriguez",
    role: "Lead Facilitator & Growth Expert",
    category: "Marketing",
    level: "Beginner",
    duration: "12 weeks",
    price: 299000,
    transactionId: "MNW-94821",
  }

  const calculatedTotal = promoApplied ? Math.round(program.price * 0.9) : program.price

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault()
    setPaymentStatus("processing")
    setTimeout(() => {
      setPaymentStatus("success")
    }, 1500)
  }

  const handleFreeClaim = () => {
    setPaymentStatus("processing")
    setTimeout(() => {
      setPaymentStatus("success")
    }, 1000)
  }

  const simulateFailure = () => {
    setPaymentStatus("processing")
    setTimeout(() => {
      setPaymentStatus("failed")
    }, 1200)
  }

  const simulateCancel = () => {
    setPaymentStatus("cancelled")
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A] font-sans flex items-center justify-center p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-sm border border-[#E7E5E1] overflow-hidden">
        {/* Top bar with back button & branding */}
        <div className="px-6 py-4 border-b border-[#E7E5E1] flex items-center justify-between bg-white">
          <Link
            href={`/programs/${program.id}`}
            className="flex items-center gap-1.5 text-xs font-bold text-[#2B2B2B] hover:text-[#0A0A0A] transition-colors"
            aria-label="Back to programme"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Cancel</span>
          </Link>
          <div className="flex items-center gap-1">
            <span className="text-sm font-black tracking-tight text-[#0A0A0A]">mentwork</span>
            <span className="text-[10px] text-[#2B2B2B]/60 font-semibold uppercase tracking-wider ml-1">Pay</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-[#5B7B6E]">
            <Lock className="h-3 w-3" />
            <span>Encrypted</span>
          </div>
        </div>

        {/* PROCESSING STATE */}
        {paymentStatus === "processing" && (
          <div className="p-8 sm:p-12 text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border-2 border-[#0A0A0A] flex items-center justify-center mx-auto">
              <Loader2 className="h-8 w-8 text-[#0A0A0A] animate-spin" />
            </div>
            <h2 className="text-xl font-extrabold text-[#0A0A0A]">Processing Payment...</h2>
            <p className="text-xs sm:text-sm text-[#2B2B2B]/70 max-w-xs mx-auto leading-relaxed">
              Connecting to secure payment gateway. Please do not refresh or close this page.
            </p>
            <div className="pt-4 flex justify-center items-center gap-2 text-xs font-medium text-[#2B2B2B]/50">
              <ShieldCheck className="h-4 w-4 text-[#5B7B6E]" />
              <span>Secured by Paystack 256-bit encryption</span>
            </div>
          </div>
        )}

        {/* SUCCESS / ENROLLMENT CONFIRMATION STATE */}
        {paymentStatus === "success" && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#5B7B6E]/10 flex items-center justify-center mx-auto">
              <div className="w-10 h-10 rounded-full bg-[#5B7B6E] flex items-center justify-center text-white">
                <Check className="h-6 w-6 stroke-[3]" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#5B7B6E] uppercase tracking-wider block mb-1">
                {isFreeClaim ? "Trial Activated" : "Enrollment Confirmed"}
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0A0A0A]">
                {isFreeClaim ? "Session Claimed!" : "Payment Successful!"}
              </h1>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1 max-w-sm mx-auto">
                You are now officially enrolled in <strong className="text-[#0A0A0A]">{program.title}</strong>. A receipt has been sent to your email.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 text-left space-y-2.5 text-xs">
              <div className="flex justify-between">
                <span className="text-[#2B2B2B]/60">Transaction Reference</span>
                <span className="font-bold text-[#0A0A0A]">{program.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2B2B2B]/60">Amount Paid</span>
                <span className="font-bold text-[#0A0A0A]">
                  {isFreeClaim ? "₦0 (Free Trial)" : `₦${calculatedTotal.toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2B2B2B]/60">Facilitator</span>
                <span className="font-bold text-[#0A0A0A]">{program.mentor}</span>
              </div>
              <div className="pt-2 border-t border-[#E7E5E1] flex items-center justify-between">
                <span className="font-semibold text-[#0A0A0A]">Add sessions to Google / Outlook calendar</span>
                <Switch
                  checked={addToCalendar}
                  onCheckedChange={setAddToCalendar}
                  className="data-[state=checked]:bg-[#0A0A0A]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                asChild
                className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
              >
                <Link href="/mentee/dashboard">Go to Learning Workspace</Link>
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-xs font-semibold text-[#2B2B2B] hover:text-[#0A0A0A]"
              >
                <Link href={`/programs/${program.id}`}>View Programme Details</Link>
              </Button>
            </div>
          </div>
        )}

        {/* FAILED STATE */}
        {paymentStatus === "failed" && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#B0674A]/10 flex items-center justify-center mx-auto">
              <div className="w-10 h-10 rounded-full bg-[#B0674A] flex items-center justify-center text-white">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-[#B0674A] uppercase tracking-wider block mb-1">Payment Unsuccessful</span>
              <h1 className="text-2xl font-black text-[#0A0A0A]">We couldn't process this charge</h1>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1 max-w-sm mx-auto">
                {failureReason}
              </p>
            </div>

            <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 text-xs text-left space-y-1.5">
              <p className="font-bold text-[#0A0A0A]">Suggestions:</p>
              <p className="text-[#2B2B2B]/70">• Check that your card has online payments enabled</p>
              <p className="text-[#2B2B2B]/70">• Try an alternative method like Bank Transfer or USSD</p>
              <p className="text-[#2B2B2B]/70">• Contact your bank if the issue persists</p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setPaymentStatus("idle")}
                className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setPaymentMethod("bank")
                  setPaymentStatus("idle")
                }}
                className="w-full border-[#E7E5E1] hover:border-[#0A0A0A] font-semibold rounded-xl text-xs h-11"
              >
                Switch to Bank Transfer
              </Button>
            </div>
          </div>
        )}

        {/* CANCELLED STATE */}
        {paymentStatus === "cancelled" && (
          <div className="p-6 sm:p-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-full bg-[#FAF9F6] border border-[#E7E5E1] flex items-center justify-center mx-auto">
              <RotateCcw className="h-6 w-6 text-[#2B2B2B]/60" />
            </div>

            <div>
              <span className="text-xs font-bold text-[#2B2B2B]/60 uppercase tracking-wider block mb-1">Checkout Suspended</span>
              <h1 className="text-2xl font-black text-[#0A0A0A]">Payment was cancelled</h1>
              <p className="text-xs sm:text-sm text-[#2B2B2B]/70 mt-1 max-w-sm mx-auto">
                No charges were made to your account. Your spot in <strong className="text-[#0A0A0A]">{program.title}</strong> is temporarily reserved.
              </p>
            </div>

            <div className="space-y-2">
              <Button
                onClick={() => setPaymentStatus("idle")}
                className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
              >
                Resume Checkout
              </Button>
              <Button
                asChild
                variant="ghost"
                className="w-full text-xs font-semibold text-[#2B2B2B] hover:text-[#0A0A0A]"
              >
                <Link href={`/programs/${program.id}`}>Return to Programme</Link>
              </Button>
            </div>
          </div>
        )}

        {/* IDLE / CHECKOUT FORM */}
        {paymentStatus === "idle" && (
          <div>
            {isFreeClaim ? (
              /* Free Session Claim Screen */
              <div className="p-6 sm:p-7 space-y-6">
                <div>
                  <Badge variant="outline" className="border-[#5B7B6E] text-[#5B7B6E] font-bold mb-2">
                    Free Trial Claim
                  </Badge>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0A]">
                    Claim your free intro session
                  </h1>
                  <p className="text-xs text-[#2B2B2B]/70 mt-1">
                    Start learning immediately with no payment card required.
                  </p>
                </div>

                {/* Program Summary Card */}
                <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 flex gap-3.5 items-center">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-xs shrink-0">
                    M
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm font-bold text-[#0A0A0A] truncate">{program.title}</h3>
                    <p className="text-xs text-[#2B2B2B]/60 mt-0.5">With {program.mentor} • 1st Live Session</p>
                  </div>
                </div>

                <div className="rounded-xl border border-[#5B7B6E]/30 bg-[#5B7B6E]/5 p-3.5 flex items-center gap-2.5">
                  <Check className="h-4 w-4 text-[#5B7B6E] shrink-0" />
                  <span className="text-xs font-semibold text-[#0A0A0A]">Zero credit card or payment required</span>
                </div>

                <Button
                  onClick={handleFreeClaim}
                  className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs"
                >
                  Activate Free Session
                </Button>

                <div className="text-center">
                  <Link href={`/programs/${program.id}`} className="text-xs font-semibold text-[#2B2B2B]/60 hover:text-[#0A0A0A]">
                    Return to programme detail
                  </Link>
                </div>
              </div>
            ) : (
              /* Full Paid Checkout Form */
              <form onSubmit={handlePay} className="p-6 sm:p-7 space-y-6">
                <div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-[#0A0A0A]">
                    Review & Complete Enrollment
                  </h1>
                  <p className="text-xs text-[#2B2B2B]/70 mt-1">
                    Verify your order summary and choose your preferred payment method.
                  </p>
                </div>

                {/* 1. Order / Programme Info */}
                <div className="rounded-2xl border border-[#E7E5E1] bg-white p-4 shadow-xs flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-black text-sm shrink-0">
                    {program.category[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Badge variant="outline" className="text-[10px] py-0 border-[#E7E5E1] font-bold text-[#0A0A0A]">
                        {program.category}
                      </Badge>
                      <span className="text-[11px] text-[#2B2B2B]/60 font-medium">{program.duration}</span>
                    </div>
                    <h3 className="text-sm font-extrabold text-[#0A0A0A] truncate">
                      {program.title}
                    </h3>
                    <p className="text-[11px] text-[#2B2B2B]/60 truncate">
                      Facilitator: {program.mentor}
                    </p>
                  </div>
                </div>

                {/* 2. Transparent Pricing Breakdown */}
                <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-[#2B2B2B]/70">
                    <span>Standard Tuition</span>
                    <span>₦{program.price.toLocaleString()}</span>
                  </div>
                  {promoApplied && (
                    <div className="flex justify-between text-[#5B7B6E] font-semibold">
                      <span>Promo Discount (10% off)</span>
                      <span>-₦{Math.round(program.price * 0.1).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#2B2B2B]/70">
                    <span>Payment Processing Fee</span>
                    <span className="text-[#5B7B6E] font-semibold">Free (Covered by Mentwork)</span>
                  </div>
                  <div className="pt-2 border-t border-[#E7E5E1] flex items-center justify-between">
                    <span className="font-extrabold text-sm text-[#0A0A0A]">Total Payable</span>
                    <span className="font-black text-lg text-[#0A0A0A]">
                      ₦{calculatedTotal.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* 3. Promo Code */}
                <div>
                  <label className="text-[10px] font-bold text-[#2B2B2B]/70 uppercase tracking-wider block mb-1.5">
                    Have a promo or scholarship code?
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="e.g., MENTWORK10"
                      className="h-11 rounded-xl text-xs sm:text-sm flex-1 uppercase"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (promoCode.trim()) setPromoApplied(true)
                      }}
                      className="h-11 px-4 rounded-xl text-xs font-bold border-[#E7E5E1] hover:border-[#0A0A0A]"
                    >
                      {promoApplied ? "Applied ✓" : "Apply"}
                    </Button>
                  </div>
                </div>

                {/* 4. Payment Method Selector */}
                <div>
                  <label className="text-[10px] font-bold text-[#2B2B2B]/70 uppercase tracking-wider block mb-2">
                    Select Payment Method
                  </label>
                  <div className="space-y-2">
                    {/* Card */}
                    <div
                      onClick={() => setPaymentMethod("card")}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === "card"
                          ? "border-2 border-[#0A0A0A] bg-white font-bold shadow-xs"
                          : "border-[#E7E5E1] bg-white text-[#2B2B2B]/70 hover:border-[#0A0A0A]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="h-4 w-4 text-[#0A0A0A]" />
                        <div>
                          <p className="text-xs sm:text-sm text-[#0A0A0A] font-bold">Debit / Credit Card</p>
                          <p className="text-[11px] text-[#2B2B2B]/60 font-normal">Visa, Mastercard, Verve via Paystack</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "card" ? "border-[#0A0A0A]" : "border-[#D8D5CF]"}`}>
                        {paymentMethod === "card" && <div className="w-2 h-2 rounded-full bg-[#0A0A0A]" />}
                      </div>
                    </div>

                    {/* Bank Transfer */}
                    <div
                      onClick={() => setPaymentMethod("bank")}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === "bank"
                          ? "border-2 border-[#0A0A0A] bg-white font-bold shadow-xs"
                          : "border-[#E7E5E1] bg-white text-[#2B2B2B]/70 hover:border-[#0A0A0A]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Building2 className="h-4 w-4 text-[#0A0A0A]" />
                        <div>
                          <p className="text-xs sm:text-sm text-[#0A0A0A] font-bold">Direct Bank Transfer</p>
                          <p className="text-[11px] text-[#2B2B2B]/60 font-normal">Instant account generation & confirmation</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "bank" ? "border-[#0A0A0A]" : "border-[#D8D5CF]"}`}>
                        {paymentMethod === "bank" && <div className="w-2 h-2 rounded-full bg-[#0A0A0A]" />}
                      </div>
                    </div>

                    {/* USSD */}
                    <div
                      onClick={() => setPaymentMethod("ussd")}
                      className={`p-3.5 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                        paymentMethod === "ussd"
                          ? "border-2 border-[#0A0A0A] bg-white font-bold shadow-xs"
                          : "border-[#E7E5E1] bg-white text-[#2B2B2B]/70 hover:border-[#0A0A0A]/40"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Smartphone className="h-4 w-4 text-[#0A0A0A]" />
                        <div>
                          <p className="text-xs sm:text-sm text-[#0A0A0A] font-bold">USSD Banking</p>
                          <p className="text-[11px] text-[#2B2B2B]/60 font-normal">Dial code on your mobile phone</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === "ussd" ? "border-[#0A0A0A]" : "border-[#D8D5CF]"}`}>
                        {paymentMethod === "ussd" && <div className="w-2 h-2 rounded-full bg-[#0A0A0A]" />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5. Primary Action Button */}
                <Button
                  type="submit"
                  className="w-full bg-[#F5C400] text-[#0A0A0A] hover:bg-[#E5B700] font-bold rounded-xl h-12 text-sm shadow-xs transition-transform active:scale-[0.99]"
                >
                  Pay ₦{calculatedTotal.toLocaleString()} & Complete Enrollment
                </Button>

                {/* Security badges & reassurance */}
                <div className="pt-2 text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-xs text-[#2B2B2B]/60">
                    <ShieldCheck className="h-4 w-4 text-[#5B7B6E]" />
                    <span>256-Bit Bank Grade Encryption • Paystack Verified</span>
                  </div>
                  <p className="text-[11px] text-[#2B2B2B]/50">
                    7-day money-back guarantee if you are not completely satisfied.
                  </p>
                </div>

                {/* State simulation triggers for QA & User Testing */}
                <div className="border-t border-[#E7E5E1] pt-4 mt-6">
                  <p className="text-[10px] font-bold text-[#2B2B2B]/40 uppercase tracking-wider mb-2 text-center">
                    Payment Simulation Testing Controls
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={simulateFailure}
                      className="text-[11px] rounded-xl border-[#E7E5E1] text-[#B0674A] hover:border-[#B0674A]"
                    >
                      Simulate Failure
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={simulateCancel}
                      className="text-[11px] rounded-xl border-[#E7E5E1] text-[#6E7BA8] hover:border-[#6E7BA8]"
                    >
                      Simulate Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const [activeOtpIndex, setActiveOtpIndex] = useState(0)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [resendTimer, setResendTimer] = useState(45)
  const [isLoading, setIsLoading] = useState(false)

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Resend countdown timer for step 2
  useEffect(() => {
    if (step === 2 && resendTimer > 0) {
      const interval = setInterval(() => {
        setResendTimer((prev) => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [step, resendTimer])

  // Step 1: Send OTP
  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(2)
      setResendTimer(45)
    }, 800)
  }

  // Handle OTP digit changes
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.slice(0, 6).split("")
      const newOtp = [...otp]
      pasted.forEach((char, i) => {
        if (i < 6) newOtp[i] = char
      })
      setOtp(newOtp)
      const nextIndex = Math.min(pasted.length, 5)
      setActiveOtpIndex(nextIndex)
      otpInputRefs.current[nextIndex]?.focus()
      return
    }

    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    if (value && index < 5) {
      setActiveOtpIndex(index + 1)
      otpInputRefs.current[index + 1]?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveOtpIndex(index - 1)
      otpInputRefs.current[index - 1]?.focus()
    }
  }

  // Step 2: Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault()
    if (otp.join("").length < 6) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setStep(3)
    }, 800)
  }

  // Password validation rules
  const hasMinLength = password.length >= 8
  const hasNumberAndSpecial = /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)
  const passwordsMatch = password.length > 0 && password === confirmPassword
  const canReset = hasMinLength && hasNumberAndSpecial && passwordsMatch

  // Step 3: Reset password
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault()
    if (!canReset) return
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      router.push("/login")
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A] font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E7E5E1] p-6 sm:p-8">
        {/* Brand header */}
        <div className="mb-4 flex items-center justify-between">
          <Link href="/" aria-label="Mentwork home">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-7 w-auto" />
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F2F1EE] text-[#4B4B4B] px-2.5 py-1 rounded-md border border-[#E7E5E1]">
            Step {step} of 3
          </span>
        </div>

        {/* Back navigation */}
        <div className="mb-4">
          <button
            type="button"
            onClick={() => {
              if (step === 1) router.push("/login")
              else if (step === 2) setStep(1)
              else setStep(2)
            }}
            className="flex items-center gap-1 text-xs font-bold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors py-1 px-1.5 rounded-lg hover:bg-[#F2F1EE]"
            aria-label="Go back"
          >
            ‹ <span>Back</span>
          </button>
        </div>

        {/* STEP 1: Request Code */}
        {step === 1 && (
          <form onSubmit={handleSendCode}>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
              Forgot password?
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 mb-6 leading-relaxed">
              Enter the email associated with your account and we&apos;ll send you a 6-digit code.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Email Address
                </label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. your@email.com"
                  className="h-12 rounded-xl text-sm"
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email}
                className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300] mt-2"
              >
                {isLoading ? "Sending code..." : "Send code"}
              </Button>
            </div>

            <div className="text-center mt-8">
              <Link href="/login" className="text-xs font-semibold text-[#6B6B6B] hover:text-[#0A0A0A]">
                ‹ Back to sign in
              </Link>
            </div>
          </form>
        )}

        {/* STEP 2: Verify Code */}
        {step === 2 && (
          <form onSubmit={handleVerifyOtp}>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
              Enter verify code
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 mb-6 leading-relaxed">
              We sent a 6-digit code to <span className="font-semibold text-[#0A0A0A]">{email}</span>.
            </p>

            {/* 6-box OTP digits */}
            <div className="flex gap-2.5 sm:gap-3 mb-6">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  ref={(el) => {
                    otpInputRefs.current[idx] = el
                  }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onFocus={() => setActiveOtpIndex(idx)}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                  className={`flex-1 aspect-square text-center text-lg sm:text-xl font-bold rounded-xl bg-white border outline-none transition-all ${
                    activeOtpIndex === idx
                      ? "border-[#0A0A0A] border-2 ring-1 ring-[#0A0A0A]"
                      : digit
                      ? "border-[#0A0A0A] text-[#0A0A0A]"
                      : "border-[#D8D5CF] text-[#0A0A0A]"
                  }`}
                />
              ))}
            </div>

            <Button
              type="submit"
              disabled={isLoading || otp.join("").length < 6}
              className={`w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300] transition-opacity ${
                otp.join("").length < 6 ? "opacity-40 cursor-not-allowed" : "opacity-100"
              }`}
            >
              {isLoading ? "Verifying..." : "Verify code"}
            </Button>

            <p className="text-center text-xs text-[#6B6B6B] mt-6">
              Didn&apos;t receive it?{" "}
              {resendTimer > 0 ? (
                <span className="font-bold text-[#0A0A0A]">Resend code ({resendTimer}s)</span>
              ) : (
                <button
                  type="button"
                  onClick={() => setResendTimer(45)}
                  className="font-bold text-[#0A0A0A] hover:underline"
                >
                  Resend code
                </button>
              )}
            </p>
          </form>
        )}

        {/* STEP 3: Reset Password */}
        {step === 3 && (
          <form onSubmit={handleResetPassword}>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
              Reset password
            </h1>
            <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1 mb-6 leading-relaxed">
              Create a secure new password for your account.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="h-12 rounded-xl text-sm pr-11"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#0A0A0A]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Confirm Password
                </label>
                <Input
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="h-12 rounded-xl text-sm"
                />
              </div>

              {/* Password Requirements Checklist with Sage checks */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasMinLength ? "bg-[#5B7B6E] text-white" : "border border-[#D8D5CF] text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={hasMinLength ? "text-[#0A0A0A] font-semibold" : "text-[#9B9B9B]"}>
                    At least 8 characters
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      hasNumberAndSpecial ? "bg-[#5B7B6E] text-white" : "border border-[#D8D5CF] text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={hasNumberAndSpecial ? "text-[#0A0A0A] font-semibold" : "text-[#9B9B9B]"}>
                    Contains a number &amp; special character
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <div
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                      passwordsMatch ? "bg-[#5B7B6E] text-white" : "border border-[#D8D5CF] text-transparent"
                    }`}
                  >
                    ✓
                  </div>
                  <span className={passwordsMatch ? "text-[#0A0A0A] font-semibold" : "text-[#9B9B9B]"}>
                    Passwords match
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !canReset}
                className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#e0b300] mt-4"
              >
                {isLoading ? "Saving..." : "Reset and log in"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

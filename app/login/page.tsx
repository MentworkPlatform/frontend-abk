"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState<"mentee" | "mentor" | "trainer">("mentee")

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login/signup and redirect based on role
    setTimeout(() => {
      setIsLoading(false)
      switch (role) {
        case "mentee":
          router.push("/mentee/dashboard")
          break
        case "mentor":
          router.push("/mentor/dashboard")
          break
        case "trainer":
          router.push("/trainer/dashboard")
          break
        default:
          router.push("/mentee/dashboard")
      }
    }, 1200)
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#0A0A0A] font-sans flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#E7E5E1] p-6 sm:p-8">
        {/* Brand header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/" aria-label="Mentwork home">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-8 w-auto" />
          </Link>
          <span className="text-[11px] font-bold uppercase tracking-wider bg-[#F2F1EE] text-[#4B4B4B] px-2.5 py-1 rounded-md border border-[#E7E5E1]">
            {isSignUp ? "Registration" : "Portal"}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl font-extrabold tracking-tight text-[#0A0A0A]">
          {isSignUp ? "Create your account" : "Welcome back"}
        </h1>
        <p className="text-xs sm:text-sm text-[#6B6B6B] mt-1.5 mb-5">
          {isSignUp
            ? "Enter your details to join the Mentwork network."
            : "Log in to continue your learning and mentoring journey."}
        </p>

        {/* Role Segmented Control */}
        <div className="bg-[#F2F1EE] rounded-xl p-1 flex gap-1 mb-6 border border-[#E7E5E1]">
          {(["mentee", "mentor", "trainer"] as const).map((r) => (
            <button
              key={r}
              type="button"
              onClick={() => setRole(r)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg capitalize transition-all ${
                role === r
                  ? "bg-[#0A0A0A] text-white shadow-xs"
                  : "text-[#6B6B6B] hover:text-[#0A0A0A] hover:bg-white/50"
              }`}
            >
              {r}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider block mb-1.5">
                Full Name
              </label>
              <Input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="e.g. Zainab Nadada"
                className="h-12 rounded-xl text-sm border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
              />
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider block mb-1.5">
              Email Address
            </label>
            <Input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="e.g. your@email.com"
              className="h-12 rounded-xl text-sm border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[11px] font-bold text-[#4B4B4B] uppercase tracking-wider">
                Password
              </label>
              {!isSignUp && (
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#6B6B6B] hover:text-[#0A0A0A] transition-colors"
                >
                  Forgot password?
                </Link>
              )}
            </div>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••••••"
                className="h-12 rounded-xl text-sm pr-11 border-[#D8D5CF] focus-visible:ring-[#0A0A0A] bg-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9B9B9B] hover:text-[#0A0A0A] transition-colors p-1"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {isSignUp && (
            <p className="text-[11px] text-[#9B9B9B] leading-relaxed pt-1">
              By creating an account, you agree to Mentwork&apos;s Terms of Service and Privacy Policy.
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-12 hover:bg-[#E5B700] active:scale-[0.99] transition-all shadow-xs mt-2 text-sm"
          >
            {isLoading ? "Please wait..." : isSignUp ? "Create account" : "Log in"}
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <div className="flex-1 h-[1px] bg-[#E7E5E1]" />
          <span className="text-[11px] font-medium text-[#9B9B9B]">or continue with</span>
          <div className="flex-1 h-[1px] bg-[#E7E5E1]" />
        </div>

        {/* Social auth */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            className="h-11 rounded-xl text-xs font-bold border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6]"
          >
            Google
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {}}
            className="h-11 rounded-xl text-xs font-bold border-[#E7E5E1] text-[#0A0A0A] hover:bg-[#FAF9F6]"
          >
            Apple
          </Button>
        </div>

        {/* Switch between sign in and sign up */}
        <p className="text-center text-xs text-[#6B6B6B]">
          {isSignUp ? (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="font-bold text-[#0A0A0A] hover:underline"
              >
                Sign In
              </button>
            </>
          ) : (
            <>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="font-bold text-[#0A0A0A] hover:underline"
              >
                Sign Up
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  )
}

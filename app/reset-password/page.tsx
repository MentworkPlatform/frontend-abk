"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Mail, ArrowRight, CheckCircle, Lock } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { apiClient, ApiError } from "@/lib/api-client"
import { PASSWORD_RESET_URL } from "@/lib/server-url"
import { toast } from "@/components/ui/use-toast"
import { useSearchParams } from "next/navigation";


export default function ResetPasswordPage() {
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");

  type PasswordResetResponse = {
    success?: boolean
    error?: string
    message?: string
     data?: {
    success?: boolean
    error?: string
    token?: string
    accessToken?: string
    user?: {
      role?: string | { name?: string }
      userType?: string
    }
  }
    
  
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if(password !== confirmPassword) {
      toast({
        title: 'Password reset failed',
        description: 'The passwords you entered do not match.',
        variant: 'destructive',
      })
      alert("The passwords you entered do not match.")
      setIsLoading(false)
      return
    }

    if(emailParam === null || token === null) {
      toast({
        title: 'Password reset failed', 
        description: 'Invalid reset link. Please request a new password reset.',
        variant: 'destructive',
      })
      alert("Invalid reset link. Please request a new password reset.")
      setIsLoading(false)
      return
    }

    try {
          const response = await apiClient.post<
            PasswordResetResponse,
            { email: string, password: string, token: string | null }
          >(
            PASSWORD_RESET_URL,
            {
              password: password,
              token: token, // Assuming you have a token to send along with the password reset request
              email: emailParam, // Assuming you have the user's email to send along with the password reset request
            },
            { withAuth: false },
          )
    
          if (response.success === false || response.data?.success === false) {
            throw new Error(
              response.error ?? response.data?.error ?? 'Something went wrong while sending the password reset email.',
            )
          }

           setIsLoading(false)
           setIsSubmitted(true)
         
        } 
    catch (error) {
        console.log("Error sending password reset email:", error)
        alert("An error occurred while sending the password reset email. Please try again.")
          toast({
            title: 'Password reset failed',
            description: 'An error occurred while sending the password reset email. Please try again.',
            variant: 'destructive',
          })
          
    } 
    finally {
       toast({
            title: 'Password reset failed',
            description: 'An error occurred while sending the password reset email. Please try again.',
            variant: 'destructive',
          })
          setIsLoading(false)
    }
      

    // Simulate sending reset email
  
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img src="/images/mentwork-logo.png" alt="Mentwork" className="h-12 w-auto mx-auto" />
          </Link>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">Reset Password</h2>
          <p className="mt-2 text-sm text-gray-600">
           Choose a new password for your account
          </p>
        </div>

        <Card>
          {/* <CardHeader>
            <CardTitle>Set Password</CardTitle>
            <CardDescription>Choose a new password for your account</CardDescription>
          </CardHeader> */}

          <CardContent>
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  
                  <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="password"
                      placeholder="New Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-8"
                      required
                    />

                    

                  </div>

                   <div className="relative">
                    <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-8"
                        required
                        />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Saving..."
                  ) : (
                    <>
                      Save Password
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            ) : (
              <div className="space-y-4 text-center">
                <div className="flex justify-center">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Congratulations!</h3>
                  <p className="text-sm text-gray-600">
                    Your password has been successfully reset.
                  </p>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
                  
                >
                    Login Now
                    <Link href="/login">
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
               
              </div>
            )}

          </CardContent>
        </Card>
      </div>
    </div>
  )
}

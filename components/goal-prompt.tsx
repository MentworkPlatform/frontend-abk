"use client"

import type React from "react"

import { useState } from "react"
import { ArrowRight, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

export default function GoalPrompt() {
  const [goal, setGoal] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const exampleGoals = [
    "Scale my startup",
    "Secure funding for my business",
    "Improve my team management",
    "Enter new markets in Africa",
    "Optimize my business operations",
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!goal) return

    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      // Redirect to onboarding or results page
      window.location.href = "/onboarding?goal=" + encodeURIComponent(goal)
    }, 1500)
  }

  const handleFocus = () => {
    if (!showSuggestions) {
      setShowSuggestions(true)
      setSuggestions(exampleGoals)
    }
  }

  const selectSuggestion = (suggestion: string) => {
    setGoal(suggestion)
    setShowSuggestions(false)
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex flex-col items-center">
          <div className="relative w-full max-w-2xl">
            <Input
              type="text"
              placeholder="What are your goals?"
              className="pr-20 h-14 text-lg rounded-full border-2 border-[#FFD500] focus-visible:ring-[#FFD500]"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              onFocus={handleFocus}
            />
            <Button
              type="submit"
              className="absolute right-1 top-1 h-12 rounded-full bg-[#FFD500] text-black hover:bg-[#e6c000]"
              disabled={isSubmitting || !goal}
            >
              {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <ArrowRight className="h-5 w-5" />}
              <span className="sr-only">Submit</span>
            </Button>
          </div>

          {showSuggestions && (
            <Card className="mt-2 w-full max-w-2xl">
              <CardContent className="p-2">
                <p className="text-sm text-gray-500 mb-2 px-2">Suggested goals:</p>
                <ul>
                  {suggestions.map((suggestion, index) => (
                    <li key={index}>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-left rounded-md hover:bg-[#F5F5F5]"
                        onClick={() => selectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </Button>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      </form>

      <p className="text-sm text-gray-500 mt-4 text-center">
        Share your professional goals and we'll match you with the right mentors
      </p>
    </div>
  )
}

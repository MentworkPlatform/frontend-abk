"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Calendar, DollarSign } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import type { SchoolMentorshipProgram } from "@/types/school-mentorship"

interface ApplyToProgramModalProps {
  isOpen: boolean
  onClose: () => void
  program: SchoolMentorshipProgram
}

export function ApplyToProgramModal({ isOpen, onClose, program }: ApplyToProgramModalProps) {
  const [motivation, setMotivation] = useState("")
  const [experience, setExperience] = useState("")
  const [availability, setAvailability] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      console.log("Application submitted:", {
        programId: program.id,
        motivation,
        experience,
        availability,
        termsAccepted,
      })
      setIsSubmitting(false)
      onClose()
    }, 1000)
  }

  const isFormValid =
    motivation.trim() !== "" && experience.trim() !== "" && availability.trim() !== "" && termsAccepted

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Apply to {program.title}</DialogTitle>
          <DialogDescription>
            Share your experience and motivation to join this school mentorship program.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          <div className="p-4 bg-gray-50 rounded-md space-y-3">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Program Duration</p>
                <p className="text-sm text-gray-500">
                  {format(new Date(program.startDate), "MMM d, yyyy")} -{" "}
                  {format(new Date(program.endDate), "MMM d, yyyy")}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-gray-500" />
              <div>
                <p className="text-sm font-medium">Compensation</p>
                <p className="text-lg font-bold">${program.compensationRate}/hour</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="motivation" className="block text-sm font-medium mb-1">
                Why are you interested in this program?
              </label>
              <Textarea
                id="motivation"
                placeholder="Share your motivation for joining this program..."
                value={motivation}
                onChange={(e) => setMotivation(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="experience" className="block text-sm font-medium mb-1">
                Relevant experience with students
              </label>
              <Textarea
                id="experience"
                placeholder="Describe your experience working with students in this age group or subject area..."
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="availability" className="block text-sm font-medium mb-1">
                Your availability
              </label>
              <Textarea
                id="availability"
                placeholder="Share your availability during the program period..."
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
              />
            </div>

            <div className="flex items-start space-x-2 pt-2">
              <Checkbox
                id="terms"
                checked={termsAccepted}
                onCheckedChange={(checked) => setTermsAccepted(checked === true)}
              />
              <label htmlFor="terms" className="text-sm text-gray-500">
                I understand that applying does not guarantee acceptance, and I commit to the program dates if selected.
                I also agree to Mentwork Foundation's code of conduct for school mentorship.
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="bg-[#FFD500] text-black hover:bg-[#e6c000]"
          >
            {isSubmitting ? "Submitting..." : "Submit Application"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

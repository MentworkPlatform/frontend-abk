"use client"

import { useState } from "react"
import Link from "next/link"
import { Calendar, Users, Plus, Target, Clock, Star, CheckCircle, Eye, BookOpen, ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const activePrograms = [
  {
    id: 1,
    title: "Digital Marketing Bootcamp",
    trainer: "Zainab Nadada",
    mentees: 14,
    totalMentees: 40,
    currentWeek: "Week 2 of 4",
    nextSession: "Wireframe review",
    nextSessionTime: "Tue 11:00 AM",
    expectedPayout: 112000,
    status: "active",
    focusArea: "Digital Marketing",
  },
  {
    id: 2,
    title: "Startup Funding Masterclass",
    trainer: "Tunde Aro",
    mentees: 12,
    totalMentees: 25,
    currentWeek: "Week 3 of 8",
    nextSession: "Pitch Deck Review",
    nextSessionTime: "Tomorrow, 10:00 AM",
    expectedPayout: 96000,
    status: "active",
    focusArea: "Finance & Funding",
  },
]

const teachingOpportunities = [
  {
    id: 3,
    title: "UX Research Foundations",
    creator: "Amaka Obi",
    type: "Cohort Programme",
    duration: "6 weeks",
    spotsLeft: 2,
    compensation: "₦9,000 / mentee",
    timeCommitment: "~4 hrs/week",
    focusArea: "Design",
    description: "Review participant assignments and lead one weekly live critique session.",
  },
  {
    id: 4,
    title: "Operations Excellence Workshop",
    creator: "Business Growth Institute",
    type: "Workshop Series",
    duration: "4 weeks",
    spotsLeft: 3,
    compensation: "₦12,000 / mentee",
    timeCommitment: "~3 hrs/week",
    focusArea: "Operations",
    description: "Guide business owners through operational bottlenecks and cost control.",
  },
]

export default function MentorDashboardPage() {
  const [selectedOpportunity, setSelectedOpportunity] = useState<any>(null)
  const [isApplying, setIsApplying] = useState(false)
  const [applicationSuccess, setApplicationSuccess] = useState(false)

  const handleApply = (opp: any) => {
    setSelectedOpportunity(opp)
    setIsApplying(true)
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      <DashboardHeader
        title="Mentor Dashboard"
        description="Review mentee work, join scheduled sessions, and find new cohorts"
        actionButton={{
          label: "Find Opportunities",
          href: "/programs?view=mentor",
          icon: Plus,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Profile & Credibility Banner */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="h-32 bg-[#2B2B2B] p-5 sm:p-6 flex items-start justify-between">
            <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              Top 15% mentor this month
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              CN
            </div>
          </div>

          <div className="p-5 sm:p-7 pt-0 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div className="flex items-end gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#2B2B2B] border-4 border-white shadow-md flex items-center justify-center text-white font-extrabold text-xl">
                  CN
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-extrabold text-[#0A0A0A]">Chidi Nwosu</h2>
                  <p className="text-xs text-[#6B6B6B]">Product Design Mentor · Lagos</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  <Link href="/mentor/dashboard/settings">Settings</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300]">
                  <Link href="/programs?view=mentor">Explore Requests</Link>
                </Button>
              </div>
            </div>

            {/* Credibility Stats Row */}
            <div className="grid grid-cols-3 bg-[#F2F1EE] rounded-2xl p-3.5 sm:p-4 text-center divide-x divide-[#E7E5E1] mb-5">
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">48</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">mentees supported</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">4.8★</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">avg. rating</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">3</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">programmes active</p>
              </div>
            </div>

            {/* Level Bar Card */}
            <div className="rounded-2xl bg-[#0A0A0A] p-4 sm:p-5 text-white mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">Level 2 · Trusted Mentor</span>
                <span className="text-xs font-bold text-[#F5C400]">Level 3 →</span>
              </div>
              <div className="flex gap-1.5 items-center mb-2">
                <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#444444]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#444444]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#444444]" />
              </div>
              <p className="text-[11px] text-white/60">
                12 more sessions unlocks priority invitations from top trainers
              </p>
            </div>

            {/* Quick Metrics & Looking for Mentors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Referral Bonus</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">₦5,000</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">earned this quarter</p>
              </div>

              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Platform Ranking</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">Top 15%</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">of mentors active</p>
              </div>

              <div className="rounded-2xl border border-[#E7E5E1] bg-white p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Looking for Mentors</span>
                    <Badge variant="rust" className="text-[9px] px-2 py-0">2 spots left</Badge>
                  </div>
                  <p className="text-xs font-bold text-[#0A0A0A]">UX Research Foundations</p>
                  <p className="text-xs font-extrabold text-[#0A0A0A] mt-0.5">₦9,000 / mentee</p>
                </div>
                <Button asChild size="sm" className="mt-3 w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs">
                  <Link href="/programs/5?view=mentor">Request to Join</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Active Mentoring Cohorts */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white p-5 sm:p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A0A0A]">Your Mentoring Cohorts</h2>
              <p className="text-xs text-[#6B6B6B]">Upcoming sessions and assignments requiring review</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {activePrograms.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl bg-[#0A0A0A] text-white p-5 sm:p-6 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white/70 mb-2">
                    <span>DELIVERED BY {prog.trainer.toUpperCase()}</span>
                    <span className="text-[#F5C400]">YOU MENTOR {prog.mentees} OF {prog.totalMentees}</span>
                  </div>
                  <h3 className="text-xl font-extrabold text-white">{prog.currentWeek}</h3>
                  <p className="text-xs text-white/80 mt-1">{prog.title}</p>

                  <div className="flex gap-1.5 my-4">
                    <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                    <div className="flex-1 h-1.5 rounded-full bg-white" />
                    <div className="flex-1 h-1.5 rounded-full bg-white/20" />
                    <div className="flex-1 h-1.5 rounded-full bg-white/20" />
                  </div>

                  <p className="text-xs text-white/70">
                    Next: {prog.nextSession} · <b className="text-white">{prog.nextSessionTime}</b>
                  </p>
                </div>

                <div className="mt-6 space-y-2">
                  <Button asChild className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 hover:bg-[#e0b300]">
                    <Link href={`/mentor/dashboard/programs/${prog.id}`}>
                      Join Session
                    </Link>
                  </Button>
                  <div className="grid grid-cols-2 gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-white/20 bg-white/10 text-white font-bold text-xs hover:bg-white/20">
                      <Link href={`/mentor/dashboard/programs/${prog.id}`}>
                        Review Submissions
                      </Link>
                    </Button>
                    <Button asChild variant="outline" size="sm" className="rounded-xl border-white/20 bg-white/10 text-white font-bold text-xs hover:bg-white/20">
                      <Link href={`/mentor/dashboard/programs/${prog.id}`}>
                        Rate Programme
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Opportunities */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white p-5 sm:p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A0A0A]">Programmes Looking for Mentors</h2>
              <p className="text-xs text-[#6B6B6B]">Apply to guide learners and earn per session</p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
              <Link href="/programs?view=mentor">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {teachingOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="rounded-2xl border border-[#E7E5E1] bg-white p-5 shadow-sm hover:border-[#D8D5CF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="yellow">{opp.focusArea}</Badge>
                    <Badge variant="rust">{opp.spotsLeft} spots left</Badge>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0A0A0A]">{opp.title}</h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">By {opp.creator}</p>
                  <p className="text-xs text-[#6B6B6B] mt-2 line-clamp-2 leading-relaxed">
                    {opp.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex items-center justify-between">
                  <div>
                    <span className="text-xs font-black text-[#0A0A0A] block">{opp.compensation}</span>
                    <span className="text-[11px] text-[#9B9B9B]">{opp.timeCommitment}</span>
                  </div>
                  <Button
                    onClick={() => handleApply(opp)}
                    size="sm"
                    className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300]"
                  >
                    Apply Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Application Dialog */}
      <Dialog open={isApplying} onOpenChange={setIsApplying}>
        <DialogContent className="max-w-md rounded-3xl p-6 sm:p-7">
          <DialogHeader>
            <DialogTitle className="text-xl font-extrabold text-[#0A0A0A]">
              Apply to Mentor
            </DialogTitle>
            <DialogDescription className="text-xs text-[#6B6B6B]">
              {selectedOpportunity?.title} · {selectedOpportunity?.compensation}
            </DialogDescription>
          </DialogHeader>

          {applicationSuccess ? (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#5B7B6E] text-white flex items-center justify-center text-xl font-bold mx-auto">
                ✓
              </div>
              <h3 className="text-base font-extrabold text-[#0A0A0A]">Application Submitted</h3>
              <p className="text-xs text-[#6B6B6B]">
                The trainer will review your profile and confirm your placement.
              </p>
              <Button
                onClick={() => {
                  setIsApplying(false)
                  setApplicationSuccess(false)
                }}
                className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 mt-4"
              >
                Done
              </Button>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Your Available Weekly Capacity
                </label>
                <Input defaultValue="4 - 6 hours/week" className="h-11 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Note to Trainer (Optional)
                </label>
                <Input placeholder="Share any relevant experience..." className="h-11 rounded-xl text-sm" />
              </div>
              <DialogFooter className="pt-2">
                <Button
                  onClick={() => setApplicationSuccess(true)}
                  className="w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 hover:bg-[#e0b300]"
                >
                  Submit Application
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

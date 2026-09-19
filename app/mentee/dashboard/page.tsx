"use client"

import Link from "next/link"
import { Plus, Clock, TrendingUp, Award, ChevronRight, BookOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardHeader } from "@/components/dashboard-header"

const yourPrograms = [
  {
    id: 1,
    title: "Digital Marketing for SMEs",
    mentor: "Zainab Nadada",
    progress: 40,
    focusArea: "Branding & Marketing",
    nextSession: "Session 3 — Ad Campaign Setup",
    nextSessionTime: "Thu, 2:00 PM",
    assignment: "Ad campaign brief",
    status: "active",
  },
  {
    id: 2,
    title: "Strategic Business Planning",
    mentor: "Michael Chen",
    progress: 60,
    focusArea: "Strategy & Planning",
    nextSession: "Tomorrow, 10:00 AM",
    nextSessionTime: "Fri, 10:00 AM",
    assignment: "Market validation summary",
    status: "active",
  },
]

export default function MenteeDashboardPage() {
  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      <DashboardHeader
        title="Mentee Dashboard"
        description="Track your learning progress and upcoming sessions"
        actionButton={{
          label: "Explore Programmes",
          href: "/programs",
          icon: Plus,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Profile & Streak Hero Card */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="h-32 bg-[#2B2B2B] p-5 sm:p-6 flex items-start justify-between">
            <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              7-day streak — keep it going
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              TA
            </div>
          </div>

          <div className="p-5 sm:p-7 pt-0 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div className="flex items-end gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#2B2B2B] border-4 border-white shadow-md flex items-center justify-center text-white font-extrabold text-xl">
                  TA
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-extrabold text-[#0A0A0A]">Tari Adeyemi</h2>
                  <p className="text-xs text-[#6B6B6B]">Learning Product Design &amp; Marketing</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  <Link href="/mentee/dashboard/profile">Edit Profile</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300]">
                  <Link href="/programs">Find Mentors</Link>
                </Button>
              </div>
            </div>

            {/* Credibility / Learning Stats Row */}
            <div className="grid grid-cols-3 bg-[#F2F1EE] rounded-2xl p-3.5 sm:p-4 text-center divide-x divide-[#E7E5E1] mb-5">
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">3</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">active cohorts</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">62%</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">avg. completion</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">2</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">certificates</p>
              </div>
            </div>

            {/* Level Bar Card */}
            <div className="rounded-2xl bg-[#0A0A0A] p-4 sm:p-5 text-white mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">Level 2 · Committed Learner</span>
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
                Finish 1 more programme to unlock Level 3 + a free mentor session
              </p>
            </div>

            {/* Quick Metrics & Picked for you */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Referral Credit</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">₦2,000</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">earned towards tuition</p>
              </div>

              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Cohort Standing</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">Top 20%</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">of your cohort</p>
              </div>

              <div className="rounded-2xl border border-[#E7E5E1] bg-white p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Picked For You</span>
                    <Badge variant="rust" className="text-[9px] px-2 py-0">3 seats left</Badge>
                  </div>
                  <p className="text-xs font-bold text-[#0A0A0A]">UX Research Foundations</p>
                  <p className="text-xs font-extrabold text-[#0A0A0A] mt-0.5">
                    ₦12,000 <span className="text-[#9B9B9B] line-through font-normal text-[11px]">₦18,000</span>
                  </p>
                </div>
                <Button asChild size="sm" className="mt-3 w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs">
                  <Link href="/programs/5">Enroll Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* In-Progress Programmes */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white p-5 sm:p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A0A0A]">In-Progress Programmes</h2>
              <p className="text-xs text-[#6B6B6B]">Continue where you left off</p>
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
              <Link href="/mentee/dashboard/programs">View All</Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {yourPrograms.map((prog) => (
              <div
                key={prog.id}
                className="rounded-2xl border border-[#E7E5E1] bg-white p-5 shadow-sm hover:border-[#D8D5CF] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="yellow">{prog.focusArea}</Badge>
                    <span className="text-xs font-bold text-[#0A0A0A]">{prog.progress}% complete</span>
                  </div>
                  <h3 className="text-base font-extrabold text-[#0A0A0A]">{prog.title}</h3>
                  <p className="text-xs text-[#6B6B6B] mt-0.5">Mentor: {prog.mentor}</p>

                  <div className="mt-4 pt-3 border-t border-[#E7E5E1] space-y-2">
                    <div className="bg-[#F2F1EE] rounded-xl p-3">
                      <p className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Next Session</p>
                      <p className="text-xs font-bold text-[#0A0A0A] mt-0.5">{prog.nextSession}</p>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-[#6B6B6B]">Assignment: <b className="text-[#0A0A0A]">{prog.assignment}</b></span>
                      <Badge variant="slate" className="text-[10px]">Due Soon</Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E7E5E1] flex gap-2">
                  <Button asChild className="flex-1 bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-10 text-xs hover:bg-[#e0b300]">
                    <Link href={`/mentee/dashboard/programs/${prog.id}`}>
                      Join Session
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="flex-1 rounded-xl h-10 text-xs font-bold">
                    <Link href={`/mentee/dashboard/programs/${prog.id}`}>
                      Submit Work
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

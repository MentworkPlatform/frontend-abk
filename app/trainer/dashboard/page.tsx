"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Plus,
  Users,
  BookOpen,
  Eye,
  ArrowRight,
  Calendar,
  Clock,
  Sparkles,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DashboardHeader } from "@/components/dashboard-header";

const upcomingSessions = [
  {
    id: 1,
    programId: "1",
    programTitle: "Digital Marketing Bootcamp",
    topic: "Topic 5: Social Media Strategy",
    time: "Today, 3:00 PM",
    duration: "90 minutes",
    participants: 25,
    meetingLink: "https://meet.google.com/abc-defg-hij",
    meetingId: "123-456-789",
  },
  {
    id: 2,
    programId: "2",
    programTitle: "Leadership Excellence Program",
    topic: "Topic 8: Team Building",
    time: "Tomorrow, 11:00 AM",
    duration: "120 minutes",
    participants: 18,
    meetingLink: "https://zoom.us/j/123456789",
    meetingId: "123 456 789",
  },
  {
    id: 3,
    programId: "1",
    programTitle: "Digital Marketing Bootcamp",
    topic: "Topic 6: Content Marketing",
    time: "Friday, 3:00 PM",
    duration: "90 minutes",
    participants: 25,
    meetingLink: "https://meet.google.com/xyz-uvwx-rst",
    meetingId: "987-654-321",
  },
];

export default function TrainerDashboard() {
  const [programs] = useState([
    {
      id: "1",
      title: "Digital Marketing Bootcamp",
      participants: 25,
      mentors: 4,
      status: "active",
      startDate: "2024-01-15",
      hasLMS: true,
    },
    {
      id: "2",
      title: "Leadership Excellence Program",
      participants: 18,
      mentors: 3,
      status: "active",
      startDate: "2024-02-01",
      hasLMS: true,
    },
    {
      id: "3",
      title: "Data Science Fundamentals",
      participants: 30,
      mentors: 5,
      status: "completed",
      startDate: "2023-11-01",
      hasLMS: false,
    },
    {
      id: "4",
      title: "Personal Branding Workshop",
      participants: 12,
      mentors: 2,
      status: "draft",
      startDate: "2023-10-15",
      hasLMS: false,
    },
    {
      id: "5",
      title: "Product Management Masterclass",
      participants: 0,
      mentors: 0,
      status: "draft",
      startDate: null,
      hasLMS: false,
    },
  ]);

  const activePrograms = programs.filter((p) => p.status === "active");
  const draftPrograms = programs.filter((p) => p.status === "draft");
  const completedPrograms = programs.filter((p) => p.status === "completed");

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      <DashboardHeader
        title="Trainer Dashboard"
        description="Manage your programmes, sessions, and mentors"
        actionButton={{
          label: "Create Programme",
          href: "/trainer/dashboard/programs/create",
          icon: Plus,
        }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        {/* Profile & Credibility Banner (from Design Gallery) */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white overflow-hidden shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="h-32 bg-[#2B2B2B] p-5 sm:p-6 flex items-start justify-between">
            <span className="text-xs font-bold text-white/90 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
              Top 12% this month
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold">
              ZN
            </div>
          </div>

          <div className="p-5 sm:p-7 pt-0 -mt-10 relative">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
              <div className="flex items-end gap-3.5">
                <div className="w-16 h-16 rounded-2xl bg-[#2B2B2B] border-4 border-white shadow-md flex items-center justify-center text-white font-extrabold text-xl">
                  ZN
                </div>
                <div className="pb-1">
                  <h2 className="text-xl font-extrabold text-[#0A0A0A]">Zainab Nadada</h2>
                  <p className="text-xs text-[#6B6B6B]">Digital Marketing Trainer · Abuja</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                  <Link href="/trainer/profile">View Public Profile</Link>
                </Button>
                <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300]">
                  <Link href="/trainer/dashboard/settings">Settings</Link>
                </Button>
              </div>
            </div>

            {/* Credibility Stats Row */}
            <div className="grid grid-cols-3 bg-[#F2F1EE] rounded-2xl p-3.5 sm:p-4 text-center divide-x divide-[#E7E5E1] mb-5">
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">1,240</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">people trained</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">14</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">programmes</p>
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-black text-[#0A0A0A]">4.8★</p>
                <p className="text-[11px] text-[#6B6B6B] font-medium mt-0.5">avg. rating</p>
              </div>
            </div>

            {/* Level Bar Card */}
            <div className="rounded-2xl bg-[#0A0A0A] p-4 sm:p-5 text-white mb-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-white">Level 3 · Established Trainer</span>
                <span className="text-xs font-bold text-[#F5C400]">Level 4 →</span>
              </div>
              <div className="flex gap-1.5 items-center">
                <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#F5C400]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#444444]" />
                <div className="flex-1 h-1.5 rounded-full bg-[#444444]" />
              </div>
            </div>

            {/* Quick Metrics & Initiative Spotlight */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">This Month</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">₦186,000</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">earnings accrued</p>
              </div>

              <div className="rounded-2xl bg-[#F2F1EE] p-4 flex flex-col justify-between">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider">Completion</span>
                <p className="text-xl font-black text-[#0A0A0A] mt-1">86%</p>
                <p className="text-[11px] text-[#6B6B6B] mt-0.5">cohort average</p>
              </div>

              <div className="rounded-2xl border border-[#E7E5E1] bg-white p-4 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] font-bold text-[#B0674A] uppercase tracking-wider">Initiative Match</span>
                  <p className="text-xs font-bold text-[#0A0A0A] mt-1">BUILD: The STEM Space</p>
                </div>
                <Button asChild size="sm" className="mt-3 w-full bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300]">
                  <Link href="/initiatives/build/apply">Apply for BUILD</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* All Programs Section with Tabs */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white p-5 sm:p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A0A0A]">Your Programmes</h2>
              <p className="text-xs text-[#6B6B6B]">Manage curriculum, enrolled learners, and mentors</p>
            </div>
          </div>

          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-11 mb-6">
              <TabsTrigger value="active">Active ({activePrograms.length})</TabsTrigger>
              <TabsTrigger value="draft">Draft ({draftPrograms.length})</TabsTrigger>
              <TabsTrigger value="completed">Completed ({completedPrograms.length})</TabsTrigger>
            </TabsList>

            <TabsContent value="active">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {activePrograms.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-2xl border border-[#E7E5E1] bg-white overflow-hidden shadow-sm hover:border-[#D8D5CF] transition-all flex flex-col justify-between"
                  >
                    <div className="p-5">
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <Badge variant="sage">Active</Badge>
                        <span className="text-xs text-[#9B9B9B]">{program.startDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-[#0A0A0A] leading-snug">
                        {program.title}
                      </h3>
                      <div className="flex items-center gap-4 text-xs text-[#6B6B6B] mt-4 pt-3 border-t border-[#E7E5E1]">
                        <span className="flex items-center gap-1 font-semibold">
                          <Users className="h-3.5 w-3.5" />
                          {program.participants} enrolled
                        </span>
                        <span className="flex items-center gap-1 font-semibold">
                          <BookOpen className="h-3.5 w-3.5" />
                          {program.mentors} mentors
                        </span>
                      </div>
                    </div>

                    <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                      <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                        <Link href={`/trainer/dashboard/programs/${program.id}`}>
                          Manage
                        </Link>
                      </Button>
                      <Button asChild size="sm" className="bg-[#0A0A0A] text-white font-bold rounded-xl text-xs hover:bg-[#2B2B2B]">
                        <Link href={`/trainer/dashboard/programs/${program.id}/lms`}>
                          Open LMS
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="draft">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {draftPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-2xl border border-[#E7E5E1] bg-white p-5 shadow-sm opacity-80 flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant="slate" className="mb-2">Draft</Badge>
                      <h3 className="text-base font-bold text-[#0A0A0A]">{program.title}</h3>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E7E5E1]">
                      <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold">
                        <Link href={`/trainer/dashboard/programs/${program.id}`}>
                          Continue Editing
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="completed">
              <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {completedPrograms.map((program) => (
                  <div
                    key={program.id}
                    className="rounded-2xl border border-[#E7E5E1] bg-white p-5 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <Badge variant="sage" className="mb-2">Completed</Badge>
                      <h3 className="text-base font-bold text-[#0A0A0A]">{program.title}</h3>
                      <p className="text-xs text-[#6B6B6B] mt-1">{program.participants} total graduates</p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-[#E7E5E1]">
                      <Button asChild variant="outline" size="sm" className="w-full rounded-xl text-xs font-bold">
                        <Link href={`/trainer/dashboard/programs/${program.id}`}>
                          View Report
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Upcoming Live Sessions */}
        <div className="rounded-3xl border border-[#E7E5E1] bg-white p-5 sm:p-6 shadow-[0_4px_14px_rgba(0,0,0,0.06)]">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-extrabold text-[#0A0A0A]">Upcoming Live Sessions</h2>
              <p className="text-xs text-[#6B6B6B]">Upcoming sessions scheduled across your cohorts</p>
            </div>
          </div>

          <div className="divide-y divide-[#E7E5E1]">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-[#F5C400] bg-[#0A0A0A] px-2 py-0.5 rounded-full inline-block mb-1">
                    {session.time}
                  </span>
                  <h4 className="text-sm font-bold text-[#0A0A0A]">{session.topic}</h4>
                  <p className="text-xs text-[#6B6B6B]">{session.programTitle} · {session.duration}</p>
                </div>
                <Button asChild size="sm" className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs hover:bg-[#e0b300] shrink-0">
                  <a href={session.meetingLink} target="_blank" rel="noopener noreferrer">
                    Join Session
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

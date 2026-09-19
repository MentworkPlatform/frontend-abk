"use client"

import { useState } from "react"
import Link from "next/link"
import { DollarSign, Calendar, User, Bell, Lock, AlertTriangle, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { SECTORS } from "@/lib/constants/onboarding"

export default function TrainerSettingsPage() {
  const [selectedSector, setSelectedSector] = useState("agriculture")
  const [selectedSubSector, setSelectedSubSector] = useState("Poultry")
  const [calendarConnected, setCalendarConnected] = useState(true)
  const [flagConflicts, setFlagConflicts] = useState(true)
  const [saved, setSaved] = useState(false)

  const currentSectorObj = SECTORS.find((s) => s.id === selectedSector) || SECTORS[0]

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="min-h-screen bg-white text-[#0A0A0A] font-sans pb-12">
      <DashboardHeader
        title="Settings"
        description="Profile information, calendar synchronization, and wallet payouts"
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-4 space-y-6">
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3 sm:grid-cols-4 h-11 mb-6">
            <TabsTrigger value="profile">Profile Info</TabsTrigger>
            <TabsTrigger value="wallet">Wallet &amp; Payouts</TabsTrigger>
            <TabsTrigger value="calendar">Calendar Sync</TabsTrigger>
            <TabsTrigger value="security" className="hidden sm:inline-flex">Security</TabsTrigger>
          </TabsList>

          {/* PROFILE INFO TAB */}
          <TabsContent value="profile">
            <form onSubmit={handleSave} className="rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.06)] space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#0A0A0A]">Edit Profile</h2>
                <p className="text-xs text-[#6B6B6B] mt-1">This feeds both your public profile and initiative matching</p>
              </div>

              {/* Avatar Box */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-[#2B2B2B] text-white font-black text-xl flex items-center justify-center">
                    ZN
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-md bg-[#F5C400] border-2 border-white" />
                </div>
                <div>
                  <Button type="button" variant="outline" size="sm" className="rounded-xl text-xs font-bold">
                    Change Photo
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                    Full Name
                  </label>
                  <Input defaultValue="Zainab Nadada" className="h-11 rounded-xl text-sm" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                    Headline
                  </label>
                  <Input defaultValue="Digital Marketing Trainer" className="h-11 rounded-xl text-sm" />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Location
                </label>
                <Input defaultValue="Abuja, Nigeria" className="h-11 rounded-xl text-sm" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                  Bio
                </label>
                <Textarea
                  defaultValue="Helping SMEs grow through practical, low-budget digital marketing and customer acquisition strategies."
                  className="rounded-xl text-sm min-h-[90px]"
                />
              </div>

              {/* Cascading Expertise Selectors */}
              <div className="pt-4 border-t border-[#E7E5E1] space-y-4">
                <span className="text-[10px] font-bold text-[#B0674A] uppercase tracking-wider block">
                  Expertise — For Matching
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                      Sector
                    </label>
                    <select
                      value={selectedSector}
                      onChange={(e) => {
                        setSelectedSector(e.target.value)
                        const sec = SECTORS.find((s) => s.id === e.target.value)
                        if (sec?.skills?.[0]) setSelectedSubSector(sec.skills[0])
                      }}
                      className="w-full h-11 rounded-xl border border-[#D8D5CF] bg-white px-3.5 text-xs sm:text-sm font-semibold text-[#0A0A0A] outline-none"
                    >
                      {SECTORS.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">
                      Sub-Sector
                    </label>
                    <select
                      value={selectedSubSector}
                      onChange={(e) => setSelectedSubSector(e.target.value)}
                      className="w-full h-11 rounded-xl border border-[#D8D5CF] bg-white px-3.5 text-xs sm:text-sm font-semibold text-[#0A0A0A] outline-none"
                    >
                      {currentSectorObj.skills.map((skill) => (
                        <option key={skill} value={skill}>
                          {skill}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-4 border-t border-[#E7E5E1] space-y-3">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block">
                  Social &amp; Links
                </span>
                <Input defaultValue="linkedin.com/in/zainabnadada" className="h-11 rounded-xl text-sm" />
                <Input defaultValue="instagram.com/zn.trains" className="h-11 rounded-xl text-sm" />
              </div>

              <div className="pt-2">
                <Button type="submit" className="w-full sm:w-auto bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 px-8 hover:bg-[#e0b300]">
                  {saved ? "Saved ✓" : "Save changes"}
                </Button>
              </div>
            </form>
          </TabsContent>

          {/* WALLET & PAYOUTS TAB */}
          <TabsContent value="wallet" className="space-y-6">
            <div className="rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.06)] space-y-6">
              {/* Wallet Card */}
              <div className="rounded-2xl bg-[#0A0A0A] p-6 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-[10px] font-bold text-[#F5C400] uppercase tracking-wider">Available Balance</span>
                  <p className="text-3xl sm:text-4xl font-black text-white mt-1">₦164,000</p>
                  <p className="text-xs text-[#2B2B2B]/60 text-white/60 mt-0.5">Cleared and ready for immediate withdrawal</p>
                </div>
                <div>
                  <Button 
                    onClick={() => alert("Withdrawal request of ₦164,000 submitted to GTBank •••• 4821. Funds typically arrive within 2 business hours.")}
                    className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl text-xs sm:text-sm px-6 h-11 hover:bg-[#e0b300] shadow-xs"
                  >
                    Withdraw Funds
                  </Button>
                </div>
              </div>

              {/* Pending Payouts */}
              <div>
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-3">
                  Pending Payouts
                </span>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <h4 className="text-sm font-bold text-[#0A0A0A]">Digital Marketing for SMEs</h4>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">Session 3 Delivery • 24 Students</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#0A0A0A]">₦22,000</span>
                      <Badge variant="slate" className="border-none">Awaiting feedback</Badge>
                    </div>
                  </div>

                  <div className="rounded-2xl border border-[#E7E5E1] bg-[#FAF9F6] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                    <div>
                      <h4 className="text-sm font-bold text-[#0A0A0A]">Poultry Business Bootcamp</h4>
                      <p className="text-xs text-[#6B6B6B] mt-0.5">Session 4 Delivery • 18 Students</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-[#0A0A0A]">₦31,000</span>
                      <Badge variant="sage" className="border-none">Cleared · releasing Fri</Badge>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payout Method */}
              <div className="pt-4 border-t border-[#E7E5E1]">
                <span className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-3">
                  Default Payout Method
                </span>
                <div className="rounded-2xl border border-[#E7E5E1] p-4 flex items-center justify-between shadow-xs bg-white">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E7E5E1] flex items-center justify-center font-bold text-xs text-[#0A0A0A]">
                      GTB
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#0A0A0A]">Guaranty Trust Bank •••• 4821</h4>
                      <p className="text-xs text-[#6B6B6B]">Zainab Nadada · Automatic weekly payout every Friday</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="rounded-xl text-xs font-bold border-[#E7E5E1] hover:border-[#0A0A0A]">
                    Edit Account
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* CALENDAR SYNC TAB */}
          <TabsContent value="calendar">
            <div className="rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.06)] space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-[#0A0A0A]">Calendar Sync & Scheduling</h2>
                <p className="text-xs text-[#6B6B6B] mt-1 leading-relaxed">
                  Sessions you create in Mentwork sync to your external calendar automatically, and we flag scheduling conflicts before invitations are sent.
                </p>
              </div>

              {/* Google Calendar Card */}
              <div className="rounded-2xl border border-[#E7E5E1] p-4 flex items-center justify-between shadow-xs bg-[#FAF9F6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0A0A0A] text-white flex items-center justify-center font-bold text-xs">
                    G
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-[#0A0A0A]">Google Calendar</h4>
                    <p className="text-xs font-semibold text-[#5B7B6E]">● Synced with zainab@example.com</p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCalendarConnected(!calendarConnected)}
                  className="rounded-xl text-xs font-bold border-[#E7E5E1] hover:border-[#0A0A0A]"
                >
                  {calendarConnected ? "Disconnect" : "Connect"}
                </Button>
              </div>

              {/* Conflict Flag Toggle */}
              <div className="flex items-center justify-between py-3 border-t border-b border-[#E7E5E1]">
                <div>
                  <h4 className="text-sm font-bold text-[#0A0A0A]">Flag scheduling conflicts</h4>
                  <p className="text-xs text-[#6B6B6B]">Warn if a newly scheduled session clashes with external personal calendar events</p>
                </div>
                <Switch
                  checked={flagConflicts}
                  onCheckedChange={setFlagConflicts}
                  className="data-[state=checked]:bg-[#0A0A0A]"
                />
              </div>

              {/* Conflict Banner Preview */}
              {flagConflicts && (
                <div className="rounded-2xl bg-[#B0674A]/10 border border-[#B0674A]/30 p-4">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle className="h-5 w-5 text-[#B0674A] shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-bold text-[#B0674A]">Conflict Detection Active</h4>
                      <p className="text-xs text-[#2B2B2B]/80 mt-0.5 leading-relaxed">
                        When creating or rescheduling cohorts, Mentwork checks Google Calendar in real time. If an overlap occurs (e.g. Client review call, 2:30 – 3:00 PM), Mentwork prompts alternative open slots.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* SECURITY & DANGER ZONE TAB */}
          <TabsContent value="security" className="space-y-6">
            <div className="rounded-3xl border border-[#E7E5E1] bg-white p-6 sm:p-8 shadow-[0_4px_14px_rgba(0,0,0,0.06)] space-y-4">
              <h2 className="text-xl font-extrabold text-[#0A0A0A]">Security &amp; Password</h2>
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">Current Password</label>
                <Input type="password" placeholder="••••••••••" className="h-11 rounded-xl text-sm" />
              </div>
              <div>
                <label className="text-[10px] font-bold text-[#9B9B9B] uppercase tracking-wider block mb-1.5">New Password</label>
                <Input type="password" placeholder="••••••••••" className="h-11 rounded-xl text-sm" />
              </div>
              <Button className="bg-[#F5C400] text-[#0A0A0A] font-bold rounded-xl h-11 px-6 hover:bg-[#e0b300] shadow-xs">
                Update Password
              </Button>
            </div>

            {/* Separated Destructive Action / Danger Zone */}
            <div className="rounded-3xl border border-[#B0674A]/30 bg-white p-6 sm:p-8 shadow-xs space-y-4">
              <span className="text-[10px] font-bold text-[#B0674A] uppercase tracking-wider block">
                Danger Zone
              </span>
              <div>
                <h3 className="text-base font-bold text-[#0A0A0A]">Deactivate Trainer Account</h3>
                <p className="text-xs text-[#6B6B6B] mt-0.5">
                  Temporarily unpublish your public profile card and pause all new cohort enrollments. You can reactivate anytime.
                </p>
              </div>
              <Button 
                variant="outline"
                onClick={() => {
                  if (confirm("Are you sure you want to deactivate your trainer profile? Active cohorts will remain accessible to enrolled students.")) {
                    alert("Account deactivated.");
                  }
                }}
                className="border-[#B0674A] text-[#B0674A] hover:bg-[#B0674A]/10 font-bold rounded-xl text-xs h-10 px-5"
              >
                Deactivate Account
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

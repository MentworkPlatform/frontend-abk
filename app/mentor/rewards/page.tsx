"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import {
  Award,
  CheckCircle,
  Lock,
  Mail,
  Star,
  Calendar,
  BookOpen,
  Zap,
  Users,
  Info,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for tiers
const tiers = [
  {
    name: "Starter",
    requirements: {
      sessions: 0,
      rating: 0,
      programs: 0,
    },
    perks: ["Access to basic school programs", "25% platform commission", "Standard visibility in search"],
    color: "gray",
  },
  {
    name: "Builder",
    requirements: {
      sessions: 10,
      rating: 4.0,
      programs: 1,
    },
    perks: [
      "Access to intermediate school programs",
      "20% platform commission",
      "Enhanced visibility in search",
      "Early access to new features",
    ],
    color: "green",
  },
  {
    name: "Leader",
    requirements: {
      sessions: 25,
      rating: 4.5,
      programs: 2,
    },
    perks: [
      "Access to advanced school programs",
      "15% platform commission",
      "Priority visibility in search",
      "Dedicated support channel",
      "Mentwork certification badge",
    ],
    color: "blue",
  },
  {
    name: "Partner",
    requirements: {
      sessions: 50,
      rating: 4.8,
      programs: 4,
    },
    perks: [
      "Access to all school programs",
      "10% platform commission",
      "Featured mentor status",
      "Co-marketing opportunities",
      "Exclusive events and workshops",
      "Revenue share on platform referrals",
    ],
    color: "purple",
  },
]

// Mock data for mentor progress
const mentorProgress = {
  currentTier: "Builder",
  sessions: 18,
  rating: 4.3,
  programs: 2,
  referrals: {
    sent: 12,
    accepted: 5,
    pending: 7,
    rewards: {
      cashEarned: 250,
      commissionReduction: "5%",
      nextReward: 3,
    },
  },
}

export default function RewardsPage() {
  const [inviteEmail, setInviteEmail] = useState("")
  const [inviteMessage, setInviteMessage] = useState("")
  const [referralLink, setReferralLink] = useState("https://mentwork.com/join?ref=sarahjohnson")
  const [copied, setCopied] = useState(false)

  // Find current tier index
  const currentTierIndex = tiers.findIndex((tier) => tier.name === mentorProgress.currentTier)
  const nextTier = tiers[currentTierIndex + 1]

  // Calculate progress to next tier
  const calculateProgress = (current: number, required: number) => {
    return Math.min(Math.round((current / required) * 100), 100)
  }

  const sessionProgress = calculateProgress(mentorProgress.sessions, nextTier?.requirements.sessions || 100)
  const ratingProgress = calculateProgress(mentorProgress.rating * 10, (nextTier?.requirements.rating || 5) * 10)
  const programsProgress = calculateProgress(mentorProgress.programs, nextTier?.requirements.programs || 5)

  // Overall progress is the average of the three
  const overallProgress = Math.round((sessionProgress + ratingProgress + programsProgress) / 3)

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle invite submission
    alert(`Invitation sent to ${inviteEmail}`)
    setInviteEmail("")
    setInviteMessage("")
  }

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Rewards & Tier Progress</h1>
          <p className="text-gray-500">Track your progress and unlock exclusive benefits</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button asChild className="bg-[#FFD500] text-black hover:bg-[#e6c000]">
            <Link href="/mentor/dashboard/school-programs">
              <BookOpen className="mr-2 h-4 w-4" /> View School Programs
            </Link>
          </Button>
          <Button variant="outline">
            <Users className="mr-2 h-4 w-4" /> Invite Mentors
          </Button>
        </div>
      </div>

      {/* Current Tier Overview - Enhanced with visual improvements */}
      <Card className="mb-6 overflow-hidden border-none shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#FFD500]/20 to-white pb-0">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <CardTitle className="flex items-center">
                <Award className="mr-2 h-5 w-5 text-[#FFD500]" />
                {mentorProgress.currentTier} Tier
              </CardTitle>
              <CardDescription>Your current benefits and progress to next tier</CardDescription>
            </div>
            {nextTier ? (
              <Badge className="mt-2 md:mt-0 bg-[#FFD500] text-black">
                {overallProgress}% to {nextTier.name}
              </Badge>
            ) : (
              <Badge className="mt-2 md:mt-0 bg-purple-100 text-purple-800">Highest Tier Achieved</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {nextTier && (
            <div className="mb-6">
              <div className="flex justify-between mb-1">
                <span className="text-sm font-medium">{mentorProgress.currentTier}</span>
                <span className="text-sm font-medium">{nextTier.name}</span>
              </div>
              <div className="relative">
                <Progress value={overallProgress} className="h-3" />
                <div
                  className="absolute top-0 h-3 bg-[#FFD500] rounded-full"
                  style={{
                    width: "4px",
                    left: `${overallProgress}%`,
                    transform: "translateX(-50%)",
                  }}
                ></div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm font-medium mb-2 flex items-center">
                <Calendar className="mr-1 h-4 w-4" /> Sessions Completed
              </p>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">{mentorProgress.sessions} sessions</span>
                {nextTier && <span className="text-sm text-gray-500">{nextTier.requirements.sessions} required</span>}
              </div>
              <div className="relative">
                <Progress value={nextTier ? sessionProgress : 100} className="h-2" />
                {nextTier && (
                  <div
                    className="absolute top-0 h-2 bg-green-500 rounded-full"
                    style={{
                      width: "2px",
                      left: `${(mentorProgress.sessions / nextTier.requirements.sessions) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                )}
              </div>
              {nextTier && mentorProgress.sessions < nextTier.requirements.sessions && (
                <p className="text-xs text-gray-500 mt-1">
                  Need {nextTier.requirements.sessions - mentorProgress.sessions} more sessions
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2 flex items-center">
                <Star className="mr-1 h-4 w-4" /> Average Rating
              </p>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">{mentorProgress.rating.toFixed(1)} / 5.0</span>
                {nextTier && (
                  <span className="text-sm text-gray-500">{nextTier.requirements.rating.toFixed(1)} required</span>
                )}
              </div>
              <div className="relative">
                <Progress value={nextTier ? ratingProgress : 100} className="h-2" />
                {nextTier && (
                  <div
                    className="absolute top-0 h-2 bg-green-500 rounded-full"
                    style={{
                      width: "2px",
                      left: `${(mentorProgress.rating / nextTier.requirements.rating) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                )}
              </div>
              {nextTier && mentorProgress.rating < nextTier.requirements.rating && (
                <p className="text-xs text-gray-500 mt-1">
                  Need to improve rating by {(nextTier.requirements.rating - mentorProgress.rating).toFixed(1)} points
                </p>
              )}
            </div>

            <div>
              <p className="text-sm font-medium mb-2 flex items-center">
                <BookOpen className="mr-1 h-4 w-4" /> Programs Created
              </p>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-500">{mentorProgress.programs} programs</span>
                {nextTier && <span className="text-sm text-gray-500">{nextTier.requirements.programs} required</span>}
              </div>
              <div className="relative">
                <Progress value={nextTier ? programsProgress : 100} className="h-2" />
                {nextTier && (
                  <div
                    className="absolute top-0 h-2 bg-green-500 rounded-full"
                    style={{
                      width: "2px",
                      left: `${(mentorProgress.programs / nextTier.requirements.programs) * 100}%`,
                      transform: "translateX(-50%)",
                    }}
                  ></div>
                )}
              </div>
              {nextTier && mentorProgress.programs < nextTier.requirements.programs && (
                <p className="text-xs text-gray-500 mt-1">
                  Need {nextTier.requirements.programs - mentorProgress.programs} more programs
                </p>
              )}
            </div>
          </div>

          {nextTier && (
            <Alert className="mt-6 bg-blue-50 border-blue-200">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              <AlertTitle className="text-blue-800">Next steps to reach {nextTier.name} tier</AlertTitle>
              <AlertDescription className="text-blue-700">
                <ul className="list-disc pl-5 mt-2 space-y-1">
                  {mentorProgress.sessions < nextTier.requirements.sessions && (
                    <li>Complete {nextTier.requirements.sessions - mentorProgress.sessions} more sessions</li>
                  )}
                  {mentorProgress.rating < nextTier.requirements.rating && (
                    <li>
                      Improve your rating to {nextTier.requirements.rating.toFixed(1)}+ (currently{" "}
                      {mentorProgress.rating.toFixed(1)})
                    </li>
                  )}
                  {mentorProgress.programs < nextTier.requirements.programs && (
                    <li>Create {nextTier.requirements.programs - mentorProgress.programs} more programs</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="md:col-span-2">
          {/* Tier Ladder - Enhanced with visual timeline and clearer benefits */}
          <Card className="mb-6 overflow-hidden border-none shadow-md">
            <CardHeader>
              <CardTitle>Tier Ladder</CardTitle>
              <CardDescription>Requirements and benefits for each tier</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tiers.map((tier, index) => {
                  const isCurrent = tier.name === mentorProgress.currentTier
                  const isCompleted = tiers.indexOf(tier) < currentTierIndex
                  const isLocked = tiers.indexOf(tier) > currentTierIndex

                  return (
                    <div
                      key={tier.name}
                      className={`p-4 rounded-lg border ${
                        isCurrent
                          ? "border-[#FFD500] bg-[#FFD500]/10"
                          : isCompleted
                            ? "border-green-200 bg-green-50"
                            : "border-gray-200"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center">
                          {isCompleted ? (
                            <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                          ) : isCurrent ? (
                            <Award className="h-5 w-5 text-[#FFD500] mr-2" />
                          ) : (
                            <Lock className="h-5 w-5 text-gray-400 mr-2" />
                          )}
                          <h3 className="font-bold text-lg">{tier.name}</h3>
                        </div>
                        {isCurrent && <Badge className="bg-[#FFD500] text-black">Current Tier</Badge>}
                        {isCompleted && <Badge className="bg-green-100 text-green-800">Completed</Badge>}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium mb-2">Requirements:</p>
                          <ul className="space-y-1 text-sm">
                            <li className="flex items-center">
                              <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                              <span className={isLocked ? "text-gray-400" : ""}>
                                {tier.requirements.sessions}+ sessions completed
                              </span>
                            </li>
                            <li className="flex items-center">
                              <Star className="h-4 w-4 text-gray-500 mr-2" />
                              <span className={isLocked ? "text-gray-400" : ""}>
                                {tier.requirements.rating.toFixed(1)}+ average rating
                              </span>
                            </li>
                            <li className="flex items-center">
                              <BookOpen className="h-4 w-4 text-gray-500 mr-2" />
                              <span className={isLocked ? "text-gray-400" : ""}>
                                {tier.requirements.programs}+ programs created
                              </span>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <p className="text-sm font-medium mb-2">Benefits:</p>
                          <ul className="space-y-1 text-sm">
                            {tier.perks.map((perk, i) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle
                                  className={`h-4 w-4 mr-2 mt-0.5 ${isLocked ? "text-gray-300" : "text-green-500"}`}
                                />
                                <span className={isLocked ? "text-gray-400" : ""}>{perk}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      {isCurrent && nextTier && (
                        <div className="mt-4 pt-4 border-t border-[#FFD500]/30">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium">Progress to {nextTier.name} tier:</p>
                            <span className="text-sm font-medium">{overallProgress}%</span>
                          </div>
                          <Progress value={overallProgress} className="h-2 mt-1.5" />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Referral Section - Enhanced with tabs and better stats */}
        <div>
          <Card className="overflow-hidden border-none shadow-md">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-white">
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-blue-500" /> Invite Mentors
              </CardTitle>
              <CardDescription>Earn rewards for each successful referral</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="stats">
                <TabsList className="w-full grid grid-cols-2 mb-4">
                  <TabsTrigger value="stats">My Referrals</TabsTrigger>
                  <TabsTrigger value="invite">Invite</TabsTrigger>
                </TabsList>

                <TabsContent value="stats">
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-sm font-medium">Your Referrals</p>
                      <Badge variant="outline">
                        {mentorProgress.referrals.accepted}/{mentorProgress.referrals.sent}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-3 bg-gray-50 rounded-md">
                        <p className="text-lg font-bold">{mentorProgress.referrals.sent}</p>
                        <p className="text-xs text-gray-500">Sent</p>
                      </div>
                      <div className="p-3 bg-green-50 rounded-md">
                        <p className="text-lg font-bold text-green-600">{mentorProgress.referrals.accepted}</p>
                        <p className="text-xs text-gray-500">Accepted</p>
                      </div>
                      <div className="p-3 bg-blue-50 rounded-md">
                        <p className="text-lg font-bold text-blue-600">{mentorProgress.referrals.pending}</p>
                        <p className="text-xs text-gray-500">Pending</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-green-50 rounded-md mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Award className="h-4 w-4 text-green-600" />
                      <p className="font-medium text-green-800">Rewards Earned</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div className="p-2 bg-white rounded-md">
                        <p className="text-xs text-gray-500">Cash Bonus</p>
                        <p className="text-lg font-bold text-green-600">
                          ${mentorProgress.referrals.rewards.cashEarned}
                        </p>
                      </div>
                      <div className="p-2 bg-white rounded-md">
                        <p className="text-xs text-gray-500">Commission Reduction</p>
                        <p className="text-lg font-bold text-green-600">
                          {mentorProgress.referrals.rewards.commissionReduction}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-green-700 flex items-center gap-1">
                      <Info className="h-3.5 w-3.5" />
                      <span>{mentorProgress.referrals.rewards.nextReward} more until next reward</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium mb-2">Your Referral Link</p>
                    <div className="flex gap-2">
                      <Input value={referralLink} readOnly className="text-sm" />
                      <Button size="sm" variant="outline" onClick={copyReferralLink}>
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="invite">
                  <div className="p-3 bg-blue-50 rounded-md mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Zap className="h-4 w-4 text-blue-500" />
                      <p className="font-medium text-blue-700">Referral Rewards</p>
                    </div>
                    <p className="text-sm text-blue-600 mb-2">For each mentor who joins and completes 5 sessions:</p>
                    <ul className="text-sm text-blue-600 space-y-1">
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                        $50 cash bonus
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-3 w-3 text-blue-500 mr-1" />
                        5% commission reduction for 3 months
                      </li>
                    </ul>
                  </div>

                  <form onSubmit={handleInvite}>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="email" className="text-sm font-medium">
                          Email Address
                        </label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="colleague@example.com"
                          value={inviteEmail}
                          onChange={(e) => setInviteEmail(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="message" className="text-sm font-medium">
                          Personal Message (Optional)
                        </label>
                        <Textarea
                          id="message"
                          placeholder="I think you'd be a great mentor..."
                          value={inviteMessage}
                          onChange={(e) => setInviteMessage(e.target.value)}
                          rows={3}
                        />
                      </div>
                      <Button type="submit" className="w-full bg-[#FFD500] text-black hover:bg-[#e6c000]">
                        <Mail className="mr-2 h-4 w-4" /> Send Invitation
                      </Button>
                    </div>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="bg-gray-50 border-t">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center text-sm text-gray-500 cursor-help">
                      <Info className="h-3.5 w-3.5 mr-1" />
                      <span>How referrals work</span>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    <p>
                      Referrals are tracked when your invitee signs up using your unique link or email invitation.
                      Rewards are earned after they complete their first 5 mentoring sessions.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}

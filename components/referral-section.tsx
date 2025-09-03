"use client"

import { useState } from "react"
import { Copy, Mail, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

interface ReferralSectionProps {
  referralCode: string
  referralStats: {
    invitesSent: number
    accepted: number
    pending: number
    earnings: number
  }
  referralBonus: number
}

export function ReferralSection({ 
  referralCode, 
  referralStats, 
  referralBonus 
}: ReferralSectionProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState(`I'm inviting you to join Mentwork as a mentor. Use my referral code: ${referralCode}`)
  const { toast } = useToast()
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://mentwork.com/join?ref=${referralCode}`)
    toast({
      title: "Link copied!",
      description: "Referral link copied to clipboard.",
    })
  }
  
  const handleSendInvite = (e) => {
    e.preventDefault()
    // In a real app, you would send the invitation email here
    toast({
      title: "Invitation sent!",
      description: `Your invitation has been sent to ${email}.`,
    })
    setEmail('')
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Invite Mentors & Earn Rewards</CardTitle>
        <CardDescription>
          Earn ${referralBonus} for each mentor who joins using your referral code and completes their first session.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="referral-link">Your Referral Link</Label>
          <div className="flex">
            <Input
              id="referral-link"
              value={`https://mentwork.com/join?ref=${referralCode}`}
              readOnly
              className="rounded-r-none"
            />
            <Button
              variant="outline"
              className="rounded-l-none border-l-0"
              onClick={handleCopyLink}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="email" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="email">Email Invite</TabsTrigger>
            <TabsTrigger value="social">Social Share</TabsTrigger>
          </TabsList>
          
          <TabsContent value="email" className="space-y-4">
            <form onSubmit={handleSendInvite} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Input
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Send Invitation
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="social" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="w-full" onClick={handleCopyLink}>
                <Copy className="h-4 w-4 mr-2" />
                Copy Link
              </Button>
              <Button variant="outline" className="w-full">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">
                Share your referral link on social media or directly with colleagues to earn rewards.
              </p>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="pt-2">
          <h3 className="text-lg font-medium mb-4">Your Referral Stats</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

\

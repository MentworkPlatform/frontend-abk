"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DollarSign, Bell, Lock } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"

export default function MentorSettingsPage() {
  return (
    <div className="w-full">
      <DashboardHeader
        title="Settings"
        description="Manage your account settings and preferences"
      />

      <div className="w-full space-y-4 md:px-6 md:pt-8 md:pb-8">
        <Tabs defaultValue="payment" className="space-y-4">
          <TabsList className="w-full md:w-auto flex-wrap h-auto p-1 gap-1">
            <TabsTrigger value="payment" className="flex-1 md:flex-initial">
              <DollarSign className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Payment Details</span>
              <span className="sm:hidden">Payment</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex-1 md:flex-initial">
              <Bell className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Notifications</span>
              <span className="sm:hidden">Notifs</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex-1 md:flex-initial">
              <Lock className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Security</span>
              <span className="sm:hidden">Security</span>
            </TabsTrigger>
          </TabsList>

        <TabsContent value="payment" className="mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Payment Details</CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                Add your payment details to receive payments for teaching sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  Payment details are required to receive payments. You can add bank account, mobile money, or other payment methods.
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="payment-method">Payment Method</Label>
                  <select
                    id="payment-method"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="">Select payment method</option>
                    <option value="bank">Bank Account</option>
                    <option value="mobile">Mobile Money</option>
                    <option value="paypal">PayPal</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-name">Account Name</Label>
                  <Input id="account-name" placeholder="Enter account name" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="account-number">Account Number</Label>
                  <Input id="account-number" placeholder="Enter account number" />
                </div>

                <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto" size="sm">Save Payment Details</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Notification Preferences</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Session Reminders</Label>
                    <p className="text-sm text-muted-foreground">Get reminded before upcoming sessions</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Payment Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when payments are processed</p>
                  </div>
                  <input type="checkbox" defaultChecked className="h-4 w-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="mt-4">
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-base sm:text-lg">Security Settings</CardTitle>
              <CardDescription className="text-xs sm:text-sm">Manage your password and security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 p-4 sm:p-6 pt-0">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input id="current-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input id="new-password" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input id="confirm-password" type="password" />
              </div>
              <Button className="bg-[#FFD500] text-black hover:bg-[#e6c000] w-full sm:w-auto" size="sm">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      </div>
    </div>
  )
}


'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Target,
  TrendingUp,
  BookOpen,
  Award,
  Settings,
  RefreshCw,
  Plus,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from '@/components/ui/sidebar'

export default function MentorIntegrationsPage() {
  const [activeTab, setActiveTab] = useState('meetings')
  const [zoomConnected, setZoomConnected] = useState(false)
  const [googleCalendarConnected, setGoogleCalendarConnected] = useState(false)
  const [outlookConnected, setOutlookConnected] = useState(false)
  const [stripeConnected, setStripeConnected] = useState(false)
  const [paypalConnected, setPaypalConnected] = useState(false)

  const [zoomAutoSchedule, setZoomAutoSchedule] = useState(true)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [followUpEnabled, setFollowUpEnabled] = useState(true)
  const [connectingService, setConnectingService] = useState<string | null>(
    null
  )

  // Simulated connection process
  const connectService = (service: string) => {
    setConnectingService(service)

    // Simulate API call delay
    setTimeout(() => {
      switch (service) {
        case 'zoom':
          setZoomConnected(true)
          break
        case 'google-calendar':
          setGoogleCalendarConnected(true)
          break
        case 'outlook':
          setOutlookConnected(true)
          break
        case 'stripe':
          setStripeConnected(true)
          break
        case 'paypal':
          setPaypalConnected(true)
          break
      }
      setConnectingService(null)
    }, 2000)
  }

  // Disconnect a service
  const disconnectService = (service: string) => {
    switch (service) {
      case 'zoom':
        setZoomConnected(false)
        break
      case 'google-calendar':
        setGoogleCalendarConnected(false)
        break
      case 'outlook':
        setOutlookConnected(false)
        break
      case 'stripe':
        setStripeConnected(false)
        break
      case 'paypal':
        setPaypalConnected(false)
        break
    }
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <Sidebar>
          <SidebarHeader>
            <div className='flex items-center gap-2 p-4'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-8'
              />
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard'>
                        <BarChart3 className='h-4 w-4' />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/programs'>
                        <BookOpen className='h-4 w-4' />
                        <span>Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Goals & Growth</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/goals'>
                        <Target className='h-4 w-4' />
                        <span>My Goals</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/recommendations'>
                        <TrendingUp className='h-4 w-4' />
                        <span>Recommendations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/subscriptions'>
                        <Award className='h-4 w-4' />
                        <span>Subscription</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Settings</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive>
                      <Link href='/mentor/integrations'>
                        <Settings className='h-4 w-4' />
                        <span>Integrations</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className='p-4'>
              <div className='flex items-center gap-4 mb-4'>
                <img
                  src='/placeholder.svg?height=40&width=40'
                  alt='User avatar'
                  className='rounded-full'
                />
                <div>
                  <p className='font-medium'>Sarah Johnson</p>
                  <p className='text-xs text-gray-500'>Business Mentor</p>
                </div>
              </div>
              <Button variant='outline' className='w-full'>
                View Public Profile
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <div className='flex-1 p-8'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold'>Integrations</h1>
              <p className='text-gray-500'>
                Connect your accounts to streamline your mentorship workflow
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='mb-8'
            >
              <TabsList className='grid grid-cols-3 w-full mb-6'>
                <TabsTrigger value='meetings'>Meeting Services</TabsTrigger>
                <TabsTrigger value='calendar'>Calendar</TabsTrigger>
                <TabsTrigger value='payments'>Payment Processing</TabsTrigger>
              </TabsList>

              <TabsContent value='meetings'>
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Video Conferencing Services</CardTitle>
                      <CardDescription>
                        Connect your video conferencing accounts to
                        automatically create and manage online sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-blue-600'
                            >
                              <path
                                fill='currentColor'
                                d='M24,9.92L18.07,9.91L18.06,6.66L12.05,6.65L12.02,0L0,0L0.02,24L24,24L24,9.92ZM17.25,17.25L6.75,17.25C6.34,17.25 6,16.91 6,16.5L6,9C6,8.59 6.34,8.25 6.75,8.25L17.25,8.25C17.66,8.25 18,8.59 18,9L18,16.5C18,16.91 17.66,17.25 17.25,17.25Z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Zoom</h3>
                            <p className='text-sm text-gray-500'>
                              {zoomConnected
                                ? 'Connected'
                                : 'Connect to create and manage Zoom meetings'}
                            </p>
                          </div>
                        </div>
                        {zoomConnected ? (
                          <Button
                            variant='outline'
                            onClick={() => disconnectService('zoom')}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => connectService('zoom')}
                            disabled={connectingService === 'zoom'}
                            className='bg-blue-600 hover:bg-blue-700'
                          >
                            {connectingService === 'zoom' ? (
                              <>
                                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />{' '}
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className='mr-2 h-4 w-4' /> Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-blue-600'
                            >
                              <path
                                fill='currentColor'
                                d='M0.5,4.25L1.5,4.25L1.5,13.75L0.5,13.75L0.5,4.25ZM19.5,4.25L20.5,4.25L20.5,13.75L19.5,13.75L19.5,4.25ZM0,14.25L1,14.25L1,15.25L0,15.25L0,14.25ZM20,14.25L21,14.25L21,15.25L20,15.25L20,14.25ZM21,3.75L0,3.75L0,2.75L21,2.75L21,3.75ZM13.8,10.95L13.8,7.05L17.1,8.925L13.8,10.95ZM13.3,12.301L18.17,9.44C18.2292,9.40962 18.2766,9.36444 18.3074,9.30997C18.3382,9.25549 18.3511,9.19405 18.345,9.133C18.3389,9.07196 18.3138,9.01388 18.2727,8.96522C18.2317,8.91655 18.1761,8.87932 18.113,8.858L13.3,6.048C13.241,6.02946 13.1769,6.01975 13.1135,6.01967C13.0502,6.01959 12.9859,6.02914 12.9268,6.04753C12.8676,6.06591 12.8148,6.09274 12.7718,6.12654C12.7287,6.16034 12.6964,6.20043 12.677,6.245C12.6576,6.28957 12.6513,6.33753 12.6588,6.3848C12.6662,6.43207 12.6871,6.47733 12.7203,6.51743C12.7535,6.55753 12.7982,6.59158 12.8512,6.61736C12.9042,6.64313 12.9643,6.65999 13.026,6.667L16.694,8.88L13.026,11.136C12.9645,11.1433 12.9047,11.1602 12.8517,11.1861C12.7988,11.2121 12.7542,11.2463 12.7212,11.2865C12.688,11.3267 12.6672,11.372 12.6599,11.4193C12.6525,11.4667 12.6589,11.5146 12.6784,11.5593C12.6979,11.604 12.7302,11.6441 12.7733,11.6779C12.8164,11.7118 12.8692,11.7386 12.9284,11.757C12.9875,11.7754 13.0519,11.7849 13.1152,11.7848C13.1786,11.7848 13.2428,11.7751 13.3,11.756L13.3,12.301Z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Microsoft Teams</h3>
                            <p className='text-sm text-gray-500'>
                              Connect to create and manage Teams meetings
                            </p>
                          </div>
                        </div>
                        <Button variant='outline'>
                          <Plus className='mr-2 h-4 w-4' /> Connect
                        </Button>
                      </div>

                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-green-600'
                            >
                              <path
                                fill='currentColor'
                                d='M12,0C5.383,0 0,5.383 0,12C0,18.617 5.383,24 12,24C18.617,24 24,18.617 24,12C24,5.383 18.617,0 12,0ZM12,7.2C14.547,7.2 16.6,9.253 16.6,11.8C16.6,14.347 14.547,16.4 12,16.4C9.453,16.4 7.4,14.347 7.4,11.8C7.4,9.253 9.453,7.2 12,7.2Z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Google Meet</h3>
                            <p className='text-sm text-gray-500'>
                              Connect to create and manage Google Meet sessions
                            </p>
                          </div>
                        </div>
                        <Button variant='outline'>
                          <Plus className='mr-2 h-4 w-4' /> Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {zoomConnected && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Zoom Settings</CardTitle>
                        <CardDescription>
                          Configure how Zoom integrates with your mentorship
                          programs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label
                              htmlFor='auto-schedule'
                              className='font-medium'
                            >
                              Auto-schedule meetings
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Automatically create Zoom meetings when sessions
                              are scheduled
                            </p>
                          </div>
                          <Switch
                            id='auto-schedule'
                            checked={zoomAutoSchedule}
                            onCheckedChange={setZoomAutoSchedule}
                          />
                        </div>

                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label
                              htmlFor='send-reminders'
                              className='font-medium'
                            >
                              Send reminders
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Send meeting reminders 1 hour before scheduled
                              sessions
                            </p>
                          </div>
                          <Switch
                            id='send-reminders'
                            checked={reminderEnabled}
                            onCheckedChange={setReminderEnabled}
                          />
                        </div>

                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label htmlFor='follow-up' className='font-medium'>
                              Follow-up emails
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Send follow-up emails with recording links after
                              sessions
                            </p>
                          </div>
                          <Switch
                            id='follow-up'
                            checked={followUpEnabled}
                            onCheckedChange={setFollowUpEnabled}
                          />
                        </div>

                        <div className='space-y-2 pt-4'>
                          <Label className='font-medium'>
                            Default Meeting Settings
                          </Label>
                          <div className='space-y-2 pl-2 pt-1'>
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='waiting-room' defaultChecked />
                              <Label
                                htmlFor='waiting-room'
                                className='font-normal'
                              >
                                Enable waiting room
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='join-before-host' />
                              <Label
                                htmlFor='join-before-host'
                                className='font-normal'
                              >
                                Allow participants to join before host
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='recording' defaultChecked />
                              <Label
                                htmlFor='recording'
                                className='font-normal'
                              >
                                Automatically record meetings
                              </Label>
                            </div>
                            <div className='flex items-center space-x-2'>
                              <Checkbox id='mute-entry' defaultChecked />
                              <Label
                                htmlFor='mute-entry'
                                className='font-normal'
                              >
                                Mute participants upon entry
                              </Label>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]'>
                          Save Settings
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </TabsContent>

              <TabsContent value='calendar'>
                <div className='space-y-6'>
                  <Card>
                    <CardHeader>
                      <CardTitle>Calendar Integrations</CardTitle>
                      <CardDescription>
                        Connect your calendars to sync availability and
                        automatically schedule sessions
                      </CardDescription>
                    </CardHeader>
                    <CardContent className='space-y-6'>
                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-blue-600'
                            >
                              <path
                                fill='#4285F4'
                                d='M5 5v14h14V5H5zm11.9 10.95l-3.9-3.9-9-9L9.95 3 17 10.05v5.9z'
                              />
                              <path
                                fill='#34A853'
                                d='M3 21h18V7.05L17 3.05 10.05 10 7 13.05 3 17.05V21z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Google Calendar</h3>
                            <p className='text-sm text-gray-500'>
                              {googleCalendarConnected
                                ? 'Connected'
                                : 'Connect to sync your Google Calendar'}
                            </p>
                          </div>
                        </div>
                        {googleCalendarConnected ? (
                          <Button
                            variant='outline'
                            onClick={() => disconnectService('google-calendar')}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => connectService('google-calendar')}
                            disabled={connectingService === 'google-calendar'}
                            className='bg-[#4285F4] hover:bg-[#3b78e7]'
                          >
                            {connectingService === 'google-calendar' ? (
                              <>
                                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />{' '}
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className='mr-2 h-4 w-4' /> Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-blue-600'
                            >
                              <path
                                fill='#0078D4'
                                d='M9.5,18.5h10V7.5H4.5v11h5Zm0-12h10V1.5H9.5Z'
                              />
                              <path fill='#0078D4' d='M4.5,6.5v-5H9.5v5Z' />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Outlook Calendar</h3>
                            <p className='text-sm text-gray-500'>
                              {outlookConnected
                                ? 'Connected'
                                : 'Connect to sync your Outlook Calendar'}
                            </p>
                          </div>
                        </div>
                        {outlookConnected ? (
                          <Button
                            variant='outline'
                            onClick={() => disconnectService('outlook')}
                          >
                            Disconnect
                          </Button>
                        ) : (
                          <Button
                            onClick={() => connectService('outlook')}
                            disabled={connectingService === 'outlook'}
                            className='bg-[#0078D4] hover:bg-[#006ac1]'
                          >
                            {connectingService === 'outlook' ? (
                              <>
                                <RefreshCw className='mr-2 h-4 w-4 animate-spin' />{' '}
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className='mr-2 h-4 w-4' /> Connect
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <div className='flex items-center justify-between p-4 border rounded-lg'>
                        <div className='flex items-center gap-4'>
                          <div className='p-2 bg-blue-100 rounded-lg'>
                            <svg
                              viewBox='0 0 24 24'
                              className='h-8 w-8 text-blue-600'
                            >
                              <path
                                fill='#1AB5F8'
                                d='M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c6.616 0 12-5.383 12-12S18.616 0 12 0zm0 1.5c5.789 0 10.5 4.711 10.5 10.5S17.789 22.5 12 22.5 1.5 17.789 1.5 12 6.211 1.5 12 1.5zM9 16.5v-9L18 12l-9 4.5z'
                              />
                            </svg>
                          </div>
                          <div>
                            <h3 className='font-medium'>Calendly</h3>
                            <p className='text-sm text-gray-500'>
                              Connect to use Calendly for scheduling
                            </p>
                          </div>
                        </div>
                        <Button variant='outline'>
                          <Plus className='mr-2 h-4 w-4' /> Connect
                        </Button>
                      </div>
                    </CardContent>
                  </Card>

                  {(googleCalendarConnected || outlookConnected) && (
                    <Card>
                      <CardHeader>
                        <CardTitle>Calendar Settings</CardTitle>
                        <CardDescription>
                          Configure how your calendar integrates with your
                          mentorship programs
                        </CardDescription>
                      </CardHeader>
                      <CardContent className='space-y-4'>
                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label htmlFor='auto-sync' className='font-medium'>
                              Auto-sync availability
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Automatically update your availability based on
                              your calendar
                            </p>
                          </div>
                          <Switch id='auto-sync' defaultChecked />
                        </div>

                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label
                              htmlFor='buffer-time'
                              className='font-medium'
                            >
                              Add buffer time
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Add 15-minute buffer before and after each session
                            </p>
                          </div>
                          <Switch id='buffer-time' defaultChecked />
                        </div>

                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label
                              htmlFor='auto-decline'
                              className='font-medium'
                            >
                              Auto-decline conflicts
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Automatically decline conflicting session requests
                            </p>
                          </div>
                          <Switch id='auto-decline' defaultChecked />
                        </div>

                        <div className='flex items-center justify-between py-2'>
                          <div>
                            <Label
                              htmlFor='two-way-sync'
                              className='font-medium'
                            >
                              Two-way sync
                            </Label>
                            <p className='text-sm text-gray-500'>
                              Sync events from Mentwork to your calendar and
                              vice versa
                            </p>
                          </div>
                          <Switch id='two-way-sync' defaultChecked />
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className='bg-[#FFD500] text-black hover:bg-[#e6c000]'>
                          Save Settings
                        </Button>
                      </CardFooter>
                    </Card>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>

      <div className='absolute inset-0 bg-gray-100 -z-10' />
    </SidebarProvider>
  )
}

import { Activity, BookOpen, ShieldCheck, UserCheck, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'

const metrics = [
  { label: 'Total Users', value: '1,248', note: '+36 this month', icon: Users },
  { label: 'Active Programs', value: '42', note: '8 awaiting review', icon: BookOpen },
  { label: 'Active Mentors', value: '186', note: '94% verified', icon: UserCheck },
  { label: 'System Health', value: 'Healthy', note: 'All services online', icon: ShieldCheck },
]

export default function SuperAdminDashboardPage() {
  return (
    <div className='w-full'>
      <DashboardHeader title='System Overview' description='Monitor users, programs, and platform activity' />
      <div className='space-y-6 p-4 sm:p-6'>
        <div className='grid gap-4 sm:grid-cols-2 xl:grid-cols-4'>
          {metrics.map(({ label, value, note, icon: Icon }) => (
            <Card key={label}>
              <CardContent className='flex items-start justify-between p-5'>
                <div><p className='text-sm text-gray-500'>{label}</p><p className='mt-1 text-2xl font-semibold'>{value}</p><p className='mt-1 text-xs text-gray-500'>{note}</p></div>
                <div className='rounded-lg bg-[#FFD500]/20 p-2'><Icon className='h-5 w-5' /></div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className='grid gap-6 lg:grid-cols-3'>
          <Card className='lg:col-span-2'>
            <CardHeader><CardTitle>Recent Activity</CardTitle><CardDescription>Latest important platform events</CardDescription></CardHeader>
            <CardContent className='space-y-4'>
              {['New trainer account awaiting verification', 'Program “Digital Oceans” was updated', 'New mentor joined the platform', 'Monthly system report is ready'].map((item, index) => (
                <div key={item} className='flex items-center gap-3 border-b pb-3 last:border-0'>
                  <Activity className='h-4 w-4 text-gray-500' /><p className='flex-1 text-sm'>{item}</p><span className='text-xs text-gray-400'>{index + 1}h ago</span>
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Attention Needed</CardTitle><CardDescription>Items requiring review</CardDescription></CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex justify-between text-sm'><span>Pending users</span><Badge>12</Badge></div>
              <div className='flex justify-between text-sm'><span>Program reviews</span><Badge variant='secondary'>8</Badge></div>
              <div className='flex justify-between text-sm'><span>Open reports</span><Badge variant='outline'>3</Badge></div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

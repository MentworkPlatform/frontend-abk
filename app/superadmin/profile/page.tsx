'use client'

import { useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'
import { getCurrentUserDetails } from '@/lib/current-user'

export default function SuperAdminProfilePage() {
  const [user, setUser] = useState({ name: 'Super Admin', email: '' })
  useEffect(() => {
    const current = getCurrentUserDetails()
    setUser({ name: current.name ?? 'Super Admin', email: current.email ?? '' })
  }, [])

  return <div><DashboardHeader title='Profile' description='Your Super Admin account information' /><div className='p-4 sm:p-6'><Card className='max-w-2xl'><CardHeader><CardTitle>Account</CardTitle><CardDescription>Authenticated system administrator</CardDescription></CardHeader><CardContent className='flex items-center gap-4'><Avatar className='h-16 w-16'><AvatarFallback>SA</AvatarFallback></Avatar><div><p className='text-lg font-semibold'>{user.name}</p><p className='text-sm text-gray-500'>{user.email || 'Email not provided'}</p><p className='mt-2 flex items-center gap-1 text-sm font-medium'><ShieldCheck className='h-4 w-4 text-green-600' /> Super Admin</p></div></CardContent></Card></div></div>
}

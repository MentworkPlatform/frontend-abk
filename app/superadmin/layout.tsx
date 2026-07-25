'use client'

import type React from 'react'
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { BarChart3, BookOpen, KeyRound, ShieldCheck, UserCog, Users } from 'lucide-react'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DashboardSidebar, type NavItem } from '@/components/dashboard-sidebar'
import { apiClient, clearAuthToken } from '@/lib/api-client'
import { getCurrentUserDetails } from '@/lib/current-user'

const asObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? value as Record<string, unknown> : null

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return null
}

const navItems: NavItem[] = [
  { href: '/superadmin/dashboard', label: 'Overview', icon: BarChart3, exactMatch: true },
  { href: '/superadmin/users', label: 'Users', icon: Users },
  { href: '/superadmin/programs', label: 'Programs', icon: BookOpen },
  { href: '/superadmin/roles', label: 'Roles', icon: ShieldCheck },
  { href: '/superadmin/permissions', label: 'Permissions', icon: KeyRound },
  { href: '/superadmin/profile', label: 'Profile', icon: UserCog },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [name, setName] = useState('Super Admin')
  const [email, setEmail] = useState<string | null>(null)

  useEffect(() => {
    const fallback = getCurrentUserDetails()
    if (fallback.name) setName(fallback.name)
    setEmail(fallback.email)

    void apiClient.get<unknown>('/auth/me').then((response) => {
      const root = asObject(response)
      const data = asObject(root?.data)
      const user = asObject(root?.user) ?? asObject(data?.user) ?? data ?? root
      const resolvedName = pickString(user?.fullName, user?.full_name, user?.name)
      const resolvedEmail = pickString(user?.email)
      if (resolvedName) setName(resolvedName)
      if (resolvedEmail) setEmail(resolvedEmail)
    }).catch(() => undefined)
  }, [])

  const initials = useMemo(() => name.split(' ').filter(Boolean).map((word) => word[0]).join('').slice(0, 2).toUpperCase() || 'SA', [name])

  const logo = (
    <Link href='/superadmin/dashboard' className='flex items-center gap-2 font-semibold'>
      <img src='/images/mentwork-logo.png' alt='Mentwork' className='h-8' />
      <span>Super Admin</span>
    </Link>
  )

  const footer = (
    <div className='mb-3 flex items-center gap-2'>
      <Avatar className='h-8 w-8'><AvatarFallback>{initials}</AvatarFallback></Avatar>
      <div className='min-w-0'>
        <p className='truncate text-sm font-medium'>{name}</p>
        <p className='truncate text-xs text-gray-500'>{email ?? 'System administrator'}</p>
      </div>
    </div>
  )

  return (
    <div className='flex min-h-screen bg-gray-50'>
      <DashboardSidebar
        navItems={navItems}
        logoContent={logo}
        footerContent={footer}
        showLogout
        onLogout={() => {
          clearAuthToken()
          router.push('/login')
        }}
      />
      <main className='min-w-0 flex-1 overflow-y-auto'>{children}</main>
    </div>
  )
}

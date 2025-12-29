'use client'

import type React from 'react'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Calendar,
  MessageSquare,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOutIcon,
  LogOut,
} from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
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
import MobileNav from '@/components/mobile-nav'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState<{
    name: string
    role?: { name: string }
  } | null>(null)

  useEffect(() => {
    let storedUserData = localStorage?.getItem('user')
    let token = localStorage?.getItem('token')
    if (!storedUserData || !token) {
      localStorage.clear()
      router.push('/login')
    } else {
      setUserData(JSON.parse(storedUserData))
    }
  }, [router])

  const handleLogout = () => {
    localStorage.clear()
    router.push('/login')
  }

  const navLinks = [
    {
      href: '/dashboard',
      label: 'Overview',
      icon: <BarChart3 className='h-4 w-4' />,
    },
    {
      href: '/dashboard/sessions',
      label: 'Sessions',
      icon: <Calendar className='h-4 w-4' />,
    },
    {
      href: '/dashboard/messages',
      label: 'Messages',
      icon: <MessageSquare className='h-4 w-4' />,
    },
    {
      href: '/dashboard/resources',
      label: 'Resources',
      icon: <BookOpen className='h-4 w-4' />,
    },
    {
      href: '/dashboard/mentors',
      label: 'My Mentors',
      icon: <Users className='h-4 w-4' />,
    },
    {
      href: '/programs',
      label: 'Explore Programs',
      icon: <BookOpen className='h-4 w-4' />,
    },
  ]

  return (
    <SidebarProvider>
      <div className='flex min-h-screen bg-[#f5f5f5]'>
        {/* Desktop Sidebar */}
        <Sidebar className='hidden md:flex'>
          <SidebarHeader>
            <div className='flex items-center gap-2 p-4'>
              <Link href='/'>
                <img
                  src='/images/mentwork-logo.png'
                  alt='Mentwork'
                  className='h-8'
                />
              </Link>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard'}
                    >
                      <Link href='/dashboard'>
                        <BarChart3 className='h-4 w-4' />
                        <span>Overview</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/sessions'}
                    >
                      <Link href='/dashboard/sessions'>
                        <Calendar className='h-4 w-4' />
                        <span>Sessions</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/messages'}
                    >
                      <Link href='/dashboard/messages'>
                        <MessageSquare className='h-4 w-4' />
                        <span>Messages</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/resources'}
                    >
                      <Link href='/dashboard/resources'>
                        <BookOpen className='h-4 w-4' />
                        <span>Resources</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Network</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/mentors'}
                    >
                      <Link href='/dashboard/mentors'>
                        <Users className='h-4 w-4' />
                        <span>My Mentors</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/school-programs'}
                    >
                      <Link href='/dashboard/school-programs'>
                        <BookOpen className='h-4 w-4' />
                        <span>School Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/programs'}
                    >
                      <Link href='/programs'>
                        <BookOpen className='h-4 w-4' />
                        <span>Explore Programs</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === '/dashboard/settings'}
                    >
                      <Link href='/dashboard/settings'>
                        <Settings className='h-4 w-4' />
                        <span>Settings</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupLabel>Account Logout</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild onClick={() => handleLogout()}>
                      <div className='flex items-center gap-2 cursor-pointer'>
                        <LogOut className='h-4 w-4' color='red' />
                        <span>Logout</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <div className='p-4'>
              <div className='flex items-center gap-4 mb-4'>
                <Avatar>
                  <AvatarImage
                    src='/placeholder.svg?height=40&width=40'
                    alt='User avatar'
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className='font-medium'>{userData?.name || 'User'}</p>
                  <p className='text-xs text-gray-500'>
                    {userData?.role?.name || 'User'}
                  </p>
                </div>
              </div>
              <Button variant='outline' className='w-full'>
                Upgrade Plan
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Header */}
        <div className='fixed top-0 left-0 right-0 z-30 bg-white border-b md:hidden'>
          <div className='flex items-center justify-between p-4'>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-6'
              />
            </Link>
            <MobileNav
              userType='mentee'
              userName='John Doe'
              userRole='Free Plan'
              links={navLinks}
            />
          </div>
        </div>

        <SidebarInset>
          <div className='flex-1 md:p-8 p-4 pt-16 md:pt-8'>{children}</div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}

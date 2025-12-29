'use client'

import type React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  BarChart3,
  Users,
  Target,
  TrendingUp,
  BookOpen,
  DollarSign,
  Award,
  CheckCircle2,
  Check,
  X,
  CreditCard,
  Calendar,
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
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export default function MentorSubscriptionsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('plans')
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [selectedBillingCycle, setSelectedBillingCycle] =
    useState<string>('monthly')
  const [checkoutOpen, setCheckoutOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [processingPayment, setProcessingPayment] = useState(false)
  const [successOpen, setSuccessOpen] = useState(false)

  // Mock subscription plans with billing cycles
  const subscriptionPlans = [
    {
      id: 'free',
      name: 'Free',
      price: {
        monthly: 0,
        quarterly: 0,
        annual: 0,
      },
      commissionStructure: 'Based on sessions completed (starts at 25%)',
      features: [
        'Commission reduces after every 5 sessions',
        'Basic mentor profile',
        'Create up to 3 programs',
        'Access to mentor community',
      ],
      notIncluded: [
        'Verified badge',
        'Priority placement in search',
        'Zero commission option',
        'Advanced analytics',
        'Calendar integrations',
      ],
    },
    {
      id: 'pro',
      name: 'Pro',
      price: {
        monthly: 29,
        quarterly: 79,
        annual: 290,
      },
      commissionStructure: '0% Commission',
      features: [
        'No commission on any program',
        'Verified mentor badge',
        'Enhanced profile visibility',
        'Priority listing in search results',
        'Basic calendar integrations',
        'Basic analytics',
        'Create unlimited programs',
        'Access to mentor community',
      ],
      notIncluded: ['Advanced analytics', 'Custom landing pages'],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: {
        monthly: 79,
        quarterly: 199,
        annual: 790,
      },
      commissionStructure: '0% Commission',
      features: [
        'No commission on any program',
        'Verified mentor badge with premium mark',
        'Top placement in search results',
        'Advanced analytics dashboard',
        'Advanced calendar integrations',
        'Custom landing page builder',
        'Dedicated support',
        'Create unlimited programs',
        'Access to mentor community',
      ],
      notIncluded: [],
    },
  ]

  // Session-based commission tiers for free plan
  const sessionCommissionTiers = [
    { sessions: '0-5', commission: '25%' },
    { sessions: '6-10', commission: '20%' },
    { sessions: '11-20', commission: '15%' },
    { sessions: '21-50', commission: '10%' },
    { sessions: '51+', commission: '5%' },
  ]

  // Get price based on billing cycle
  const getPlanPrice = (plan: any) => {
    return plan?.price?.[selectedBillingCycle] || 0
  }

  // Get billing cycle discount info
  const getBillingCycleInfo = () => {
    switch (selectedBillingCycle) {
      case 'annual':
        return { label: 'Annual', discount: 'Save 20%', period: 'year' }
      case 'quarterly':
        return { label: 'Quarterly', discount: 'Save 10%', period: 'quarter' }
      default:
        return { label: 'Monthly', discount: '', period: 'month' }
    }
  }

  // Handle checkout flow
  const handleCheckout = (planId: string) => {
    setSelectedPlan(planId)
    setCheckoutOpen(true)
  }

  // Handle payment submission
  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setProcessingPayment(true)

    // Simulate payment processing
    setTimeout(() => {
      setProcessingPayment(false)
      setCheckoutOpen(false)
      setSuccessOpen(true)
    }, 2000)
  }

  // Get selected plan details
  const getSelectedPlan = () => {
    return subscriptionPlans.find((plan) => plan.id === selectedPlan)
  }

  return (
    <SidebarProvider>
      <div className='flex min-h-screen'>
        <Sidebar className='hidden md:flex'>
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
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link href='/mentor/dashboard/sessions'>
                        <Calendar className='h-4 w-4' />
                        <span>Sessions</span>
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
                    <SidebarMenuButton asChild isActive>
                      <Link href='/mentor/subscriptions'>
                        <Award className='h-4 w-4' />
                        <span>Subscription</span>
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

        {/* Mobile header */}
        <div className='fixed top-0 left-0 right-0 z-30 bg-white border-b md:hidden'>
          <div className='flex items-center justify-between p-4'>
            <Link href='/'>
              <img
                src='/images/mentwork-logo.png'
                alt='Mentwork'
                className='h-6'
              />
            </Link>
            <Link href='/mentor/dashboard'>
              <Button variant='ghost' size='sm'>
                Dashboard
              </Button>
            </Link>
          </div>
        </div>

        <SidebarInset>
          <div className='flex-1 p-4 md:p-8 pt-16 md:pt-8'>
            <div className='mb-8'>
              <h1 className='text-2xl font-bold'>Mentor Subscription Plans</h1>
              <p className='text-gray-500'>
                Upgrade your mentor account to eliminate commissions and unlock
                premium features
              </p>
            </div>

            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className='mb-8'
            >
              <TabsList className='grid grid-cols-3 w-full mb-6'>
                <TabsTrigger value='plans'>Subscription Plans</TabsTrigger>
                <TabsTrigger value='benefits'>Benefits</TabsTrigger>
                <TabsTrigger value='account'>Account</TabsTrigger>
              </TabsList>

              <TabsContent value='plans'>
                <div className='mb-6'>
                  <div className='bg-gray-50 p-4 rounded-lg mb-6'>
                    <h3 className='font-medium mb-2'>Select Billing Cycle</h3>
                    <div className='flex flex-wrap gap-3'>
                      <Button
                        variant={
                          selectedBillingCycle === 'monthly'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedBillingCycle('monthly')}
                        className={
                          selectedBillingCycle === 'monthly'
                            ? 'bg-[#FFD500] text-black hover:bg-[#e6c000]'
                            : ''
                        }
                      >
                        Monthly
                      </Button>
                      <Button
                        variant={
                          selectedBillingCycle === 'quarterly'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedBillingCycle('quarterly')}
                        className={
                          selectedBillingCycle === 'quarterly'
                            ? 'bg-[#FFD500] text-black hover:bg-[#e6c000]'
                            : ''
                        }
                      >
                        Quarterly{' '}
                        <span className='text-xs ml-1 text-green-600'>
                          Save 10%
                        </span>
                      </Button>
                      <Button
                        variant={
                          selectedBillingCycle === 'annual'
                            ? 'default'
                            : 'outline'
                        }
                        onClick={() => setSelectedBillingCycle('annual')}
                        className={
                          selectedBillingCycle === 'annual'
                            ? 'bg-[#FFD500] text-black hover:bg-[#e6c000]'
                            : ''
                        }
                      >
                        Annual{' '}
                        <span className='text-xs ml-1 text-green-600'>
                          Save 20%
                        </span>
                      </Button>
                    </div>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {subscriptionPlans.map((plan) => (
                      <Card
                        key={plan.id}
                        className={`border-2 ${
                          plan.id === 'premium'
                            ? 'border-[#FFD500]'
                            : 'border-gray-200'
                        } overflow-hidden`}
                      >
                        {plan.id === 'premium' && (
                          <div className='bg-[#FFD500] text-center py-1 text-sm font-medium text-black'>
                            MOST POPULAR
                          </div>
                        )}
                        <CardHeader>
                          <CardTitle>{plan.name}</CardTitle>
                          <div className='mt-2 flex items-baseline'>
                            <span className='text-3xl font-bold'>
                              ${getPlanPrice(plan)}
                            </span>
                            {getPlanPrice(plan) > 0 && (
                              <span className='text-gray-500 ml-1'>
                                /{getBillingCycleInfo().period}
                              </span>
                            )}
                          </div>
                          <CardDescription className='mt-2'>
                            <span className='font-medium'>
                              {plan.commissionStructure}
                            </span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent className='pb-2'>
                          <div className='space-y-3'>
                            {plan.features.map((feature, i) => (
                              <div key={i} className='flex items-center gap-2'>
                                <Check className='h-4 w-4 text-green-500 flex-shrink-0' />
                                <p className='text-sm'>{feature}</p>
                              </div>
                            ))}

                            {plan.notIncluded.map((feature, i) => (
                              <div
                                key={i}
                                className='flex items-center gap-2 text-gray-400'
                              >
                                <X className='h-4 w-4 flex-shrink-0' />
                                <p className='text-sm'>{feature}</p>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                        <CardFooter className='pt-2'>
                          {plan.id === 'free' ? (
                            <Button
                              variant='outline'
                              className='w-full'
                              disabled
                            >
                              Current Plan
                            </Button>
                          ) : (
                            <Button
                              className={
                                plan.id === 'premium'
                                  ? 'w-full bg-[#FFD500] text-black hover:bg-[#e6c000]'
                                  : 'w-full'
                              }
                              onClick={() => handleCheckout(plan.id)}
                            >
                              {plan.id === 'premium'
                                ? 'Get Premium'
                                : 'Upgrade'}
                            </Button>
                          )}
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>

                <div className='mt-8 border rounded-lg p-6 bg-gray-50'>
                  <div className='flex items-start gap-4'>
                    <div className='p-2 bg-blue-100 rounded-full'>
                      <CheckCircle2 className='h-6 w-6 text-blue-600' />
                    </div>
                    <div>
                      <h3 className='text-lg font-medium mb-2'>
                        Subscription Benefits
                      </h3>
                      <div className='space-y-3'>
                        <div className='flex items-center gap-2'>
                          <Award className='h-4 w-4 text-[#FFD500]' />
                          <p className='text-sm'>
                            Get a verified badge to stand out from other mentors
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <DollarSign className='h-4 w-4 text-green-600' />
                          <p className='text-sm'>
                            Pay zero commission on all your programs with paid
                            plans
                          </p>
                        </div>
                        <div className='flex items-center gap-2'>
                          <Users className='h-4 w-4 text-purple-600' />
                          <p className='text-sm'>
                            Get prioritized in search results to attract more
                            mentees
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value='benefits'>
                <Card>
                  <CardHeader>
                    <CardTitle>Why Upgrade Your Mentor Account?</CardTitle>
                    <CardDescription>
                      Compare the benefits across different subscription tiers
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className='overflow-x-auto'>
                      <table className='w-full border-collapse'>
                        <thead>
                          <tr className='border-b'>
                            <th className='text-left py-3 px-4 font-medium'>
                              Feature
                            </th>
                            <th className='text-center py-3 px-4 font-medium'>
                              Free
                            </th>
                            <th className='text-center py-3 px-4 font-medium'>
                              Pro
                            </th>
                            <th className='text-center py-3 px-4 font-medium text-[#FFD500]'>
                              Premium
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Commission</td>
                            <td className='text-center py-3 px-4'>
                              5-25% (based on sessions)
                            </td>
                            <td className='text-center py-3 px-4 font-medium'>
                              0%
                            </td>
                            <td className='text-center py-3 px-4 font-medium'>
                              0%
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Verified Badge</td>
                            <td className='text-center py-3 px-4'>
                              <X className='h-4 w-4 text-gray-400 mx-auto' />
                            </td>
                            <td className='text-center py-3 px-4'>
                              <Check className='h-4 w-4 text-green-500 mx-auto' />
                            </td>
                            <td className='text-center py-3 px-4'>
                              <Check className='h-4 w-4 text-green-500 mx-auto' />
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Search Placement</td>
                            <td className='text-center py-3 px-4'>Standard</td>
                            <td className='text-center py-3 px-4'>Priority</td>
                            <td className='text-center py-3 px-4 font-medium'>
                              Top Priority
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Calendar Integrations</td>
                            <td className='text-center py-3 px-4'>
                              <X className='h-4 w-4 text-gray-400 mx-auto' />
                            </td>
                            <td className='text-center py-3 px-4'>Basic</td>
                            <td className='text-center py-3 px-4 font-medium'>
                              Advanced
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Analytics Dashboard</td>
                            <td className='text-center py-3 px-4'>Basic</td>
                            <td className='text-center py-3 px-4'>Enhanced</td>
                            <td className='text-center py-3 px-4 font-medium'>
                              Advanced
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Custom Landing Page</td>
                            <td className='text-center py-3 px-4'>
                              <X className='h-4 w-4 text-gray-400 mx-auto' />
                            </td>
                            <td className='text-center py-3 px-4'>
                              <X className='h-4 w-4 text-gray-400 mx-auto' />
                            </td>
                            <td className='text-center py-3 px-4'>
                              <Check className='h-4 w-4 text-green-500 mx-auto' />
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Support</td>
                            <td className='text-center py-3 px-4'>Email</td>
                            <td className='text-center py-3 px-4'>
                              Priority Email
                            </td>
                            <td className='text-center py-3 px-4 font-medium'>
                              Dedicated Support
                            </td>
                          </tr>
                          <tr className='border-b'>
                            <td className='py-3 px-4'>Program Limit</td>
                            <td className='text-center py-3 px-4'>
                              3 Programs
                            </td>
                            <td className='text-center py-3 px-4'>Unlimited</td>
                            <td className='text-center py-3 px-4'>Unlimited</td>
                          </tr>
                          <tr>
                            <td className='py-3 px-4'>Monthly Price</td>
                            <td className='text-center py-3 px-4'>$0</td>
                            <td className='text-center py-3 px-4'>$29</td>
                            <td className='text-center py-3 px-4 font-medium'>
                              $79
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className='mt-8 space-y-6'>
                      <div>
                        <h3 className='text-lg font-medium mb-2'>
                          Potential Earnings Increase
                        </h3>
                        <p className='text-sm text-gray-600 mb-4'>
                          Upgrading to a paid plan eliminates commissions,
                          allowing you to earn more from each program. Here's
                          how much more you could earn:
                        </p>

                        <div className='border rounded-lg p-4 bg-gray-50'>
                          <div className='space-y-4'>
                            <div>
                              <p className='font-medium mb-1'>
                                For a $1,000 program:
                              </p>
                              <ul className='space-y-1 text-sm'>
                                <li>
                                  Free Plan (25% commission):{' '}
                                  <span className='font-medium'>$750</span>{' '}
                                  earnings
                                </li>
                                <li>
                                  Free Plan (after 51+ sessions, 5% commission):{' '}
                                  <span className='font-medium'>$950</span>{' '}
                                  earnings{' '}
                                  <span className='text-green-600'>
                                    (+$200)
                                  </span>
                                </li>
                                <li>
                                  Pro/Premium Plan (0% commission):{' '}
                                  <span className='font-medium'>$1,000</span>{' '}
                                  earnings{' '}
                                  <span className='text-green-600'>
                                    (+$250)
                                  </span>
                                </li>
                              </ul>
                            </div>

                            <div>
                              <p className='font-medium mb-1'>
                                Annual earnings with $25,000 in program sales:
                              </p>
                              <ul className='space-y-1 text-sm'>
                                <li>
                                  Free Plan (25% commission):{' '}
                                  <span className='font-medium'>$18,750</span>{' '}
                                  earnings
                                </li>
                                <li>
                                  Free Plan (after 51+ sessions, 5% commission):{' '}
                                  <span className='font-medium'>$23,750</span>{' '}
                                  earnings{' '}
                                  <span className='text-green-600'>
                                    (+$5,000)
                                  </span>
                                </li>
                                <li>
                                  Pro Plan (0% commission):{' '}
                                  <span className='font-medium'>$25,000</span>{' '}
                                  earnings{' '}
                                  <span className='text-green-600'>
                                    (+$6,250)
                                  </span>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className='flex justify-center'>
                        <Button
                          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                          onClick={() => {
                            setActiveTab('plans')
                            handleCheckout('premium')
                          }}
                        >
                          <Award className='mr-2 h-4 w-4' /> Get Premium Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value='account'>
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Status</CardTitle>
                    <CardDescription>
                      Your current plan and commission details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className='space-y-6'>
                    <div className='flex items-center p-4 border rounded-lg bg-gray-50'>
                      <div className='mr-4'>
                        <div className='h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center'>
                          <Award className='h-6 w-6 text-gray-600' />
                        </div>
                      </div>
                      <div>
                        <h3 className='font-medium'>Free Plan</h3>
                        <p className='text-sm text-gray-500'>
                          Commission based on sessions completed
                        </p>
                        <div className='mt-1 flex items-center'>
                          <Badge
                            variant='outline'
                            className='text-xs font-normal'
                          >
                            Current Plan
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className='text-lg font-medium mb-4'>
                        Session-Based Commission Structure
                      </h3>
                      <p className='text-sm text-gray-600 mb-4'>
                        On the free plan, your commission rate decreases as you
                        complete more sessions:
                      </p>
                      <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                        {sessionCommissionTiers.map((tier, index) => (
                          <Card
                            key={index}
                            className={`border-2 ${
                              index === 2
                                ? 'border-[#FFD500]'
                                : 'border-[#F5F5F5]'
                            }`}
                          >
                            <CardContent className='p-4'>
                              <h4 className='font-medium mb-1'>
                                {tier.sessions} Sessions
                              </h4>
                              <p className='text-2xl font-bold mb-1'>
                                {tier.commission}
                              </p>
                              <p className='text-xs text-gray-500'>
                                Commission Rate
                              </p>
                              {index === 2 && (
                                <Badge className='mt-2 bg-[#FFD500] text-black'>
                                  Current
                                </Badge>
                              )}
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                      <p className='text-sm text-gray-500 mt-4'>
                        Note: Paid subscription plans eliminate commissions
                        entirely, regardless of sessions completed.
                      </p>
                    </div>

                    <div className='border-t pt-6'>
                      <h3 className='text-lg font-medium mb-4'>
                        Upgrade to Eliminate Commissions
                      </h3>
                      <p className='text-sm text-gray-600 mb-4'>
                        Upgrading to a paid plan will eliminate commissions
                        entirely, allowing you to keep 100% of your program
                        earnings.
                      </p>
                      <div className='flex justify-center'>
                        <Button
                          className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                          onClick={() => {
                            setActiveTab('plans')
                            handleCheckout('premium')
                          }}
                        >
                          <Award className='mr-2 h-4 w-4' /> Upgrade Your Plan
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </div>

      {/* Checkout Dialog */}
      <Dialog open={checkoutOpen} onOpenChange={setCheckoutOpen}>
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <DialogTitle>
              Subscribe to {getSelectedPlan()?.name} Plan
            </DialogTitle>
            <DialogDescription>
              Upgrade your mentor account to eliminate commissions and unlock
              premium features
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handlePaymentSubmit}>
            <div className='space-y-4 py-4'>
              <div className='border-b pb-4'>
                <div className='flex justify-between mb-2'>
                  <span>
                    {getSelectedPlan()?.name} Plan (
                    {getBillingCycleInfo().label})
                  </span>
                  <span>
                    ${getPlanPrice(getSelectedPlan())}/
                    {getBillingCycleInfo().period}
                  </span>
                </div>
                <div className='flex justify-between text-sm text-gray-500'>
                  <span>Commission Rate</span>
                  <span>{getSelectedPlan()?.commissionStructure}</span>
                </div>
                {getBillingCycleInfo().discount && (
                  <div className='flex justify-between text-sm text-green-600 mt-1'>
                    <span>Discount</span>
                    <span>{getBillingCycleInfo().discount}</span>
                  </div>
                )}
              </div>

              <div className='space-y-2'>
                <h3 className='font-medium'>Payment Method</h3>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className='flex flex-col space-y-1'
                >
                  <div className='flex items-center space-x-2 border rounded-md p-3'>
                    <RadioGroupItem value='card' id='payment-card' />
                    <Label
                      htmlFor='payment-card'
                      className='flex-1 cursor-pointer'
                    >
                      <div className='flex justify-between items-center'>
                        <span>Credit/Debit Card</span>
                        <div className='flex'>
                          <div className='h-6 w-10 rounded bg-blue-100 mr-1'></div>
                          <div className='h-6 w-10 rounded bg-red-100 mr-1'></div>
                          <div className='h-6 w-10 rounded bg-gray-100'></div>
                        </div>
                      </div>
                    </Label>
                  </div>
                  <div className='flex items-center space-x-2 border rounded-md p-3'>
                    <RadioGroupItem value='paypal' id='payment-paypal' />
                    <Label
                      htmlFor='payment-paypal'
                      className='flex-1 cursor-pointer'
                    >
                      <div className='flex justify-between items-center'>
                        <span>PayPal</span>
                        <div className='h-6 w-16 rounded bg-blue-200'></div>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === 'card' && (
                <div className='space-y-4'>
                  <div className='space-y-2'>
                    <Label htmlFor='card-number'>Card Number</Label>
                    <Input id='card-number' placeholder='1234 5678 9012 3456' />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                    <div className='space-y-2'>
                      <Label htmlFor='expiry'>Expiry Date</Label>
                      <Input id='expiry' placeholder='MM/YY' />
                    </div>
                    <div className='space-y-2'>
                      <Label htmlFor='cvc'>CVC</Label>
                      <Input id='cvc' placeholder='123' />
                    </div>
                  </div>
                </div>
              )}

              <div className='space-y-2'>
                <Label htmlFor='billing-email'>Billing Email</Label>
                <Input
                  id='billing-email'
                  placeholder='your-email@example.com'
                />
              </div>
            </div>
            <DialogFooter className='flex-col sm:flex-row sm:justify-between'>
              <Button
                variant='outline'
                type='button'
                onClick={() => setCheckoutOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                disabled={processingPayment}
              >
                {processingPayment ? (
                  <>
                    <span className='animate-spin mr-2'>⟳</span> Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className='mr-2 h-4 w-4' /> Subscribe - $
                    {getPlanPrice(getSelectedPlan())}/
                    {getBillingCycleInfo().period}
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Dialog */}
      <Dialog open={successOpen} onOpenChange={setSuccessOpen}>
        <DialogContent className='sm:max-w-md'>
          <div className='text-center py-4'>
            <div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <CheckCircle2 className='h-8 w-8 text-green-600' />
            </div>
            <h2 className='text-xl font-bold'>Subscription Successful!</h2>
            <p className='text-gray-600 mt-2 mb-6'>
              You're now subscribed to the {getSelectedPlan()?.name} Plan.
              You'll pay 0% commission on all your programs!
            </p>
            <div className='flex gap-4 justify-center'>
              <Button variant='outline' onClick={() => setSuccessOpen(false)}>
                Close
              </Button>
              <Button
                className='bg-[#FFD500] text-black hover:bg-[#e6c000]'
                onClick={() => {
                  setSuccessOpen(false)
                  router.push('/mentor/dashboard')
                }}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
}

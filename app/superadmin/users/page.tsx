'use client'

import { useEffect, useMemo, useState } from 'react'
import { Plus, Search, SlidersHorizontal, Users } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApiError, apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

type UserRow = {
  id: string
  name: string
  email: string
  role: string
  location: string
  isActive: boolean
  createdAt: string
}

type Filters = {
  search: string
  role: string
  roleId: string
  isActive: string
  location: string
  sectorId: string
  createdFrom: string
  createdTo: string
  sortBy: string
  sortOrder: string
}

const emptyFilters: Filters = {
  search: '', role: 'all', roleId: '', isActive: 'all', location: '', sectorId: '',
  createdFrom: '', createdTo: '', sortBy: 'createdAt', sortOrder: 'desc',
}

const asObject = (value: unknown): Record<string, unknown> | null =>
  typeof value === 'object' && value !== null ? value as Record<string, unknown> : null

const pickString = (...values: unknown[]) => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim()
    if (typeof value === 'number' && Number.isFinite(value)) return String(value)
  }
  return ''
}

const extractUsers = (payload: unknown) => {
  const root = asObject(payload)
  const data = asObject(root?.data)
  const candidates = [root?.users, data?.users, root?.items, data?.items, root?.data]
  const rows = candidates.find(Array.isArray) as unknown[] | undefined
  return rows ?? []
}

const mapUser = (value: unknown): UserRow | null => {
  const user = asObject(value)
  if (!user) return null
  const roleRecord = asObject(user.role)
  const profile = asObject(user.profile)
  const id = pickString(user.id, user.userId)
  if (!id) return null

  const activeValue = user.isActive ?? user.active ?? user.status
  const isActive = typeof activeValue === 'boolean'
    ? activeValue
    : !['false', 'inactive', 'disabled', 'suspended'].includes(String(activeValue ?? 'true').toLowerCase())

  return {
    id,
    name: pickString(user.fullName, user.full_name, user.name, profile?.name) || 'Unnamed user',
    email: pickString(user.email, profile?.email) || 'Not provided',
    role: pickString(roleRecord?.name, user.roleName, user.userType, user.role) || 'Unknown',
    location: pickString(user.location, profile?.location) || 'Not provided',
    isActive,
    createdAt: pickString(user.createdAt, user.created_at),
  }
}

const getPagination = (payload: unknown, fallbackPage: number, fallbackCount: number) => {
  const root = asObject(payload)
  const data = asObject(root?.data)
  const pagination = asObject(root?.pagination) ?? asObject(data?.pagination) ?? asObject(root?.meta) ?? asObject(data?.meta)
  const number = (...values: unknown[]) => {
    for (const value of values) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
    return 0
  }
  const total = number(pagination?.total, pagination?.totalItems, root?.total, data?.total, fallbackCount)
  const page = number(pagination?.page, pagination?.currentPage, fallbackPage) || fallbackPage
  const totalPages = number(pagination?.totalPages, pagination?.pages) || Math.max(1, Math.ceil(total / 20))
  return { total, page, totalPages }
}

export default function SuperAdminUsersPage() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [appliedFilters, setAppliedFilters] = useState<Filters>(emptyFilters)
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(20)
  const [users, setUsers] = useState<UserRow[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', roleId: '', reason: '' })

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value && value !== 'all') params.set(key, value)
    })
    return params.toString()
  }, [appliedFilters, page, limit])

  useEffect(() => {
    let mounted = true
    const loadUsers = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await apiClient.get<unknown>(`/admin/users?${query}`, { cache: 'no-store' })
        if (!mounted) return
        const mapped = extractUsers(response).map(mapUser).filter((user): user is UserRow => Boolean(user))
        setUsers(mapped)
        setPagination(getPagination(response, page, mapped.length))
      } catch (loadError) {
        if (!mounted) return
        setUsers([])
        setError(loadError instanceof ApiError || loadError instanceof Error ? loadError.message : 'Unable to load users.')
      } finally {
        if (mounted) setIsLoading(false)
      }
    }
    void loadUsers()
    return () => { mounted = false }
  }, [query, page, reloadToken])

  const updateFilter = (field: keyof Filters, value: string) => setFilters((previous) => ({ ...previous, [field]: value }))
  const applyFilters = () => { setPage(1); setAppliedFilters(filters) }
  const resetFilters = () => { setFilters(emptyFilters); setAppliedFilters(emptyFilters); setPage(1) }

  const createUser = async (event: React.FormEvent) => {
    event.preventDefault()
    const roleId = Number(createForm.roleId)
    if (!Number.isInteger(roleId) || roleId <= 0) {
      toast({ title: 'Invalid role ID', description: 'Role ID must be a positive number.', variant: 'destructive' })
      return
    }

    setIsCreating(true)
    try {
      await apiClient.post('/admin/users', {
        name: createForm.name.trim(),
        email: createForm.email.trim(),
        password: createForm.password,
        roleId,
        reason: createForm.reason.trim(),
      })
      toast({ title: 'User created', description: `${createForm.name.trim()} can now access the platform.` })
      setCreateForm({ name: '', email: '', password: '', roleId: '', reason: '' })
      setIsCreateOpen(false)
      setPage(1)
      setReloadToken((value) => value + 1)
    } catch (createError) {
      toast({ title: 'Unable to create user', description: createError instanceof ApiError || createError instanceof Error ? createError.message : 'Request failed.', variant: 'destructive' })
    } finally {
      setIsCreating(false)
    }
  }

  return (
    <div className='w-full'>
      <DashboardHeader title='Users' description='Search and oversee every platform account' />
      <div className='space-y-5 p-4 sm:p-6'>
        <Card>
          <CardHeader className='pb-3'><CardTitle className='flex items-center gap-2 text-base'><SlidersHorizontal className='h-4 w-4' /> Filters</CardTitle></CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
              <div className='space-y-1'><Label>Search</Label><Input value={filters.search} onChange={(event) => updateFilter('search', event.target.value)} placeholder='Name or email' /></div>
              <div className='space-y-1'><Label>Role</Label><Select value={filters.role} onValueChange={(value) => updateFilter('role', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='all'>All roles</SelectItem><SelectItem value='mentee'>Mentee</SelectItem><SelectItem value='mentor'>Mentor</SelectItem><SelectItem value='trainer'>Trainer</SelectItem><SelectItem value='superadmin'>Super Admin</SelectItem></SelectContent></Select></div>
              <div className='space-y-1'><Label>Status</Label><Select value={filters.isActive} onValueChange={(value) => updateFilter('isActive', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='all'>All statuses</SelectItem><SelectItem value='true'>Active</SelectItem><SelectItem value='false'>Inactive</SelectItem></SelectContent></Select></div>
              <div className='space-y-1'><Label>Location</Label><Input value={filters.location} onChange={(event) => updateFilter('location', event.target.value)} placeholder='e.g. Lagos' /></div>
              <div className='space-y-1'><Label>Role ID</Label><Input value={filters.roleId} onChange={(event) => updateFilter('roleId', event.target.value)} placeholder='Role ID' /></div>
              <div className='space-y-1'><Label>Sector ID</Label><Input value={filters.sectorId} onChange={(event) => updateFilter('sectorId', event.target.value)} placeholder='Sector ID' /></div>
              <div className='space-y-1'><Label>Created from</Label><Input type='date' value={filters.createdFrom} onChange={(event) => updateFilter('createdFrom', event.target.value)} /></div>
              <div className='space-y-1'><Label>Created to</Label><Input type='date' min={filters.createdFrom || undefined} value={filters.createdTo} onChange={(event) => updateFilter('createdTo', event.target.value)} /></div>
              <div className='space-y-1'><Label>Sort by</Label><Select value={filters.sortBy} onValueChange={(value) => updateFilter('sortBy', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='createdAt'>Created date</SelectItem><SelectItem value='name'>Name</SelectItem><SelectItem value='email'>Email</SelectItem><SelectItem value='role'>Role</SelectItem></SelectContent></Select></div>
              <div className='space-y-1'><Label>Order</Label><Select value={filters.sortOrder} onValueChange={(value) => updateFilter('sortOrder', value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='asc'>Ascending</SelectItem><SelectItem value='desc'>Descending</SelectItem></SelectContent></Select></div>
            </div>
            <div className='flex flex-wrap gap-2'><Button onClick={applyFilters}><Search className='mr-2 h-4 w-4' />Apply filters</Button><Button variant='outline' onClick={resetFilters}>Reset</Button></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex-row items-center justify-between gap-3'><CardTitle className='flex items-center gap-2'><Users className='h-5 w-5' />Users <Badge variant='secondary'>{pagination.total}</Badge></CardTitle><div className='flex items-center gap-2'><Button size='sm' onClick={() => setIsCreateOpen(true)}><Plus className='mr-2 h-4 w-4' />Create user</Button><Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1) }}><SelectTrigger className='w-24'><SelectValue /></SelectTrigger><SelectContent><SelectItem value='10'>10</SelectItem><SelectItem value='20'>20</SelectItem><SelectItem value='50'>50</SelectItem></SelectContent></Select></div></CardHeader>
          <CardContent>
            {error ? <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div> : isLoading ? <p className='py-8 text-center text-sm text-gray-500'>Loading users...</p> : users.length === 0 ? <p className='py-8 text-center text-sm text-gray-500'>No users match these filters.</p> : (
              <div className='overflow-x-auto'><table className='w-full text-sm'><thead><tr className='border-b text-left text-gray-500'><th className='px-3 py-3'>User</th><th className='px-3 py-3'>Role</th><th className='px-3 py-3'>Location</th><th className='px-3 py-3'>Status</th><th className='px-3 py-3'>Joined</th></tr></thead><tbody>{users.map((user) => <tr key={user.id} className='border-b last:border-0'><td className='px-3 py-3'><p className='font-medium'>{user.name}</p><p className='text-xs text-gray-500'>{user.email}</p></td><td className='px-3 py-3 capitalize'>{user.role}</td><td className='px-3 py-3'>{user.location}</td><td className='px-3 py-3'><Badge variant={user.isActive ? 'default' : 'secondary'}>{user.isActive ? 'Active' : 'Inactive'}</Badge></td><td className='px-3 py-3'>{user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not provided'}</td></tr>)}</tbody></table></div>
            )}
            <div className='mt-4 flex items-center justify-between'><p className='text-xs text-gray-500'>Page {pagination.page} of {pagination.totalPages}</p><div className='flex gap-2'><Button variant='outline' size='sm' disabled={page <= 1 || isLoading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button variant='outline' size='sm' disabled={page >= pagination.totalPages || isLoading} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
          </CardContent>
        </Card>
      </div>
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader><DialogTitle>Create user</DialogTitle><DialogDescription>Create a platform account and assign its initial role.</DialogDescription></DialogHeader>
          <form className='space-y-4' onSubmit={createUser}>
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-1 sm:col-span-2'><Label htmlFor='new-user-name'>Full name *</Label><Input id='new-user-name' value={createForm.name} onChange={(event) => setCreateForm((form) => ({ ...form, name: event.target.value }))} required /></div>
              <div className='space-y-1 sm:col-span-2'><Label htmlFor='new-user-email'>Email *</Label><Input id='new-user-email' type='email' value={createForm.email} onChange={(event) => setCreateForm((form) => ({ ...form, email: event.target.value }))} required /></div>
              <div className='space-y-1'><Label htmlFor='new-user-password'>Temporary password *</Label><Input id='new-user-password' type='password' minLength={8} value={createForm.password} onChange={(event) => setCreateForm((form) => ({ ...form, password: event.target.value }))} required /></div>
              <div className='space-y-1'><Label htmlFor='new-user-role'>Role ID *</Label><Input id='new-user-role' type='number' min='1' value={createForm.roleId} onChange={(event) => setCreateForm((form) => ({ ...form, roleId: event.target.value }))} required /></div>
              <div className='space-y-1 sm:col-span-2'><Label htmlFor='new-user-reason'>Reason *</Label><Input id='new-user-reason' value={createForm.reason} onChange={(event) => setCreateForm((form) => ({ ...form, reason: event.target.value }))} placeholder='Why is this account being created?' required /></div>
            </div>
            <div className='flex justify-end gap-2'><Button type='button' variant='outline' onClick={() => setIsCreateOpen(false)}>Cancel</Button><Button type='submit' disabled={isCreating}>{isCreating ? 'Creating...' : 'Create user'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

'use client'

import { useCallback, useEffect, useState } from 'react'
import { Edit3, KeyRound, Plus, RefreshCw, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApiError, apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

type AccessItem = {
  id: string
  name: string
  description: string
  isActive: boolean | null
}

type Props = {
  resource: 'roles' | 'permissions'
  singularLabel: 'Role' | 'Permission'
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

const mapItem = (value: unknown): AccessItem | null => {
  const item = asObject(value)
  if (!item) return null
  const id = pickString(item.id, item.roleId, item.permissionId)
  if (!id) return null
  const status = item.isActive ?? item.active ?? item.status
  return {
    id,
    name: pickString(item.name, item.roleName, item.permissionName, item.key) || 'Unnamed',
    description: pickString(item.description),
    isActive:
      status === undefined || status === null
        ? null
        : typeof status === 'boolean'
          ? status
          : !['false', 'inactive', 'disabled'].includes(String(status).toLowerCase()),
  }
}

const extractItems = (payload: unknown, resource: Props['resource']) => {
  const root = asObject(payload)
  const data = asObject(root?.data)
  const candidates = [root?.[resource], data?.[resource], root?.items, data?.items, root?.data]
  return ((candidates.find(Array.isArray) as unknown[] | undefined) ?? [])
    .map(mapItem)
    .filter((item): item is AccessItem => Boolean(item))
}

const extractPagination = (payload: unknown, fallbackPage: number, limit: number, count: number) => {
  const root = asObject(payload)
  const data = asObject(root?.data)
  const meta = asObject(root?.pagination) ?? asObject(data?.pagination) ?? asObject(root?.meta) ?? asObject(data?.meta)
  const toNumber = (...values: unknown[]) => {
    for (const value of values) {
      const parsed = Number(value)
      if (Number.isFinite(parsed)) return parsed
    }
    return 0
  }
  const total = toNumber(meta?.total, meta?.totalItems, root?.total, data?.total, count)
  return {
    total,
    page: toNumber(meta?.page, meta?.currentPage, fallbackPage) || fallbackPage,
    totalPages: toNumber(meta?.totalPages, meta?.pages) || Math.max(1, Math.ceil(total / limit)),
  }
}

const errorMessage = (error: unknown, fallback: string) =>
  error instanceof ApiError || error instanceof Error ? error.message : fallback

export function AccessResourceManager({ resource, singularLabel }: Props) {
  const { toast } = useToast()
  const [items, setItems] = useState<AccessItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState({ name: '' })
  const [search, setSearch] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [sortOrder, setSortOrder] = useState('asc')
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [permissionRole, setPermissionRole] = useState<AccessItem | null>(null)
  const [availablePermissions, setAvailablePermissions] = useState<AccessItem[]>([])
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<string[]>([])
  const [assignmentReason, setAssignmentReason] = useState('')
  const [isLoadingPermissions, setIsLoadingPermissions] = useState(false)
  const endpoint = `/admin/${resource}`

  const loadItems = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), sortBy: 'name', sortOrder })
      if (appliedSearch) params.set('search', appliedSearch)
      const response = await apiClient.get<unknown>(`${endpoint}?${params.toString()}`, { cache: 'no-store' })
      const mapped = extractItems(response, resource)
      setItems(mapped)
      setPagination(extractPagination(response, page, limit, mapped.length))
    } catch (loadError) {
      setError(errorMessage(loadError, `Unable to load ${resource}.`))
    } finally {
      setIsLoading(false)
    }
  }, [appliedSearch, endpoint, limit, page, resource, sortOrder])

  useEffect(() => { void loadItems() }, [loadItems])

  const resetForm = () => { setEditingId(null); setForm({ name: '' }) }

  const editItem = async (id: string) => {
    setIsSaving(true)
    try {
      const response = await apiClient.get<unknown>(`${endpoint}/${encodeURIComponent(id)}`)
      const root = asObject(response)
      const data = asObject(root?.data)
      const detail = mapItem(root?.[singularLabel.toLowerCase()] ?? data?.[singularLabel.toLowerCase()] ?? root?.data ?? root)
      const fallback = items.find((item) => item.id === id)
      const item = detail ?? fallback
      if (!item) throw new Error(`${singularLabel} details were not returned.`)
      setEditingId(id)
      setForm({ name: item.name })
    } catch (loadError) {
      toast({ title: `Unable to open ${singularLabel.toLowerCase()}`, description: errorMessage(loadError, 'Request failed.'), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) return
    setIsSaving(true)
    try {
      const payload = { name: form.name.trim() }
      if (editingId) await apiClient.put(`${endpoint}/${encodeURIComponent(editingId)}`, payload)
      else await apiClient.post(endpoint, payload)
      toast({ title: `${singularLabel} ${editingId ? 'updated' : 'created'}`, description: `${form.name.trim()} was saved successfully.` })
      resetForm()
      await loadItems()
    } catch (saveError) {
      toast({ title: `Unable to save ${singularLabel.toLowerCase()}`, description: errorMessage(saveError, 'Request failed.'), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  const removeItem = async (item: AccessItem) => {
    if (!window.confirm(`Delete ${singularLabel.toLowerCase()} “${item.name}”?`)) return
    try {
      await apiClient.delete(`${endpoint}/${encodeURIComponent(item.id)}`)
      setItems((current) => current.filter((entry) => entry.id !== item.id))
      if (editingId === item.id) resetForm()
      toast({ title: `${singularLabel} deleted` })
    } catch (deleteError) {
      toast({ title: `Unable to delete ${singularLabel.toLowerCase()}`, description: errorMessage(deleteError, 'Request failed.'), variant: 'destructive' })
    }
  }

  const openPermissions = async (role: AccessItem) => {
    setPermissionRole(role)
    setAssignmentReason('')
    setIsLoadingPermissions(true)
    try {
      const [permissionsResponse, roleResponse] = await Promise.all([
        apiClient.get<unknown>('/admin/permissions?page=1&limit=100&sortBy=name&sortOrder=asc', { cache: 'no-store' }),
        apiClient.get<unknown>(`/admin/roles/${encodeURIComponent(role.id)}`, { cache: 'no-store' }),
      ])
      setAvailablePermissions(extractItems(permissionsResponse, 'permissions'))

      const root = asObject(roleResponse)
      const data = asObject(root?.data)
      const roleRecord = asObject(root?.role) ?? asObject(data?.role) ?? data ?? root
      const assigned = Array.isArray(roleRecord?.permissions) ? roleRecord.permissions : []
      setSelectedPermissionIds(
        assigned.map((permission) => {
          const record = asObject(permission)
          return pickString(record?.id, record?.permissionId, permission)
        }).filter(Boolean),
      )
    } catch (loadError) {
      toast({ title: 'Unable to load permissions', description: errorMessage(loadError, 'Request failed.'), variant: 'destructive' })
      setPermissionRole(null)
    } finally {
      setIsLoadingPermissions(false)
    }
  }

  const togglePermission = (permissionId: string) => {
    setSelectedPermissionIds((current) => current.includes(permissionId)
      ? current.filter((id) => id !== permissionId)
      : [...current, permissionId])
  }

  const assignPermissions = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!permissionRole) return
    const permissionIds = selectedPermissionIds.map(Number)
    if (permissionIds.some((id) => !Number.isInteger(id) || id <= 0)) {
      toast({ title: 'Invalid permission selection', description: 'Permission IDs must be positive numbers.', variant: 'destructive' })
      return
    }
    setIsSaving(true)
    try {
      await apiClient.put(`/admin/roles/${encodeURIComponent(permissionRole.id)}/permissions`, {
        permissionIds,
        reason: assignmentReason.trim(),
      })
      toast({ title: 'Permissions assigned', description: `${permissionRole.name} was updated successfully.` })
      setPermissionRole(null)
    } catch (assignError) {
      toast({ title: 'Unable to assign permissions', description: errorMessage(assignError, 'Request failed.'), variant: 'destructive' })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='grid gap-5 lg:grid-cols-[340px_1fr]'>
      <Card className='h-fit'>
        <CardHeader><CardTitle className='text-base'>{editingId ? `Edit ${singularLabel}` : `Create ${singularLabel}`}</CardTitle></CardHeader>
        <CardContent><form className='space-y-4' onSubmit={submit}><div className='space-y-1'><Label htmlFor={`${resource}-name`}>Name *</Label><Input id={`${resource}-name`} value={form.name} onChange={(event) => setForm({ name: event.target.value })} placeholder={resource === 'roles' ? 'e.g. support-admin' : 'e.g. support.tickets.manage'} required /></div><div className='flex gap-2'><Button type='submit' disabled={isSaving}><Plus className='mr-2 h-4 w-4' />{editingId ? 'Save changes' : `Create ${singularLabel.toLowerCase()}`}</Button>{editingId ? <Button type='button' variant='outline' onClick={resetForm}>Cancel</Button> : null}</div></form></CardContent>
      </Card>
      <Card>
        <CardHeader className='flex-row items-center justify-between'><CardTitle className='text-base'>{resource === 'roles' ? 'Roles' : 'Permissions'} <Badge variant='secondary'>{pagination.total}</Badge></CardTitle><Button size='sm' variant='outline' onClick={() => void loadItems()} disabled={isLoading}><RefreshCw className='mr-2 h-4 w-4' />Refresh</Button></CardHeader>
        <CardContent className='space-y-4'>
          <form className='flex flex-col gap-2 sm:flex-row' onSubmit={(event) => { event.preventDefault(); setPage(1); setAppliedSearch(search.trim()) }}><Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder={`Search ${resource}`} className='sm:max-w-xs' /><Select value={sortOrder} onValueChange={(value) => { setSortOrder(value); setPage(1) }}><SelectTrigger className='sm:w-36'><SelectValue /></SelectTrigger><SelectContent><SelectItem value='asc'>Name A–Z</SelectItem><SelectItem value='desc'>Name Z–A</SelectItem></SelectContent></Select><Select value={String(limit)} onValueChange={(value) => { setLimit(Number(value)); setPage(1) }}><SelectTrigger className='sm:w-24'><SelectValue /></SelectTrigger><SelectContent><SelectItem value='10'>10</SelectItem><SelectItem value='20'>20</SelectItem><SelectItem value='50'>50</SelectItem></SelectContent></Select><Button type='submit'><Search className='mr-2 h-4 w-4' />Search</Button>{appliedSearch ? <Button type='button' variant='outline' onClick={() => { setSearch(''); setAppliedSearch(''); setPage(1) }}>Clear</Button> : null}</form>
          {error ? <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div> : isLoading ? <p className='py-8 text-center text-sm text-gray-500'>Loading {resource}...</p> : items.length === 0 ? <p className='py-8 text-center text-sm text-gray-500'>No {resource} found.</p> : <div className='space-y-2'>{items.map((item) => <div key={item.id} className='flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center'><div className='min-w-0 flex-1'><div className='flex items-center gap-2'><p className='font-medium'>{item.name}</p>{item.isActive !== null ? <Badge variant={item.isActive ? 'default' : 'secondary'}>{item.isActive ? 'Active' : 'Inactive'}</Badge> : null}</div><p className='mt-1 text-sm text-gray-500'>{item.description || `${singularLabel} ID: ${item.id}`}</p></div><div className='flex gap-2'>{resource === 'roles' ? <Button size='sm' variant='outline' onClick={() => void openPermissions(item)}><KeyRound className='mr-2 h-4 w-4' />Permissions</Button> : null}<Button size='icon' variant='outline' aria-label={`Edit ${item.name}`} onClick={() => void editItem(item.id)}><Edit3 className='h-4 w-4' /></Button><Button size='icon' variant='outline' aria-label={`Delete ${item.name}`} onClick={() => void removeItem(item)}><Trash2 className='h-4 w-4 text-red-600' /></Button></div></div>)}</div>}
          <div className='flex items-center justify-between'><p className='text-xs text-gray-500'>Page {pagination.page} of {pagination.totalPages}</p><div className='flex gap-2'><Button size='sm' variant='outline' disabled={page <= 1 || isLoading} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button size='sm' variant='outline' disabled={page >= pagination.totalPages || isLoading} onClick={() => setPage((value) => value + 1)}>Next</Button></div></div>
        </CardContent>
      </Card>
      <Dialog open={Boolean(permissionRole)} onOpenChange={(open) => { if (!open) setPermissionRole(null) }}>
        <DialogContent className='sm:max-w-lg'>
          <DialogHeader><DialogTitle>Assign permissions</DialogTitle><DialogDescription>Select permissions for {permissionRole?.name}.</DialogDescription></DialogHeader>
          <form className='space-y-4' onSubmit={assignPermissions}>
            <div className='max-h-72 space-y-2 overflow-y-auto rounded-md border p-3'>
              {isLoadingPermissions ? <p className='py-6 text-center text-sm text-gray-500'>Loading permissions...</p> : availablePermissions.length === 0 ? <p className='py-6 text-center text-sm text-gray-500'>No permissions are available.</p> : availablePermissions.map((permission) => <label key={permission.id} className='flex cursor-pointer items-start gap-3 rounded-md p-2 hover:bg-gray-50'><Checkbox checked={selectedPermissionIds.includes(permission.id)} onCheckedChange={() => togglePermission(permission.id)} /><span><span className='block text-sm font-medium'>{permission.name}</span><span className='text-xs text-gray-500'>ID: {permission.id}</span></span></label>)}
            </div>
            <div className='space-y-1'><Label htmlFor='permission-reason'>Reason *</Label><Input id='permission-reason' value={assignmentReason} onChange={(event) => setAssignmentReason(event.target.value)} placeholder='Why are these permissions being assigned?' required /></div>
            <div className='flex justify-end gap-2'><Button type='button' variant='outline' onClick={() => setPermissionRole(null)}>Cancel</Button><Button type='submit' disabled={isSaving || isLoadingPermissions}>{isSaving ? 'Saving...' : 'Save permissions'}</Button></div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

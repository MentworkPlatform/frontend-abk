'use client'

import { useEffect, useMemo, useState } from 'react'
import { Archive, BookOpen, Search, Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DashboardHeader } from '@/components/dashboard-header'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ApiError, apiClient } from '@/lib/api-client'
import { useToast } from '@/hooks/use-toast'

type ProgramRow = {
  id: string
  title: string
  trainer: string
  category: string
  format: string
  price: number | null
  startDate: string
  endDate: string
  isPublished: boolean
  moderationStatus: string
}

type Filters = {
  search: string; isPublished: string; moderationStatus: string; createdBy: string
  categoryId: string; experienceLevelId: string; formatId: string; sector: string
  minPrice: string; maxPrice: string; createdFrom: string; createdTo: string
  sortBy: string; sortOrder: string
}

const emptyFilters: Filters = {
  search: '', isPublished: 'all', moderationStatus: 'all', createdBy: '', categoryId: '',
  experienceLevelId: '', formatId: '', sector: '', minPrice: '', maxPrice: '',
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

const extractPrograms = (payload: unknown) => {
  const root = asObject(payload); const data = asObject(root?.data)
  return (([root?.programs, data?.programs, root?.items, data?.items, root?.data].find(Array.isArray) as unknown[] | undefined) ?? [])
}

const mapProgram = (value: unknown): ProgramRow | null => {
  const program = asObject(value); if (!program) return null
  const id = pickString(program.id, program.programId); if (!id) return null
  const trainer = asObject(program.trainer) ?? asObject(program.createdByUser) ?? asObject(program.creator)
  const category = asObject(program.category); const format = asObject(program.format)
  const price = Number(program.price)
  return {
    id,
    title: pickString(program.title) || 'Untitled program',
    trainer: pickString(trainer?.name, program.trainerName, program.createdBy) || 'Not provided',
    category: pickString(category?.name, program.categoryName, program.category) || 'Not provided',
    format: pickString(format?.name, program.formatName, program.format) || 'Not provided',
    price: Number.isFinite(price) ? price : null,
    startDate: pickString(program.startDate),
    endDate: pickString(program.endDate),
    isPublished: program.isPublished === true || String(program.isPublished).toLowerCase() === 'true',
    moderationStatus: pickString(program.moderationStatus, program.moderation_status) || 'ACTIVE',
  }
}

const paginationFrom = (payload: unknown, page: number, limit: number, count: number) => {
  const root = asObject(payload); const data = asObject(root?.data)
  const meta = asObject(root?.pagination) ?? asObject(data?.pagination) ?? asObject(root?.meta) ?? asObject(data?.meta)
  const num = (...values: unknown[]) => { for (const value of values) { const parsed = Number(value); if (Number.isFinite(parsed)) return parsed } return 0 }
  const total = num(meta?.total, meta?.totalItems, root?.total, data?.total, count)
  return { total, page: num(meta?.page, meta?.currentPage, page) || page, totalPages: num(meta?.totalPages, meta?.pages) || Math.max(1, Math.ceil(total / limit)) }
}

const displayDate = (value: string) => {
  if (!value) return 'Not provided'
  const date = new Date(value); return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString()
}

export default function SuperAdminProgramsPage() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<Filters>(emptyFilters)
  const [applied, setApplied] = useState<Filters>(emptyFilters)
  const [page, setPage] = useState(1); const [limit, setLimit] = useState(20)
  const [programs, setPrograms] = useState<ProgramRow[]>([])
  const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 })
  const [isLoading, setIsLoading] = useState(true); const [error, setError] = useState<string | null>(null)
  const [reloadToken, setReloadToken] = useState(0); const [busyId, setBusyId] = useState<string | null>(null)

  const query = useMemo(() => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) })
    Object.entries(applied).forEach(([key, value]) => { if (value && value !== 'all') params.set(key, value) })
    return params.toString()
  }, [applied, limit, page])

  useEffect(() => {
    let mounted = true
    void (async () => {
      setIsLoading(true); setError(null)
      try {
        const response = await apiClient.get<unknown>(`/admin/programs?${query}`, { cache: 'no-store' })
        if (!mounted) return
        const mapped = extractPrograms(response).map(mapProgram).filter((program): program is ProgramRow => Boolean(program))
        setPrograms(mapped); setPagination(paginationFrom(response, page, limit, mapped.length))
      } catch (loadError) {
        if (!mounted) return
        setPrograms([]); setError(loadError instanceof ApiError || loadError instanceof Error ? loadError.message : 'Unable to load programs.')
      } finally { if (mounted) setIsLoading(false) }
    })()
    return () => { mounted = false }
  }, [limit, page, query, reloadToken])

  const update = (field: keyof Filters, value: string) => setFilters((current) => ({ ...current, [field]: value }))
  const applyFilters = () => { setPage(1); setApplied(filters) }
  const reset = () => { setFilters(emptyFilters); setApplied(emptyFilters); setPage(1) }

  const moderate = async (program: ProgramRow) => {
    const moderationStatus = program.moderationStatus.toUpperCase() === 'ARCHIVED' ? 'ACTIVE' : 'ARCHIVED'
    setBusyId(program.id)
    try {
      await apiClient.patch(`/admin/programs/${encodeURIComponent(program.id)}/moderation`, { moderationStatus })
      setPrograms((current) => current.map((item) => item.id === program.id ? { ...item, moderationStatus } : item))
      toast({ title: `Program ${moderationStatus === 'ARCHIVED' ? 'archived' : 'reactivated'}` })
    } catch (actionError) { toast({ title: 'Moderation failed', description: actionError instanceof ApiError || actionError instanceof Error ? actionError.message : 'Request failed.', variant: 'destructive' }) }
    finally { setBusyId(null) }
  }

  const remove = async (program: ProgramRow) => {
    if (!window.confirm(`Delete “${program.title}”? This cannot be undone.`)) return
    setBusyId(program.id)
    try {
      await apiClient.delete(`/admin/programs/${encodeURIComponent(program.id)}`)
      toast({ title: 'Program deleted' }); setReloadToken((value) => value + 1)
    } catch (actionError) { toast({ title: 'Delete failed', description: actionError instanceof ApiError || actionError instanceof Error ? actionError.message : 'Request failed.', variant: 'destructive' }) }
    finally { setBusyId(null) }
  }

  return <div className='w-full'><DashboardHeader title='Programs' description='Review and moderate every platform program' /><div className='space-y-5 p-4 sm:p-6'>
    <Card><CardHeader><CardTitle className='text-base'>Filters</CardTitle></CardHeader><CardContent className='space-y-4'><div className='grid gap-3 sm:grid-cols-2 lg:grid-cols-4'>
      <div className='space-y-1'><Label>Search</Label><Input value={filters.search} onChange={(e) => update('search', e.target.value)} placeholder='Program title' /></div>
      <div className='space-y-1'><Label>Published</Label><Select value={filters.isPublished} onValueChange={(v) => update('isPublished', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='all'>All</SelectItem><SelectItem value='true'>Published</SelectItem><SelectItem value='false'>Unpublished</SelectItem></SelectContent></Select></div>
      <div className='space-y-1'><Label>Moderation</Label><Select value={filters.moderationStatus} onValueChange={(v) => update('moderationStatus', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='all'>All</SelectItem><SelectItem value='ACTIVE'>Active</SelectItem><SelectItem value='ARCHIVED'>Archived</SelectItem></SelectContent></Select></div>
      <div className='space-y-1'><Label>Sector</Label><Input value={filters.sector} onChange={(e) => update('sector', e.target.value)} placeholder='e.g. technology' /></div>
      <div className='space-y-1'><Label>Created by</Label><Input value={filters.createdBy} onChange={(e) => update('createdBy', e.target.value)} placeholder='Trainer ID' /></div>
      <div className='space-y-1'><Label>Category ID</Label><Input value={filters.categoryId} onChange={(e) => update('categoryId', e.target.value)} /></div>
      <div className='space-y-1'><Label>Level ID</Label><Input value={filters.experienceLevelId} onChange={(e) => update('experienceLevelId', e.target.value)} /></div>
      <div className='space-y-1'><Label>Format ID</Label><Input value={filters.formatId} onChange={(e) => update('formatId', e.target.value)} /></div>
      <div className='space-y-1'><Label>Minimum price</Label><Input type='number' min='0' value={filters.minPrice} onChange={(e) => update('minPrice', e.target.value)} /></div>
      <div className='space-y-1'><Label>Maximum price</Label><Input type='number' min={filters.minPrice || '0'} value={filters.maxPrice} onChange={(e) => update('maxPrice', e.target.value)} /></div>
      <div className='space-y-1'><Label>Created from</Label><Input type='date' value={filters.createdFrom} onChange={(e) => update('createdFrom', e.target.value)} /></div>
      <div className='space-y-1'><Label>Created to</Label><Input type='date' min={filters.createdFrom || undefined} value={filters.createdTo} onChange={(e) => update('createdTo', e.target.value)} /></div>
      <div className='space-y-1'><Label>Sort by</Label><Select value={filters.sortBy} onValueChange={(v) => update('sortBy', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{['title','price','startDate','createdAt','updatedAt'].map((v) => <SelectItem key={v} value={v}>{v}</SelectItem>)}</SelectContent></Select></div>
      <div className='space-y-1'><Label>Order</Label><Select value={filters.sortOrder} onValueChange={(v) => update('sortOrder', v)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value='asc'>Ascending</SelectItem><SelectItem value='desc'>Descending</SelectItem></SelectContent></Select></div>
    </div><div className='flex gap-2'><Button onClick={applyFilters}><Search className='mr-2 h-4 w-4' />Apply</Button><Button variant='outline' onClick={reset}>Reset</Button></div></CardContent></Card>
    <Card><CardHeader className='flex-row items-center justify-between'><CardTitle className='flex items-center gap-2'><BookOpen className='h-5 w-5' />Programs <Badge variant='secondary'>{pagination.total}</Badge></CardTitle><Select value={String(limit)} onValueChange={(v) => { setLimit(Number(v)); setPage(1) }}><SelectTrigger className='w-24'><SelectValue /></SelectTrigger><SelectContent><SelectItem value='10'>10</SelectItem><SelectItem value='20'>20</SelectItem><SelectItem value='50'>50</SelectItem></SelectContent></Select></CardHeader><CardContent>
      {error ? <div className='rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-700'>{error}</div> : isLoading ? <p className='py-8 text-center text-sm text-gray-500'>Loading programs...</p> : programs.length === 0 ? <p className='py-8 text-center text-sm text-gray-500'>No programs match these filters.</p> : <div className='overflow-x-auto'><table className='w-full text-sm'><thead><tr className='border-b text-left text-gray-500'><th className='p-3'>Program</th><th className='p-3'>Details</th><th className='p-3'>Status</th><th className='p-3'>Dates</th><th className='p-3 text-right'>Actions</th></tr></thead><tbody>{programs.map((program) => <tr key={program.id} className='border-b last:border-0'><td className='p-3'><p className='font-medium'>{program.title}</p><p className='text-xs text-gray-500'>{program.trainer}</p></td><td className='p-3'><p>{program.category}</p><p className='text-xs text-gray-500'>{program.format} · {program.price === null ? 'No price' : `₦${program.price.toLocaleString()}`}</p></td><td className='p-3'><div className='flex flex-wrap gap-1'><Badge variant={program.isPublished ? 'default' : 'secondary'}>{program.isPublished ? 'Published' : 'Draft'}</Badge><Badge variant='outline'>{program.moderationStatus}</Badge></div></td><td className='whitespace-nowrap p-3'>{displayDate(program.startDate)} - {displayDate(program.endDate)}</td><td className='p-3'><div className='flex justify-end gap-2'><Button size='sm' variant='outline' disabled={busyId === program.id} onClick={() => void moderate(program)}><Archive className='mr-2 h-4 w-4' />{program.moderationStatus.toUpperCase() === 'ARCHIVED' ? 'Activate' : 'Archive'}</Button><Button size='icon' variant='outline' disabled={busyId === program.id} onClick={() => void remove(program)}><Trash2 className='h-4 w-4 text-red-600' /></Button></div></td></tr>)}</tbody></table></div>}
      <div className='mt-4 flex items-center justify-between'><p className='text-xs text-gray-500'>Page {pagination.page} of {pagination.totalPages}</p><div className='flex gap-2'><Button size='sm' variant='outline' disabled={page <= 1 || isLoading} onClick={() => setPage((v) => v - 1)}>Previous</Button><Button size='sm' variant='outline' disabled={page >= pagination.totalPages || isLoading} onClick={() => setPage((v) => v + 1)}>Next</Button></div></div>
    </CardContent></Card>
  </div></div>
}

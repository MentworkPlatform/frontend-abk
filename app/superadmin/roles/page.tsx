import { DashboardHeader } from '@/components/dashboard-header'
import { AccessResourceManager } from '@/components/superadmin/access-resource-manager'

export default function SuperAdminRolesPage() {
  return <div><DashboardHeader title='Roles' description='Create and manage system roles' /><div className='p-4 sm:p-6'><AccessResourceManager resource='roles' singularLabel='Role' /></div></div>
}

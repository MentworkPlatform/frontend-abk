import { DashboardHeader } from '@/components/dashboard-header'
import { AccessResourceManager } from '@/components/superadmin/access-resource-manager'

export default function SuperAdminPermissionsPage() {
  return <div><DashboardHeader title='Permissions' description='Create and manage system permissions' /><div className='p-4 sm:p-6'><AccessResourceManager resource='permissions' singularLabel='Permission' /></div></div>
}

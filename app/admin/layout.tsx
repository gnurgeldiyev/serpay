import { auth } from '@/lib/auth-wrapper'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminBreadcrumb } from '@/components/admin/AdminBreadcrumb'
import { ToastProvider } from '@/contexts/toast-context'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Get session for displaying user info (middleware already handles auth)
  const session = await auth()

  return (
    <ToastProvider>
      <div className="min-h-screen bg-background">
        <AdminSidebar userName={session?.name} />
        
        {/* Main content */}
        <div className="lg:pl-72">
          {/* Top bar */}
          <header className="sticky top-0 z-30 border-b bg-background/80 backdrop-blur-lg">
            <div className="px-6 py-4">
              <AdminBreadcrumb />
            </div>
          </header>
          
          {/* Page content */}
          <main className="p-6">
            <div className="mx-auto max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ToastProvider>
  )
}
import MobileNav from '@/components/shared/MobileNav'
import Sidebar from '@/components/shared/Sidebar'

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="root flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Mobile Navigation */}
      <MobileNav />

      {/* Main Content Area */}
      <div className="root-container flex-1  lg:ml-0 mt-16">
        <div className="wrapper">
          {children}
        </div>
      </div>
    </main>
  )
}

export default Layout

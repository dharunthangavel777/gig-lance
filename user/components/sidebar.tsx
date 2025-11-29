"use client"

import { Home, Bookmark, FileText, User, PlusCircle, LayoutGrid, Users, CheckCircle, Star, LogOut } from "lucide-react"

interface SidebarProps {
  isOpen: boolean
  onClose: () => void
  currentPage: string
  onNavigate: (page: string) => void
  isClient: boolean
  isAdmin: boolean
  onLogout: () => void
}

export default function Sidebar({
  isOpen,
  onClose,
  currentPage,
  onNavigate,
  isClient,
  isAdmin,
  onLogout,
}: SidebarProps) {
  const navItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "saved", label: "Saved Jobs", icon: Bookmark },
    { id: "applications", label: "My Applications", icon: FileText },
    { id: "profile", label: "Profile", icon: User },
  ]

  const clientItems = [
    { id: "post-job", label: "Post a Job", icon: PlusCircle },
    { id: "my-posts", label: "My Job Posts", icon: LayoutGrid },
  ]

  const adminItems = [
    { id: "admin-clients", label: "Client Requests", icon: Users },
    { id: "admin-jobs", label: "Job Approvals", icon: CheckCircle },
    { id: "admin-badges", label: "Badge Requests", icon: Star },
  ]

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-gray-200 
        flex flex-col z-50 transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
      `}
      >
        <div className="p-5 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center text-xl font-bold">
            G
          </div>
          <span className="text-xl font-bold text-gray-900">Giglance</span>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`
                flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-1
                text-left font-medium transition-all
                ${currentPage === item.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
              `}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}

          {isClient && (
            <>
              <div className="h-px bg-gray-200 my-4" />
              <span className="text-xs font-semibold uppercase text-gray-400 px-4 tracking-wide">Client Dashboard</span>
              {clientItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-1
                    text-left font-medium transition-all mt-2
                    ${currentPage === item.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}

          {isAdmin && (
            <>
              <div className="h-px bg-gray-200 my-4" />
              <span className="text-xs font-semibold uppercase text-gray-400 px-4 tracking-wide">Admin Panel</span>
              {adminItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex items-center gap-3 w-full px-4 py-3 rounded-xl mb-1
                    text-left font-medium transition-all mt-2
                    ${currentPage === item.id ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100"}
                  `}
                >
                  <item.icon size={20} />
                  <span>{item.label}</span>
                </button>
              ))}
            </>
          )}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={onLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-gray-100 text-gray-600 font-medium transition-all hover:bg-red-500 hover:text-white"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}

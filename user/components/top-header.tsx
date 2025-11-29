"use client"

import { Menu, Search, Bell } from "lucide-react"
import type { User } from "firebase/auth"
import type { UserProfile } from "./giglance-platform"

interface TopHeaderProps {
  onMenuToggle: () => void
  user: User
  userProfile: UserProfile | null
  isClient: boolean
  isAdmin: boolean
}

export default function TopHeader({ onMenuToggle, user, userProfile, isClient, isAdmin }: TopHeaderProps) {
  const role = isAdmin ? "Admin" : isClient ? "Client" : "Freelancer"

  return (
    <header className="h-[70px] bg-white border-b border-gray-200 flex items-center px-4 md:px-8 gap-6 sticky top-0 z-30">
      <button onClick={onMenuToggle} className="lg:hidden text-gray-600">
        <Menu size={24} />
      </button>

      <div className="flex-1 max-w-md hidden md:flex items-center gap-3 bg-gray-100 px-5 py-3 rounded-full">
        <Search size={20} className="text-gray-400" />
        <input
          type="text"
          placeholder="Search jobs, skills, companies..."
          className="flex-1 border-none bg-transparent text-sm outline-none text-gray-700 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <button className="relative w-11 h-11 rounded-xl border-none bg-gray-100 flex items-center justify-center text-gray-600 transition-all hover:bg-gray-200">
          <Bell size={20} />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-semibold flex items-center justify-center">
            0
          </span>
        </button>

        <div className="flex items-center gap-3 py-1.5 pl-1.5 pr-4 bg-gray-100 rounded-full">
          <img
            src={user.photoURL || "/placeholder.svg?height=36&width=36"}
            alt="User"
            className="w-9 h-9 rounded-full object-cover"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-sm font-semibold text-gray-800">
              {userProfile?.name || user.displayName || "User"}
            </span>
            <span className="text-xs text-gray-500">{role}</span>
          </div>
        </div>
      </div>
    </header>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { Briefcase, Pencil, Shield } from "lucide-react"
import type { User } from "firebase/auth"
import type { UserProfile } from "../giglance-platform"

interface ProfilePageProps {
  user: User
  userProfile: UserProfile | null
  onUpdateProfile: (data: Partial<UserProfile>) => Promise<void>
  onBecomeClient: () => void
  isClient: boolean
  clientStatus: string | null
  isAdmin: boolean
  onNavigateAdmin: () => void
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function ProfilePage({
  user,
  userProfile,
  onUpdateProfile,
  onBecomeClient,
  isClient,
  clientStatus,
  isAdmin,
  onNavigateAdmin,
  showToast,
}: ProfilePageProps) {
  const [formData, setFormData] = useState({
    name: userProfile?.name || "",
    professionalRole: userProfile?.professionalRole || "",
    location: userProfile?.location || "",
    phone: userProfile?.phone || "",
    skills: userProfile?.skills?.join(", ") || "",
    experience: userProfile?.experience || "",
    portfolio: userProfile?.portfolio?.join("\n") || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await onUpdateProfile({
        name: formData.name,
        professionalRole: formData.professionalRole,
        location: formData.location,
        phone: formData.phone,
        skills: formData.skills
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        experience: formData.experience,
        portfolio: formData.portfolio
          .split("\n")
          .map((s) => s.trim())
          .filter(Boolean),
      })
      showToast("Profile updated successfully!", "success")
    } catch {
      showToast("Failed to update profile", "error")
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
        <p className="text-gray-500">Manage your professional profile</p>
      </div>

      <div className="grid gap-6">
        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start mb-8 pb-6 border-b border-gray-200">
            <div className="relative">
              <img
                src={user.photoURL || "/placeholder.svg?height=100&width=100"}
                alt="Profile"
                className="w-24 h-24 rounded-2xl object-cover"
              />
              <button className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-600 border-2 border-white rounded-full flex items-center justify-center text-white">
                <Pencil size={14} />
              </button>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{userProfile?.name || "Your Name"}</h2>
              <p className="text-gray-500 text-sm">{userProfile?.professionalRole || "Freelancer"}</p>
              <p className="text-gray-500 text-sm">{userProfile?.location || "Add your location"}</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Shield size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Admin Dashboard</h3>
            <p className="text-gray-500 mb-5">
              Access the admin dashboard to manage users, jobs, and client requests.
            </p>
            <button
              onClick={onNavigateAdmin}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all flex items-center justify-center gap-2 mx-auto"
            >
              <Shield size={16} /> Go to Admin Dashboard
            </button>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-xl p-8">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Professional Role</label>
                <input
                  type="text"
                  value={formData.professionalRole}
                  onChange={(e) => setFormData({ ...formData, professionalRole: e.target.value })}
                  placeholder="e.g., Full Stack Developer"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Mumbai, India"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                />
              </div>
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Skills (comma separated)</label>
              <input
                type="text"
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                placeholder="e.g., JavaScript, React, Node.js, Python"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">Experience</label>
              <textarea
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                rows={4}
                placeholder="Describe your work experience..."
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Portfolio URLs (one per line)</label>
              <textarea
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                rows={3}
                placeholder="https://github.com/username&#10;https://yourportfolio.com"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
              />
            </div>
            <div className="flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>

        {!isClient && !clientStatus && (
          <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4 text-blue-600">
              <Briefcase size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Want to Hire Talent?</h3>
            <p className="text-gray-500 mb-5">
              Become a client to post jobs and find the perfect freelancers for your projects.
            </p>
            <button
              onClick={onBecomeClient}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-all"
            >
              Become a Client
            </button>
          </div>
        )}

        {!isClient && clientStatus && (
          <div className="bg-white border border-gray-200 rounded-xl p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Client Status</h3>
            <div
              className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-medium mb-3
              ${clientStatus === "pending" ? "bg-amber-500 text-white" : ""}
              ${clientStatus === "approved" ? "bg-green-500 text-white" : ""}
              ${clientStatus === "rejected" ? "bg-red-500 text-white" : ""}
            `}
            >
              <span>{clientStatus === "pending" ? "⏳" : clientStatus === "approved" ? "✓" : "✗"}</span>
              <span>
                {clientStatus === "pending"
                  ? "Pending Approval"
                  : clientStatus === "approved"
                    ? "Approved"
                    : "Rejected"}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {clientStatus === "pending"
                ? "Your client verification request is being reviewed by our admin team."
                : clientStatus === "rejected"
                  ? "Your request was rejected. Please contact support for more information."
                  : "You are now approved as a client!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useEffect, useState, useCallback } from "react"
import {
  Users,
  Briefcase,
  UserCheck,
  ClipboardCheck,
  Award,
  Settings,
  Menu,
  Bell,
  LogOut,
  Search,
  Check,
  X,
  Clock,
  Star,
  Crown,
  CheckCircle,
  Inbox,
} from "lucide-react"

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3qwPX8LkL-VNM3jVHzuCHQDkhjtNRZvY",
  authDomain: "gig-lance.firebaseapp.com",
  databaseURL: "https://gig-lance-default-rtdb.firebaseio.com",
  projectId: "gig-lance",
  storageBucket: "gig-lance.appspot.com",
  messagingSenderId: "921742476464",
  appId: "1:921742476464:web:50b0ea2be127ffa388a775",
}

const ADMIN_EMAILS = ["admin@giglance.com", "dharuncod@gmail.com"]

// DEMO_DATA removed

type ViewType = "dashboard" | "users" | "jobs" | "clientVerification" | "jobApproval" | "badgeRequest" | "settings"

interface User {
  displayName: string
  email: string
  role: string
  photoURL: string | null
  createdAt: number
  badges: Record<string, boolean>
}

interface Toast {
  message: string
  type: "success" | "error" | "info" | "warning"
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  // isDemoMode removed
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [activeView, setActiveView] = useState<ViewType>("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [showDomainHelp, setShowDomainHelp] = useState(false)

  // Data states
  const [stats, setStats] = useState({ totalUsers: 0, activeJobs: 0, pendingRequests: 0, featuredBadges: 0 })
  const [pendingCounts, setPendingCounts] = useState({ clients: 0, jobs: 0, badges: 0 })
  const [users, setUsers] = useState<Record<string, User>>({})
  const [jobs, setJobs] = useState<Record<string, any>>({})
  const [clientRequests, setClientRequests] = useState<Record<string, any>>({})
  const [jobApprovals, setJobApprovals] = useState<Record<string, any>>({})
  const [badgeRequests, setBadgeRequests] = useState<Record<string, any>>({})
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState("all")
  const [jobStatusFilter, setJobStatusFilter] = useState("all")
  const [dateTime, setDateTime] = useState("")

  // Firebase refs
  const [firebase, setFirebase] = useState<any>(null)
  const [auth, setAuth] = useState<any>(null)
  const [database, setDatabase] = useState<any>(null)

  // Initialize Firebase
  useEffect(() => {
    const loadFirebase = async () => {
      if (typeof window !== "undefined") {
        const fb = (window as any).firebase
        if (fb && !fb.apps?.length) {
          fb.initializeApp(firebaseConfig)
        }
        if (fb) {
          setFirebase(fb)
          setAuth(fb.auth())
          setDatabase(fb.database())
        }
      }
    }

    // Load Firebase scripts
    const script1 = document.createElement("script")
    script1.src = "https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js"
    script1.onload = () => {
      const script2 = document.createElement("script")
      script2.src = "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth-compat.js"
      script2.onload = () => {
        const script3 = document.createElement("script")
        script3.src = "https://www.gstatic.com/firebasejs/9.6.0/firebase-database-compat.js"
        script3.onload = loadFirebase
        document.head.appendChild(script3)
      }
      document.head.appendChild(script2)
    }
    document.head.appendChild(script1)
  }, [])

  // Auth state listener
  useEffect(() => {
    if (!auth) return
    const unsubscribe = auth.onAuthStateChanged((user: any) => {
      if (user && ADMIN_EMAILS.includes(user.email)) {
        setCurrentUser(user)
        setIsAuthenticated(true)
      } else if (user) {
        showToastMessage("You are not authorized to access the admin panel", "error")
        auth.signOut()
      }
    })
    return () => unsubscribe()
  }, [auth])

  // Update date/time
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date()
      setDateTime(
        now.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
      )
    }
    updateDateTime()
    const interval = setInterval(updateDateTime, 60000)
    return () => clearInterval(interval)
  }, [])

  // Load data when authenticated
  useEffect(() => {
    // isDemoMode check removed
    if (isAuthenticated) {
      loadAllData()
    }
  }, [isAuthenticated, activeView])

  const showToastMessage = (message: string, type: Toast["type"]) => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 5000)
  }

  const dbRef = useCallback(
    (path: string) => {
      return database?.ref(path)
    },
    [database],
  )

  const loadAllData = async () => {
    if (!database) return

    // Load users
    const usersSnap = await dbRef("users")?.once("value")
    const usersData = usersSnap?.val() || {}
    setUsers(usersData)

    // Load jobs
    const jobsSnap = await dbRef("jobs")?.once("value")
    const jobsData = jobsSnap?.val() || {}
    setJobs(jobsData)

    // Load pending client requests
    const clientSnap = await dbRef("clientRequests")?.orderByChild("status").equalTo("pending").once("value")
    const clientData = clientSnap?.val() || {}
    setClientRequests(clientData)

    // Load pending job approvals from jobs path with status "pending"
    const jobAppSnap = await dbRef("jobs")?.orderByChild("status").equalTo("pending").once("value")
    const jobAppData = jobAppSnap?.val() || {}
    setJobApprovals(jobAppData)

    // Load pending badge requests
    const badgeSnap = await dbRef("badgeRequests")?.orderByChild("status").equalTo("pending").once("value")
    const badgeData = badgeSnap?.val() || {}
    setBadgeRequests(badgeData)

    // Calculate stats
    const activeJobsCount = Object.values(jobsData).filter((j: any) => j.status === "active").length
    let badgeCount = 0
    Object.values(usersData).forEach((u: any) => {
      if (u.badges) badgeCount += Object.keys(u.badges).length
    })

    setStats({
      totalUsers: Object.keys(usersData).length,
      activeJobs: activeJobsCount,
      pendingRequests: Object.keys(clientData).length + Object.keys(jobAppData).length + Object.keys(badgeData).length,
      featuredBadges: badgeCount,
    })

    setPendingCounts({
      clients: Object.keys(clientData).length,
      jobs: Object.keys(jobAppData).length,
      badges: Object.keys(badgeData).length,
    })
  }

  const handleGoogleSignIn = async () => {
    if (!auth) {
      setLoginError("Firebase is not initialized. Please wait and try again.")
      return
    }
    try {
      const provider = new firebase.auth.GoogleAuthProvider()
      await auth.signInWithPopup(provider)
    } catch (error: any) {
      if (error.code === "auth/unauthorized-domain") {
        setLoginError("This domain is not authorized for Firebase OAuth.")
        setShowDomainHelp(true)
      } else {
        setLoginError(error.message)
      }
    }
  }

  const handleSignOut = () => {
    auth?.signOut().then(() => {
      setIsAuthenticated(false)
      setCurrentUser(null)
      showToastMessage("Signed out successfully", "success")
    })
  }

  const handleRequest = async (type: string, id: string, action: "approve" | "reject") => {
    if (!confirm(`Are you sure you want to ${action} this ${type} request?`)) return

    const timestamp = Date.now()

    try {
      if (type === "client") {
        const updates: any = {}
        updates[`clientRequests/${id}/status`] = action
        updates[`clientRequests/${id}/processedAt`] = timestamp
        if (action === "approve") {
          const req = clientRequests[id]
          if (req?.userId) {
            updates[`users/${req.userId}/role`] = "client"
            // Also update the clients path with the approval status
            updates[`clients/${req.userId}/status`] = "approved"
            updates[`clients/${req.userId}/approvedAt`] = timestamp
          }
        } else if (action === "reject") {
          const req = clientRequests[id]
          if (req?.userId) {
            // Also update the clients path with the rejection status
            updates[`clients/${req.userId}/status`] = "rejected"
            updates[`clients/${req.userId}/rejectedAt`] = timestamp
          }
        }
        await database.ref().update(updates)
      } else if (type === "job") {
        const updates: any = {}
        if (action === "approve") {
          const job = jobApprovals[id]
          updates[`jobs/${id}/status`] = "active"
          updates[`jobs/${id}/approvedAt`] = timestamp
        } else if (action === "reject") {
          updates[`jobs/${id}/status`] = "rejected"
          updates[`jobs/${id}/rejectedAt`] = timestamp
        }
        await database.ref().update(updates)
      } else if (type === "badge") {
        const updates: any = {}
        if (action === "approve") {
          const req = badgeRequests[id]
          if (req?.jobId) {
            updates[`jobs/${req.jobId}/featured`] = true
            updates[`jobs/${req.jobId}/featuredAt`] = timestamp
          }
          updates[`badgeRequests/${id}/status`] = "approved"
          updates[`badgeRequests/${id}/approvedAt`] = timestamp
        } else if (action === "reject") {
          updates[`badgeRequests/${id}/status`] = "rejected"
          updates[`badgeRequests/${id}/rejectedAt`] = timestamp
        }
        await database.ref().update(updates)
      }
      showToastMessage(`${type} request ${action}d successfully`, "success")
      loadAllData()
    } catch (error: any) {
      showToastMessage("Error: " + error.message, "error")
    }
  }

  const formatDate = (timestamp: number) => {
    if (!timestamp) return "N/A"
    return new Date(timestamp).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })
  }

  const formatRelativeTime = (timestamp: number) => {
    if (!timestamp) return "N/A"
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return formatDate(timestamp)
  }

  const filteredUsers = Object.entries(users).filter(([_, user]) => {
    const matchesSearch =
      !userSearch ||
      user.displayName?.toLowerCase().includes(userSearch.toLowerCase()) ||
      user.email?.toLowerCase().includes(userSearch.toLowerCase())
    const matchesRole = userRoleFilter === "all" || user.role === userRoleFilter
    return matchesSearch && matchesRole
  })

  const filteredJobs = Object.entries(jobs).filter(([_, job]) => {
    return jobStatusFilter === "all" || job.status === jobStatusFilter
  })

  // Login Screen - Removed isDemoMode check
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">GigLance Admin</h1>
            <p className="text-gray-500 mt-2">Sign in to access the admin dashboard</p>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 hover:shadow-md transition-all"
          >
            <img
              src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
              alt="Google"
              className="w-5 h-5"
            />
            Sign in with Google
          </button>

          {loginError && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{loginError}</p>
              {showDomainHelp && (
                <div className="mt-3 text-xs text-gray-600">
                  <p className="font-medium mb-1">To fix this:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>
                      Go to{" "}
                      <a
                        href="https://console.firebase.google.com"
                        target="_blank"
                        className="text-blue-600 hover:underline"
                        rel="noreferrer"
                      >
                        Firebase Console
                      </a>
                    </li>
                    <li>Select your project (gig-lance)</li>
                    <li>Go to Authentication &gt; Settings &gt; Authorized domains</li>
                    <li>Add this domain to the list</li>
                  </ol>
                  <p className="mt-2 p-2 bg-gray-100 rounded font-mono text-xs break-all">
                    {typeof window !== "undefined" ? window.location.hostname : ""}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    )
  }

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Briefcase className="w-5 h-5" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { id: "jobs", label: "Jobs", icon: <Briefcase className="w-5 h-5" /> },
    {
      id: "clientVerification",
      label: "Client Verification",
      icon: <UserCheck className="w-5 h-5" />,
      badge: pendingCounts.clients,
    },
    {
      id: "jobApproval",
      label: "Job Approvals",
      icon: <ClipboardCheck className="w-5 h-5" />,
      badge: pendingCounts.jobs,
    },
    { id: "badgeRequest", label: "Badge Requests", icon: <Award className="w-5 h-5" />, badge: pendingCounts.badges },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white flex-shrink-0 h-full fixed z-20 transition-all duration-300 ${sidebarCollapsed ? "w-20" : "w-64"}`}
      >
        <div className="p-4 border-b border-gray-700 flex items-center">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          {!sidebarCollapsed && <h1 className="text-xl font-bold ml-3">GigLance Admin</h1>}
        </div>
        <nav className="mt-4 flex-1">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as ViewType)}
              className={`w-full flex items-center px-4 py-3 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors ${
                activeView === item.id ? "bg-gray-700 text-white border-l-4 border-blue-500" : ""
              }`}
            >
              {item.icon}
              {!sidebarCollapsed && (
                <>
                  <span className="ml-3 flex-1 text-left">{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{item.badge}</span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>
        {/* Removed user info and sign out button from footer as it's moved to header */}
      </div>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? "ml-20" : "ml-64"}`}>
        {/* Header */}
        <header className="bg-white shadow-sm h-16 flex items-center justify-between px-6 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="text-xl font-semibold text-gray-800 capitalize">
              {activeView === "clientVerification"
                ? "Client Verification"
                : activeView === "jobApproval"
                  ? "Job Approvals"
                  : activeView === "badgeRequest"
                    ? "Badge Requests"
                    : activeView}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{dateTime}</span>
            <button className="p-2 hover:bg-gray-100 rounded-lg relative">
              <Bell className="w-5 h-5 text-gray-600" />
              {stats.pendingRequests > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {stats.pendingRequests}
                </span>
              )}
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {currentUser?.displayName?.charAt(0) || "A"}
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">{currentUser?.displayName || "Admin"}</p>
                <p className="text-sm text-gray-500">{currentUser?.email}</p>
              </div>
              <button onClick={handleSignOut} className="p-2 hover:bg-gray-100 rounded-lg" title="Sign Out">
                <LogOut className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </header>

        {/* Toast Notification */}
        {toast && (
          <div
            className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-green-500 text-white"
                : toast.type === "error"
                  ? "bg-red-500 text-white"
                  : toast.type === "warning"
                    ? "bg-yellow-500 text-white"
                    : "bg-blue-500 text-white"
            }`}
          >
            {toast.type === "success" && <Check className="w-5 h-5" />}
            {toast.type === "error" && <X className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 p-6 overflow-auto">
          {/* Dashboard View */}
          {activeView === "dashboard" && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Total Users</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{stats.totalUsers}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Active Jobs</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{stats.activeJobs}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Briefcase className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Pending Requests</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{stats.pendingRequests}</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-orange-600" />
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-500">Featured Badges</p>
                      <p className="text-3xl font-bold text-gray-800 mt-1">{stats.featuredBadges}</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Award className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button
                    onClick={() => setActiveView("clientVerification")}
                    className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors text-left"
                  >
                    <UserCheck className="w-6 h-6 text-blue-600 mb-2" />
                    <p className="font-medium text-gray-800">Verify Clients</p>
                    <p className="text-sm text-gray-500">{pendingCounts.clients} pending</p>
                  </button>
                  <button
                    onClick={() => setActiveView("jobApproval")}
                    className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors text-left"
                  >
                    <ClipboardCheck className="w-6 h-6 text-green-600 mb-2" />
                    <p className="font-medium text-gray-800">Approve Jobs</p>
                    <p className="text-sm text-gray-500">{pendingCounts.jobs} pending</p>
                  </button>
                  <button
                    onClick={() => setActiveView("badgeRequest")}
                    className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors text-left"
                  >
                    <Award className="w-6 h-6 text-purple-600 mb-2" />
                    <p className="font-medium text-gray-800">Badge Requests</p>
                    <p className="text-sm text-gray-500">{pendingCounts.badges} pending</p>
                  </button>
                  <button
                    onClick={() => setActiveView("users")}
                    className="p-4 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors text-left"
                  >
                    <Users className="w-6 h-6 text-orange-600 mb-2" />
                    <p className="font-medium text-gray-800">Manage Users</p>
                    <p className="text-sm text-gray-500">{stats.totalUsers} total</p>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Users View */}
          {activeView === "users" && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={userRoleFilter}
                    onChange={(e) => setUserRoleFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Roles</option>
                    <option value="freelancer">Freelancer</option>
                    <option value="client">Client</option>
                  </select>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badges</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-6 py-12 text-center">
                          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No users found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(([id, user]) => (
                        <tr key={id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium">
                                {user.displayName?.charAt(0) || "U"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{user.displayName || "Unknown"}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.role === "client" ? "bg-purple-100 text-purple-700" : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {user.role || "freelancer"}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-1">
                              {user.badges?.verified && (
                                <span title="Verified" className="p-1 bg-green-100 rounded">
                                  <CheckCircle className="w-4 h-4 text-green-600" />
                                </span>
                              )}
                              {user.badges?.topRated && (
                                <span title="Top Rated" className="p-1 bg-yellow-100 rounded">
                                  <Star className="w-4 h-4 text-yellow-600" />
                                </span>
                              )}
                              {user.badges?.expert && (
                                <span title="Expert" className="p-1 bg-purple-100 rounded">
                                  <Crown className="w-4 h-4 text-purple-600" />
                                </span>
                              )}
                              {!user.badges ||
                                (Object.keys(user.badges).length === 0 && (
                                  <span className="text-gray-400 text-sm">None</span>
                                ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Jobs View */}
          {activeView === "jobs" && (
            <div className="bg-white rounded-xl shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <select
                  value={jobStatusFilter}
                  onChange={(e) => setJobStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Job</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Budget</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posted</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredJobs.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <Inbox className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                          <p className="text-gray-500">No jobs found</p>
                        </td>
                      </tr>
                    ) : (
                      filteredJobs.map(([id, job]) => (
                        <tr key={id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-gray-800">{job.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{job.description}</p>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{job.client || job.postedByName || "Unknown"}</td>
                          <td className="px-6 py-4 text-gray-600">${job.budget}</td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                job.status === "active"
                                  ? "bg-green-100 text-green-700"
                                  : job.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {job.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">{formatDate(job.createdAt)}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Client Verification View */}
          {activeView === "clientVerification" && (
            <div className="space-y-4">
              {Object.keys(clientRequests).length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No pending client requests</h3>
                  <p className="text-gray-400 mt-1">All client verification requests have been processed</p>
                </div>
              ) : (
                Object.entries(clientRequests).map(([id, req]) => (
                  <div key={id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                          <UserCheck className="w-6 h-6 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{req.userName}</h3>
                          <p className="text-sm text-gray-500">{req.userEmail}</p>
                          {req.companyName && (
                            <p className="text-sm text-gray-600 mt-1">
                              <span className="font-medium">Company:</span> {req.companyName}
                            </p>
                          )}
                          {req.companyDescription && (
                            <p className="text-sm text-gray-500 mt-1">{req.companyDescription}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{formatRelativeTime(req.timestamp)}</span>
                        <button
                          onClick={() => handleRequest("client", id, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequest("client", id, "reject")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Job Approval View */}
          {activeView === "jobApproval" && (
            <div className="space-y-4">
              {Object.keys(jobApprovals).length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No pending job approvals</h3>
                  <p className="text-gray-400 mt-1">All job posts have been reviewed</p>
                </div>
              ) : (
                Object.entries(jobApprovals).map(([id, job]) => (
                  <div key={id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 text-lg">{job.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                          Posted by {job.clientName} | {job.company}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          Budget: ₹{job.minPay} - ₹{job.maxPay}
                        </p>
                        {job.category && (
                          <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                            {job.category}
                          </span>
                        )}
                        {job.skills && (
                          <p className="text-sm text-gray-600 mt-2">
                            <strong>Skills:</strong> {job.skills.join(", ")}
                          </p>
                        )}
                        {job.description && <p className="text-gray-600 mt-3">{job.description}</p>}
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{formatRelativeTime(job.createdAt)}</span>
                        <button
                          onClick={() => handleRequest("job", id, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Publish
                        </button>
                        <button
                          onClick={() => handleRequest("job", id, "reject")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Badge Requests View */}
          {activeView === "badgeRequest" && (
            <div className="space-y-4">
              {Object.keys(badgeRequests).length === 0 ? (
                <div className="bg-white rounded-xl p-12 shadow-sm text-center">
                  <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-600">No pending badge requests</h3>
                  <p className="text-gray-400 mt-1">All badge requests have been processed</p>
                </div>
              ) : (
                Object.entries(badgeRequests).map(([id, req]) => (
                  <div key={id} className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-yellow-100">
                          <Star className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{req.jobTitle}</h3>
                          <p className="text-sm text-gray-500">Requested by: {req.clientName}</p>
                          <p className="text-sm mt-1">
                            <span className="font-medium text-gray-600">Job ID:</span> {req.jobId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-400">{formatRelativeTime(req.requestedAt)}</span>
                        <button
                          onClick={() => handleRequest("badge", id, "approve")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <Check className="w-4 h-4" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleRequest("badge", id, "reject")}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Settings View */}
          {activeView === "settings" && (
            <div className="bg-white rounded-xl p-6 shadow-sm max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-800 mb-6">Admin Settings</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Current Admin</h4>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-lg">
                      {currentUser?.displayName?.charAt(0) || "A"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{currentUser?.displayName || "Admin"}</p>
                      <p className="text-sm text-gray-500">{currentUser?.email}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Authorized Admin Emails</h4>
                  <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                    {ADMIN_EMAILS.map((email) => (
                      <p key={email} className="text-sm text-gray-600 font-mono">
                        {email}
                      </p>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Firebase Project</h4>
                  <p className="text-sm text-gray-600 font-mono p-4 bg-gray-50 rounded-lg">
                    {firebaseConfig.projectId}
                  </p>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

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

// Declare firebase variable before using it
const firebase = window.firebase

// Initialize Firebase (using compat version loaded via CDN)
if (firebase && !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

// Firebase services
const auth = firebase ? firebase.auth() : null
const database = firebase ? firebase.database() : null

// Admin email whitelist
const ADMIN_EMAILS = ["admin@giglance.com", "dharuncod@gmail.com"]

let isDemoMode = false

const DEMO_DATA = {
  users: {
    user1: {
      displayName: "John Doe",
      email: "john@example.com",
      role: "freelancer",
      photoURL: null,
      createdAt: Date.now() - 86400000 * 30,
      badges: { verified: true },
    },
    user2: {
      displayName: "Jane Smith",
      email: "jane@example.com",
      role: "client",
      photoURL: null,
      createdAt: Date.now() - 86400000 * 20,
      badges: {},
    },
    user3: {
      displayName: "Bob Wilson",
      email: "bob@example.com",
      role: "freelancer",
      photoURL: null,
      createdAt: Date.now() - 86400000 * 10,
      badges: { topRated: true },
    },
    user4: {
      displayName: "Alice Brown",
      email: "alice@example.com",
      role: "client",
      photoURL: null,
      createdAt: Date.now() - 86400000 * 5,
      badges: {},
    },
    user5: {
      displayName: "Charlie Davis",
      email: "charlie@example.com",
      role: "freelancer",
      photoURL: null,
      createdAt: Date.now() - 86400000 * 2,
      badges: { expert: true, verified: true },
    },
  },
  jobs: {
    job1: {
      title: "Website Development",
      client: "Jane Smith",
      budget: "$500-1000",
      status: "active",
      createdAt: Date.now() - 86400000 * 5,
      description: "Build a modern e-commerce website",
    },
    job2: {
      title: "Mobile App UI Design",
      client: "Alice Brown",
      budget: "$300-500",
      status: "active",
      createdAt: Date.now() - 86400000 * 3,
      description: "Design UI for iOS fitness app",
    },
    job3: {
      title: "Logo Design",
      client: "Jane Smith",
      budget: "$100-200",
      status: "completed",
      createdAt: Date.now() - 86400000 * 15,
      description: "Create a minimalist logo",
    },
  },
  clientRequests: {
    req1: {
      userId: "user2",
      userName: "Jane Smith",
      email: "jane@example.com",
      status: "pending",
      timestamp: Date.now() - 86400000,
      businessName: "Jane's Boutique",
      reason: "Hiring freelancers for web projects",
    },
    req2: {
      userId: "user4",
      userName: "Alice Brown",
      email: "alice@example.com",
      status: "pending",
      timestamp: Date.now() - 3600000,
      businessName: "FitLife Apps",
      reason: "Need designers for mobile app",
    },
  },
  jobApprovals: {
    approval1: {
      title: "Backend API Development",
      clientId: "user2",
      clientName: "Jane Smith",
      budget: "$800-1500",
      status: "pending",
      timestamp: Date.now() - 7200000,
      description: "Build REST API for e-commerce",
    },
  },
  badgeRequests: {
    badge1: {
      userId: "user1",
      userName: "John Doe",
      badgeType: "expert",
      status: "pending",
      timestamp: Date.now() - 86400000 * 2,
      reason: "Completed 50+ projects with 5-star ratings",
    },
  },
}

// DOM Elements
const loginScreen = document.getElementById("loginScreen")
const adminPanel = document.getElementById("adminPanel")
const googleSignInBtn = document.getElementById("googleSignInBtn")
const demoModeBtn = document.getElementById("demoModeBtn")
const loginError = document.getElementById("loginError")
const loginErrorText = document.getElementById("loginErrorText")
const domainInstructions = document.getElementById("domainInstructions")
const currentDomainEl = document.getElementById("currentDomain")
const userPhoto = document.getElementById("userPhoto")
const userName = document.getElementById("userName")
const greetingName = document.getElementById("greetingName")
const signOutBtn = document.getElementById("signOutBtn")
const sidebarToggle = document.getElementById("sidebarToggle")
const sidebar = document.getElementById("sidebar")
const mainContent = document.getElementById("mainContent")
const toast = document.getElementById("toast")
const toastMessage = document.getElementById("toastMessage")
const toastIcon = document.getElementById("toastIcon")
const pageTitle = document.getElementById("pageTitle")

// Stats elements
const totalUsersEl = document.getElementById("totalUsers")
const activeJobsEl = document.getElementById("activeJobs")
const pendingRequestsEl = document.getElementById("pendingRequests")
const featuredBadgesEl = document.getElementById("featuredBadges")
const pendingClientRequests = document.getElementById("pendingClientRequests")
const pendingJobApprovals = document.getElementById("pendingJobApprovals")
const pendingBadgeRequests = document.getElementById("pendingBadgeRequests")

// Update current date/time
function updateDateTime() {
  const now = new Date()
  const options = { weekday: "short", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }
  const dateTimeEl = document.getElementById("currentDateTime")
  if (dateTimeEl) {
    dateTimeEl.textContent = now.toLocaleDateString("en-US", options)
  }
}
updateDateTime()
setInterval(updateDateTime, 60000)

function showLoginError(message, showDomainHelp = false) {
  if (loginError && loginErrorText) {
    loginErrorText.textContent = message
    loginError.classList.remove("hidden")

    if (showDomainHelp && domainInstructions && currentDomainEl) {
      domainInstructions.classList.remove("hidden")
      currentDomainEl.textContent = window.location.hostname
    } else if (domainInstructions) {
      domainInstructions.classList.add("hidden")
    }
  }
}

// Google Sign In
if (googleSignInBtn) {
  googleSignInBtn.addEventListener("click", () => {
    if (!auth) {
      showLoginError("Firebase is not initialized. Please use Demo Mode.")
      return
    }

    const provider = new firebase.auth.GoogleAuthProvider()
    auth
      .signInWithPopup(provider)
      .then((result) => {
        // Auth state change will handle the rest
      })
      .catch((error) => {
        if (error.code === "auth/unauthorized-domain") {
          showLoginError("This domain is not authorized for Firebase OAuth.", true)
        } else {
          showLoginError(error.message)
        }
      })
  })
}

if (demoModeBtn) {
  demoModeBtn.addEventListener("click", () => {
    isDemoMode = true
    if (loginScreen) loginScreen.classList.add("hidden")
    if (adminPanel) adminPanel.classList.remove("hidden")

    // Setup demo admin
    const demoUser = {
      displayName: "Demo Admin",
      email: "demo@giglance.com",
      photoURL: null,
      metadata: { lastSignInTime: new Date().toISOString() },
    }
    setupAdminDashboard(demoUser)
    showToast("Welcome to Demo Mode! Using sample data.", "info")
  })
}

// Check authentication state
if (auth) {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // Check if user is admin
      if (ADMIN_EMAILS.includes(user.email)) {
        // User is signed in and is admin
        if (loginScreen) loginScreen.classList.add("hidden")
        if (adminPanel) adminPanel.classList.remove("hidden")
        setupAdminDashboard(user)
      } else {
        // User is not authorized
        showToast("You are not authorized to access the admin panel", "error")
        showLoginError("You are not authorized to access the admin panel")
        auth.signOut()
      }
    } else {
      // User is signed out
      if (!isDemoMode) {
        if (loginScreen) loginScreen.classList.remove("hidden")
        if (adminPanel) adminPanel.classList.add("hidden")
      }
    }
  })
}

// Sign out function
function signOutUser() {
  if (isDemoMode) {
    isDemoMode = false
    if (loginScreen) loginScreen.classList.remove("hidden")
    if (adminPanel) adminPanel.classList.add("hidden")
    showToast("Exited demo mode", "info")
    return
  }

  if (auth) {
    auth
      .signOut()
      .then(() => {
        showToast("Signed out successfully", "success")
      })
      .catch((error) => {
        showToast("Error signing out: " + error.message, "error")
      })
  }
}

// Setup admin dashboard
function setupAdminDashboard(user) {
  // Set user info
  if (userPhoto) {
    userPhoto.src =
      user.photoURL ||
      "https://ui-avatars.com/api/?name=" +
        encodeURIComponent(user.displayName || "Admin") +
        "&background=3B82F6&color=fff"
  }
  if (userName) userName.textContent = user.displayName || "Admin"
  if (greetingName) greetingName.textContent = (user.displayName || "Admin").split(" ")[0]

  // Set admin info in settings
  const adminEmail = document.getElementById("adminEmail")
  const lastLogin = document.getElementById("lastLogin")
  if (adminEmail) adminEmail.textContent = user.email
  if (lastLogin) lastLogin.textContent = formatDate(user.metadata.lastSignInTime)

  // Load dashboard data
  loadDashboardData()

  // Setup event listeners
  setupEventListeners()

  // Setup real-time listeners
  setupRealtimeListeners()

  // Show dashboard view by default
  showView("dashboardView")
}

function dbRef(path) {
  if (isDemoMode) {
    return {
      once: (type) => {
        const pathParts = path.split("/")
        let data = DEMO_DATA
        for (const part of pathParts) {
          if (data && data[part]) {
            data = data[part]
          } else {
            data = null
            break
          }
        }
        return Promise.resolve({
          val: () => data,
          exists: () => data !== null,
        })
      },
      orderByChild: (child) => ({
        equalTo: (value) => ({
          once: (type) => {
            const pathParts = path.split("/")
            let data = DEMO_DATA
            for (const part of pathParts) {
              if (data && data[part]) {
                data = data[part]
              } else {
                data = {}
                break
              }
            }
            // Filter by child value
            const filtered = {}
            if (data) {
              Object.entries(data).forEach(([key, item]) => {
                if (item && item[child] === value) {
                  filtered[key] = item
                }
              })
            }
            return Promise.resolve({
              val: () => filtered,
              exists: () => Object.keys(filtered).length > 0,
            })
          },
        }),
      }),
      on: (event, callback) => {
        // For real-time listeners in demo mode, just call once
        const pathParts = path.split("/")
        let data = DEMO_DATA
        for (const part of pathParts) {
          if (data && data[part]) {
            data = data[part]
          } else {
            data = null
            break
          }
        }
        callback({ val: () => data })
      },
      update: (updates) => {
        // Handle updates in demo mode
        const pathParts = path.split("/")
        let target = DEMO_DATA
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!target[pathParts[i]]) target[pathParts[i]] = {}
          target = target[pathParts[i]]
        }
        const lastKey = pathParts[pathParts.length - 1]
        if (target[lastKey]) {
          Object.assign(target[lastKey], updates)
        }
        return Promise.resolve()
      },
      set: (value) => {
        const pathParts = path.split("/")
        let target = DEMO_DATA
        for (let i = 0; i < pathParts.length - 1; i++) {
          if (!target[pathParts[i]]) target[pathParts[i]] = {}
          target = target[pathParts[i]]
        }
        target[pathParts[pathParts.length - 1]] = value
        return Promise.resolve()
      },
    }
  }
  return database.ref(path)
}

// Load dashboard data - Updated to use dbRef helper
function loadDashboardData() {
  // Load users count
  dbRef("users")
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val()
      const userCount = users ? Object.keys(users).length : 0
      if (totalUsersEl) totalUsersEl.textContent = userCount
    })

  // Load pending client verification requests
  dbRef("clientRequests")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const requests = snapshot.val() || {}
      const count = Object.keys(requests).length
      if (pendingClientRequests) pendingClientRequests.textContent = count
      const clientVerificationCount = document.getElementById("clientVerificationCount")
      if (clientVerificationCount) clientVerificationCount.textContent = `${count} pending`

      updateBadge("pendingClientBadge", count)
      updateTotalPendingRequests()
      loadRecentActivity(requests)
    })

  // Load pending job approvals
  dbRef("jobApprovals")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const jobs = snapshot.val() || {}
      const count = Object.keys(jobs).length
      if (pendingJobApprovals) pendingJobApprovals.textContent = count
      const jobApprovalCount = document.getElementById("jobApprovalCount")
      if (jobApprovalCount) jobApprovalCount.textContent = `${count} pending`

      updateBadge("pendingJobBadge", count)
      updateTotalPendingRequests()
    })

  // Load pending badge requests
  dbRef("badgeRequests")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const badges = snapshot.val() || {}
      const count = Object.keys(badges).length
      if (pendingBadgeRequests) pendingBadgeRequests.textContent = count
      const badgeRequestCount = document.getElementById("badgeRequestCount")
      if (badgeRequestCount) badgeRequestCount.textContent = `${count} pending`

      updateBadge("pendingBadgeBadge", count)
      updateTotalPendingRequests()
    })

  // Load active jobs count
  dbRef("jobs")
    .orderByChild("status")
    .equalTo("active")
    .once("value")
    .then((snapshot) => {
      const jobs = snapshot.val() || {}
      if (activeJobsEl) activeJobsEl.textContent = Object.keys(jobs).length
    })

  // Load featured badges count
  dbRef("users")
    .once("value")
    .then((snapshot) => {
      const users = snapshot.val() || {}
      let badgeCount = 0
      Object.values(users).forEach((user) => {
        if (user.badges) {
          badgeCount += Object.keys(user.badges).length
        }
      })
      if (featuredBadgesEl) featuredBadgesEl.textContent = badgeCount
    })
}

// Update badge visibility
function updateBadge(badgeId, count) {
  const badge = document.getElementById(badgeId)
  if (badge) {
    if (count > 0) {
      badge.textContent = count
      badge.classList.remove("hidden")
    } else {
      badge.classList.add("hidden")
    }
  }
}

// Update total pending requests
function updateTotalPendingRequests() {
  const clientCount = Number.parseInt(pendingClientRequests?.textContent || 0)
  const jobCount = Number.parseInt(pendingJobApprovals?.textContent || 0)
  const badgeCount = Number.parseInt(pendingBadgeRequests?.textContent || 0)
  const total = clientCount + jobCount + badgeCount

  if (pendingRequestsEl) {
    pendingRequestsEl.textContent = total
  }

  // Update notification badge
  const notifBadge = document.getElementById("notificationBadge")
  if (notifBadge) {
    if (total > 0) {
      notifBadge.textContent = total > 99 ? "99+" : total
      notifBadge.classList.remove("hidden")
      notifBadge.classList.add("flex")
    } else {
      notifBadge.classList.add("hidden")
      notifBadge.classList.remove("flex")
    }
  }
}

// Show a specific view
function showView(viewId) {
  // Hide all views
  document.querySelectorAll('[id$="View"]').forEach((view) => {
    view.classList.add("hidden")
  })

  // Show the requested view
  const view = document.getElementById(viewId)
  if (view) {
    view.classList.remove("hidden")
  }

  // Update menu active state
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.classList.remove("active")
    if (item.getAttribute("data-view") === viewId) {
      item.classList.add("active")
    }
  })

  // Update page title
  const titles = {
    dashboardView: "Dashboard",
    usersView: "Users Management",
    jobsView: "Jobs Management",
    clientVerificationView: "Client Verification",
    jobApprovalView: "Job Approvals",
    badgeRequestView: "Badge Requests",
    settingsView: "Settings",
    clientRequestsView: "Client Requests",
  }
  if (pageTitle) pageTitle.textContent = titles[viewId] || "Dashboard"

  // Update URL hash
  const hash = viewId.replace("View", "")
  window.history.pushState({}, "", "#" + hash.toLowerCase())

  // Load data for the view
  switch (viewId) {
    case "dashboardView":
      loadDashboardData()
      break
    case "usersView":
      loadUsers()
      break
    case "jobsView":
      loadJobs()
      break
    case "clientVerificationView":
      loadClientVerificationRequests()
      break
    case "jobApprovalView":
      loadJobApprovalRequests()
      break
    case "badgeRequestView":
      loadBadgeRequests()
      break
    case "clientRequestsView":
      loadAllClientRequests()
      break
  }
}

// Format date
function formatDate(timestamp) {
  if (!timestamp) return "N/A"

  const date = new Date(timestamp)
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Format relative time
function formatRelativeTime(timestamp) {
  if (!timestamp) return "N/A"

  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(timestamp)
}

// Show toast notification
function showToast(message, type = "info") {
  if (!toast || !toastMessage) return

  toastMessage.textContent = message

  // Reset classes
  toast.className = "fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-3"

  switch (type) {
    case "success":
      toast.classList.add("bg-green-600", "text-white")
      if (toastIcon) toastIcon.className = "fas fa-check-circle"
      break
    case "error":
      toast.classList.add("bg-red-600", "text-white")
      if (toastIcon) toastIcon.className = "fas fa-exclamation-circle"
      break
    case "warning":
      toast.classList.add("bg-amber-500", "text-white")
      if (toastIcon) toastIcon.className = "fas fa-exclamation-triangle"
      break
    default:
      toast.classList.add("bg-gray-800", "text-white")
      if (toastIcon) toastIcon.className = "fas fa-info-circle"
  }

  toast.classList.remove("hidden")

  setTimeout(hideToast, 5000)
}

// Hide toast notification
function hideToast() {
  if (toast) toast.classList.add("hidden")
}

// Setup event listeners
function setupEventListeners() {
  // Sign out button
  if (signOutBtn) signOutBtn.addEventListener("click", signOutUser)

  // Sidebar toggle
  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", () => {
      if (sidebar) sidebar.classList.toggle("collapsed")
      if (mainContent) mainContent.classList.toggle("expanded")
    })
  }

  // Menu item clicks
  document.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.preventDefault()
      const view = item.getAttribute("data-view")
      if (view) {
        showView(view)
      }
    })
  })

  // Handle back/forward navigation
  window.addEventListener("popstate", () => {
    const hash = window.location.hash.substring(1)
    if (hash) {
      const viewId = hash.charAt(0).toUpperCase() + hash.slice(1) + "View"
      showView(viewId)
    } else {
      showView("dashboardView")
    }
  })

  // User search
  const userSearchInput = document.getElementById("userSearchInput")
  if (userSearchInput) {
    userSearchInput.addEventListener("input", (e) => {
      const roleFilter = document.getElementById("userRoleFilter")
      filterUsers(e.target.value, roleFilter ? roleFilter.value : "all")
    })
  }

  // User role filter
  const userRoleFilter = document.getElementById("userRoleFilter")
  if (userRoleFilter) {
    userRoleFilter.addEventListener("change", (e) => {
      const searchInput = document.getElementById("userSearchInput")
      filterUsers(searchInput ? searchInput.value : "", e.target.value)
    })
  }

  // Job status filter
  const jobStatusFilter = document.getElementById("jobStatusFilter")
  if (jobStatusFilter) {
    jobStatusFilter.addEventListener("change", (e) => {
      loadJobs(e.target.value)
    })
  }
}

// Load recent activity
function loadRecentActivity(requests) {
  const recentActivity = document.getElementById("recentActivity")
  if (!recentActivity) return

  if (!requests || Object.keys(requests).length === 0) {
    recentActivity.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-inbox text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">No recent activity</p>
            </div>
        `
    return
  }

  // Convert to array and sort by timestamp (newest first)
  const requestsArray = Object.entries(requests)
    .map(([id, request]) => ({
      id,
      ...request,
    }))
    .sort((a, b) => b.timestamp - a.timestamp)

  const recentItems = requestsArray.slice(0, 5)

  recentActivity.innerHTML = ""

  recentItems.forEach((item) => {
    const activityItem = document.createElement("div")
    activityItem.className = "flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors"
    activityItem.innerHTML = `
            <div class="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <i class="fas fa-user-plus text-blue-600"></i>
            </div>
            <div class="ml-4 flex-1">
                <p class="text-sm font-medium text-gray-900">New client verification request</p>
                <p class="text-sm text-gray-500">${item.userName || "Unknown user"}</p>
                <p class="text-xs text-gray-400 mt-1">${formatRelativeTime(item.timestamp)}</p>
            </div>
            <button onclick="viewClientRequest('${item.id}')" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                View
            </button>
        `
    recentActivity.appendChild(activityItem)
  })
}

// Load users - Updated to use dbRef
let allUsers = {}
function loadUsers() {
  const container = document.getElementById("usersList")
  if (!container) return

  container.innerHTML = '<div class="flex items-center justify-center py-8"><div class="spinner"></div></div>'

  dbRef("users")
    .once("value")
    .then((snapshot) => {
      allUsers = snapshot.val() || {}
      renderUsers(allUsers)
    })
}

function renderUsers(users) {
  const container = document.getElementById("usersList")
  if (!container) return

  if (!users || Object.keys(users).length === 0) {
    container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-users text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">No users found</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th class="pb-3">User</th>
                        <th class="pb-3">Role</th>
                        <th class="pb-3">Badges</th>
                        <th class="pb-3">Joined</th>
                        <th class="pb-3">Actions</th>
                    </tr>
                </thead>
                <tbody id="usersTableBody" class="divide-y divide-gray-100">
                </tbody>
            </table>
        </div>
    `

  const tbody = document.getElementById("usersTableBody")
  if (!tbody) return

  Object.entries(users).forEach(([userId, user]) => {
    const row = document.createElement("tr")
    row.className = "hover:bg-gray-50"

    const badges = user.badges
      ? Object.keys(user.badges)
          .map(
            (badge) =>
              `<span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">${badge}</span>`,
          )
          .join(" ")
      : '<span class="text-gray-400 text-sm">None</span>'

    const roleColors = {
      admin: "bg-red-100 text-red-800",
      client: "bg-blue-100 text-blue-800",
      freelancer: "bg-green-100 text-green-800",
    }

    row.innerHTML = `
            <td class="py-4">
                <div class="flex items-center">
                    <img src="${user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || "User")}&background=random`}" 
                         alt="${user.displayName}" 
                         class="w-10 h-10 rounded-full">
                    <div class="ml-3">
                        <p class="font-medium text-gray-900">${user.displayName || "Unknown"}</p>
                        <p class="text-sm text-gray-500">${user.email || "No email"}</p>
                    </div>
                </div>
            </td>
            <td class="py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColors[user.role] || "bg-gray-100 text-gray-800"}">
                    ${user.role || "freelancer"}
                </span>
            </td>
            <td class="py-4">${badges}</td>
            <td class="py-4 text-sm text-gray-500">${formatDate(user.createdAt)}</td>
            <td class="py-4">
                <button onclick="editUserRole('${userId}', '${user.role || "freelancer"}')" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                    Edit Role
                </button>
            </td>
        `

    tbody.appendChild(row)
  })
}

function filterUsers(search, role) {
  let filtered = { ...allUsers }

  if (search) {
    const searchLower = search.toLowerCase()
    filtered = Object.fromEntries(
      Object.entries(filtered).filter(
        ([_, user]) =>
          (user.displayName || "").toLowerCase().includes(searchLower) ||
          (user.email || "").toLowerCase().includes(searchLower),
      ),
    )
  }

  if (role && role !== "all") {
    filtered = Object.fromEntries(Object.entries(filtered).filter(([_, user]) => user.role === role))
  }

  renderUsers(filtered)
}

// Edit user role
function editUserRole(userId, currentRole) {
  const newRole = prompt(
    `Enter new role for user (current: ${currentRole})\nOptions: freelancer, client, admin`,
    currentRole,
  )

  if (newRole && ["freelancer", "client", "admin"].includes(newRole)) {
    if (isDemoMode) {
      if (DEMO_DATA.users[userId]) {
        DEMO_DATA.users[userId].role = newRole
      }
      showToast("User role updated (Demo)", "success")
      loadUsers()
      return
    }

    dbRef(`users/${userId}/role`)
      .set(newRole)
      .then(() => {
        showToast("User role updated successfully", "success")
        loadUsers()
      })
      .catch((error) => {
        showToast("Error updating role: " + error.message, "error")
      })
  } else if (newRole) {
    showToast("Invalid role. Please use: freelancer, client, or admin", "error")
  }
}

// Load jobs - Updated to use dbRef
function loadJobs(statusFilter = "all") {
  const container = document.getElementById("jobsList")
  if (!container) return

  container.innerHTML = '<div class="flex items-center justify-center py-8"><div class="spinner"></div></div>'

  dbRef("jobs")
    .once("value")
    .then((snapshot) => {
      let jobs = snapshot.val() || {}

      if (statusFilter !== "all") {
        jobs = Object.fromEntries(Object.entries(jobs).filter(([_, job]) => job.status === statusFilter))
      }

      renderJobs(jobs)
    })
}

function renderJobs(jobs) {
  const container = document.getElementById("jobsList")
  if (!container) return

  if (!jobs || Object.keys(jobs).length === 0) {
    container.innerHTML = `
            <div class="text-center py-8">
                <i class="fas fa-briefcase text-4xl text-gray-300 mb-3"></i>
                <p class="text-gray-500">No jobs found</p>
            </div>
        `
    return
  }

  container.innerHTML = `
        <div class="overflow-x-auto">
            <table class="w-full">
                <thead>
                    <tr class="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th class="pb-3">Title</th>
                        <th class="pb-3">Client</th>
                        <th class="pb-3">Budget</th>
                        <th class="pb-3">Status</th>
                        <th class="pb-3">Posted</th>
                    </tr>
                </thead>
                <tbody id="jobsTableBody" class="divide-y divide-gray-100">
                </tbody>
            </table>
        </div>
    `

  const tbody = document.getElementById("jobsTableBody")
  if (!tbody) return

  Object.entries(jobs).forEach(([jobId, job]) => {
    const row = document.createElement("tr")
    row.className = "hover:bg-gray-50"

    const statusColors = {
      active: "bg-green-100 text-green-800",
      completed: "bg-blue-100 text-blue-800",
      cancelled: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
    }

    row.innerHTML = `
            <td class="py-4">
                <div class="flex flex-col">
                    <p class="font-medium text-gray-900">${job.title || "Untitled Job"}</p>
                    <p class="text-sm text-gray-500">${job.description ? job.description.substring(0, 60) + "..." : "No description"}</p>
                </div>
            </td>
            <td class="py-4 text-sm text-gray-500">${job.client || "Unknown"}</td>
            <td class="py-4 text-sm font-medium text-gray-700">$${job.budget || "N/A"}</td>
            <td class="py-4">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[job.status] || "bg-gray-100 text-gray-800"}">
                    ${job.status || "unknown"}
                </span>
            </td>
            <td class="py-4 text-sm text-gray-500">${formatDate(job.createdAt)}</td>
        `
    tbody.appendChild(row)
  })
}

// Client Verification Functions
// Load client verification requests - Updated to use dbRef
function loadClientVerificationRequests() {
  const container = document.getElementById("clientVerificationList")
  if (!container) return

  container.innerHTML = '<div class="flex items-center justify-center py-8"><div class="spinner"></div></div>'

  dbRef("clientRequests")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const requests = snapshot.val() || {}
      renderClientVerificationRequests(requests)
    })
}

function renderClientVerificationRequests(requests) {
  const container = document.getElementById("clientVerificationList")
  if (!container) return

  if (!requests || Object.keys(requests).length === 0) {
    container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-check-circle text-5xl text-green-300 mb-4"></i>
                <p class="text-gray-500 text-lg">All caught up!</p>
                <p class="text-gray-400 text-sm">No pending client verification requests</p>
            </div>
        `
    return
  }

  container.innerHTML = '<div class="space-y-4"></div>'
  const list = container.firstChild

  Object.entries(requests).forEach(([requestId, request]) => {
    const card = createVerificationCard(requestId, request)
    list.appendChild(card)
  })
}

function createVerificationCard(requestId, request) {
  const card = document.createElement("div")
  card.className = "border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
  card.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex items-start gap-4">
                <img src="${request.userPhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(request.userName || "User")}&background=random`}" 
                     alt="${request.userName}" 
                     class="w-12 h-12 rounded-full">
                <div>
                    <h4 class="font-semibold text-gray-800">${request.userName || "Unknown User"}</h4>
                    <p class="text-sm text-gray-500">${request.userEmail || "No email"}</p>
                    <div class="mt-3 space-y-1">
                        <p class="text-sm"><span class="font-medium text-gray-700">Company:</span> ${request.companyName || "N/A"}</p>
                        <p class="text-sm"><span class="font-medium text-gray-700">Website:</span> ${request.companyWebsite ? `<a href="${request.companyWebsite}" target="_blank" class="text-blue-600 hover:underline">${request.companyWebsite}</a>` : "N/A"}</p>
                        <p class="text-sm"><span class="font-medium text-gray-700">Description:</span> ${request.companyDescription || "N/A"}</p>
                    </div>
                    <p class="text-xs text-gray-400 mt-3"><i class="fas fa-clock mr-1"></i>${formatRelativeTime(request.timestamp)}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="handleRequest('client', '${requestId}', 'reject')" 
                        class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <i class="fas fa-times mr-1"></i>Reject
                </button>
                <button onclick="handleRequest('client', '${requestId}', 'approve')" 
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-check mr-1"></i>Approve
                </button>
            </div>
        </div>
    `
  return card
}

// Job Approval Functions
// Load job approval requests - Updated to use dbRef
function loadJobApprovalRequests() {
  const container = document.getElementById("jobApprovalList")
  if (!container) return

  container.innerHTML = '<div class="flex items-center justify-center py-8"><div class="spinner"></div></div>'

  dbRef("jobApprovals")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const jobs = snapshot.val() || {}
      renderJobApprovalRequests(jobs)
    })
}

function renderJobApprovalRequests(jobs) {
  const container = document.getElementById("jobApprovalList")
  if (!container) return

  if (!jobs || Object.keys(jobs).length === 0) {
    container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-clipboard-check text-5xl text-green-300 mb-4"></i>
                <p class="text-gray-500 text-lg">All caught up!</p>
                <p class="text-gray-400 text-sm">No pending job approvals</p>
            </div>
        `
    return
  }

  container.innerHTML = '<div class="space-y-4"></div>'
  const list = container.firstChild

  Object.entries(jobs).forEach(([jobId, job]) => {
    const card = createJobApprovalCard(jobId, job)
    list.appendChild(card)
  })
}

function createJobApprovalCard(jobId, job) {
  const card = document.createElement("div")
  card.className = "border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
  card.innerHTML = `
        <div class="flex justify-between items-start">
            <div>
                <h4 class="font-semibold text-gray-800 text-lg">${job.jobTitle || "Untitled Job"}</h4>
                <p class="text-sm text-gray-500">Posted by: ${job.postedByName || "Unknown"}</p>
                <div class="mt-3 grid grid-cols-2 gap-4">
                    <div>
                        <p class="text-xs text-gray-400">Budget</p>
                        <p class="text-sm font-medium text-gray-700">$${job.budget || "Not specified"}</p>
                    </div>
                    <div>
                        <p class="text-xs text-gray-400">Category</p>
                        <p class="text-sm font-medium text-gray-700">${job.category || "General"}</p>
                    </div>
                </div>
                <div class="mt-3">
                    <p class="text-xs text-gray-400">Description</p>
                    <p class="text-sm text-gray-600 mt-1">${job.description || "No description provided"}</p>
                </div>
                <p class="text-xs text-gray-400 mt-3"><i class="fas fa-clock mr-1"></i>${formatRelativeTime(job.timestamp)}</p>
            </div>
            <div class="flex gap-2">
                <button onclick="handleRequest('job', '${jobId}', 'reject')" 
                        class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <i class="fas fa-times mr-1"></i>Reject
                </button>
                <button onclick="handleRequest('job', '${jobId}', 'approve')" 
                        class="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors">
                    <i class="fas fa-check mr-1"></i>Approve
                </button>
            </div>
        </div>
    `
  return card
}

// Badge Request Functions
// Load badge requests - Updated to use dbRef
function loadBadgeRequests() {
  const container = document.getElementById("badgeRequestList")
  if (!container) return

  container.innerHTML = '<div class="flex items-center justify-center py-8"><div class="spinner"></div></div>'

  dbRef("badgeRequests")
    .orderByChild("status")
    .equalTo("pending")
    .once("value")
    .then((snapshot) => {
      const requests = snapshot.val() || {}
      renderBadgeRequests(requests)
    })
}

function renderBadgeRequests(requests) {
  const container = document.getElementById("badgeRequestList")
  if (!container) return

  if (!requests || Object.keys(requests).length === 0) {
    container.innerHTML = `
            <div class="text-center py-12">
                <i class="fas fa-award text-5xl text-amber-300 mb-4"></i>
                <p class="text-gray-500 text-lg">All caught up!</p>
                <p class="text-gray-400 text-sm">No pending badge requests</p>
            </div>
        `
    return
  }

  container.innerHTML = '<div class="space-y-4"></div>'
  const list = container.firstChild

  Object.entries(requests).forEach(([requestId, request]) => {
    const card = createBadgeRequestCard(requestId, request)
    list.appendChild(card)
  })
}

function createBadgeRequestCard(requestId, request) {
  const badgeIcons = {
    verified: "fa-check-circle text-blue-600",
    topRated: "fa-star text-amber-500",
    expert: "fa-crown text-purple-600",
  }

  const card = document.createElement("div")
  card.className = "border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
  card.innerHTML = `
        <div class="flex justify-between items-start">
            <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <i class="fas ${badgeIcons[request.badgeType] || "fa-medal text-amber-600"} text-xl"></i>
                </div>
                <div>
                    <h4 class="font-semibold text-gray-800">${request.userName || "Unknown User"}</h4>
                    <p class="text-sm text-gray-500">${request.userEmail || "No email"}</p>
                    <div class="mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                            ${request.badgeType || "Unknown"} Badge
                        </span>
                    </div>
                    <p class="text-sm text-gray-600 mt-2"><span class="font-medium">Reason:</span> ${request.reason || "No reason provided"}</p>
                    <p class="text-xs text-gray-400 mt-2"><i class="fas fa-clock mr-1"></i>${formatRelativeTime(request.timestamp)}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <button onclick="handleRequest('badge', '${requestId}', 'reject')" 
                        class="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors">
                    <i class="fas fa-times mr-1"></i>Reject
                </button>
                <button onclick="handleRequest('badge', '${requestId}', 'approve')" 
                        class="px-4 py-2 text-sm font-medium text-white bg-amber-600 rounded-lg hover:bg-amber-700 transition-colors">
                    <i class="fas fa-award mr-1"></i>Award
                </button>
            </div>
        </div>
    `
  return card
}

// Handle approval/rejection of requests
function handleRequest(type, id, action) {
  const confirmMessage =
    action === "approve"
      ? `Are you sure you want to ${action} this ${type} request?`
      : `Are you sure you want to ${action} this ${type} request?`

  if (!confirm(confirmMessage)) return

  const timestamp = Date.now()
  const adminId = auth && auth.currentUser ? auth.currentUser.uid : "demo_admin"

  switch (type) {
    case "client":
      handleClientRequest(id, action, timestamp, adminId)
      break
    case "job":
      handleJobRequest(id, action, timestamp, adminId)
      break
    case "badge":
      handleBadgeRequest(id, action, timestamp, adminId)
      break
  }
}

function handleClientRequest(requestId, action, timestamp, adminId) {
  if (isDemoMode) {
    if (DEMO_DATA.clientRequests[requestId]) {
      DEMO_DATA.clientRequests[requestId].status = action
    }
    showToast(`Client request ${action}d (Demo)`, "success")
    loadClientVerificationRequests()
    loadDashboardData()
    return
  }

  database
    .ref(`clientRequests/${requestId}`)
    .once("value")
    .then((snapshot) => {
      const request = snapshot.val()
      if (!request) {
        showToast("Request not found", "error")
        return
      }

      const updates = {}
      updates[`clientRequests/${requestId}/status`] = action
      updates[`clientRequests/${requestId}/processedAt`] = timestamp
      updates[`clientRequests/${requestId}/processedBy`] = adminId

      if (action === "approve" && request.userId) {
        updates[`users/${request.userId}/role`] = "client"
      }

      return database.ref().update(updates)
    })
    .then(() => {
      showToast(`Client request ${action}d successfully`, "success")
      loadClientVerificationRequests()
      loadDashboardData()
    })
    .catch((error) => {
      showToast("Error: " + error.message, "error")
    })
}

function handleJobRequest(jobId, action, timestamp, adminId) {
  if (isDemoMode) {
    if (DEMO_DATA.jobApprovals[jobId]) {
      DEMO_DATA.jobApprovals[jobId].status = action
    }
    showToast(`Job request ${action}d (Demo)`, "success")
    loadJobApprovalRequests()
    loadDashboardData()
    return
  }

  database
    .ref(`jobApprovals/${jobId}`)
    .once("value")
    .then((snapshot) => {
      const jobData = snapshot.val()
      if (!jobData) {
        showToast("Job not found", "error")
        return
      }

      const updates = {}
      updates[`jobApprovals/${jobId}/status`] = action
      updates[`jobApprovals/${jobId}/processedAt`] = timestamp
      updates[`jobApprovals/${jobId}/processedBy`] = adminId

      if (action === "approve") {
        updates[`jobs/${jobId}`] = {
          ...jobData,
          title: jobData.jobTitle,
          status: "active",
          approvedAt: timestamp,
          approvedBy: adminId,
          createdAt: jobData.timestamp, // Assuming timestamp exists in jobApprovals
        }
      }

      return database.ref().update(updates)
    })
    .then(() => {
      showToast(`Job ${action == "approve" ? "published" : "rejected"}.`, "success")
      loadJobApprovalRequests()
      loadDashboardData()
    })
    .catch((error) => {
      showToast("Error: " + error.message, "error")
    })
}

function handleBadgeRequest(requestId, action, timestamp, adminId) {
  if (isDemoMode) {
    if (DEMO_DATA.badgeRequests[requestId]) {
      DEMO_DATA.badgeRequests[requestId].status = action
    }
    if (DEMO_DATA.users[requestId.replace("badge", "user")]) {
      // Simple mapping for demo
      const badgeType = DEMO_DATA.badgeRequests[requestId]?.badgeType
      if (badgeType && action === "approve") {
        if (!DEMO_DATA.users[requestId.replace("badge", "user")].badges) {
          DEMO_DATA.users[requestId.replace("badge", "user")].badges = {}
        }
        DEMO_DATA.users[requestId.replace("badge", "user")].badges[badgeType] = true
      }
    }
    showToast(`Badge request ${action}d (Demo)`, "success")
    loadBadgeRequests()
    loadDashboardData()
    return
  }

  database
    .ref(`badgeRequests/${requestId}`)
    .once("value")
    .then((snapshot) => {
      const request = snapshot.val()
      if (!request) {
        showToast("Request not found", "error")
        return
      }

      const updates = {}
      updates[`badgeRequests/${requestId}/status`] = action
      updates[`badgeRequests/${requestId}/processedAt`] = timestamp
      updates[`badgeRequests/${requestId}/processedBy`] = adminId

      if (action === "approve" && request.userId && request.badgeType) {
        updates[`users/${request.userId}/badges/${request.badgeType}`] = true
      }

      return database.ref().update(updates)
    })
    .then(() => {
      showToast(`Badge ${action === "approve" ? "awarded" : "request rejected"}`, "success")
      loadBadgeRequests()
      loadDashboardData()
    })
    .catch((error) => {
      showToast("Error: " + error.message, "error")
    })
}

// View client request (legacy support)
function viewClientRequest(requestId) {
  showView("clientVerificationView")
}

// Load all client requests (legacy)
function loadAllClientRequests() {
  loadClientVerificationRequests()
}

// Approve/Reject request (legacy support)
function approveRequest(requestId) {
  handleRequest("client", requestId, "approve")
}

function rejectRequest(requestId) {
  handleRequest("client", requestId, "reject")
}

// Set up real-time listeners
function setupRealtimeListeners() {
  // Client verification requests
  dbRef("clientRequests")
    .orderByChild("status")
    .equalTo("pending")
    .on("value", (snapshot) => {
      const requests = snapshot.val() || {}
      const count = Object.keys(requests).length
      if (pendingClientRequests) pendingClientRequests.textContent = count
      const clientVerificationCount = document.getElementById("clientVerificationCount")
      if (clientVerificationCount) clientVerificationCount.textContent = `${count} pending`
      updateBadge("pendingClientBadge", count)
      updateTotalPendingRequests()
    })

  // Job approvals
  dbRef("jobApprovals")
    .orderByChild("status")
    .equalTo("pending")
    .on("value", (snapshot) => {
      const jobs = snapshot.val() || {}
      const count = Object.keys(jobs).length
      if (pendingJobApprovals) pendingJobApprovals.textContent = count
      const jobApprovalCount = document.getElementById("jobApprovalCount")
      if (jobApprovalCount) jobApprovalCount.textContent = `${count} pending`
      updateBadge("pendingJobBadge", count)
      updateTotalPendingRequests()
    })

  // Badge requests
  dbRef("badgeRequests")
    .orderByChild("status")
    .equalTo("pending")
    .on("value", (snapshot) => {
      const requests = snapshot.val() || {}
      const count = Object.keys(requests).length
      if (pendingBadgeRequests) pendingBadgeRequests.textContent = count
      const badgeRequestCount = document.getElementById("badgeRequestCount")
      if (badgeRequestCount) badgeRequestCount.textContent = `${count} pending`
      updateBadge("pendingBadgeBadge", count)
      updateTotalPendingRequests()
    })
}

// Confirmation modal functions
function showConfirmModal(title, message, onConfirm) {
  const confirmTitle = document.getElementById("confirmTitle")
  const confirmMessage = document.getElementById("confirmMessage")
  const confirmBtn = document.getElementById("confirmBtn")
  const confirmModal = document.getElementById("confirmModal")

  if (confirmTitle) confirmTitle.textContent = title
  if (confirmMessage) confirmMessage.textContent = message
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      onConfirm()
      closeConfirmModal()
    }
  }
  if (confirmModal) confirmModal.classList.remove("hidden")
}

function closeConfirmModal() {
  const confirmModal = document.getElementById("confirmModal")
  if (confirmModal) confirmModal.classList.add("hidden")
}

// Make functions available globally
window.showView = showView
window.viewClientRequest = viewClientRequest
window.approveRequest = approveRequest
window.rejectRequest = rejectRequest
window.hideToast = hideToast
window.handleRequest = handleRequest
window.editUserRole = editUserRole
window.closeConfirmModal = closeConfirmModal

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const hash = window.location.hash.substring(1)
  if (hash) {
    const viewId = hash.charAt(0).toUpperCase() + hash.slice(1) + "View"
    showView(viewId)
  } else {
    // If no hash, default to dashboard, but only if auth is available or demo mode is active
    if (auth || isDemoMode) {
      showView("dashboardView")
    }
  }
})

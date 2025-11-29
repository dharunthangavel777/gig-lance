"use client"

import { useState, useEffect, useRef } from "react"
import { initializeApp, getApps } from "firebase/app"
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth"
import { getDatabase, ref, set, get, push, update, remove, onValue } from "firebase/database"
import type { Job, Application, UserProfile } from "@/components/giglance-platform"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Initialize Firebase only once
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0]
const auth = getAuth(app)
const database = getDatabase(app)

export function useFirebase(adminEmails: string[]) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [clientStatus, setClientStatus] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [jobs, setJobs] = useState<Job[]>([])
  const [savedJobs, setSavedJobs] = useState<string[]>([])
  const [userApplications, setUserApplications] = useState<Application[]>([])
  const [myJobPosts, setMyJobPosts] = useState<Job[]>([])
  const [clientRequests, setClientRequests] = useState<any[]>([])
  const [pendingJobs, setPendingJobs] = useState<Job[]>([])
  const [badgeRequests, setBadgeRequests] = useState<any[]>([])
  const [authError, setAuthError] = useState<string | null>(null)
  const isSigningIn = useRef(false)
  const pendingPromiseRef = useRef<Promise<any> | null>(null)

  // Auth state listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)
      if (user) {
        await loadUserData(user)
      } else {
        setUserProfile(null)
        setIsClient(false)
        setIsAdmin(false)
      }
      setLoading(false)
    })
    return () => unsubscribe()
  }, [])

  // Load user data
  const loadUserData = async (user: User) => {
    try {
      // Load or create user profile
      const profileRef = ref(database, `users/${user.uid}`)
      const profileSnap = await get(profileRef)

      let profile = profileSnap.val()
      if (!profile) {
        profile = {
          uid: user.uid,
          email: user.email,
          name: user.displayName || "User",
          photoURL: user.photoURL || "",
          role: "freelancer",
          createdAt: Date.now(),
        }
        await set(profileRef, profile)
      }
      setUserProfile(profile)

      // Check admin status
      setIsAdmin(adminEmails.includes(user.email || ""))

      // Load saved jobs
      const savedRef = ref(database, `users/${user.uid}/savedJobs`)
      const savedSnap = await get(savedRef)
      setSavedJobs(savedSnap.val() ? Object.keys(savedSnap.val()) : [])

      // Load user applications
      const appsRef = ref(database, `users/${user.uid}/applications`)
      const appsSnap = await get(appsRef)
      const apps: Application[] = []
      appsSnap.forEach((child) => {
        apps.push({ id: child.key!, ...child.val() })
      })
      setUserApplications(apps)
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  // Real-time listener for client status changes
  useEffect(() => {
    if (!currentUser) return

    const clientRef = ref(database, `clients/${currentUser.uid}`)
    const unsubscribe = onValue(clientRef, (snapshot) => {
      const clientData = snapshot.val()
      if (clientData) {
        console.log("Client status updated:", clientData.status)
        setIsClient(clientData.status === "approved")
        setClientStatus(clientData.status)
      } else {
        setIsClient(false)
        setClientStatus(null)
      }
    }, (error) => {
      console.error("Error listening to client status:", error)
    })

    // Also set up a polling mechanism as a fallback to check for updates every 5 seconds
    const pollInterval = setInterval(async () => {
      try {
        const clientSnap = await get(clientRef)
        const clientData = clientSnap.val()
        if (clientData) {
          setIsClient(clientData.status === "approved")
          setClientStatus(clientData.status)
        }
      } catch (error) {
        console.error("Error polling client status:", error)
      }
    }, 5000)

    return () => {
      unsubscribe()
      clearInterval(pollInterval)
    }
  }, [currentUser])

  // Load jobs
  useEffect(() => {
    const jobsRef = ref(database, "jobs")
    const unsubscribe = onValue(jobsRef, (snapshot) => {
      const allJobs: Job[] = []
      const pending: Job[] = []
      const myPosts: Job[] = []

      snapshot.forEach((child) => {
        const job = { id: child.key!, ...child.val() }
        if (job.status === "active" || job.status === "approved") {
          allJobs.push(job)
        }
        if (job.status === "pending") {
          pending.push(job)
        }
        if (currentUser && job.clientId === currentUser.uid) {
          myPosts.push(job)
        }
      })

      // Sort by featured and date
      allJobs.sort((a, b) => {
        if (a.featured && !b.featured) return -1
        if (!a.featured && b.featured) return 1
        return b.createdAt - a.createdAt
      })

      setJobs(allJobs)
      setPendingJobs(pending)
      setMyJobPosts(myPosts)
    })

    return () => unsubscribe()
  }, [currentUser])

  // Load admin data
  useEffect(() => {
    if (!isAdmin) return

    // Client requests
    const clientReqRef = ref(database, "clientRequests")
    const unsubClientReq = onValue(clientReqRef, (snapshot) => {
      const requests: any[] = []
      snapshot.forEach((child) => {
        const req = child.val()
        if (req.status === "pending") {
          requests.push({ id: child.key!, ...req })
        }
      })
      setClientRequests(requests)
    })

    // Badge requests
    const badgeRef = ref(database, "badgeRequests")
    const unsubBadge = onValue(badgeRef, (snapshot) => {
      const requests: any[] = []
      snapshot.forEach((child) => {
        const req = child.val()
        if (req.status === "pending") {
          requests.push({ id: child.key!, ...req })
        }
      })
      setBadgeRequests(requests)
    })

    return () => {
      unsubClientReq()
      unsubBadge()
    }
  }, [isAdmin])

  // Auth functions
  const signInWithGoogle = async () => {
    // Prevent multiple sign-in attempts
    if (isSigningIn.current) {
      console.log("Sign in already in progress")
      return
    }
    
    isSigningIn.current = true
    setAuthError(null)
    
    try {
      const provider = new GoogleAuthProvider()
      
      // Add a small delay to prevent rapid multiple clicks
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // Clear any existing pending popup requests
      if (window.opener) {
        window.close()
      }
      
      // Reset the promise state
      pendingPromiseRef.current = null
      
      // Store the promise to prevent multiple sign-in attempts
      pendingPromiseRef.current = signInWithPopup(auth, provider)
      await pendingPromiseRef.current
      
    } catch (error: any) {
      if (error.code === "auth/cancelled-popup-request") {
        console.log("Sign in popup was cancelled")
        return
      }
      if (error.code === "auth/unauthorized-domain") {
        const currentDomain = typeof window !== "undefined" ? window.location.hostname : "this domain"
        setAuthError(
          `To enable Google Sign-In, add "${currentDomain}" to your Firebase authorized domains:\n\n` +
            `1. Go to Firebase Console → Authentication → Settings\n` +
            `2. Scroll to "Authorized domains"\n` +
            `3. Click "Add domain" and enter: ${currentDomain}\n` +
            `4. Save and try again`,
        )
      } else if (error.code === "auth/popup-closed-by-user") {
        // User closed popup, no error needed
        return
      } else {
        setAuthError(`Authentication error: ${error.message}`)
      }
      throw error
    } finally {
      isSigningIn.current = false
      pendingPromiseRef.current = null
    }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
  }

  // Profile functions
  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return
    await update(ref(database, `users/${currentUser.uid}`), {
      ...data,
      updatedAt: Date.now(),
    })
    setUserProfile((prev) => (prev ? { ...prev, ...data } : null))
  }

  // Job functions
  const toggleSaveJob = async (jobId: string) => {
    if (!currentUser) return
    const savedRef = ref(database, `users/${currentUser.uid}/savedJobs/${jobId}`)

    if (savedJobs.includes(jobId)) {
      await remove(savedRef)
      setSavedJobs((prev) => prev.filter((id) => id !== jobId))
    } else {
      await set(savedRef, true)
      setSavedJobs((prev) => [...prev, jobId])
    }
  }

  const applyToJob = async (job: Job) => {
    if (!currentUser || !userProfile) return

    // Check if already applied
    const existing = userApplications.find((app) => app.jobId === job.id)
    if (existing) {
      throw new Error("You have already applied to this job")
    }

    const applicationData = {
      jobId: job.id,
      jobTitle: job.title,
      company: job.company,
      applicantId: currentUser.uid,
      applicantName: userProfile.name,
      applicantEmail: currentUser.email,
      applicantPhoto: currentUser.photoURL || "",
      applicantSkills: userProfile.skills || [],
      status: "pending",
      appliedAt: Date.now(),
    }

    await set(ref(database, `applications/${job.id}/${currentUser.uid}`), applicationData)
    await set(ref(database, `users/${currentUser.uid}/applications/${job.id}`), applicationData)

    // Update application count
    const countRef = ref(database, `jobs/${job.id}/applicationCount`)
    const countSnap = await get(countRef)
    await set(countRef, (countSnap.val() || 0) + 1)

    setUserApplications((prev) => [...prev, { id: job.id, ...applicationData }])
  }

  const postJob = async (
    jobData: Omit<Job, "id" | "clientId" | "clientName" | "status" | "applicationCount" | "createdAt">,
  ) => {
    if (!currentUser || !userProfile) return

    const newJob = {
      ...jobData,
      clientId: currentUser.uid,
      clientName: userProfile.name,
      status: "pending",
      applicationCount: 0,
      createdAt: Date.now(),
    }

    const jobRef = await push(ref(database, "jobs"), newJob)

    if (jobData.featured) {
      await set(ref(database, `badgeRequests/${jobRef.key}`), {
        jobId: jobRef.key,
        jobTitle: jobData.title,
        clientId: currentUser.uid,
        clientName: userProfile.name,
        status: "pending",
        requestedAt: Date.now(),
      })
    }
  }

  // Client functions
  const submitClientRequest = async (data: {
    companyName: string
    companyDescription: string
    hiringPurpose: string
  }) => {
    if (!currentUser || !userProfile) return

    const requestData = {
      userId: currentUser.uid,
      userName: userProfile.name,
      userEmail: currentUser.email,
      ...data,
      status: "pending",
      requestedAt: Date.now(),
    }

    await set(ref(database, `clients/${currentUser.uid}`), requestData)
    await set(ref(database, `clientRequests/${currentUser.uid}`), requestData)
    setClientStatus("pending")
  }

  const getJobApplications = async (jobId: string) => {
    const appsRef = ref(database, `applications/${jobId}`)
    const snapshot = await get(appsRef)
    const apps: any[] = []
    snapshot.forEach((child) => {
      apps.push({ id: child.key!, ...child.val() })
    })
    return apps
  }

  const handleApplicationAction = async (jobId: string, applicantId: string, status: string, message: string) => {
    const updates = {
      status,
      clientMessage: message,
      updatedAt: Date.now(),
    }
    await update(ref(database, `applications/${jobId}/${applicantId}`), updates)
    await update(ref(database, `users/${applicantId}/applications/${jobId}`), updates)
  }

  // Admin functions
  const approveClient = async (userId: string) => {
    await update(ref(database, `clients/${userId}`), { status: "approved" })
    await remove(ref(database, `clientRequests/${userId}`))
  }

  const rejectClient = async (userId: string) => {
    await update(ref(database, `clients/${userId}`), { status: "rejected" })
    await remove(ref(database, `clientRequests/${userId}`))
  }

  const approveJob = async (jobId: string) => {
    await update(ref(database, `jobs/${jobId}`), { status: "approved" })
  }

  const rejectJob = async (jobId: string) => {
    await update(ref(database, `jobs/${jobId}`), { status: "rejected" })
  }

  const approveBadge = async (requestId: string, jobId: string) => {
    await update(ref(database, `jobs/${jobId}`), { featured: true })
    await remove(ref(database, `badgeRequests/${requestId}`))
  }

  const rejectBadge = async (requestId: string, jobId: string) => {
    await update(ref(database, `jobs/${jobId}`), { featured: false })
    await remove(ref(database, `badgeRequests/${requestId}`))
  }

  return {
    currentUser,
    userProfile,
    isClient,
    isAdmin,
    clientStatus,
    loading,
    jobs,
    savedJobs,
    userApplications,
    myJobPosts,
    clientRequests,
    pendingJobs,
    badgeRequests,
    authError,
    setAuthError,
    signInWithGoogle,
    signOut,
    updateProfile,
    toggleSaveJob,
    applyToJob,
    postJob,
    submitClientRequest,
    getJobApplications,
    handleApplicationAction,
    approveClient,
    rejectClient,
    approveJob,
    rejectJob,
    approveBadge,
    rejectBadge,
  }
}

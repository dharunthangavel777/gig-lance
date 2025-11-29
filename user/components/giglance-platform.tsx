"use client"

import { useState, useCallback } from "react"
import AuthScreen from "./auth-screen"
import Sidebar from "./sidebar"
import TopHeader from "./top-header"
import HomePage from "./pages/home-page"
import SavedJobsPage from "./pages/saved-jobs-page"
import ApplicationsPage from "./pages/applications-page"
import ProfilePage from "./pages/profile-page"
import PostJobPage from "./pages/post-job-page"
import MyPostsPage from "./pages/my-posts-page"
import AdminClientsPage from "./pages/admin-clients-page"
import AdminJobsPage from "./pages/admin-jobs-page"
import AdminBadgesPage from "./pages/admin-badges-page"
import JobDetailModal from "./modals/job-detail-modal"
import ApplicationsModal from "./modals/applications-modal"
import BecomeClientModal from "./modals/become-client-modal"
import CustomToast from "./ui/custom-toast"
import { useFirebase } from "@/hooks/use-firebase"
import { useToast } from "@/components/ui/use-toast"

export type UserProfile = {
  uid: string
  email: string
  name: string
  photoURL: string
  role: string
  professionalRole?: string
  location?: string
  phone?: string
  skills?: string[]
  experience?: string
  portfolio?: string[]
  createdAt: number
}

export type Job = {
  id: string
  title: string
  company: string
  location: string
  category: string
  minPay: number
  maxPay: number
  contact: string
  maxApplications: number
  skills: string[]
  highlights: string
  description: string
  responsibilities: string
  featured: boolean
  clientId: string
  clientName: string
  status: string
  applicationCount: number
  createdAt: number
}

export type Application = {
  id: string
  jobId: string
  jobTitle: string
  company: string
  applicantId: string
  applicantName: string
  applicantEmail: string | null
  applicantPhoto: string
  applicantSkills: string[]
  status: string
  clientMessage?: string
  appliedAt: number
}

const ADMIN_EMAILS = ["admin@giglance.com", "dharuncod@gmail.com"]

const ENABLE_ADMIN_FOR_ALL = false // Set to false in production

export default function GiglancePlatform() {
  // Initialize state with URL parameter or default to "home"
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const page = urlParams.get('page');
      return page || 'home';
    }
    return 'home';
  });
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [selectedJobForApplications, setSelectedJobForApplications] = useState<{ id: string; title: string } | null>(
    null,
  )
  const [showBecomeClientModal, setShowBecomeClientModal] = useState(false)

  const {
    currentUser,
    userProfile,
    isClient,
    isAdmin,
    loading,
    signInWithGoogle,
    signOut,
    updateProfile,
    submitClientRequest,
    clientStatus,
    authError,
    setAuthError,
  } = useFirebase(ADMIN_EMAILS)

  const { toasts, toast, dismiss } = useToast()

  const showToast = (message: string, type: "success" | "error" | "info" | "warning" = "info") => {
    toast({
      title: message,
      description: type,
    })
  }

  const removeToast = (toastId: string) => {
    dismiss(toastId)
  }

  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page)
    setSidebarOpen(false)
  }, [])


  if (!currentUser) {
    return <AuthScreen onSignIn={signInWithGoogle} authError={authError} onClearError={() => setAuthError(null)} />
  }

  const effectiveAdminStatus = ENABLE_ADMIN_FOR_ALL || isAdmin

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isClient={isClient}
        isAdmin={effectiveAdminStatus}
        onLogout={signOut}
      />

      <main className="flex-1 lg:ml-[260px]">
        <TopHeader
          onMenuToggle={() => setSidebarOpen(true)}
          user={currentUser}
          userProfile={userProfile}
          isClient={isClient}
          isAdmin={effectiveAdminStatus}
        />

        <div className="p-4 md:p-8">
          {currentPage === "home" && <HomePage onViewJob={setSelectedJob} showToast={showToast} />}
          {currentPage === "saved" && <SavedJobsPage onViewJob={setSelectedJob} showToast={showToast} />}
          {currentPage === "applications" && <ApplicationsPage />}
          {currentPage === "profile" && (
            <ProfilePage
              user={currentUser}
              userProfile={userProfile}
              onUpdateProfile={updateProfile}
              onBecomeClient={() => setShowBecomeClientModal(true)}
              isClient={isClient}
              clientStatus={clientStatus}
              isAdmin={effectiveAdminStatus}
              onNavigateAdmin={() => {
                // Open admin dashboard in a new tab
                const adminUrl = window.location.href.split('?')[0] + '?page=admin-dashboard';
                window.open(adminUrl, '_blank');
              }}
              showToast={showToast}
            />
          )}
          {currentPage === "post-job" && isClient && <PostJobPage showToast={showToast} />}
          {currentPage === "my-posts" && isClient && (
            <MyPostsPage onViewApplications={(id, title) => setSelectedJobForApplications({ id, title })} />
          )}
          {currentPage === "admin-clients" && effectiveAdminStatus && <AdminClientsPage showToast={showToast} />}
          {currentPage === "admin-jobs" && effectiveAdminStatus && <AdminJobsPage showToast={showToast} />}
          {currentPage === "admin-badges" && effectiveAdminStatus && <AdminBadgesPage showToast={showToast} />}
        </div>
      </main>

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} showToast={showToast} />}

      {selectedJobForApplications && (
        <ApplicationsModal
          jobId={selectedJobForApplications.id}
          jobTitle={selectedJobForApplications.title}
          onClose={() => setSelectedJobForApplications(null)}
          showToast={showToast}
        />
      )}

      {showBecomeClientModal && (
        <BecomeClientModal
          onClose={() => setShowBecomeClientModal(false)}
          onSubmit={async (data) => {
            await submitClientRequest(data)
            setShowBecomeClientModal(false)
            showToast("Client request submitted successfully!", "success")
          }}
        />
      )}

      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {toasts.map((toast) => (
          <CustomToast key={toast.id} message={toast.title as string} type={(toast.description as "success" | "error" | "warning" | "info") || "info"} onClose={() => removeToast(toast.id)} />
        ))}
      </div>
    </div>
  )
}

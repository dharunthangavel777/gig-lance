"use client"

import { CheckCircle } from "lucide-react"
import EmptyState from "../ui/empty-state"
import { useFirebase } from "@/hooks/use-firebase"

interface AdminJobsPageProps {
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function AdminJobsPage({ showToast }: AdminJobsPageProps) {
  const { pendingJobs, approveJob, rejectJob } = useFirebase([])

  const handleApprove = async (jobId: string) => {
    await approveJob(jobId)
    showToast("Job approved!", "success")
  }

  const handleReject = async (jobId: string) => {
    await rejectJob(jobId)
    showToast("Job rejected", "success")
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Job Post Approvals</h1>
        <p className="text-gray-500">Review and approve job listings</p>
      </div>

      {pendingJobs.length === 0 ? (
        <EmptyState
          icon={<CheckCircle size={80} />}
          title="No pending jobs"
          description="All job posts have been reviewed"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {pendingJobs.map((job) => (
            <div key={job.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{job.title}</h3>
                  <p className="text-sm text-gray-500">
                    {job.company} • {job.clientName}
                  </p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-600">
                  Pending
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Location:</strong> {job.location}
                </p>
                <p>
                  <strong>Pay:</strong> ₹{job.minPay} - ₹{job.maxPay}
                </p>
                <p>
                  <strong>Contact:</strong> {job.contact}
                </p>
                <p>
                  <strong>Skills:</strong> {job.skills?.join(", ")}
                </p>
                <p>
                  <strong>Description:</strong> {job.description?.substring(0, 200)}...
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(job.id)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(job.id)}
                  className="px-6 py-3 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-all"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

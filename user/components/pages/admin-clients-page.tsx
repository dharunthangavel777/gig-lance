"use client"

import { Users } from "lucide-react"
import EmptyState from "../ui/empty-state"
import { useFirebase } from "@/hooks/use-firebase"

interface AdminClientsPageProps {
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function AdminClientsPage({ showToast }: AdminClientsPageProps) {
  const { clientRequests, approveClient, rejectClient } = useFirebase([])

  const handleApprove = async (userId: string) => {
    await approveClient(userId)
    showToast("Client approved!", "success")
  }

  const handleReject = async (userId: string) => {
    await rejectClient(userId)
    showToast("Client rejected", "success")
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Client Verification Requests</h1>
        <p className="text-gray-500">Review and approve client applications</p>
      </div>

      {clientRequests.length === 0 ? (
        <EmptyState
          icon={<Users size={80} />}
          title="No pending requests"
          description="All client requests have been processed"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {clientRequests.map((req) => (
            <div key={req.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-base font-semibold text-gray-900 mb-1">{req.userName}</h3>
                  <p className="text-sm text-gray-500">{req.userEmail}</p>
                </div>
                <span className="px-4 py-1.5 rounded-full text-sm font-medium bg-amber-100 text-amber-600">
                  Pending
                </span>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 mb-4 text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Company:</strong> {req.companyName}
                </p>
                <p>
                  <strong>Description:</strong> {req.companyDescription}
                </p>
                <p>
                  <strong>Hiring Purpose:</strong> {req.hiringPurpose}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(req.id)}
                  className="px-6 py-3 bg-green-500 text-white rounded-xl text-sm font-medium hover:bg-green-600 transition-all"
                >
                  Approve
                </button>
                <button
                  onClick={() => handleReject(req.id)}
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

"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"
import { useFirebase } from "@/hooks/use-firebase"
import { capitalizeFirst } from "@/lib/utils"

interface ApplicationsModalProps {
  jobId: string
  jobTitle: string
  onClose: () => void
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function ApplicationsModal({ jobId, jobTitle, onClose, showToast }: ApplicationsModalProps) {
  const { getJobApplications, handleApplicationAction } = useFirebase([])
  const [applications, setApplications] = useState<any[]>([])
  const [messages, setMessages] = useState<Record<string, string>>({})

  useEffect(() => {
    loadApplications()
  }, [jobId])

  const loadApplications = async () => {
    const apps = await getJobApplications(jobId)
    setApplications(apps)
  }

  const handleAction = async (applicantId: string, status: "accepted" | "rejected") => {
    await handleApplicationAction(jobId, applicantId, status, messages[applicantId] || "")
    showToast(`Application ${status}!`, "success")
    loadApplications()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Applications for {jobTitle}</h2>

        {applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <h3 className="text-base font-semibold">No applications yet</h3>
            <p className="text-sm">Check back later for new applications</p>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => (
              <div
                key={app.id}
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 bg-gray-50 rounded-xl"
              >
                <div className="flex gap-4 items-center">
                  <img
                    src={app.applicantPhoto || "/placeholder.svg?height=48&width=48"}
                    alt={app.applicantName}
                    className="w-12 h-12 rounded-xl object-cover"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{app.applicantName}</h4>
                    <p className="text-xs text-gray-500">
                      {app.applicantSkills?.slice(0, 3).join(", ") || "No skills listed"}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-2 w-full sm:w-auto">
                  {app.status === "pending" ? (
                    <>
                      <input
                        type="text"
                        placeholder="Message (optional)"
                        value={messages[app.id] || ""}
                        onChange={(e) => setMessages({ ...messages, [app.id]: e.target.value })}
                        className="px-3 py-2 border border-gray-200 rounded-lg text-sm w-full sm:w-48"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAction(app.id, "accepted")}
                          className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg text-sm font-medium hover:bg-green-600"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleAction(app.id, "rejected")}
                          className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600"
                        >
                          Reject
                        </button>
                      </div>
                    </>
                  ) : (
                    <span
                      className={`
                      px-4 py-1.5 rounded-full text-sm font-medium
                      ${app.status === "accepted" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}
                    `}
                    >
                      {capitalizeFirst(app.status)}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

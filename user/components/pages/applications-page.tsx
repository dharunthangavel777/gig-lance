"use client"

import { FileText } from "lucide-react"
import EmptyState from "../ui/empty-state"
import { useFirebase } from "@/hooks/use-firebase"
import { formatDate, capitalizeFirst } from "@/lib/utils"

export default function ApplicationsPage() {
  const { userApplications } = useFirebase([])

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
        <p className="text-gray-500">Track the status of your job applications</p>
      </div>

      {userApplications.length === 0 ? (
        <EmptyState
          icon={<FileText size={80} />}
          title="No applications yet"
          description="Apply to jobs to track your applications here"
        />
      ) : (
        <div className="flex flex-col gap-4">
          {userApplications.map((app) => (
            <div
              key={app.id}
              className="bg-white border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-1">{app.jobTitle}</h3>
                <p className="text-sm text-gray-500">
                  {app.company} • Applied {formatDate(app.appliedAt)}
                </p>
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2">
                <span
                  className={`
                  px-4 py-1.5 rounded-full text-sm font-medium
                  ${app.status === "pending" ? "bg-amber-100 text-amber-600" : ""}
                  ${app.status === "accepted" ? "bg-green-100 text-green-600" : ""}
                  ${app.status === "rejected" ? "bg-red-100 text-red-600" : ""}
                `}
                >
                  {capitalizeFirst(app.status)}
                </span>
                {app.clientMessage && (
                  <div className="text-sm text-gray-600 bg-gray-100 px-3 py-2 rounded-lg max-w-xs">
                    "{app.clientMessage}"
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

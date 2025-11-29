"use client"

import { X, MapPin, DollarSign, Calendar, Users, Bookmark } from "lucide-react"
import type { Job } from "../giglance-platform"
import { useFirebase } from "@/hooks/use-firebase"
import { formatDate } from "@/lib/utils"

interface JobDetailModalProps {
  job: Job
  onClose: () => void
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function JobDetailModal({ job, onClose, showToast }: JobDetailModalProps) {
  const { savedJobs, toggleSaveJob, applyToJob } = useFirebase([])
  const isSaved = savedJobs.includes(job.id)
  const companyInitial = job.company?.charAt(0).toUpperCase() || "C"

  const handleSave = async () => {
    await toggleSaveJob(job.id)
    showToast(isSaved ? "Job removed from saved" : "Job saved successfully", "success")
  }

  const handleApply = async () => {
    try {
      await applyToJob(job)
      showToast("Application submitted successfully!", "success")
      onClose()
    } catch (error: unknown) {
      if (error instanceof Error) {
        showToast(error.message, "warning")
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <div className="flex gap-5 mb-6 pt-4">
          <div className="w-18 h-18 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-600">
            {companyInitial}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{job.title}</h2>
            <p className="text-gray-600">
              {job.clientName || "Client"} — {job.company}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-5 p-5 bg-gray-50 rounded-xl mb-6">
          <div className="flex items-center gap-2">
            <MapPin size={20} className="text-blue-600" />
            <span className="text-sm text-gray-700">{job.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <DollarSign size={20} className="text-blue-600" />
            <span className="text-sm text-gray-700">
              ₹{job.minPay} - ₹{job.maxPay}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar size={20} className="text-blue-600" />
            <span className="text-sm text-gray-700">Posted {formatDate(job.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users size={20} className="text-blue-600" />
            <span className="text-sm text-gray-700">{job.applicationCount || 0} Applications</span>
          </div>
        </div>

        {job.highlights && (
          <div className="mb-6">
            <h3 className="text-base font-semibold text-gray-900 mb-3">Job Highlights</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{job.highlights}</p>
          </div>
        )}

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Description</h3>
          <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
          <ul className="text-sm text-gray-600 leading-relaxed pl-5 list-disc space-y-2">
            {job.responsibilities?.split("\n").map((r, idx) => (
              <li key={idx}>{r}</li>
            ))}
          </ul>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills?.map((skill, idx) => (
              <span key={idx} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Contact</h3>
          <p className="text-sm text-gray-600">Phone: {job.contact}</p>
        </div>

        <div className="flex gap-3 pt-6 border-t border-gray-200">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all"
          >
            <Bookmark size={20} fill={isSaved ? "currentColor" : "none"} />
            {isSaved ? "Saved" : "Save Job"}
          </button>
          <button
            onClick={handleApply}
            className="flex-1 px-8 py-4 rounded-xl text-base font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  )
}

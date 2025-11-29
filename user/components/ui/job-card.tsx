"use client"

import { MapPin, DollarSign, Bookmark, Star } from "lucide-react"
import type { Job } from "../giglance-platform"

interface JobCardProps {
  job: Job
  isSaved: boolean
  onSave: () => void
  onApply: () => void
}

export default function JobCard({ job, isSaved, onSave, onApply }: JobCardProps) {
  const companyInitial = job.company?.charAt(0).toUpperCase() || "C"

  return (
    <div
      className={`
      bg-white border rounded-xl p-6 transition-all hover:shadow-md hover:border-gray-300
      ${job.featured ? "border-blue-600 bg-gradient-to-br from-blue-50/50 to-white" : "border-gray-200"}
    `}
    >
      {job.featured && (
        <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <Star size={12} fill="currentColor" />
          Featured
        </div>
      )}

      <div className="flex gap-4 mb-4">
        <div className="w-13 h-13 bg-gray-100 rounded-xl flex items-center justify-center text-xl font-bold text-blue-600">
          {companyInitial}
        </div>
        <div>
          <h3 className="text-base font-semibold text-gray-900 mb-1">{job.title}</h3>
          <span className="text-sm text-gray-500">{job.company}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-4 mb-4">
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <MapPin size={16} />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-gray-500">
          <DollarSign size={16} />
          <span>
            ₹{job.minPay} - ₹{job.maxPay}
          </span>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-5">
        {job.skills?.slice(0, 4).map((skill, idx) => (
          <span key={idx} className="bg-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
            {skill}
          </span>
        ))}
      </div>

      <div className="flex gap-3">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSave()
          }}
          className="flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-medium bg-gray-100 text-gray-700 transition-all hover:bg-gray-200"
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
          {isSaved ? "Saved" : "Save"}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onApply()
          }}
          className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 text-white transition-all hover:bg-blue-700"
        >
          Apply Now
        </button>
      </div>
    </div>
  )
}

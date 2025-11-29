"use client"

import { useState } from "react"
import { Grid3X3, Code, Target, Pencil, Megaphone, BarChart3 } from "lucide-react"
import JobCard from "../ui/job-card"
import EmptyState from "../ui/empty-state"
import type { Job } from "../giglance-platform"
import { useFirebase } from "@/hooks/use-firebase"

interface HomePageProps {
  onViewJob: (job: Job) => void
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

const categories = [
  { id: "all", label: "All Jobs", icon: Grid3X3 },
  { id: "tech", label: "Tech", icon: Code },
  { id: "design", label: "Design", icon: Target },
  { id: "writing", label: "Writing", icon: Pencil },
  { id: "marketing", label: "Marketing", icon: Megaphone },
  { id: "data", label: "Data", icon: BarChart3 },
]

export default function HomePage({ onViewJob, showToast }: HomePageProps) {
  const [activeCategory, setActiveCategory] = useState("all")
  const [sortBy, setSortBy] = useState("newest")
  const [searchQuery, setSearchQuery] = useState("")
  const { jobs, savedJobs, toggleSaveJob, loading } = useFirebase([])

  const filteredJobs = jobs
    .filter((job) => {
      if (activeCategory !== "all" && job.category !== activeCategory) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          job.title?.toLowerCase().includes(query) ||
          job.company?.toLowerCase().includes(query) ||
          job.skills?.some((s) => s.toLowerCase().includes(query))
        )
      }
      return true
    })
    .sort((a, b) => {
      if (a.featured && !b.featured) return -1
      if (!a.featured && b.featured) return 1
      switch (sortBy) {
        case "highest":
          return b.maxPay - a.maxPay
        case "lowest":
          return a.minPay - b.minPay
        default:
          return b.createdAt - a.createdAt
      }
    })

  const handleSave = async (jobId: string) => {
    await toggleSaveJob(jobId)
    showToast(savedJobs.includes(jobId) ? "Job removed from saved" : "Job saved successfully", "success")
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Find Your Next Opportunity</h1>
        <p className="text-gray-500">Browse through thousands of gig work, freelance projects, and job openings</p>
      </div>

      <div className="mb-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Popular Categories</h2>
        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`
                flex items-center gap-2.5 px-5 py-3 rounded-full border text-sm font-medium transition-all
                ${
                  activeCategory === cat.id
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-white border-gray-200 text-gray-600 hover:border-blue-600 hover:text-blue-600"
                }
              `}
            >
              <cat.icon size={18} />
              <span className="hidden sm:inline">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-5">
        <h2 className="text-lg font-semibold text-gray-800">Latest Opportunities</h2>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-2.5 border border-gray-200 rounded-lg bg-white text-sm text-gray-600 cursor-pointer outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="highest">Highest Pay</option>
          <option value="lowest">Lowest Pay</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filteredJobs.length === 0 ? (
        <EmptyState
          icon={<Grid3X3 size={80} />}
          title="No jobs found"
          description="Check back later for new opportunities"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={savedJobs.includes(job.id)}
              onSave={() => handleSave(job.id)}
              onApply={() => onViewJob(job)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

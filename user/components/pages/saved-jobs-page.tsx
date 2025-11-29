"use client"

import { Bookmark } from "lucide-react"
import JobCard from "../ui/job-card"
import EmptyState from "../ui/empty-state"
import type { Job } from "../giglance-platform"
import { useFirebase } from "@/hooks/use-firebase"

interface SavedJobsPageProps {
  onViewJob: (job: Job) => void
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function SavedJobsPage({ onViewJob, showToast }: SavedJobsPageProps) {
  const { jobs, savedJobs, toggleSaveJob } = useFirebase([])

  const savedJobsList = jobs.filter((job) => savedJobs.includes(job.id))

  const handleSave = async (jobId: string) => {
    await toggleSaveJob(jobId)
    showToast("Job removed from saved", "success")
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Saved Jobs</h1>
        <p className="text-gray-500">Jobs you've bookmarked for later</p>
      </div>

      {savedJobsList.length === 0 ? (
        <EmptyState
          icon={<Bookmark size={80} />}
          title="No saved jobs"
          description="Save jobs you're interested in to view them later"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {savedJobsList.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSaved={true}
              onSave={() => handleSave(job.id)}
              onApply={() => onViewJob(job)}
            />
          ))}
        </div>
      )}
    </div>
  )
}

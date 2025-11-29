"use client"

import { LayoutGrid } from "lucide-react"
import EmptyState from "../ui/empty-state"
import { useFirebase } from "@/hooks/use-firebase"
import { formatDate, capitalizeFirst } from "@/lib/utils"

interface MyPostsPageProps {
  onViewApplications: (jobId: string, jobTitle: string) => void
}

export default function MyPostsPage({ onViewApplications }: MyPostsPageProps) {
  const { myJobPosts } = useFirebase([])

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">My Job Posts</h1>
        <p className="text-gray-500">Manage your job listings and view applications</p>
      </div>

      {myJobPosts.length === 0 ? (
        <EmptyState
          icon={<LayoutGrid size={80} />}
          title="No job posts yet"
          description="Create your first job post to find talent"
        />
      ) : (
        <div className="flex flex-col gap-5">
          {myJobPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{post.title}</h3>
                  <p className="text-sm text-gray-500">
                    {post.company} • {post.location}
                  </p>
                </div>
                <span
                  className={`
                  px-4 py-1.5 rounded-full text-sm font-medium
                  ${post.status === "pending" ? "bg-amber-100 text-amber-600" : ""}
                  ${post.status === "approved" ? "bg-green-100 text-green-600" : ""}
                  ${post.status === "rejected" ? "bg-red-100 text-red-600" : ""}
                `}
                >
                  {capitalizeFirst(post.status)}
                </span>
              </div>
              <div className="flex flex-wrap gap-6 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{post.applicationCount || 0}</div>
                  <div className="text-xs text-gray-500">Applications</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ₹{post.minPay}-{post.maxPay}
                  </div>
                  <div className="text-xs text-gray-500">Pay Range</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{formatDate(post.createdAt)}</div>
                  <div className="text-xs text-gray-500">Posted</div>
                </div>
              </div>
              <button
                onClick={() => onViewApplications(post.id, post.title)}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-all"
              >
                View Applications
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

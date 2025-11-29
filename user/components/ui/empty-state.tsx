import type React from "react"
interface EmptyStateProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function EmptyState({ icon, title, description }: EmptyStateProps) {
  return (
    <div className="text-center py-16 px-5 text-gray-500">
      <div className="w-20 h-20 mx-auto mb-4 opacity-50 flex items-center justify-center">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-700 mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  )
}

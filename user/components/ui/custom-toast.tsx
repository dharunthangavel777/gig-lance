"use client"

import { useEffect } from "react"
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react"

interface ToastProps {
  message: string
  type: "success" | "error" | "warning" | "info"
  onClose: () => void
}

export default function CustomToast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000)
    return () => clearTimeout(timer)
  }, [onClose])

  const icons = {
    success: <CheckCircle size={20} />,
    error: <AlertCircle size={20} />,
    warning: <AlertTriangle size={20} />,
    info: <Info size={20} />,
  }

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    warning: "bg-amber-500",
    info: "bg-blue-500",
  }

  return (
    <div
      className={`
        flex items-center gap-3 px-5 py-4 rounded-xl text-white shadow-lg
        animate-in slide-in-from-right duration-300
        ${colors[type]}
      `}
    >
      {icons[type]}
      <span className="text-sm font-medium flex-1">{message}</span>
      <button onClick={onClose} className="opacity-70 hover:opacity-100 transition-opacity">
        <X size={18} />
      </button>
    </div>
  )
}

"use client"

import type React from "react"

import { useState } from "react"
import { X } from "lucide-react"

interface BecomeClientModalProps {
  onClose: () => void
  onSubmit: (data: { companyName: string; companyDescription: string; hiringPurpose: string }) => void
}

export default function BecomeClientModal({ onClose, onSubmit }: BecomeClientModalProps) {
  const [formData, setFormData] = useState({
    companyName: "",
    companyDescription: "",
    hiringPurpose: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5" onClick={onClose}>
      <div
        className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-2">Become a Client</h2>
        <p className="text-gray-500 mb-6 text-sm">
          Fill out this form to request client access. Our admin team will review your application.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Company / Organization Name</label>
            <input
              type="text"
              required
              value={formData.companyName}
              onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              placeholder="Enter company name"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">About Your Company</label>
            <textarea
              required
              value={formData.companyDescription}
              onChange={(e) => setFormData({ ...formData, companyDescription: e.target.value })}
              rows={4}
              placeholder="Describe what your company does..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Why do you want to hire freelancers?</label>
            <textarea
              required
              value={formData.hiringPurpose}
              onChange={(e) => setFormData({ ...formData, hiringPurpose: e.target.value })}
              rows={3}
              placeholder="Explain your hiring needs..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-transparent border border-gray-300 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700"
            >
              Submit Request
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

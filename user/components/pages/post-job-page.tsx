"use client"

import type React from "react"

import { useState } from "react"
import { useFirebase } from "@/hooks/use-firebase"

interface PostJobPageProps {
  showToast: (message: string, type: "success" | "error" | "warning" | "info") => void
}

export default function PostJobPage({ showToast }: PostJobPageProps) {
  const { postJob } = useFirebase([])
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    category: "",
    minPay: "",
    maxPay: "",
    contact: "",
    maxApplications: "",
    skills: "",
    highlights: "",
    description: "",
    responsibilities: "",
    featured: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await postJob({
        title: formData.title,
        company: formData.company,
        location: formData.location,
        category: formData.category,
        minPay: Number.parseInt(formData.minPay),
        maxPay: Number.parseInt(formData.maxPay),
        contact: formData.contact,
        maxApplications: Number.parseInt(formData.maxApplications) || 100,
        skills: formData.skills.split(",").map((s) => s.trim()),
        highlights: formData.highlights,
        description: formData.description,
        responsibilities: formData.responsibilities,
        featured: formData.featured,
      })
      showToast("Job submitted for approval!", "success")
      setFormData({
        title: "",
        company: "",
        location: "",
        category: "",
        minPay: "",
        maxPay: "",
        contact: "",
        maxApplications: "",
        skills: "",
        highlights: "",
        description: "",
        responsibilities: "",
        featured: false,
      })
    } catch {
      showToast("Failed to post job", "error")
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
        <p className="text-gray-500">Create a job listing to find the perfect talent</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Job Title *</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Senior React Developer"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Company Name *</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Your company name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Remote, Mumbai, Hybrid"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select category</option>
                <option value="tech">Tech</option>
                <option value="design">Design</option>
                <option value="writing">Writing</option>
                <option value="marketing">Marketing</option>
                <option value="data">Data</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Pay (₹) *</label>
              <input
                type="number"
                required
                value={formData.minPay}
                onChange={(e) => setFormData({ ...formData, minPay: e.target.value })}
                placeholder="e.g., 2000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Pay (₹) *</label>
              <input
                type="number"
                required
                value={formData.maxPay}
                onChange={(e) => setFormData({ ...formData, maxPay: e.target.value })}
                placeholder="e.g., 5000"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contact Number *</label>
              <input
                type="tel"
                required
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Your contact number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Applications</label>
              <input
                type="number"
                value={formData.maxApplications}
                onChange={(e) => setFormData({ ...formData, maxApplications: e.target.value })}
                placeholder="e.g., 50"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Skills (comma separated) *</label>
            <input
              type="text"
              required
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              placeholder="e.g., React, Node.js, MongoDB"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Highlights</label>
            <input
              type="text"
              value={formData.highlights}
              onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
              placeholder="e.g., Work from home, Flexible hours, Great team"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Job Description *</label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              placeholder="Describe the job in detail..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <div className="mb-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">Key Responsibilities *</label>
            <textarea
              required
              value={formData.responsibilities}
              onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
              rows={4}
              placeholder="List the key responsibilities (one per line)..."
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 resize-y"
            />
          </div>
          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-5 h-5 accent-blue-600"
              />
              <span className="text-sm text-gray-700">Request Featured Badge (Premium listing at the top)</span>
            </label>
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-4 bg-blue-600 text-white rounded-xl text-base font-medium hover:bg-blue-700 transition-all"
            >
              Submit for Approval
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

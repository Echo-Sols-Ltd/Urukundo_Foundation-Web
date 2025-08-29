"use client"

import type React from "react"
import Image from "next/image"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "@/components/donation/Sidebar"
import { ChevronDown } from "lucide-react"

interface DonationForm {
  cause: string
  amount: string
  donationType: "one-time" | "monthly"
  message: string
}

const causes = [
  "Education Fund",
  "Healthcare Initiative",
  "Food Security",
  "Environmental Protection",
  "Emergency Relief",
  "General Fund",
]

export default function DonatePage() {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [formData, setFormData] = useState<DonationForm>({
    cause: "",
    amount: "",
    donationType: "one-time",
    message: "",
  })
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: keyof DonationForm, value: string) => {
    setFormData({ ...formData, [field]: value })
  }

  const getHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null
    return {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  const mapCauseToEnum = (label: string) => {
    const normalized = label.toLowerCase()
    if (normalized.includes('education')) return 'EDUCATION'
    if (normalized.includes('health')) return 'HEALTH_CARE'
    if (normalized.includes('water')) return 'WATER_SHORTAGE'
    return 'EDUCATION'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsConfirmOpen(true)
  }

  const confirmDonation = async () => {
    try {
      setIsSubmitting(true)
      const amountNumber = Number(formData.amount)
      const payload = {
        amount: isNaN(amountNumber) ? 0 : amountNumber,
        donationText: formData.message || '',
        methodOfPayment: 'ONLINE',
        donationCause: mapCauseToEnum(formData.cause),
        status: 'PENDING',
      }
      const res = await fetch('/api/donation', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        alert(`Thank you for your ${formData.donationType} donation of RWF ${formData.amount}!`)
        router.push('/donation/my-donations')
      } else {
        alert('Failed to submit donation. Please try again.')
      }
    } catch {
      alert('Failed to submit donation. Please try again later.')
    } finally {
      setIsSubmitting(false)
      setIsConfirmOpen(false)
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button
              title="Open Menu"
                onClick={() => setIsMobileMenuOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="ml-2 lg:ml-0">
                <h1 className="text-2xl font-bold text-gray-900">Make a Donation</h1>
                <p className="text-gray-600 mt-1">Thank you for making a difference in the world</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Donations</div>
                <div className="text-lg font-semibold text-orange-500">45,000 Rwf</div>
              </div>
              <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                <Image src="/diverse-group-profile.png" alt="Profile" width={40} height={40} className="w-10 h-10 rounded-full object-cover" />
              </div>
            </div>
          </div>
        </div>

        <main className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-8">Choose Your Donation</h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Cause */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Cause</label>
                  <div className="relative">
                    <select
                      title="Select cause to support"
                      value={formData.cause}
                      onChange={(e) => handleInputChange("cause", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent appearance-none bg-white text-gray-900"
                      required
                    >
                      <option value="">Select cause to support</option>
                      {causes.map((cause) => (
                        <option key={cause} value={cause}>
                          {cause}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Donation Amount */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Donation Amount</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600 text-sm font-semibold">RWF</span>
                    <input
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="Enter amount to donate"
                      value={formData.amount}
                      onChange={(e) => handleInputChange("amount", e.target.value)}
                      className="w-full pl-16 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      required
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                {/* Donation Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Donation Type</label>
                  <div className="flex space-x-4">
                    <button
                      type="button"
                      onClick={() => handleInputChange("donationType", "one-time")}
                      className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                        formData.donationType === "one-time"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      One-Time
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInputChange("donationType", "monthly")}
                      className={`flex-1 py-3 px-4 rounded-lg border font-medium transition-colors ${
                        formData.donationType === "monthly"
                          ? "border-orange-500 bg-orange-50 text-orange-700"
                          : "border-gray-300 text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
                  <textarea
                    rows={4}
                    placeholder="Let others know why this cause matters to you . . ."
                    value={formData.message}
                    onChange={(e) => handleInputChange("message", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                </div>

                {/* Donate Button */}
                <button
                  type="submit"
                  className="w-full bg-orange-500 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-orange-600 transition-colors"
                >
                  DONATE
                </button>
              </form>
            </div>
          </div>
        </main>

        {isConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white w-full max-w-md mx-auto rounded-xl shadow-xl border border-gray-200">
              <div className="px-6 py-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">Confirm Your Donation</h3>
                <p className="text-sm text-gray-600 mt-1">Please review the details before proceeding.</p>
              </div>
              <div className="px-6 py-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Amount</span>
                  <span className="text-gray-900 font-semibold">RWF {formData.amount || '0'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Cause</span>
                  <span className="text-gray-900 font-medium">{formData.cause || 'General Fund'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 text-sm">Type</span>
                  <span className="text-gray-900 font-medium">{formData.donationType === 'monthly' ? 'Monthly' : 'One-Time'}</span>
                </div>
                {formData.message && (
                  <div>
                    <span className="block text-gray-600 text-sm mb-1">Message</span>
                    <p className="text-gray-900 text-sm bg-gray-50 rounded-lg p-3">{formData.message}</p>
                  </div>
                )}
              </div>
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={() => setIsConfirmOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="px-4 py-2.5 rounded-lg bg-orange-500 text-white hover:bg-orange-600 disabled:opacity-60"
                  onClick={confirmDonation}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Processing...' : 'Confirm Donation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

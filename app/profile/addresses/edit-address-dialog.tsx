'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateAddress } from '@/lib/data/addresses'
import type { Database } from '@/types/database.types'

type Address = Database['public']['Tables']['addresses']['Row']

interface EditAddressDialogProps {
  address: Address
  isOpen: boolean
  onClose: () => void
}

export default function EditAddressDialog({ address, isOpen, onClose }: EditAddressDialogProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const result = await updateAddress(address.id, formData)

    if (result.success) {
      router.refresh()
      onClose()
    } else {
      setError(result.error || 'Failed to update address')
    }
    
    setIsSubmitting(false)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Edit Address</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="full_name"
                  name="full_name"
                  defaultValue={address.full_name}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  defaultValue={address.phone}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-4">
              <label htmlFor="address_line1" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1 *
              </label>
              <input
                type="text"
                id="address_line1"
                name="address_line1"
                defaultValue={address.address_line1}
                required
                placeholder="House No., Building Name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="address_line2" className="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                type="text"
                id="address_line2"
                name="address_line2"
                defaultValue={address.address_line2 || ''}
                placeholder="Road Name, Area, Colony"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  defaultValue={address.city}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue={address.state}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="postal_code"
                  name="postal_code"
                  defaultValue={address.postal_code}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
                Country *
              </label>
              <input
                type="text"
                id="country"
                name="country"
                defaultValue={address.country}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div className="mb-6">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="is_default"
                  defaultChecked={address.is_default}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm text-gray-700">Set as default address</span>
              </label>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import type { Database } from '@/types/database.types'
import EditAddressDialog from './edit-address-dialog'
import { deleteAddress, setDefaultAddress } from '@/lib/data/addresses'
import { useRouter } from 'next/navigation'

type Address = Database['public']['Tables']['addresses']['Row']

interface AddressCardProps {
  address: Address
}

export default function AddressCard({ address }: AddressCardProps) {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Are you sure you want to delete this address?')) {
      return
    }

    setIsDeleting(true)
    const result = await deleteAddress(address.id)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to delete address')
      setIsDeleting(false)
    }
  }

  async function handleSetDefault() {
    const result = await setDefaultAddress(address.id)
    
    if (result.success) {
      router.refresh()
    } else {
      alert(result.error || 'Failed to set default address')
    }
  }

  return (
    <>
      <div className={`relative bg-white rounded-lg border-2 p-6 ${
        address.is_default ? 'border-blue-500' : 'border-gray-200'
      }`}>
        {address.is_default && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
              Default
            </span>
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {address.full_name}
        </h3>
        <p className="text-gray-600 mb-1">{address.phone}</p>
        <p className="text-gray-600">
          {address.address_line1}
          {address.address_line2 && `, ${address.address_line2}`}
        </p>
        <p className="text-gray-600">
          {address.city}, {address.state} {address.postal_code}
        </p>
        <p className="text-gray-600">{address.country}</p>

        <div className="mt-6 flex gap-3">
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex-1 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
          >
            Edit
          </button>
          
          {!address.is_default && (
            <button
              onClick={handleSetDefault}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Set as Default
            </button>
          )}
          
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <EditAddressDialog
        address={address}
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
      />
    </>
  )
}

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

interface OrderFiltersProps {
  totalOrders: number
  statusCounts: Record<string, number>
}

export default function OrderFilters({ totalOrders, statusCounts }: OrderFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') || '')

  const currentStatus = searchParams.get('status') || 'all'
  const currentPayment = searchParams.get('payment') || 'all'

  const handleStatusFilter = (status: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (status === 'all') {
      params.delete('status')
    } else {
      params.set('status', status)
    }
    router.push(`/admin/orders-list?${params.toString()}`)
  }

  const handlePaymentFilter = (payment: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (payment === 'all') {
      params.delete('payment')
    } else {
      params.set('payment', payment)
    }
    router.push(`/admin/orders-list?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (search.trim()) {
      params.set('search', search.trim())
    } else {
      params.delete('search')
    }
    router.push(`/admin/orders-list?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch('')
    router.push('/admin/orders-list')
  }

  const orderStatuses = [
    { value: 'all', label: 'All Orders', count: totalOrders },
    { value: 'pending', label: 'Pending', count: statusCounts.pending || 0 },
    { value: 'processing', label: 'Processing', count: statusCounts.processing || 0 },
    { value: 'shipped', label: 'Shipped', count: statusCounts.shipped || 0 },
    { value: 'delivered', label: 'Delivered', count: statusCounts.delivered || 0 },
    { value: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled || 0 },
  ]

  const paymentStatuses = [
    { value: 'all', label: 'All Payments' },
    { value: 'pending', label: 'Pending' },
    { value: 'paid', label: 'Paid' },
    { value: 'failed', label: 'Failed' },
    { value: 'refunded', label: 'Refunded' },
  ]

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by order ID, email, or phone..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          Search
        </button>
        {(searchParams.get('search') || searchParams.get('status') || searchParams.get('payment')) && (
          <button
            type="button"
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Clear
          </button>
        )}
      </form>

      {/* Status Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 self-center mr-2">Order Status:</span>
        {orderStatuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusFilter(status.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentStatus === status.value
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label}
            <span className="ml-1 opacity-75">({status.count})</span>
          </button>
        ))}
      </div>

      {/* Payment Status Filter */}
      <div className="flex flex-wrap gap-2">
        <span className="text-sm font-medium text-gray-600 self-center mr-2">Payment:</span>
        {paymentStatuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handlePaymentFilter(status.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
              currentPayment === status.value
                ? 'bg-green-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'

interface OrderUpdateFormProps {
  orderId: string
  currentOrderStatus: string
  currentPaymentStatus: string
  currentTrackingId: string
  currentTrackingUrl: string
  currentAdminNotes: string
}

export default function OrderUpdateForm({
  orderId,
  currentOrderStatus,
  currentPaymentStatus,
  currentTrackingId,
  currentTrackingUrl,
  currentAdminNotes,
}: OrderUpdateFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isSendingEmail, setIsSendingEmail] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const [orderStatus, setOrderStatus] = useState(currentOrderStatus)
  const [paymentStatus, setPaymentStatus] = useState(currentPaymentStatus)
  const [trackingId, setTrackingId] = useState(currentTrackingId)
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl)
  const [adminNotes, setAdminNotes] = useState(currentAdminNotes)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    startTransition(async () => {
      try {
        const response = await fetch(`/api/admin/orders/${orderId}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            status: orderStatus,
            payment_status: paymentStatus,
            tracking_id: trackingId || null,
            tracking_url: trackingUrl || null,
            admin_notes: adminNotes || null,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to update order')
        }

        setSuccess('Order updated successfully!')
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      }
    })
  }

  const handleSendDeliveryEmail = async () => {
    setError(null)
    setSuccess(null)
    setIsSendingEmail(true)

    try {
      const response = await fetch(`/api/admin/orders/${orderId}/send-delivery-email`, {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send email')
      }

      setSuccess(`✅ Delivery email sent successfully to ${data.sentTo}!`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send email')
    } finally {
      setIsSendingEmail(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-sm text-green-600">{success}</p>
        </div>
      )}

      {/* Order Status */}
      <div>
        <label htmlFor="orderStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Order Status
        </label>
        <select
          id="orderStatus"
          value={orderStatus}
          onChange={(e) => setOrderStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Payment Status */}
      <div>
        <label htmlFor="paymentStatus" className="block text-sm font-medium text-gray-700 mb-1">
          Payment Status
        </label>
        <select
          id="paymentStatus"
          value={paymentStatus}
          onChange={(e) => setPaymentStatus(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      {/* Tracking ID */}
      <div>
        <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-1">
          Tracking ID (AWB Number)
        </label>
        <input
          type="text"
          id="trackingId"
          value={trackingId}
          onChange={(e) => setTrackingId(e.target.value)}
          placeholder="Enter tracking/AWB number"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Tracking URL */}
      <div>
        <label htmlFor="trackingUrl" className="block text-sm font-medium text-gray-700 mb-1">
          Tracking URL
        </label>
        <input
          type="url"
          id="trackingUrl"
          value={trackingUrl}
          onChange={(e) => setTrackingUrl(e.target.value)}
          placeholder="https://tracking.example.com/..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">Full URL for package tracking</p>
      </div>

      {/* Admin Notes */}
      <div>
        <label htmlFor="adminNotes" className="block text-sm font-medium text-gray-700 mb-1">
          Admin Notes
        </label>
        <textarea
          id="adminNotes"
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          placeholder="Internal notes (not visible to customer)"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Updating...
            </span>
          ) : (
            'Update Order'
          )}
        </button>

        <button
          type="button"
          onClick={handleSendDeliveryEmail}
          disabled={isSendingEmail || isPending}
          className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        >
          {isSendingEmail ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Sending...
            </span>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Send Delivery Email
            </>
          )}
        </button>
      </div>
    </form>
  )
}

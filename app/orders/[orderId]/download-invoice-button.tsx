'use client'

import { useState } from 'react'

interface DownloadInvoiceButtonProps {
  orderId: string
  orderNumber: string
}

export default function DownloadInvoiceButton({ orderId, orderNumber }: DownloadInvoiceButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  async function handleDownload() {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/invoice/${orderId}`)
      
      if (!response.ok) {
        throw new Error('Failed to generate invoice')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `Invoice-${orderNumber}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Error downloading invoice:', error)
      alert('Failed to download invoice. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      {isLoading ? 'Generating...' : 'Download Invoice'}
    </button>
  )
}

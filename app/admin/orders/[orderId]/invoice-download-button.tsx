'use client'

import { useState } from 'react'

interface InvoiceDownloadButtonProps {
  orderId: string
  orderNumber: string
}

export default function InvoiceDownloadButton({ orderId, orderNumber }: InvoiceDownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleDownload = async () => {
    setIsLoading(true)
    try {
      // Open invoice in new window which will trigger print dialog
      const invoiceUrl = `/api/admin/orders/${orderId}/invoice`
      const newWindow = window.open(invoiceUrl, '_blank', 'width=800,height=600')
      
      if (newWindow) {
        // The invoice page has auto-print functionality
        // User can save as PDF from print dialog
      }
    } catch (error) {
      console.error('Error opening invoice:', error)
      alert('Failed to open invoice. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrintPDF = async () => {
    setIsLoading(true)
    try {
      // Fetch the invoice HTML using query parameter
      const response = await fetch(`/api/admin/orders/${orderId}?format=invoice`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch invoice')
      }
      
      const html = await response.text()
      
      // Create a hidden iframe for printing
      const iframe = document.createElement('iframe')
      iframe.style.position = 'fixed'
      iframe.style.right = '0'
      iframe.style.bottom = '0'
      iframe.style.width = '0'
      iframe.style.height = '0'
      iframe.style.border = 'none'
      document.body.appendChild(iframe)
      
      // Write the invoice content to the iframe
      const iframeDoc = iframe.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(html)
        iframeDoc.close()
        
        // Wait for content to load then print
        iframe.onload = () => {
          setTimeout(() => {
            iframe.contentWindow?.focus()
            iframe.contentWindow?.print()
            
            // Remove iframe after printing
            setTimeout(() => {
              document.body.removeChild(iframe)
            }, 1000)
          }, 500)
        }
      }
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Failed to generate invoice. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handlePrintPDF}
      disabled={isLoading}
      className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Loading...
        </>
      ) : (
        <>
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Invoice
        </>
      )}
    </button>
  )
}

'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface SalesData {
  date: string
  revenue: number
  orders: number
}

interface ProductData {
  name: string
  sold: number
  revenue: number
}

export default function AdminReportsPage() {
  const [salesData, setSalesData] = useState<SalesData[]>([])
  const [topProducts, setTopProducts] = useState<ProductData[]>([])
  const [mostOrderedProduct, setMostOrderedProduct] = useState<ProductData | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30') // days
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrders, setTotalOrders] = useState(0)

  useEffect(() => {
    fetchReportData()
  }, [timeRange])

  const fetchReportData = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/reports?days=${timeRange}`)
      if (!response.ok) throw new Error('Failed to fetch report data')
      const data = await response.json()
      setSalesData(data.salesData || [])
      setTopProducts(data.topProducts || [])
      setMostOrderedProduct(data.mostOrderedProduct || null)
      setTotalRevenue(data.totalRevenue || 0)
      setTotalOrders(data.totalOrders || 0)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleExportCSV = () => {
    const headers = ['Date', 'Revenue', 'Orders']
    const rows = salesData.map((d) => [d.date, `₹${d.revenue.toFixed(2)}`, d.orders])
    const csv = [headers, ...rows]
      .map((row) => row.join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `sales-report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const getMaxRevenue = () => Math.max(...salesData.map((d) => d.revenue), 100)
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/admin/dashboard"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium mb-2 inline-block"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Track your store performance and sales insights</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-4 mb-8 flex justify-between items-center">
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-gray-900 font-medium"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 90 days</option>
                <option value="365">Last year</option>
              </select>
            </label>
          </div>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
          >
            📥 Export CSV
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium">Total Revenue</p>
            <p className="text-3xl font-bold text-gray-900">
              ₹{totalRevenue.toFixed(2)}
            </p>
            <p className="text-green-600 text-xs mt-1">Last {timeRange} days</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium">Total Orders</p>
            <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
            <p className="text-blue-600 text-xs mt-1">Completed orders</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium">Avg Order Value</p>
            <p className="text-3xl font-bold text-gray-900">₹{avgOrderValue.toFixed(2)}</p>
            <p className="text-purple-600 text-xs mt-1">Per order</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium">🏆 Most Ordered</p>
            {mostOrderedProduct ? (
              <>
                <p className="text-lg font-bold text-gray-900 truncate" title={mostOrderedProduct.name}>
                  {mostOrderedProduct.name}
                </p>
                <p className="text-orange-600 text-xs mt-1">{mostOrderedProduct.sold} units sold</p>
              </>
            ) : (
              <p className="text-gray-500 text-sm">No data</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales Chart */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">📊 Daily Revenue Trend</h2>
            {loading ? (
              <div className="h-64 flex items-center justify-center text-gray-500">
                Loading...
              </div>
            ) : (
              <div className="h-64 relative">
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-600 w-12">
                  <span>₹{getMaxRevenue().toFixed(0)}</span>
                  <span>₹{(getMaxRevenue() / 2).toFixed(0)}</span>
                  <span>₹0</span>
                </div>
                {/* Chart area */}
                <div className="ml-14 h-full border-b border-l border-gray-300 flex items-end gap-2 pb-6">
                  {salesData.length > 0 ? (
                    salesData.map((day, idx) => {
                      const maxRev = getMaxRevenue()
                      const height = Math.max((day.revenue / maxRev) * 100, 5)
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group" style={{ height: '100%' }}>
                          <div className="flex-1 w-full flex items-end justify-center">
                            <div 
                              className="w-full max-w-12 bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer relative" 
                              style={{ height: `${height}%` }}
                            >
                              {/* Tooltip */}
                              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block bg-gray-900 text-white text-xs rounded px-2 py-1 whitespace-nowrap z-10">
                                ₹{day.revenue.toFixed(2)} ({day.orders} orders)
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-gray-900 font-medium mt-1 text-center whitespace-nowrap">
                            {new Date(day.date).toLocaleDateString('en-IN', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      )
                    })
                  ) : (
                    <p className="text-gray-500 w-full text-center self-center">No data available for this period</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔥 Top Products by Revenue</h2>
            <div className="space-y-4">
              {topProducts.length > 0 ? (
                topProducts.slice(0, 5).map((product, idx) => (
                  <div key={idx} className="border-b pb-3 last:border-b-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                        idx === 0 ? 'bg-yellow-500' : idx === 1 ? 'bg-gray-400' : idx === 2 ? 'bg-orange-400' : 'bg-gray-300'
                      }`}>
                        {idx + 1}
                      </span>
                      <p className="font-medium text-gray-900 text-sm truncate flex-1" title={product.name}>
                        {product.name}
                      </p>
                    </div>
                    <div className="flex justify-between items-center mt-1 ml-8">
                      <p className="text-xs text-gray-600">{product.sold} units sold</p>
                      <p className="text-sm font-semibold text-green-600">₹{product.revenue.toFixed(2)}</p>
                    </div>
                    {/* Progress bar */}
                    <div className="ml-8 mt-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 rounded-full"
                        style={{ width: `${(product.revenue / (topProducts[0]?.revenue || 1)) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No sales data available</p>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Table */}
        <div className="bg-white rounded-lg shadow mt-8">
          <div className="px-6 py-4 border-b">
            <h2 className="text-xl font-bold text-gray-900">📋 Daily Breakdown</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Orders
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Avg Order Value
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : salesData.length > 0 ? (
                  salesData.map((day, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {new Date(day.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                      <td className="px-6 py-4 text-gray-900 font-medium">{day.orders}</td>
                      <td className="px-6 py-4 font-bold text-green-700">
                        ₹{day.revenue.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        ₹{(day.revenue / Math.max(day.orders, 1)).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      No data available for this period
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}


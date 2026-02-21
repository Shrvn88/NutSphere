'use client'

import { useRouter, useSearchParams } from 'next/navigation'

interface SortDropdownProps {
  currentSort: string
}

export default function SortDropdown({ currentSort }: SortDropdownProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', newSort)
    params.set('page', '1') // Reset to page 1 on sort change
    router.push(`/search?${params.toString()}`)
  }

  return (
    <select
      id="sort"
      name="sort"
      value={currentSort}
      onChange={(e) => handleSortChange(e.target.value)}
      className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
    >
      <option value="newest">Newest First</option>
      <option value="popular">Most Popular</option>
      <option value="price-asc">Price: Low to High</option>
      <option value="price-desc">Price: High to Low</option>
      <option value="rating">Highest Rated</option>
    </select>
  )
}


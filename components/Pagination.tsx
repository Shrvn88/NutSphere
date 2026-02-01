import Link from 'next/link'

interface PaginationProps {
  currentPage: number
  totalPages: number
  baseUrl: string
}

/**
 * Pagination component for navigating through paginated data
 */
export default function Pagination({ currentPage, totalPages, baseUrl }: Readonly<PaginationProps>) {
  const pages = []
  const maxVisible = 5

  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2))
  let endPage = Math.min(totalPages, startPage + maxVisible - 1)

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i)
  }

  const getPageUrl = (page: number) => {
    return page === 1 ? baseUrl : `${baseUrl}?page=${page}`
  }

  return (
    <nav className="flex justify-center items-center gap-2">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Previous
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
          Previous
        </span>
      )}

      {/* Page Numbers */}
      <div className="flex gap-1">
        {startPage > 1 && (
          <>
            <Link
              href={getPageUrl(1)}
              className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              1
            </Link>
            {startPage > 2 && (
              <span className="px-4 py-2 text-gray-500">...</span>
            )}
          </>
        )}

        {pages.map((page) => (
          <Link
            key={page}
            href={getPageUrl(page)}
            className={`px-4 py-2 rounded-md border transition-colors ${
              page === currentPage
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </Link>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <span className="px-4 py-2 text-gray-500">...</span>
            )}
            <Link
              href={getPageUrl(totalPages)}
              className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
            >
              {totalPages}
            </Link>
          </>
        )}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-4 py-2 rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors"
        >
          Next
        </Link>
      ) : (
        <span className="px-4 py-2 rounded-md bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed">
          Next
        </span>
      )}
    </nav>
  )
}

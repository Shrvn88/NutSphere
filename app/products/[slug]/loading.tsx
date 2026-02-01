export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="animate-pulse">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image skeleton */}
          <div className="bg-gray-200 rounded-lg h-96"></div>
          
          {/* Product info skeleton */}
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
            <div className="h-12 bg-gray-200 rounded w-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

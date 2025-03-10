import React from "react"

/**
 * Minimal DashboardSkeleton component for use as a Suspense fallback
 * Displays a simplified skeleton UI that mimics a dashboard layout
 */
const DashboardSkeleton: React.FC = () => {
  return (
    <div className="h-screen overflow-auto bg-gray-50 p-4 sm:p-6 dark:bg-gray-900">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="mb-3 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="mb-4 animate-pulse">
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-60 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-700"></div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="animate-pulse rounded-lg bg-white p-4 shadow dark:bg-gray-800"
          >
            <div className="mb-3 h-5 w-24 rounded bg-gray-200 dark:bg-gray-700"></div>
            <div className="h-8 w-20 rounded bg-gray-200 dark:bg-gray-700"></div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow dark:bg-gray-800">
        <div className="mb-4 animate-pulse">
          <div className="h-6 w-32 rounded bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="h-60 w-full animate-pulse rounded-md bg-gray-100 dark:bg-gray-700"></div>
      </div>
    </div>
  )
}

export default DashboardSkeleton

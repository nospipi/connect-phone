// "use client"

// const ErrorPage = () => {
//   return (
//     <div>
//       <h1>Error</h1>
//     </div>
//   )
// }
// export default ErrorPage

"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

const ErrorPage = ({
  error,
  reset = () => window.location.reload(),
}: {
  error?: Error | string | unknown
  reset?: () => void
}) => {
  const [countdown, setCountdown] = useState(15)

  // Extract error message properly based on type
  const errorMessage = error
    ? error instanceof Error
      ? error.message || "An unexpected error occurred"
      : typeof error === "string"
        ? error
        : "Something went wrong"
    : "Something went wrong"

  useEffect(() => {
    // Auto-redirect countdown
    if (countdown <= 0) {
      window.location.href = "/"
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 dark:bg-gray-900">
      <div className="h-2 bg-red-600"></div>

      <div className="px-6 py-8 md:p-10">
        <div className="flex flex-col items-center md:flex-row">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              Oops! An error occurred
            </h1>
            <p className="mb-6 text-gray-600 dark:text-gray-300">
              {errorMessage}
            </p>

            <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
              <button
                onClick={reset}
                className="inline-flex items-center justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Try Again
              </button>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="mr-2 h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7m-7-7v18"
                  />
                </svg>
                Back to Home
              </Link>
            </div>

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Redirecting to homepage in{" "}
                <span className="font-medium">{countdown}</span> seconds
              </p>
              <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
                <div
                  className="h-1.5 rounded-full bg-red-600 transition-all duration-1000 ease-in-out"
                  style={{ width: `${(countdown / 15) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage

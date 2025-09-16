"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

//--------------------------------------------------------------------

const ErrorPageContent = ({ error }: { error?: Error | string | unknown }) => {
  const [countdown, setCountdown] = useState(15)
  const router = useRouter()

  // Extract error message properly based on type
  const errorMessage = error
    ? error instanceof Error
      ? error.message || "An unexpected error occurred"
      : typeof error === "string"
        ? error
        : "Something went wrong"
    : "Something went wrong"

  useEffect(() => {
    if (countdown === 0) {
      router.refresh()
      setCountdown(15) // Reset the timer
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex h-full items-center justify-center px-4 py-12">
      <div className="h-2 bg-red-600"></div>

      <div className="px-6 py-8 md:p-10">
        <div className="flex flex-col items-center md:flex-row">
          <div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
              Oops! An error occurred
            </h1>
            <p className="mb-6 text-red-500 dark:text-red-400">
              {errorMessage}
            </p>

            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Will try again in{" "}
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

export default ErrorPageContent

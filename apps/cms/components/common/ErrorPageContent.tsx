"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { RiArrowLeftLine } from "@remixicon/react"

//--------------------------------------------------------------------

const ErrorPageContent = ({ error }: { error?: Error | string | unknown }) => {
  const [countdown, setCountdown] = useState(15)
  const router = useRouter()

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
      setCountdown(15)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  return (
    <div className="flex h-full items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="px-6 py-8 md:p-10">
          <h1 className="mb-2 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            Oops! An error occurred
          </h1>
          <p className="mb-8 text-red-500 dark:text-red-400">{errorMessage}</p>

          <div className="mb-8 border-t border-gray-200 pt-6 dark:border-gray-700">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Will try again in <span className="font-medium">{countdown}</span>{" "}
              seconds
            </p>
            <div className="mt-2 h-1.5 w-full rounded-full bg-gray-200 dark:bg-gray-700">
              <div
                className="h-1.5 rounded-full bg-red-600 transition-all duration-1000 ease-in-out"
                style={{ width: `${(countdown / 15) * 100}%` }}
              ></div>
            </div>
          </div>

          <div className="flex justify-center sm:justify-start">
            <button
              onClick={() => router.back()}
              className="inline-flex items-center gap-2 border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 shadow-sm transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <RiArrowLeftLine className="h-4 w-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPageContent

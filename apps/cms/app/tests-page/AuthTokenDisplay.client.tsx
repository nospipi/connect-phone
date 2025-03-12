"use client"

import { useState } from "react"
import {
  RiEyeLine,
  RiEyeOffLine,
  RiClipboardLine,
  RiCheckLine,
  RiErrorWarningLine,
} from "@remixicon/react"

interface AuthTokenDisplayProps {
  token: string | null | undefined
}

const AuthTokenDisplay = ({ token }: AuthTokenDisplayProps) => {
  const [copied, setCopied] = useState(false)
  const [showToken, setShowToken] = useState(false)

  const copyToClipboard = async () => {
    if (!token) return

    try {
      await navigator.clipboard.writeText(token)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy token to clipboard", err)
    }
  }

  const toggleShowToken = () => {
    setShowToken(!showToken)
  }

  // Check if token is null or undefined
  const hasToken = token !== null && token !== undefined

  return (
    <div className="rounded-md border border-gray-200 bg-white p-3 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Auth Token
        </span>
        <div className="flex space-x-2">
          {hasToken && (
            <>
              <button
                onClick={toggleShowToken}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                title={showToken ? "Hide token" : "Show token"}
                disabled={!hasToken}
              >
                {showToken ? (
                  <RiEyeOffLine size={18} />
                ) : (
                  <RiEyeLine size={18} />
                )}
              </button>
              <button
                onClick={copyToClipboard}
                className="rounded-md p-1.5 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
                title="Copy to clipboard"
                disabled={!hasToken}
              >
                {copied ? (
                  <RiCheckLine size={18} className="text-green-500" />
                ) : (
                  <RiClipboardLine size={18} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {!hasToken ? (
        <div className="mt-2 flex items-center text-amber-600 dark:text-amber-400">
          <RiErrorWarningLine size={16} className="mr-1" />
          <p className="text-xs">No authentication token available</p>
        </div>
      ) : showToken ? (
        <div className="mt-2 max-h-32 overflow-y-auto rounded bg-gray-50 p-2 dark:bg-gray-900">
          <p className="break-all font-mono text-xs text-gray-600 dark:text-gray-400">
            {token}
          </p>
        </div>
      ) : (
        <div className="mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {copied
              ? "✓ Token copied to clipboard!"
              : "Click the clipboard icon to copy the token"}
          </p>
        </div>
      )}
    </div>
  )
}

export default AuthTokenDisplay

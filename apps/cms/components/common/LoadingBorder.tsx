// app/components/LoadingBorder.tsx

"use client"

import { ReactNode } from "react"

//------------------------------------------------------------

interface LoadingBorderProps {
  children: ReactNode
  isLoading: boolean
}

export default function LoadingBorder({
  children,
  isLoading,
}: LoadingBorderProps) {
  return (
    <div className="relative">
      <div
        className={`relative rounded-lg border-2 ${isLoading ? "border-transparent" : "border-gray-200 dark:border-gray-800"}`}
      >
        {isLoading && (
          <>
            <div className="pointer-events-none absolute -inset-[2px] overflow-hidden rounded-lg">
              <div className="absolute inset-0 animate-[spin_3s_linear_infinite] bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-75 blur-sm"></div>
            </div>
            <div className="pointer-events-none absolute -inset-[1px] animate-[spin_3s_linear_infinite] rounded-lg bg-gradient-to-r from-blue-500/30 via-blue-400/30 to-blue-500/30"></div>
          </>
        )}
        <div className="relative rounded-lg bg-white dark:bg-gray-950">
          {children}
        </div>
      </div>
    </div>
  )
}

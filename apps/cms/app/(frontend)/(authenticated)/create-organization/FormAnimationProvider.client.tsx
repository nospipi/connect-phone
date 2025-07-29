// FormAnimation.client.tsx
"use client"

import { useEffect, useState } from "react"

export default function FormAnimationProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Set visible after component mounts
    setIsVisible(true)
  }, [])

  return (
    <div
      className={`transform transition-all duration-500 ease-out ${
        isVisible ? "translate-x-0 opacity-100" : "-translate-x-5 opacity-0"
      }`}
    >
      {children}
    </div>
  )
}

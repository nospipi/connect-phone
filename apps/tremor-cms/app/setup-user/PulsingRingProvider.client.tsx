"use client"

import React from "react"

type PulsingRingProviderProps = {
  children: React.ReactNode
  color?: string
  ringCount?: number
  size?: number
  speed?: number
  className?: string
}

export default function PulsingRingProvider({
  children,
  ringCount = 2,
  size = 1.5,
  speed = 1.5,
  className = "",
}: PulsingRingProviderProps) {
  const rings = Array.from({ length: ringCount }, (_, i) => {
    const animationDelay = `${(i * 0.5) / speed}s`
    const ringSize = `${size * (2 + i * 0.5)}rem`

    return (
      <div
        key={i}
        className={`absolute animate-pulse rounded-full bg-slate-300 bg-gradient-radial dark:bg-slate-800`}
        style={{
          width: ringSize,
          height: ringSize,
          animationDelay,
          animationDuration: `${3 / speed}s`,
          opacity: 0,
        }}
      />
    )
  })

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {rings}
      <div className="z-10">{children}</div>
    </div>
  )
}

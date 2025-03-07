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
  color = "sky",
  ringCount = 2,
  size = 1.5,
  speed = 1.5,
  className = "",
}: PulsingRingProviderProps) {
  // Map color string to Tailwind color classes
  const colorMap: Record<string, string> = {
    sky: "from-sky-400/30 to-sky-400/5",
    blue: "from-blue-400/30 to-blue-400/5",
    purple: "from-purple-400/30 to-purple-400/5",
    indigo: "from-indigo-400/30 to-indigo-400/5",
    pink: "from-pink-400/30 to-pink-400/5",
    rose: "from-rose-400/30 to-rose-400/5",
    amber: "from-amber-400/30 to-amber-400/5",
    emerald: "from-emerald-400/30 to-emerald-400/5",
  }

  // Choose color class based on prop
  const colorClass = colorMap[color] || colorMap.sky

  // Generate rings based on ringCount
  const rings = Array.from({ length: ringCount }, (_, i) => {
    // Calculate animation delay so rings pulse sequentially
    const animationDelay = `${(i * 0.5) / speed}s`
    // Calculate size of this ring
    const ringSize = `${size * (2 + i * 0.5)}rem`

    return (
      <div
        key={i}
        className={`bg-gradient-radial absolute rounded-full ${colorClass} animate-pulse`}
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
      <div className="relative z-10">{children}</div>
    </div>
  )
}

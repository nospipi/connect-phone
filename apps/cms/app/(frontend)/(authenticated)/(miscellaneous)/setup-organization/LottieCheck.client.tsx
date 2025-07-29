"use client"

import animationData from "./Animation - 1741343069156.json"
import { useLottie } from "lottie-react"

const LottieCheckmark = () => {
  const defaultOptions = {
    animationData: animationData,
    loop: false,
    speed: 0.5,
  }

  const { View } = useLottie(defaultOptions)

  return <div className="w-30">{View}</div>
}

export default LottieCheckmark

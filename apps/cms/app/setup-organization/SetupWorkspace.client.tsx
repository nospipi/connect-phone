"use client"

import { useEffect, useCallback, useRef } from "react"
import { stepOne, stepTwo, stepThree, resetSetup } from "./server_actions"
import { Button } from "@/components/Button"
import { RiArrowRightLine, RiRefreshLine } from "@remixicon/react"
import Link from "next/link"
import lottie from "lottie-web"
import animation from "./Animation - 1741343069156.json"
import LottieCheckmark from "./LottieCheck.client"

interface StepDisplayProps {
  currentStep: number
  isComplete: boolean
}

const SetupWorkspace = ({ currentStep, isComplete }: StepDisplayProps) => {
  const animationContainer = useRef(null)

  useEffect(() => {
    let anim: any

    if (animationContainer.current) {
      // Initialize lottie animation with imported JSON
      anim = lottie.loadAnimation({
        container: animationContainer.current,
        renderer: "svg",
        loop: false,
        autoplay: true,
        animationData: animation,
      })
      anim.setSpeed(0.5)
    }

    // Clean up animation when component unmounts
    return () => {
      if (anim) {
        anim.destroy()
      }
    }
  }, [])

  const runSteps = useCallback(async () => {
    if (isComplete) return

    if (currentStep === 0) {
      await stepOne()
    } else if (currentStep === 1) {
      await stepTwo()
    } else if (currentStep === 2) {
      await stepThree()
    }
  }, [currentStep, isComplete])

  useEffect(() => {
    runSteps()
  }, [runSteps])

  const handleReset = async () => {
    await resetSetup()
  }

  const stepNames = [
    "Initializing system",
    "Configuring settings",
    "Finalizing setup",
  ]

  return (
    <div>
      {isComplete ? (
        <div className="flex flex-col items-center text-center">
          {/* <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
            <svg
              className="h-6 w-6 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div> */}

          <LottieCheckmark />

          <h2 className="mb-4 text-lg font-medium text-gray-900 dark:text-white">
            Setup Complete!
          </h2>

          <div className="flex w-full max-w-md flex-col gap-4 sm:flex-row">
            <Link href="/org-id/overview" className="flex-1">
              <Button className="group flex w-full items-center justify-center gap-2 rounded-lg px-5 py-3 font-medium !text-white transition-colors duration-200">
                Visit your dashboard
                <RiArrowRightLine
                  className="animate-pulse-horizontal h-5 w-5"
                  style={{
                    animation: "pulseHorizontal 1.5s ease-in-out infinite",
                  }}
                />
              </Button>
            </Link>

            {/*  keyframes animation to global CSS */}
            <style jsx global>{`
              @keyframes pulseHorizontal {
                0%,
                100% {
                  transform: translateX(0);
                }
                50% {
                  transform: translateX(3px);
                }
              }
            `}</style>
          </div>

          <button
            onClick={handleReset}
            className="fixed right-2 top-2 flex flex-1 items-center justify-center gap-2 rounded-lg border border-gray-300 px-5 py-3 font-medium text-gray-700 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800/50"
          >
            <RiRefreshLine className="h-5 w-5" />
            Reset Setup
          </button>
        </div>
      ) : (
        <>
          {/* Progress bar */}

          <h1 className="mb-6 text-xl font-semibold text-gray-900 dark:text-white">
            Setting Up Your Workspace
          </h1>

          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>Progress</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>

            <progress
              className="h-2 w-full [&::-moz-progress-bar]:rounded-full [&::-moz-progress-bar]:bg-blue-600 dark:[&::-moz-progress-bar]:bg-blue-500 [&::-webkit-progress-bar]:rounded-full [&::-webkit-progress-bar]:bg-gray-200 dark:[&::-webkit-progress-bar]:bg-gray-700 [&::-webkit-progress-value]:rounded-full [&::-webkit-progress-value]:bg-blue-600 dark:[&::-webkit-progress-value]:bg-blue-500"
              value={currentStep}
              max={3}
            />
          </div>

          {/* Steps list */}
          <div className="space-y-4">
            {stepNames.map((name, index) => (
              <div key={index} className="flex items-center">
                <div
                  className={`mr-3 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                    currentStep > index
                      ? "bg-blue-600 text-white dark:bg-blue-500"
                      : currentStep === index
                        ? "border-2 border-blue-600 bg-white text-blue-600 dark:border-blue-500 dark:bg-gray-800 dark:text-blue-500"
                        : "border-2 border-gray-300 bg-white text-gray-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400"
                  }`}
                >
                  {currentStep > index ? (
                    <svg
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>

                <div className="flex-grow">
                  <p
                    className={`font-medium ${
                      currentStep > index
                        ? "text-gray-700 dark:text-gray-300"
                        : currentStep === index
                          ? "text-gray-900 dark:text-white"
                          : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {name}
                  </p>
                </div>

                {currentStep === index && (
                  <div className="ml-2 flex items-center">
                    <svg
                      className="h-4 w-4 animate-spin text-blue-600 dark:text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!isComplete && (
        <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
          {"Please wait while we set up your workspace. This won't take long."}
        </p>
      )}
    </div>
  )
}

export default SetupWorkspace

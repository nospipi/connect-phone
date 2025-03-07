"use client"

import { useState, useRef } from "react"
import logo from "@/public/logo.png"
import Image from "next/image"

export default function LogoUpload() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [ipConfirmed, setIpConfirmed] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create a preview URL for the selected image
    const previewUrl = URL.createObjectURL(file)
    setLogoPreview(previewUrl)
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="group relative mb-4">
        <div
          className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-2 border-dashed border-gray-300 bg-gray-100 transition-colors group-hover:border-indigo-500 dark:border-gray-700 dark:bg-gray-800"
          style={
            logoPreview
              ? {
                  backgroundImage: `url(${logoPreview})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }
              : {}
          }
        >
          {!logoPreview && (
            <div className="p-2 text-center text-sm text-gray-400">
              <Image
                src={logo}
                alt="logo"
                width={50}
                height={50}
                className="transition-all duration-200 dark:invert"
              />
            </div>
          )}
        </div>
        <label
          htmlFor="logo-upload"
          className={`absolute inset-0 flex cursor-pointer items-center justify-center opacity-0 transition-opacity ${
            ipConfirmed ? "group-hover:opacity-100" : "cursor-not-allowed"
          }`}
          onClick={(e) => {
            if (!ipConfirmed) {
              e.preventDefault()
            }
          }}
        >
          <div className="rounded-full bg-indigo-600/80 p-2 text-white shadow-lg dark:bg-indigo-700/80">
            Upload
          </div>
        </label>
      </div>
      <input
        type="file"
        id="logo-upload"
        name="logo"
        accept="image/*"
        ref={fileInputRef}
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            if (file.size > 1048576) {
              alert("File is too large. Maximum size is 1MB.")
              e.target.value = ""
              return
            }
            handleFileChange(e)
          }
        }}
        className={`mx-auto block w-full max-w-xs text-center text-sm ${
          ipConfirmed
            ? "text-gray-700 file:mr-4 file:rounded-full file:border-0 file:bg-indigo-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-indigo-600 hover:file:bg-indigo-100 focus:outline-none dark:text-gray-400 dark:file:bg-gray-800 dark:file:text-indigo-400 dark:hover:file:bg-gray-700"
            : "cursor-not-allowed text-gray-400 opacity-70 file:mr-4 file:rounded-full file:border-0 file:bg-gray-100 file:px-4 file:py-2 file:text-sm file:font-medium file:text-gray-400 dark:text-gray-600 dark:file:bg-gray-900 dark:file:text-gray-600"
        }`}
        disabled={!ipConfirmed}
        required
      />

      <p className="mt-2 text-center text-xs text-gray-500">
        Recommended: Square image, at least 512x512px
      </p>

      <div className="mt-4 flex items-start space-x-2 self-start">
        <input
          type="checkbox"
          id="ip-confirm"
          name="ip-confirm"
          checked={ipConfirmed}
          onChange={(e) => {
            setIpConfirmed(e.target.checked)
            //if its false, remove the preview
            if (!e.target.checked) {
              setLogoPreview(null)
            }
          }}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800"
        />
        <label
          htmlFor="ip-confirm"
          className="text-sm text-gray-700 dark:text-gray-300"
        >
          I confirm that i own the rights to this image , and I take full
          responsibility for sharing it
        </label>
      </div>
    </div>
  )
}

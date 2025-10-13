// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/upload/page.tsx
import { RiArrowLeftLine } from "@remixicon/react"
import Link from "next/link"
import FileUploadForm from "./FileUploadForm.client"

//----------------------------------------------------------------------

const Page = async () => {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <Link
          href="/media"
          className="flex h-full items-center justify-center px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gray-300"
        >
          <RiArrowLeftLine className="h-4 w-4" />
        </Link>
        <div className="flex items-center gap-4 py-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Upload Media
            </h1>
            <p className="text-sm text-gray-500">
              Upload images to your media library
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-hidden py-4">
        <div className="flex h-full w-full justify-center overflow-auto px-4">
          <div className="w-full max-w-4xl">
            <FileUploadForm />

            {/* Help Section */}
            <div className="mt-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Image requirements
              </h3>
              <ul className="mt-2 space-y-1 text-sm text-blue-700 dark:text-blue-200">
                <li>• Maximum file size: 1MB per image</li>
                <li>• Supported formats: JPG, PNG, GIF, WebP</li>
                <li>• Up to 5 images can be uploaded at once</li>
                <li>• Images will be uploaded sequentially</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page

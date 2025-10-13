// apps/cms/app/(frontend)/(authenticated)/(dashboard)/media/upload/page.tsx
import { RiArrowLeftLine, RiCheckLine, RiAlertLine } from "@remixicon/react"
import Link from "next/link"
import FileUploadForm from "./FileUploadForm.client"

//----------------------------------------------------------------------

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) => {
  const params = await searchParams
  const { success, error, total } = params

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
            {/* Success Message */}
            {success && (
              <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-800/50">
                      <RiCheckLine className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-900 dark:text-green-100">
                      Upload complete
                    </p>
                    <p className="mt-1 text-sm text-green-700 dark:text-green-200">
                      Successfully uploaded {total}{" "}
                      {Number(total) === 1 ? "image" : "images"}
                    </p>
                  </div>
                  <Link
                    href="/media/upload"
                    className="text-sm text-green-600 underline hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                  >
                    Dismiss
                  </Link>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-800 dark:bg-red-900/20">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-800/50">
                      <RiAlertLine className="h-5 w-5 text-red-600 dark:text-red-400" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-red-900 dark:text-red-100">
                      Upload failed
                    </p>
                    <p className="mt-1 text-sm text-red-700 dark:text-red-200">
                      {decodeURIComponent(error)}
                    </p>
                  </div>
                  <Link
                    href="/media/upload"
                    className="text-sm text-red-600 underline hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Dismiss
                  </Link>
                </div>
              </div>
            )}

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

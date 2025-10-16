// app/components/common/DotsLoading.tsx

export default function DotsLoading() {
  return (
    <div className="flex items-center justify-center gap-1">
      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.6s] [animation-duration:1.2s] dark:bg-gray-600"></div>
      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-delay:-0.3s] [animation-duration:1.2s] dark:bg-gray-600"></div>
      <div className="h-1 w-1 animate-pulse rounded-full bg-gray-500 [animation-duration:1.2s] dark:bg-gray-600"></div>
    </div>
  )
}

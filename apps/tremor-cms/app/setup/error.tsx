"use client"

const Error = ({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) => {
  return (
    <div>
      <div>{error?.message || "An error occurred"}</div>
      <button onClick={() => reset()}>Try again</button>
    </div>
  )
}
export default Error

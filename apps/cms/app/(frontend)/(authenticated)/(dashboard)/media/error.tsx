"use client"

import ErrorPageContent from "@/components/common/ErrorPageContent"

//--------------------------------------------------------------------

const ErrorPage = ({ error }: { error?: Error | string | unknown }) => {
  return <ErrorPageContent error={error} />
}

export default ErrorPage

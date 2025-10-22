// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/InclusionsMultiSelect.client.tsx
"use client"

import { useRouter } from "next/navigation"
import MultiSelect from "@/components/common/MultiSelect.client"

//------------------------------------------------------------

interface InclusionsMultiSelectProps {
  options: { value: string; label: string }[]
  selectedValues: string[]
}

export default function InclusionsMultiSelect({
  options,
  selectedValues,
}: InclusionsMultiSelectProps) {
  const router = useRouter()

  const handleChange = (values: string[]) => {
    const newParams = new URLSearchParams(window.location.search)
    if (values.length > 0) {
      newParams.set("inclusionIds", values.join(","))
    } else {
      newParams.delete("inclusionIds")
    }
    router.replace(`${window.location.pathname}?${newParams.toString()}`)
  }

  return (
    <MultiSelect
      fieldName="inclusions"
      options={options}
      selectedValues={selectedValues}
      placeholder="Select inclusions..."
      onChange={handleChange}
    />
  )
}

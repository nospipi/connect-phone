// apps/cms/app/(frontend)/(authenticated)/(dashboard)/inventory/offers/create-new/ExclusionsMultiSelect.client.tsx
"use client"

import { useRouter } from "next/navigation"
import MultiSelect from "@/components/common/MultiSelect.client"

//------------------------------------------------------------

interface ExclusionsMultiSelectProps {
  options: { value: string; label: string }[]
  selectedValues: string[]
}

export default function ExclusionsMultiSelect({
  options,
  selectedValues,
}: ExclusionsMultiSelectProps) {
  const router = useRouter()

  const handleChange = (values: string[]) => {
    const newParams = new URLSearchParams(window.location.search)
    if (values.length > 0) {
      newParams.set("exclusionIds", values.join(","))
    } else {
      newParams.delete("exclusionIds")
    }
    router.replace(`${window.location.pathname}?${newParams.toString()}`)
  }

  return (
    <MultiSelect
      fieldName="exclusions"
      options={options}
      selectedValues={selectedValues}
      placeholder="Select exclusions..."
      onChange={handleChange}
    />
  )
}

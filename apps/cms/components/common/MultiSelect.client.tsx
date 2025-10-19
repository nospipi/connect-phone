// apps/cms/components/common/forms/MultiSelect.client.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { RiArrowDownSLine, RiCloseLine, RiCheckLine } from "@remixicon/react"

//------------------------------------------------------------

interface MultiSelectOption {
  value: string
  label: string
}

interface MultiSelectProps {
  fieldName: string
  options: MultiSelectOption[]
  selectedValues: string[]
  placeholder?: string
  onChange: (values: string[]) => void
}

export default function MultiSelect({
  fieldName,
  options,
  selectedValues,
  placeholder = "Select options...",
  onChange,
}: MultiSelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleToggle = (value: string) => {
    const newValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value]
    onChange(newValues)
  }

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selectedValues.filter((v) => v !== value))
  }

  const getSelectedLabels = () => {
    return selectedValues
      .map((value) => options.find((opt) => opt.value === value)?.label)
      .filter(Boolean)
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex min-h-[42px] cursor-pointer items-center justify-between border border-gray-300 bg-white px-3 py-2 text-sm transition-colors hover:border-gray-400 dark:border-slate-700/50 dark:bg-slate-900/50 dark:hover:border-slate-600/50"
      >
        <div className="flex flex-1 flex-wrap items-center gap-1">
          {selectedValues.length === 0 ? (
            <span className="text-gray-500 dark:text-slate-500">
              {placeholder}
            </span>
          ) : (
            getSelectedLabels().map((label, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1 bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300"
              >
                {label}
                <button
                  type="button"
                  onClick={(e) =>
                    handleRemove(
                      selectedValues[
                        getSelectedLabels().findIndex((l) => l === label)
                      ],
                      e,
                    )
                  }
                  className="hover:text-indigo-900 dark:hover:text-indigo-100"
                >
                  <RiCloseLine className="h-3 w-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <RiArrowDownSLine
          className={`h-5 w-5 flex-shrink-0 text-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {options.map((option) => {
            const isSelected = selectedValues.includes(option.value)
            return (
              <div
                key={option.value}
                onClick={() => handleToggle(option.value)}
                className="flex cursor-pointer items-center justify-between px-3 py-2 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <span
                  className={`${
                    isSelected
                      ? "font-medium text-indigo-600 dark:text-indigo-400"
                      : "text-gray-900 dark:text-gray-100"
                  }`}
                >
                  {option.label}
                </span>
                {isSelected && (
                  <RiCheckLine className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

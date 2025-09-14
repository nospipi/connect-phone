"use client"

import * as NavigationMenuPrimitives from "@radix-ui/react-navigation-menu"
import React, { useState, useEffect } from "react"
import { usePathname } from "next/navigation"
import { cx, focusRing } from "@/lib/utils"

function getSubtree(
  options: { asChild: boolean | undefined; children: React.ReactNode },
  content: React.ReactNode | ((children: React.ReactNode) => React.ReactNode),
) {
  const { asChild, children } = options
  if (!asChild)
    return typeof content === "function" ? content(children) : content

  const firstChild = React.Children.only(children) as React.ReactElement

  return React.cloneElement(firstChild, {
    ...(firstChild.props as React.PropsWithChildren<{}>),
    ...("children" in (firstChild.props as React.PropsWithChildren<{}>)
      ? {
          children:
            typeof content === "function"
              ? content(
                  (firstChild.props as React.PropsWithChildren<{}>).children,
                )
              : content,
        }
      : {}),
  })
}

const TabNavigation = React.forwardRef<
  React.ComponentRef<typeof NavigationMenuPrimitives.Root>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Root>,
    "orientation" | "defaultValue" | "dir"
  >
>(({ className, children, ...props }, forwardedRef) => (
  <NavigationMenuPrimitives.Root ref={forwardedRef} {...props} asChild={false}>
    <NavigationMenuPrimitives.List
      className={cx(
        // base
        "border-b[scrollbar-width:none] flex items-center justify-start whitespace-nowrap [&::-webkit-scrollbar]:hidden",
        // border color
        "border-gray-200 dark:border-gray-800",
        className,
      )}
    >
      {children}
    </NavigationMenuPrimitives.List>
  </NavigationMenuPrimitives.Root>
))

TabNavigation.displayName = "TabNavigation"

const TabNavigationLink = React.forwardRef<
  React.ElementRef<typeof NavigationMenuPrimitives.Link>,
  Omit<
    React.ComponentPropsWithoutRef<typeof NavigationMenuPrimitives.Link>,
    "onSelect"
  > & { disabled?: boolean; href: string; count?: number }
>(
  (
    { asChild, disabled, href, className, children, count, ...props },
    forwardedRef,
  ) => {
    const pathname = usePathname()
    const [loadingHref, setLoadingHref] = useState<string | null>(null)

    const handleClick = () => {
      // ✅ only trigger shimmer if navigating to a *different* tab
      if (pathname !== href) {
        setLoadingHref(href)
      }
    }

    useEffect(() => {
      // reset shimmer when navigation completes
      setLoadingHref(null)
    }, [pathname])

    const isActive = pathname === href

    return (
      <NavigationMenuPrimitives.Item className="flex" aria-disabled={disabled}>
        <NavigationMenuPrimitives.Link
          aria-disabled={disabled}
          ref={forwardedRef}
          onSelect={() => {}}
          asChild={asChild}
          {...props}
          className={cx("group flex shrink-0 items-center", className)}
        >
          {getSubtree({ asChild, children }, (children) => (
            <span
              onClick={handleClick}
              className={cx(
                "relative -mb-px flex items-center overflow-hidden border-b-2 border-transparent px-3 pb-2 pt-2 text-sm font-medium transition-all",
                "text-gray-500 dark:text-gray-500",
                "group-hover:text-gray-700 group-hover:dark:text-gray-400",
                "group-hover:border-gray-300 group-hover:dark:border-gray-400",
                "group-data-[active]:border-indigo-600 group-data-[active]:text-indigo-600",
                "group-data-[active]:dark:border-indigo-500 group-data-[active]:dark:text-indigo-500",
                disabled
                  ? "pointer-events-none text-gray-300 dark:text-gray-700"
                  : "",
                focusRing,
              )}
            >
              {/* ✅ show shimmer only if it's loading AND not the active tab */}
              {loadingHref === href && !isActive && (
                <div className="absolute inset-0 z-0 animate-[shimmer_1.8s_infinite] bg-gradient-to-r from-transparent via-gray-900/20 to-transparent dark:via-white/20" />
              )}
              <span className="relative z-10 flex items-center">
                {children}
                {/* Count indicator */}
                {count != null && count > 0 && (
                  <span
                    className={cx(
                      "ml-2 inline-flex min-w-[1rem] items-center justify-center rounded-full p-1 px-2 text-[10px] font-medium leading-none",
                      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
                      "group-data-[active]:bg-indigo-100 group-data-[active]:text-indigo-700",
                      "group-data-[active]:dark:bg-indigo-900/50 group-data-[active]:dark:text-indigo-300",
                      "group-hover:bg-gray-200 group-hover:dark:bg-gray-700",
                      "transition-colors",
                    )}
                  >
                    {count > 9 ? "9+" : count}
                  </span>
                )}
              </span>
            </span>
          ))}
        </NavigationMenuPrimitives.Link>
      </NavigationMenuPrimitives.Item>
    )
  },
)

TabNavigationLink.displayName = "TabNavigationLink"

export { TabNavigation, TabNavigationLink }

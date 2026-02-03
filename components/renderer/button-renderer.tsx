"use client"

import { ButtonComponent, ThemeTokens } from "@/types/component-tree"
import { cn } from "@/lib/utils"
import Link from "next/link"

interface ButtonRendererProps {
  component: ButtonComponent
  theme: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

const variantToClasses: Record<string, string> = {
  primary: "bg-primary text-white hover:bg-primary/90",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline: "border border-input bg-background hover:bg-accent",
  ghost: "hover:bg-accent hover:text-accent-foreground",
}

export function ButtonRenderer({
  component,
  theme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: ButtonRendererProps) {
  const isSelected = component.id === selectedComponentId
  const baseClasses =
    "inline-flex items-center justify-center rounded-md px-6 py-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"

  const button = (
    <button
      className={cn(
        baseClasses,
        variantToClasses[component.variant] || variantToClasses.primary,
        component.className,
        !isPreview && isSelected && "ring-2 ring-primary ring-offset-2",
        !isPreview && "hover:scale-105 transition-transform"
      )}
      onClick={(e) => {
        if (!isPreview && component.id && onComponentClick) {
          e.stopPropagation()
          onComponentClick(component.id)
        }
      }}
    >
      {component.label}
    </button>
  )

  if (component.href && component.href !== "#") {
    return (
      <Link href={component.href} className="inline-block">
        {button}
      </Link>
    )
  }

  return button
}

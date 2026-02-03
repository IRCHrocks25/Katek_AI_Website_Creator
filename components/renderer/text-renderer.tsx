"use client"

import { TextComponent, ThemeTokens } from "@/types/component-tree"
import { cn } from "@/lib/utils"

interface TextRendererProps {
  component: TextComponent
  theme: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

const roleToTag: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  h4: "h4",
  h5: "h5",
  h6: "h6",
  p: "p",
  span: "span",
}

const roleToSize: Record<string, string> = {
  h1: "text-5xl md:text-6xl font-bold",
  h2: "text-4xl md:text-5xl font-bold",
  h3: "text-3xl md:text-4xl font-semibold",
  h4: "text-2xl md:text-3xl font-semibold",
  h5: "text-xl md:text-2xl font-medium",
  h6: "text-lg md:text-xl font-medium",
  p: "text-base md:text-lg",
  span: "text-base",
}

export function TextRenderer({
  component,
  theme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: TextRendererProps) {
  const Tag = roleToTag[component.role] || "p"
  const sizeClass = roleToSize[component.role] || ""
  const isSelected = component.id === selectedComponentId

  return (
    <Tag
      className={cn(
        sizeClass,
        component.className,
        !isPreview && isSelected && "ring-2 ring-primary ring-offset-2",
        !isPreview && "hover:outline hover:outline-1 hover:outline-primary/20"
      )}
      style={{
        color: theme.colors.foreground,
      }}
      onClick={(e) => {
        if (!isPreview && component.id && onComponentClick) {
          e.stopPropagation()
          onComponentClick(component.id)
        }
      }}
    >
      {component.content}
    </Tag>
  )
}

"use client"

import { StackComponent, ThemeTokens, Component } from "@/types/component-tree"
import { TextRenderer } from "./text-renderer"
import { ButtonRenderer } from "./button-renderer"
import { ImageRenderer } from "./image-renderer"
import { cn } from "@/lib/utils"

interface StackRendererProps {
  component: StackComponent
  theme: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

export function StackRenderer({
  component,
  theme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: StackRendererProps) {
  const gap = component.gap ?? 16
  const isSelected = component.id === selectedComponentId

  const getAlignClasses = (align?: string) => {
    switch (align) {
      case "start":
        return "items-start"
      case "center":
        return "items-center"
      case "end":
        return "items-end"
      case "stretch":
        return "items-stretch"
      default:
        return "items-start"
    }
  }

  const getJustifyClasses = (justify?: string) => {
    switch (justify) {
      case "start":
        return "justify-start"
      case "center":
        return "justify-center"
      case "end":
        return "justify-end"
      case "between":
        return "justify-between"
      case "around":
        return "justify-around"
      default:
        return "justify-start"
    }
  }

  return (
    <div
      className={cn(
        "flex",
        component.direction === "horizontal" ? "flex-row" : "flex-col",
        getAlignClasses(component.align),
        getJustifyClasses(component.justify),
        component.className,
        !isPreview && isSelected && "ring-2 ring-primary ring-offset-2",
        !isPreview && "hover:outline hover:outline-1 hover:outline-primary/20"
      )}
      style={{ gap: `${gap}px` }}
      onClick={(e) => {
        if (!isPreview && component.id && onComponentClick) {
          e.stopPropagation()
          onComponentClick(component.id)
        }
      }}
    >
      {component.children.map((child, index) => {
        const key = child.id || `child-${index}`
        switch (child.type) {
          case "Text":
            return (
              <TextRenderer
                key={key}
                component={child}
                theme={theme}
                isPreview={isPreview}
                onComponentClick={onComponentClick}
                selectedComponentId={selectedComponentId}
              />
            )
          case "Button":
            return (
              <ButtonRenderer
                key={key}
                component={child}
                theme={theme}
                isPreview={isPreview}
                onComponentClick={onComponentClick}
                selectedComponentId={selectedComponentId}
              />
            )
          case "Image":
            return (
              <ImageRenderer
                key={key}
                component={child}
                theme={theme}
                isPreview={isPreview}
                onComponentClick={onComponentClick}
                selectedComponentId={selectedComponentId}
              />
            )
          default:
            return null
        }
      })}
    </div>
  )
}

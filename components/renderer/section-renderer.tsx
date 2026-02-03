"use client"

import { Component, SectionComponent, ThemeTokens } from "@/types/component-tree"
import { StackRenderer } from "./stack-renderer"
import { TextRenderer } from "./text-renderer"
import { ButtonRenderer } from "./button-renderer"
import { ImageRenderer } from "./image-renderer"
import { cn } from "@/lib/utils"

interface SectionRendererProps {
  component: SectionComponent
  theme: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

export function SectionRenderer({
  component,
  theme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: SectionRendererProps) {
  const padding = component.padding || {}
  const paddingTop = padding.top ?? 64
  const paddingBottom = padding.bottom ?? 64
  const paddingLeft = padding.left ?? 0
  const paddingRight = padding.right ?? 0

  const isSelected = component.id === selectedComponentId

  const getSectionClasses = (variant: string) => {
    const base = "w-full"
    switch (variant) {
      case "hero_centered":
        return `${base} flex flex-col items-center justify-center text-center`
      case "hero_split":
        return `${base} grid grid-cols-1 md:grid-cols-2 gap-8 items-center`
      case "hero_with_badges":
        return `${base} flex flex-col items-center justify-center text-center`
      case "features_grid":
        return `${base} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8`
      case "features_list":
        return `${base} flex flex-col gap-6`
      case "pricing_2_tier":
        return `${base} grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto`
      case "pricing_3_tier":
        return `${base} grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto`
      case "faq_accordion":
        return `${base} flex flex-col gap-4 max-w-3xl mx-auto`
      case "faq_list":
        return `${base} flex flex-col gap-6 max-w-3xl mx-auto`
      case "testimonials_cards":
        return `${base} grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
      case "testimonials_single":
        return `${base} flex flex-col items-center text-center max-w-3xl mx-auto`
      case "cta_centered":
        return `${base} flex flex-col items-center justify-center text-center`
      case "cta_split":
        return `${base} grid grid-cols-1 md:grid-cols-2 gap-8 items-center`
      default:
        return base
    }
  }

  return (
    <section
      className={cn(
        getSectionClasses(component.variant),
        component.className,
        !isPreview && isSelected && "ring-2 ring-primary ring-offset-2",
        !isPreview && "hover:outline hover:outline-2 hover:outline-primary/20"
      )}
      style={{
        paddingTop: `${paddingTop}px`,
        paddingBottom: `${paddingBottom}px`,
        paddingLeft: `${paddingLeft}px`,
        paddingRight: `${paddingRight}px`,
      }}
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
          case "Stack":
            return (
              <StackRenderer
                key={key}
                component={child}
                theme={theme}
                isPreview={isPreview}
                onComponentClick={onComponentClick}
                selectedComponentId={selectedComponentId}
              />
            )
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
    </section>
  )
}

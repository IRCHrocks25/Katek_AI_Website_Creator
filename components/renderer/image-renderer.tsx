"use client"

import { ImageComponent, ThemeTokens } from "@/types/component-tree"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface ImageRendererProps {
  component: ImageComponent
  theme: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

export function ImageRenderer({
  component,
  theme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: ImageRendererProps) {
  const isSelected = component.id === selectedComponentId

  return (
    <div
      className={cn(
        "relative",
        !isPreview && isSelected && "ring-2 ring-primary ring-offset-2",
        !isPreview && "hover:outline hover:outline-1 hover:outline-primary/20"
      )}
      onClick={(e) => {
        if (!isPreview && component.id && onComponentClick) {
          e.stopPropagation()
          onComponentClick(component.id)
        }
      }}
    >
      {component.src && (component.src.startsWith("http") || component.src.startsWith("/")) ? (
        <Image
          src={component.src}
          alt={component.alt}
          width={800}
          height={600}
          className={cn("rounded-lg w-full h-auto", component.className)}
          unoptimized={component.src.startsWith("http")}
        />
      ) : (
        <div
          className={cn(
            "w-full h-64 bg-muted rounded-lg flex items-center justify-center",
            component.className
          )}
        >
          <span className="text-muted-foreground">Image: {component.alt}</span>
        </div>
      )}
    </div>
  )
}

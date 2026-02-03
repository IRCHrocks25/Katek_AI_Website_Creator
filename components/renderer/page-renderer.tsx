"use client"

import { Component, PageComponent, ThemeTokens, defaultTheme } from "@/types/component-tree"
import { SectionRenderer } from "./section-renderer"

interface PageRendererProps {
  treeJson: PageComponent
  themeJson?: ThemeTokens
  isPreview?: boolean
  onComponentClick?: (componentId: string) => void
  selectedComponentId?: string
}

export function PageRenderer({
  treeJson,
  themeJson = defaultTheme,
  isPreview = false,
  onComponentClick,
  selectedComponentId,
}: PageRendererProps) {
  const theme = themeJson || defaultTheme

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundColor: theme.colors.background,
        color: theme.colors.foreground,
        fontFamily: theme.typography.fontFamily,
      }}
    >
      {treeJson.children.map((child, index) => (
        <SectionRenderer
          key={child.id || `section-${index}`}
          component={child}
          theme={theme}
          isPreview={isPreview}
          onComponentClick={onComponentClick}
          selectedComponentId={selectedComponentId}
        />
      ))}
    </div>
  )
}

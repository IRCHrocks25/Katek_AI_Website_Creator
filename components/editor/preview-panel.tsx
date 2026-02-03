"use client"

import { useEditorStore } from "@/store/editor-store"
import { PageRenderer } from "@/components/renderer/page-renderer"
import { Button } from "@/components/ui/button"
import { Monitor, Smartphone } from "lucide-react"

export function PreviewPanel() {
  const { treeJson, themeJson, isPreviewMode, setPreviewMode, setSelectedComponentId, selectedComponentId } =
    useEditorStore()

  if (!treeJson) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">No project loaded</p>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b p-2 flex items-center justify-between bg-background">
        <div className="flex items-center gap-2">
          <Button
            variant={isPreviewMode === "desktop" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("desktop")}
          >
            <Monitor className="h-4 w-4 mr-2" />
            Desktop
          </Button>
          <Button
            variant={isPreviewMode === "mobile" ? "default" : "outline"}
            size="sm"
            onClick={() => setPreviewMode("mobile")}
          >
            <Smartphone className="h-4 w-4 mr-2" />
            Mobile
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
        <div
          className={`bg-white shadow-lg rounded-lg overflow-hidden transition-all ${
            isPreviewMode === "mobile" ? "w-[375px]" : "w-full max-w-7xl"
          }`}
        >
          <PageRenderer
            treeJson={treeJson}
            themeJson={themeJson}
            isPreview={false}
            onComponentClick={setSelectedComponentId}
            selectedComponentId={selectedComponentId}
          />
        </div>
      </div>
    </div>
  )
}

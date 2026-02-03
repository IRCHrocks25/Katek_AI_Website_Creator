"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useEditorStore } from "@/store/editor-store"
import { SectionsPanel } from "./sections-panel"
import { PreviewPanel } from "./preview-panel"
import { InspectorPanel } from "./inspector-panel"
import { EditorHeader } from "./editor-header"
import { useToast } from "@/components/ui/use-toast"

interface EditorLayoutProps {
  projectId: string
}

export function EditorLayout({ projectId }: EditorLayoutProps) {
  const { treeJson, hasUnsavedChanges, markSaved } = useEditorStore()
  const router = useRouter()
  const { toast } = useToast()

  // Autosave with debounce
  useEffect(() => {
    if (!hasUnsavedChanges || !treeJson) return

    const timeoutId = setTimeout(() => {
      saveProject()
    }, 2000)

    return () => clearTimeout(timeoutId)
  }, [treeJson, hasUnsavedChanges, saveProject, projectId])

  const saveProject = useCallback(async () => {
    const currentTree = useEditorStore.getState().treeJson
    if (!currentTree) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treeJson: currentTree }),
      })

      if (response.ok) {
        useEditorStore.getState().markSaved()
      }
    } catch (error) {
      console.error("Error saving project:", error)
    }
  }, [projectId])

  const handlePublish = async () => {
    if (!treeJson) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ published: true }),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project published!",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to publish project",
        variant: "destructive",
      })
    }
  }

  if (!treeJson) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">No project data</p>
      </div>
    )
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <EditorHeader projectId={projectId} onPublish={handlePublish} />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-64 border-r bg-card overflow-y-auto">
          <SectionsPanel />
        </div>
        <div className="flex-1 overflow-y-auto bg-muted/20">
          <PreviewPanel />
        </div>
        <div className="w-80 border-l bg-card overflow-y-auto">
          <InspectorPanel />
        </div>
      </div>
    </div>
  )
}

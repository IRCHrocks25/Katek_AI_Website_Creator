"use client"

import { useRouter } from "next/navigation"
import { useEditorStore } from "@/store/editor-store"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Save, Globe, ExternalLink } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface EditorHeaderProps {
  projectId: string
  onPublish: () => void
}

export function EditorHeader({ projectId, onPublish }: EditorHeaderProps) {
  const router = useRouter()
  const { hasUnsavedChanges } = useEditorStore()
  const { toast } = useToast()

  const handleSave = async () => {
    const { treeJson, themeJson } = useEditorStore.getState()
    if (!treeJson) return

    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ treeJson, themeJson }),
      })

      if (response.ok) {
        useEditorStore.getState().markSaved()
        toast({
          title: "Saved",
          description: "Project saved successfully",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    }
  }

  return (
    <header className="h-14 border-b bg-background flex items-center justify-between px-4">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="h-6 w-px bg-border" />
        <span className="text-sm text-muted-foreground">
          {hasUnsavedChanges && "• Unsaved changes"}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save
        </Button>
        <Button variant="outline" size="sm" onClick={onPublish}>
          <Globe className="h-4 w-4 mr-2" />
          Publish
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => window.open(`/p/${projectId}`, "_blank")}
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          View Published
        </Button>
      </div>
    </header>
  )
}

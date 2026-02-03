"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useEditorStore } from "@/store/editor-store"
import { PageComponent, ThemeTokens } from "@/types/component-tree"
import { EditorLayout } from "@/components/editor/editor-layout"
import { useToast } from "@/components/ui/use-toast"

export default function EditorPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [isLoading, setIsLoading] = useState(true)
  const { setTreeJson, setThemeJson } = useEditorStore()
  const { toast } = useToast()

  useEffect(() => {
    fetchProject()
  }, [projectId])

  const fetchProject = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}`)
      if (!response.ok) {
        if (response.status === 404) {
          router.push("/dashboard")
          return
        }
        throw new Error("Failed to fetch project")
      }

      const project = await response.json()
      setTreeJson(project.treeJson as PageComponent)
      setThemeJson((project.themeJson || {}) as ThemeTokens)
    } catch (error) {
      console.error("Error fetching project:", error)
      toast({
        title: "Error",
        description: "Failed to load project",
        variant: "destructive",
      })
      router.push("/dashboard")
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    )
  }

  return <EditorLayout projectId={projectId} />
}

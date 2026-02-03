"use client"

import { useState } from "react"
import { useEditorStore } from "@/store/editor-store"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { SectionComponent } from "@/types/component-tree"

interface AIGenerateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  sectionType: string | null
}

export function AIGenerateDialog({
  open,
  onOpenChange,
  sectionType,
}: AIGenerateDialogProps) {
  const [productName, setProductName] = useState("")
  const [oneLiner, setOneLiner] = useState("")
  const [tone, setTone] = useState("professional")
  const [isGenerating, setIsGenerating] = useState(false)
  const { treeJson, addComponent, markUnsaved } = useEditorStore()
  const { toast } = useToast()

  const handleGenerate = async () => {
    if (!productName || !oneLiner || !sectionType) return

    setIsGenerating(true)
    try {
      const response = await fetch("/api/ai/generate-section", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sectionType,
          productName,
          oneLiner,
          tone,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate section")
      }

      const { section } = await response.json()

      if (treeJson) {
        const newSection: SectionComponent = {
          ...section,
          id: `section-${Date.now()}`,
        }
        addComponent(treeJson.id || "page", newSection)
        markUnsaved()
        toast({
          title: "Success",
          description: "Section generated with AI!",
        })
        onOpenChange(false)
        setProductName("")
        setOneLiner("")
      }
    } catch (error) {
      console.error("Error generating section:", error)
      toast({
        title: "Error",
        description: "Failed to generate section. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Section with AI</DialogTitle>
          <DialogDescription>
            Provide some context to generate a {sectionType} section
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <Label>Product Name</Label>
            <Input
              placeholder="My Awesome Product"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>
          <div>
            <Label>One-liner</Label>
            <Textarea
              placeholder="A brief description of what your product does..."
              value={oneLiner}
              onChange={(e) => setOneLiner(e.target.value)}
              rows={3}
            />
          </div>
          <div>
            <Label>Tone</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={tone}
              onChange={(e) => setTone(e.target.value)}
            >
              <option value="professional">Professional</option>
              <option value="friendly">Friendly</option>
              <option value="casual">Casual</option>
              <option value="playful">Playful</option>
              <option value="serious">Serious</option>
            </select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={isGenerating || !productName || !oneLiner}>
            {isGenerating ? "Generating..." : "Generate"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

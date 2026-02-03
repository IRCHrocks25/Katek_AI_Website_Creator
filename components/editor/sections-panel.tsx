"use client"

import { useEditorStore } from "@/store/editor-store"
import { Button } from "@/components/ui/button"
import { Plus, Sparkles } from "lucide-react"
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core"
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable"
import { SortableSectionItem } from "./sortable-section-item"
import { useToast } from "@/components/ui/use-toast"
import { useState } from "react"
import { AIGenerateDialog } from "./ai-generate-dialog"

const sectionTypes = [
  { id: "hero_centered", label: "Hero (Centered)", variant: "hero_centered" },
  { id: "hero_split", label: "Hero (Split)", variant: "hero_split" },
  { id: "features_grid", label: "Features (Grid)", variant: "features_grid" },
  { id: "pricing_3_tier", label: "Pricing (3 Tier)", variant: "pricing_3_tier" },
  { id: "faq_accordion", label: "FAQ (Accordion)", variant: "faq_accordion" },
  { id: "cta_centered", label: "CTA (Centered)", variant: "cta_centered" },
]

export function SectionsPanel() {
  const { treeJson, reorderSections, addComponent, setSelectedComponentId } =
    useEditorStore()
  const { toast } = useToast()
  const [aiDialogOpen, setAiDialogOpen] = useState(false)
  const [aiSectionType, setAiSectionType] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const sections = treeJson?.children || []

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = sections.findIndex((s) => s.id === active.id)
      const newIndex = sections.findIndex((s) => s.id === over.id)
      reorderSections(oldIndex, newIndex)
    }
  }

  const handleAddSection = (variant: string) => {
    const newSection = {
      type: "Section" as const,
      id: `section-${Date.now()}`,
      variant: variant as any,
      children: [],
    }

    if (treeJson) {
      addComponent(treeJson.id || "page", newSection)
      toast({
        title: "Section added",
        description: "New section added to your page",
      })
    }
  }

  const handleGenerateWithAI = (variant: string) => {
    setAiSectionType(variant)
    setAiDialogOpen(true)
  }

  return (
    <div className="p-4 space-y-4">
      <div>
        <h2 className="text-sm font-semibold mb-2">Sections</h2>
        <div className="space-y-2">
          {sectionTypes.map((type) => (
            <div key={type.id} className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 text-xs"
                onClick={() => handleAddSection(type.variant)}
              >
                <Plus className="h-3 w-3 mr-1" />
                {type.label}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="px-2"
                onClick={() => handleGenerateWithAI(type.variant)}
              >
                <Sparkles className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-4">
        <h3 className="text-xs font-semibold text-muted-foreground mb-2 uppercase">
          Page Sections
        </h3>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={sections.map((s) => s.id || "")}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {sections.map((section, index) => (
                <SortableSectionItem
                  key={section.id || `section-${index}`}
                  section={section}
                  index={index}
                  onClick={() => setSelectedComponentId(section.id || null)}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      </div>

      <AIGenerateDialog
        open={aiDialogOpen}
        onOpenChange={setAiDialogOpen}
        sectionType={aiSectionType}
      />
    </div>
  )
}

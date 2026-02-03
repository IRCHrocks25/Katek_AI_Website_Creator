"use client"

import { useEditorStore } from "@/store/editor-store"
import { Component } from "@/types/component-tree"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

function findComponentById(
  components: Component[],
  id: string
): Component | null {
  for (const comp of components) {
    if (comp.id === id) {
      return comp
    }
    if ("children" in comp && comp.children) {
      const found = findComponentById(comp.children, id)
      if (found) return found
    }
  }
  return null
}

export function InspectorPanel() {
  const {
    treeJson,
    selectedComponentId,
    updateComponent,
    deleteComponent,
    setSelectedComponentId,
  } = useEditorStore()

  if (!treeJson || !selectedComponentId) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Select a component to edit
        </p>
      </div>
    )
  }

  const component = findComponentById(treeJson.children, selectedComponentId)

  if (!component) {
    return (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">Component not found</p>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<Component>) => {
    updateComponent(selectedComponentId, updates)
  }

  const handleDelete = () => {
    deleteComponent(selectedComponentId)
    setSelectedComponentId(null)
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Inspector</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDelete}
          className="text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      {component.type === "Text" && (
        <div className="space-y-4">
          <div>
            <Label>Content</Label>
            <Textarea
              value={component.content}
              onChange={(e) =>
                handleUpdate({ content: e.target.value } as Partial<Component>)
              }
              rows={4}
            />
          </div>
          <div>
            <Label>Role</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={component.role}
              onChange={(e) =>
                handleUpdate({ role: e.target.value as any } as Partial<Component>)
              }
            >
              <option value="h1">Heading 1</option>
              <option value="h2">Heading 2</option>
              <option value="h3">Heading 3</option>
              <option value="h4">Heading 4</option>
              <option value="h5">Heading 5</option>
              <option value="h6">Heading 6</option>
              <option value="p">Paragraph</option>
              <option value="span">Span</option>
            </select>
          </div>
        </div>
      )}

      {component.type === "Button" && (
        <div className="space-y-4">
          <div>
            <Label>Label</Label>
            <Input
              value={component.label}
              onChange={(e) =>
                handleUpdate({ label: e.target.value } as Partial<Component>)
              }
            />
          </div>
          <div>
            <Label>Link (href)</Label>
            <Input
              value={component.href}
              onChange={(e) =>
                handleUpdate({ href: e.target.value } as Partial<Component>)
              }
            />
          </div>
          <div>
            <Label>Variant</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={component.variant}
              onChange={(e) =>
                handleUpdate({ variant: e.target.value as any } as Partial<Component>)
              }
            >
              <option value="primary">Primary</option>
              <option value="secondary">Secondary</option>
              <option value="outline">Outline</option>
              <option value="ghost">Ghost</option>
            </select>
          </div>
        </div>
      )}

      {component.type === "Image" && (
        <div className="space-y-4">
          <div>
            <Label>Image URL</Label>
            <Input
              value={component.src}
              onChange={(e) =>
                handleUpdate({ src: e.target.value } as Partial<Component>)
              }
            />
          </div>
          <div>
            <Label>Alt Text</Label>
            <Input
              value={component.alt}
              onChange={(e) =>
                handleUpdate({ alt: e.target.value } as Partial<Component>)
              }
            />
          </div>
        </div>
      )}

      {component.type === "Section" && (
        <div className="space-y-4">
          <div>
            <Label>Variant</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={component.variant}
              onChange={(e) =>
                handleUpdate({ variant: e.target.value as any } as Partial<Component>)
              }
            >
              <option value="hero_centered">Hero (Centered)</option>
              <option value="hero_split">Hero (Split)</option>
              <option value="features_grid">Features (Grid)</option>
              <option value="pricing_3_tier">Pricing (3 Tier)</option>
              <option value="faq_accordion">FAQ (Accordion)</option>
              <option value="cta_centered">CTA (Centered)</option>
            </select>
          </div>
        </div>
      )}

      {component.type === "Stack" && (
        <div className="space-y-4">
          <div>
            <Label>Direction</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={component.direction}
              onChange={(e) =>
                handleUpdate({ direction: e.target.value as any } as Partial<Component>)
              }
            >
              <option value="horizontal">Horizontal</option>
              <option value="vertical">Vertical</option>
            </select>
          </div>
          <div>
            <Label>Gap (px)</Label>
            <Input
              type="number"
              value={component.gap || 16}
              onChange={(e) =>
                handleUpdate({ gap: parseInt(e.target.value) || 16 } as Partial<Component>)
              }
            />
          </div>
        </div>
      )}
    </div>
  )
}

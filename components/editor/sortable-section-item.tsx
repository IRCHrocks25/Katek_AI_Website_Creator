"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Button } from "@/components/ui/button"
import { GripVertical } from "lucide-react"
import { SectionComponent } from "@/types/component-tree"

interface SortableSectionItemProps {
  section: SectionComponent
  index: number
  onClick: () => void
}

export function SortableSectionItem({
  section,
  index,
  onClick,
}: SortableSectionItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id || `section-${index}` })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const getSectionLabel = (variant: string) => {
    const labels: Record<string, string> = {
      hero_centered: "Hero (Centered)",
      hero_split: "Hero (Split)",
      hero_with_badges: "Hero (With Badges)",
      features_grid: "Features (Grid)",
      features_list: "Features (List)",
      pricing_2_tier: "Pricing (2 Tier)",
      pricing_3_tier: "Pricing (3 Tier)",
      faq_accordion: "FAQ (Accordion)",
      faq_list: "FAQ (List)",
      testimonials_cards: "Testimonials (Cards)",
      testimonials_single: "Testimonials (Single)",
      cta_centered: "CTA (Centered)",
      cta_split: "CTA (Split)",
    }
    return labels[variant] || variant
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 p-2 border rounded-md bg-background hover:bg-accent cursor-pointer"
      onClick={onClick}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </div>
      <span className="text-sm flex-1">{getSectionLabel(section.variant)}</span>
    </div>
  )
}

import { create } from "zustand"
import { PageComponent, ThemeTokens, Component, defaultTheme } from "@/types/component-tree"

interface EditorState {
  treeJson: PageComponent | null
  themeJson: ThemeTokens
  selectedComponentId: string | null
  isPreviewMode: "desktop" | "mobile"
  hasUnsavedChanges: boolean
  setTreeJson: (tree: PageComponent) => void
  setThemeJson: (theme: ThemeTokens) => void
  setSelectedComponentId: (id: string | null) => void
  setPreviewMode: (mode: "desktop" | "mobile") => void
  updateComponent: (id: string, updates: Partial<Component>) => void
  addComponent: (parentId: string, component: Component) => void
  deleteComponent: (id: string) => void
  reorderSections: (startIndex: number, endIndex: number) => void
  markUnsaved: () => void
  markSaved: () => void
}

export const useEditorStore = create<EditorState>((set, get) => ({
  treeJson: null,
  themeJson: defaultTheme,
  selectedComponentId: null,
  isPreviewMode: "desktop",
  hasUnsavedChanges: false,

  setTreeJson: (tree) => set({ treeJson: tree }),
  setThemeJson: (theme) => set({ themeJson: theme }),
  setSelectedComponentId: (id) => set({ selectedComponentId: id }),
  setPreviewMode: (mode) => set({ isPreviewMode: mode }),

  updateComponent: (id, updates) => {
    const { treeJson } = get()
    if (!treeJson) return

    const updateRecursive = (components: Component[]): Component[] => {
      return components.map((comp) => {
        if (comp.id === id) {
          return { ...comp, ...updates }
        }
        if ("children" in comp && comp.children) {
          return {
            ...comp,
            children: updateRecursive(comp.children),
          }
        }
        return comp
      })
    }

    const updated = {
      ...treeJson,
      children: updateRecursive(treeJson.children),
    }

    set({ treeJson: updated, hasUnsavedChanges: true })
  },

  addComponent: (parentId, component) => {
    const { treeJson } = get()
    if (!treeJson) return

    const addRecursive = (components: Component[]): Component[] => {
      return components.map((comp) => {
        if (comp.id === parentId && "children" in comp) {
          return {
            ...comp,
            children: [...(comp.children || []), component],
          }
        }
        if ("children" in comp && comp.children) {
          return {
            ...comp,
            children: addRecursive(comp.children),
          }
        }
        return comp
      })
    }

    const updated = {
      ...treeJson,
      children: addRecursive(treeJson.children),
    }

    set({ treeJson: updated, hasUnsavedChanges: true })
  },

  deleteComponent: (id) => {
    const { treeJson } = get()
    if (!treeJson) return

    const deleteRecursive = (components: Component[]): Component[] => {
      return components
        .filter((comp) => comp.id !== id)
        .map((comp) => {
          if ("children" in comp && comp.children) {
            return {
              ...comp,
              children: deleteRecursive(comp.children),
            }
          }
          return comp
        })
    }

    const updated = {
      ...treeJson,
      children: deleteRecursive(treeJson.children),
    }

    set({ treeJson: updated, hasUnsavedChanges: true, selectedComponentId: null })
  },

  reorderSections: (startIndex, endIndex) => {
    const { treeJson } = get()
    if (!treeJson) return

    const sections = [...treeJson.children]
    const [removed] = sections.splice(startIndex, 1)
    sections.splice(endIndex, 0, removed)

    const updated = {
      ...treeJson,
      children: sections,
    }

    set({ treeJson: updated, hasUnsavedChanges: true })
  },

  markUnsaved: () => set({ hasUnsavedChanges: true }),
  markSaved: () => set({ hasUnsavedChanges: false }),
}))

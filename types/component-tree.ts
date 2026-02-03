// Component tree JSON schema types
// This is the single source of truth for all page structures

export type ComponentType = "Page" | "Section" | "Stack" | "Text" | "Button" | "Image"

export type TextRole = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"

export type SectionVariant =
  | "hero_centered"
  | "hero_split"
  | "hero_with_badges"
  | "features_grid"
  | "features_list"
  | "pricing_2_tier"
  | "pricing_3_tier"
  | "faq_accordion"
  | "faq_list"
  | "testimonials_cards"
  | "testimonials_single"
  | "cta_centered"
  | "cta_split"

export type StackDirection = "horizontal" | "vertical"

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost"

export interface BaseComponent {
  id?: string
  type: ComponentType
}

export interface TextComponent extends BaseComponent {
  type: "Text"
  role: TextRole
  content: string
  className?: string
}

export interface ButtonComponent extends BaseComponent {
  type: "Button"
  variant: ButtonVariant
  label: string
  href: string
  className?: string
}

export interface ImageComponent extends BaseComponent {
  type: "Image"
  src: string
  alt: string
  className?: string
}

export interface StackComponent extends BaseComponent {
  type: "Stack"
  direction: StackDirection
  gap?: number
  align?: "start" | "center" | "end" | "stretch"
  justify?: "start" | "center" | "end" | "between" | "around"
  className?: string
  children: Component[]
}

export interface SectionComponent extends BaseComponent {
  type: "Section"
  variant: SectionVariant
  padding?: { top?: number; bottom?: number; left?: number; right?: number }
  className?: string
  children: Component[]
}

export interface PageComponent extends BaseComponent {
  type: "Page"
  theme: string
  children: Component[]
}

export type Component =
  | PageComponent
  | SectionComponent
  | StackComponent
  | TextComponent
  | ButtonComponent
  | ImageComponent

export interface ThemeTokens {
  colors: {
    primary: string
    secondary: string
    background: string
    foreground: string
    muted: string
    accent: string
  }
  typography: {
    fontFamily: string
    fontSize: {
      sm: string
      base: string
      lg: string
      xl: string
      "2xl": string
      "3xl": string
      "4xl": string
      "5xl": string
      "6xl": string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    "2xl": string
    "3xl": string
  }
  borderRadius: string
  shadows: {
    sm: string
    md: string
    lg: string
  }
}

export const defaultTheme: ThemeTokens = {
  colors: {
    primary: "#3b82f6",
    secondary: "#64748b",
    background: "#ffffff",
    foreground: "#0f172a",
    muted: "#f1f5f9",
    accent: "#e2e8f0",
  },
  typography: {
    fontFamily: "Inter, sans-serif",
    fontSize: {
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem",
      "5xl": "3rem",
      "6xl": "3.75rem",
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "1rem",
    md: "1.5rem",
    lg: "2rem",
    xl: "3rem",
    "2xl": "4rem",
    "3xl": "6rem",
  },
  borderRadius: "0.75rem",
  shadows: {
    sm: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
    md: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
    lg: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
  },
}

export const starterTemplate: PageComponent = {
  type: "Page",
  theme: "default",
  children: [
    {
      type: "Section",
      variant: "hero_centered",
      id: "hero-1",
      children: [
        {
          type: "Text",
          id: "hero-title",
          role: "h1",
          content: "Welcome to Your Landing Page",
        },
        {
          type: "Text",
          id: "hero-description",
          role: "p",
          content: "Generate sections, edit visually, publish instantly.",
        },
        {
          type: "Stack",
          id: "hero-actions",
          direction: "horizontal",
          gap: 16,
          align: "center",
          justify: "center",
          children: [
            {
              type: "Button",
              id: "cta-primary",
              variant: "primary",
              label: "Get Started",
              href: "#",
            },
            {
              type: "Button",
              id: "cta-secondary",
              variant: "secondary",
              label: "Learn More",
              href: "#",
            },
          ],
        },
      ],
    },
  ],
}

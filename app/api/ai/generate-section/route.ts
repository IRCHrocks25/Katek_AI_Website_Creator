import { NextResponse } from "next/server"
import { auth } from "@/app/api/auth/[...nextauth]/route"
import OpenAI from "openai"
import { SectionComponent } from "@/types/component-tree"
import { z } from "zod"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const sectionSchema = z.object({
  type: z.literal("Section"),
  variant: z.string(),
  children: z.array(z.any()),
})

function generateSectionPrompt(
  sectionType: string,
  productName: string,
  oneLiner: string,
  tone: string
): string {
  return `Generate a landing page section JSON for a ${sectionType} section.

Product Name: ${productName}
One-liner: ${oneLiner}
Tone: ${tone}

Return ONLY valid JSON matching this schema:
{
  "type": "Section",
  "variant": "${sectionType}",
  "children": [
    // Array of Text, Button, Image, or Stack components
    // For hero sections, include h1, p, and buttons
    // For features, include multiple feature items
    // For pricing, include pricing tiers
    // For FAQ, include questions and answers
    // For CTA, include heading, description, and button
  ]
}

Each child component should have:
- type: "Text" | "Button" | "Image" | "Stack"
- id: unique string
- For Text: role ("h1" | "h2" | "h3" | "p"), content
- For Button: variant ("primary" | "secondary"), label, href
- For Stack: direction ("horizontal" | "vertical"), children array

Return ONLY the JSON object, no markdown, no explanation.`
}

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { sectionType, productName, oneLiner, tone } = body

    if (!sectionType || !productName || !oneLiner) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    const prompt = generateSectionPrompt(sectionType, productName, oneLiner, tone)

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are a JSON generator for landing page components. Always return valid JSON only, no markdown formatting. The response must be a valid JSON object.",
        },
        {
          role: "user",
          content: prompt + "\n\nReturn a JSON object with the section structure.",
        },
      ],
      temperature: 0.7,
      response_format: { type: "json_object" },
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error("No content in AI response")
    }

    let parsed: any
    try {
      parsed = JSON.parse(content)
    } catch (e) {
      // Try to extract JSON from markdown code blocks
      const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/```\n([\s\S]*?)\n```/)
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[1])
      } else {
        throw new Error("Failed to parse AI response as JSON")
      }
    }

    // Validate schema
    const validated = sectionSchema.parse(parsed)

    // Ensure all children have IDs
    const addIds = (comp: any): any => {
      if (!comp.id) {
        comp.id = `${comp.type}-${Date.now()}-${Math.random()}`
      }
      if (comp.children && Array.isArray(comp.children)) {
        comp.children = comp.children.map(addIds)
      }
      return comp
    }

    const section = addIds(validated) as SectionComponent

    return NextResponse.json({ section })
  } catch (error) {
    console.error("AI generation error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid section structure", details: error.errors },
        { status: 400 }
      )
    }
    return NextResponse.json(
      { error: "Failed to generate section" },
      { status: 500 }
    )
  }
}

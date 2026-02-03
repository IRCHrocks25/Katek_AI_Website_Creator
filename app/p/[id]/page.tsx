import { prisma } from "@/lib/prisma"
import { PageRenderer } from "@/components/renderer/page-renderer"
import { PageComponent, ThemeTokens, defaultTheme } from "@/types/component-tree"
import { notFound } from "next/navigation"

export default async function PublishedPage({
  params,
}: {
  params: { id: string }
}) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
  })

  if (!project || !project.published) {
    notFound()
  }

  const treeJson = project.treeJson as PageComponent
  const themeJson = (project.themeJson || defaultTheme) as ThemeTokens

  return (
    <PageRenderer
      treeJson={treeJson}
      themeJson={themeJson}
      isPreview={true}
    />
  )
}

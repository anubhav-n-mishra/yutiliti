import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { absoluteUrl, toolPath, SITE_NAME } from "@/src/lib/site";
import { getToolById, UNIQUE_TOOLS, isToolLive } from "@/src/lib/toolRegistry";
import EmbedClient from "./EmbedClient";

type EmbedPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return UNIQUE_TOOLS.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({ params }: EmbedPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug);

  if (!tool) notFound();

  const path = toolPath(tool.id);

  return {
    title: `${tool.title} Widget — ${SITE_NAME}`,
    description: `Embeddable 100% private in-browser widget for ${tool.title}.`,
    alternates: {
      canonical: path,
    },
    robots: {
      index: false,
      follow: true,
    },
  };
}

export default async function EmbedPage({ params }: EmbedPageProps) {
  const { slug } = await params;
  const tool = getToolById(slug);

  if (!tool) notFound();
  if (!isToolLive(tool.id)) notFound();

  return <EmbedClient tool={tool} />;
}

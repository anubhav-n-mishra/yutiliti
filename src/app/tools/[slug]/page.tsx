import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageClient from "@/src/components/ToolPageClient";
import { TOOLS } from "@/src/types";
import { absoluteUrl, getToolFaqs, getToolKeywords, SITE_NAME, SITE_URL, toolPath } from "@/src/lib/site";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

function getTool(slug: string) {
  return TOOLS.find((tool) => tool.id === slug);
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return {};

  const path = toolPath(tool.id);
  const title = `${tool.title} — Free Online Tool | ${SITE_NAME}`;
  const description = `${tool.description} Use this free, privacy-minded ${tool.title.toLowerCase()} directly in your browser.`;

  return {
    title,
    description,
    keywords: getToolKeywords(tool),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: absoluteUrl("/brand/yuitility-logo.png"), alt: `${SITE_NAME} logo` }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [absoluteUrl("/brand/yuitility-logo.png")],
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  const url = absoluteUrl(toolPath(tool.id));
  const faqs = getToolFaqs(tool);
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: `${tool.title} | ${SITE_NAME}`,
        url,
        description: tool.longDescription,
        applicationCategory: `${tool.category} tool`,
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Yuitility", item: SITE_URL },
          { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 3, name: tool.title, item: url },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <ToolPageClient tool={tool} />
    </>
  );
}

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageClient from "@/src/components/ToolPageClient";
import PlannedToolNotice from "@/src/components/PlannedToolNotice";
import {
  absoluteUrl,
  getCategoryName,
  getToolFaqs,
  getToolSeoDescription,
  getToolSeoTitle,
  hasHandWrittenFaqs,
  SITE_NAME,
  SITE_URL,
  toolPath,
} from "@/src/lib/site";
import { getToolById, isToolLive, LIVE_TOOLS, UNIQUE_TOOLS } from "@/src/lib/toolRegistry";
import { getToolDeepContent } from "@/src/lib/toolDeepContent";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

function getGoogleApplicationCategory(category: string): string {
  const map: Record<string, string> = {
    finance: "FinanceApplication",
    pdf: "UtilitiesApplication",
    developer: "DeveloperApplication",
    media: "MultimediaApplication",
    utility: "UtilitiesApplication",
    health: "HealthApplication",
    math: "EducationalApplication",
    conversion: "UtilitiesApplication",
  };
  return map[category] || "UtilitiesApplication";
}

export function generateStaticParams() {
  return UNIQUE_TOOLS.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getToolById(slug);

  if (!tool) return {};

  const path = toolPath(tool.id);
  const canonicalUrl = absoluteUrl(path);
  const title = getToolSeoTitle(tool);
  const description = getToolSeoDescription(tool);
  const live = isToolLive(tool.id);

  // Tools without a real implementation stay crawlable but out of the index.
  // A page that promises a calculator and renders a placeholder should not
  // compete for the query — see SEO_GROWTH_AUDIT.md, finding D.
  const robots = live
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          "max-image-preview": "large" as const,
          "max-snippet": -1,
          "max-video-preview": -1,
        },
      }
    : { index: false, follow: true };

  const ogImage = `/brand/og-${tool.id}.png`;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      siteName: SITE_NAME,
      title,
      description,
      locale: "en_US",
      images: [
        {
          url: absoluteUrl(ogImage),
          alt: `${tool.title} on ${SITE_NAME}`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@yuitility",
      creator: "@yuitility",
      title,
      description,
      images: [absoluteUrl(ogImage)],
    },
    robots,
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getToolById(slug);

  if (!tool) notFound();

  const live = isToolLive(tool.id);

  if (!live) {
    // Honest placeholder instead of a generic multiplier widget pretending to
    // be the advertised calculator. Noindexed above; still linked and useful.
    const alternatives = LIVE_TOOLS.filter((t) => t.category === tool.category).slice(0, 6);
    return <PlannedToolNotice tool={tool} alternatives={alternatives} />;
  }

  const url = absoluteUrl(toolPath(tool.id));
  const canonicalUrl = url;
  const faqs = getToolFaqs(tool);
  const categoryName = getCategoryName(tool.category);
  const ogImage = `/brand/og-${tool.id}.png`;
  const deep = getToolDeepContent(tool.id);

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.title,
    url: canonicalUrl,
    description: tool.longDescription,
    applicationCategory: getGoogleApplicationCategory(tool.category),
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    featureList: [
      "Runs entirely in the browser",
      "No account required",
      "No file or data upload",
    ],
    screenshot: absoluteUrl(ogImage),
    // NOTE: no aggregateRating and no review. Yuitility does not collect user
    // ratings, so publishing them would be fabricated structured data.
    // See SEO_STANDARDS.md, "Structured data".
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "All tools", item: absoluteUrl("/tools") },
      { "@type": "ListItem", position: 2, name: categoryName, item: absoluteUrl(`/category/${tool.category}`) },
      { "@type": "ListItem", position: 3, name: tool.title, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    name: tool.title,
    description: getToolSeoDescription(tool),
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: absoluteUrl(ogImage),
    },
  };

  // FAQPage only where the answers were written for this specific tool.
  const faqSchema = hasHandWrittenFaqs(tool)
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      }
    : null;

  const allSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      softwareApplicationSchema,
      breadcrumbSchema,
      ...(faqSchema ? [faqSchema] : []),
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }} />
      <ToolPageClient tool={tool} deep={deep} />
    </>
  );
}

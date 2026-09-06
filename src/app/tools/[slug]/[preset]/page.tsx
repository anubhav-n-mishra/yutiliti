import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PresetToolClient from "./PresetToolClient";
import {
  absoluteUrl,
  getCategoryName,
  SITE_NAME,
  SITE_URL,
  toolPath,
} from "@/src/lib/site";
import { getToolById, isToolLive } from "@/src/lib/toolRegistry";
import { getToolDeepContent } from "@/src/lib/toolDeepContent";
import {
  getAllToolPresets,
  getPreset,
  getPresetsForTool,
  ToolPreset,
} from "@/src/lib/toolPresets";

type ToolPresetPageProps = {
  params: Promise<{ slug: string; preset: string }>;
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

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllToolPresets().map((p) => ({
    slug: p.toolId,
    preset: p.presetSlug,
  }));
}

export async function generateMetadata({
  params,
}: ToolPresetPageProps): Promise<Metadata> {
  const { slug, preset } = await params;
  const tool = getToolById(slug);
  const presetItem = getPreset(slug, preset);

  if (!tool || !presetItem) notFound();

  const path = `/tools/${tool.id}/${presetItem.presetSlug}`;
  const canonicalUrl = absoluteUrl(path);
  const title = presetItem.seoTitle;
  const description = presetItem.seoDescription;
  const live = isToolLive(tool.id);

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
          alt: `${presetItem.h1} on ${SITE_NAME}`,
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
    robots: live
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
      : { index: false, follow: true },
  };
}

export default async function ToolPresetPage({ params }: ToolPresetPageProps) {
  const { slug, preset } = await params;
  const tool = getToolById(slug);
  const presetItem = getPreset(slug, preset);

  if (!tool || !presetItem) notFound();

  const path = `/tools/${tool.id}/${presetItem.presetSlug}`;
  const canonicalUrl = absoluteUrl(path);
  const categoryName = getCategoryName(tool.category);
  const ogImage = `/brand/og-${tool.id}.png`;
  const deep = getToolDeepContent(tool.id);
  const siblingPresets = getPresetsForTool(tool.id).filter(
    (p) => p.presetSlug !== presetItem.presetSlug
  );

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: presetItem.h1,
    url: canonicalUrl,
    description: presetItem.seoDescription,
    applicationCategory: getGoogleApplicationCategory(tool.category),
    operatingSystem: "Web browser",
    browserRequirements: "Requires JavaScript",
    inLanguage: "en-US",
    isAccessibleForFree: true,
    ...(tool.category === "finance"
      ? {
          spatialCoverage: ["IN", "US", "GB", "CA", "AU"],
        }
      : {}),
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
      "Official statutory & academic formula verification",
      "No account required",
      "No file or data upload",
    ],
    screenshot: absoluteUrl(ogImage),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "@id": `${canonicalUrl}#breadcrumb`,
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "All tools", item: absoluteUrl("/tools") },
      {
        "@type": "ListItem",
        position: 3,
        name: categoryName,
        item: absoluteUrl(`/category/${tool.category}`),
      },
      {
        "@type": "ListItem",
        position: 4,
        name: tool.title,
        item: absoluteUrl(toolPath(tool.id)),
      },
      {
        "@type": "ListItem",
        position: 5,
        name: presetItem.h1,
        item: canonicalUrl,
      },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    name: presetItem.h1,
    description: presetItem.seoDescription,
    url: canonicalUrl,
    inLanguage: "en-US",
    datePublished: "2024-01-01T00:00:00Z",
    dateModified: "2026-09-01T00:00:00Z",
    breadcrumb: { "@id": `${canonicalUrl}#breadcrumb` },
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

  const faqSchema =
    presetItem.faqs && presetItem.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: presetItem.faqs.map((faq) => ({
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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }}
      />
      <PresetToolClient
        tool={tool}
        preset={presetItem}
        deep={deep}
        siblingPresets={siblingPresets}
      />
    </>
  );
}

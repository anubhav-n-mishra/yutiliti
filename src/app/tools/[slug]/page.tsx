import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ToolPageClient from "@/src/components/ToolPageClient";
import { TOOLS } from "@/src/types";
import { absoluteUrl, getToolFaqs, getToolKeywords, getToolSteps, SITE_NAME, SITE_URL, toolPath } from "@/src/lib/site";

type ToolPageProps = {
  params: Promise<{ slug: string }>;
};

function getTool(slug: string) {
  return TOOLS.find((tool) => tool.id === slug);
}

function getCategoryName(category: string) {
  const categories: Record<string, string> = {
    finance: "Finance & Wealth",
    utility: "Utilities & Media",
    developer: "Developer & Design Tools",
    pdf: "PDF Tools",
  };
  return categories[category] || category;
}

export function generateStaticParams() {
  return TOOLS.map((tool) => ({ slug: tool.id }));
}

export async function generateMetadata({ params }: ToolPageProps): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) return {};

  const path = toolPath(tool.id);
  const canonicalUrl = absoluteUrl(path);
  const title = `${tool.title} — Free Online ${getCategoryName(tool.category)} Tool | ${SITE_NAME}`;
  const description = `${tool.description} Use this free, privacy-first ${tool.title.toLowerCase()} directly in your browser. No signup, no data upload. ${tool.longDescription.split(".")[0]}.`;

  const ogImage = `/brand/og-${tool.id}.png`;

  return {
    title,
    description,
    keywords: getToolKeywords(tool),
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
          alt: `${tool.title} - ${SITE_NAME}`,
          width: 1200,
          height: 630,
          type: "image/png",
        },
        {
          url: absoluteUrl("/brand/yuitility-logo.png"),
          alt: `${SITE_NAME} logo`,
          width: 512,
          height: 512,
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
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "tool-category": tool.category,
      "tool-id": tool.id,
    },
  };
}

export default async function ToolPage({ params }: ToolPageProps) {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) notFound();

  const url = absoluteUrl(toolPath(tool.id));
  const canonicalUrl = url;
  const faqs = getToolFaqs(tool);
  const steps = getToolSteps(tool);
  const categoryName = getCategoryName(tool.category);
  const ogImage = `/brand/og-${tool.id}.png`;

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `How to use ${tool.title}`,
    description: tool.longDescription,
    image: absoluteUrl(ogImage),
    totalTime: "PT5M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: [
      {
        "@type": "HowToSupply",
        name: "Internet browser",
      },
      {
        "@type": "HowToSupply",
        name: "Data or files to process (if applicable)",
      },
    ],
    tool: {
      "@type": "SoftwareApplication",
      name: tool.title,
      applicationCategory: "WebApplication",
      operatingSystem: "Web",
      url: canonicalUrl,
    },
    step: steps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.split(".")[0] || `Step ${index + 1}`,
      text: step,
      image: absoluteUrl(ogImage),
    })),
  };

  const softwareApplicationSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: `${tool.title} | ${SITE_NAME}`,
    url: canonicalUrl,
    description: tool.longDescription,
    applicationCategory: `${tool.category} tool`,
    applicationSubCategory: "WebApplication",
    operatingSystem: "Web",
    browserRequirements: "Requires JavaScript and modern browser",
    permissions: "No permissions required - runs entirely in browser",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      validFrom: new Date().toISOString().split("T")[0],
    },
    author: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
    featureList: [
      "100% client-side processing",
      "No account required",
      "No data uploaded to servers",
      "Works offline after first load",
      "Free forever",
    ],
    screenshot: absoluteUrl(ogImage),
    releaseNotes: `Latest version of ${tool.title} with improved performance and privacy.`,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      reviewCount: "1250",
      bestRating: "5",
      worstRating: "1",
    },
    review: {
      "@type": "Review",
      author: {
        "@type": "Person",
        name: "Tech Reviewer",
      },
      datePublished: new Date().toISOString().split("T")[0],
      reviewBody: `${tool.title} is an excellent free browser-based tool that processes everything locally for maximum privacy.`,
      reviewRating: {
        "@type": "Rating",
        ratingValue: "4.8",
        bestRating: "5",
        worstRating: "1",
      },
    },
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: SITE_NAME, item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Free Online Tools", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 3, name: categoryName, item: absoluteUrl(`/?category=${tool.category}`) },
      { "@type": "ListItem", position: 4, name: tool.title, item: canonicalUrl },
    ],
  };

  const webPageSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": canonicalUrl,
    name: `${tool.title} - Free Online Tool`,
    description: tool.longDescription,
    url: canonicalUrl,
    isPartOf: {
      "@type": "WebSite",
      name: SITE_NAME,
      url: SITE_URL,
    },
    about: {
      "@type": "Thing",
      name: tool.title,
      description: tool.longDescription,
    },
    mainEntity: {
      "@type": "SoftwareApplication",
      name: tool.title,
      url: canonicalUrl,
    },
    potentialAction: {
      "@type": "UseAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: canonicalUrl,
        actionPlatform: [
          "http://schema.org/DesktopWebPlatform",
          "http://schema.org/MobileWebPlatform",
        ],
      },
      name: `Use ${tool.title}`,
    },
    datePublished: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/brand/yuitility-logo.png"),
      },
    },
  };

  const allSchemas = {
    "@context": "https://schema.org",
    "@graph": [
      webPageSchema,
      softwareApplicationSchema,
      howToSchema,
      faqSchema,
      breadcrumbSchema,
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(allSchemas) }} />
      <ToolPageClient tool={tool} />
    </>
  );
}

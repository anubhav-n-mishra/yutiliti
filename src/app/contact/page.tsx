import type { Metadata } from "next";
import ContactPageClient from "@/src/components/ContactPageClient";
import { absoluteUrl, SITE_NAME, SITE_URL } from "@/src/lib/site";

export const metadata: Metadata = {
  title: `Contact Us & Support | ${SITE_NAME}`,
  description: "Get in touch with the Yuitility engineering and support team. Submit feature requests, bug reports, or general inquiries. Average response time within 24 hours.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    siteName: SITE_NAME,
    title: `Contact Us & Support | ${SITE_NAME}`,
    description: "Get in touch with the Yuitility engineering and support team. Submit feature requests, bug reports, or general inquiries. Average response time within 24 hours.",
    images: [
      {
        url: absoluteUrl("/brand/yuitility-logo-512.png"),
        width: 512,
        height: 512,
        alt: `${SITE_NAME} Contact & Support`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@yuitility",
    creator: "@yuitility",
    title: `Contact Us & Support | ${SITE_NAME}`,
    description: "Get in touch with the Yuitility engineering and support team. Submit feature requests, bug reports, or general inquiries. Average response time within 24 hours.",
    images: [absoluteUrl("/brand/yuitility-logo-512.png")],
  },
};

export default function ContactPage() {
  const contactSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "@id": `${SITE_URL}/contact#webpage`,
    url: `${SITE_URL}/contact`,
    name: `Contact Us & Support | ${SITE_NAME}`,
    description: "Get in touch with the Yuitility engineering and support team. Submit feature requests, bug reports, or general inquiries. Average response time within 24 hours.",
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
    },
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
        { "@type": "ListItem", position: 2, name: "Contact & Support", item: `${SITE_URL}/contact` },
      ],
    },
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: `${SITE_URL}/`,
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@yuitility.app",
        availableLanguage: ["English"],
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactSchema) }}
      />
      <ContactPageClient />
    </>
  );
}

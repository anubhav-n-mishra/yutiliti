import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_URL } from "@/src/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "Yuitility",
    description: "Free, private browser tools for PDFs, images, calculations, developer workflows, and everyday tasks.",
    start_url: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone", "minimal-ui"],
    background_color: "#fafafa",
    theme_color: "#2563eb",
    orientation: "portrait-primary",
    scope: "/",
    lang: "en",
    dir: "ltr",
    categories: ["utilities", "productivity", "developer", "finance", "education"],
    icons: [
      { src: "/icon-72.png", sizes: "72x72", type: "image/png", purpose: "any maskable" },
      { src: "/icon-96.png", sizes: "96x96", type: "image/png", purpose: "any maskable" },
      { src: "/icon-128.png", sizes: "128x128", type: "image/png", purpose: "any maskable" },
      { src: "/icon-144.png", sizes: "144x144", type: "image/png", purpose: "any maskable" },
      { src: "/icon-152.png", sizes: "152x152", type: "image/png", purpose: "any maskable" },
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any maskable" },
      { src: "/icon-384.png", sizes: "384x384", type: "image/png", purpose: "any maskable" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any maskable" },
      { src: "/icon-1024.png", sizes: "1024x1024", type: "image/png", purpose: "any maskable" },
    ],
    screenshots: [
      {
        src: "/screenshots/desktop.png",
        sizes: "1920x1080",
        type: "image/png",
        form_factor: "wide",
        label: "Yuitility on desktop",
      },
      {
        src: "/screenshots/mobile.png",
        sizes: "750x1334",
        type: "image/png",
        form_factor: "narrow",
        label: "Yuitility on mobile",
      },
    ],
    shortcuts: [
      {
        name: "EMI Calculator",
        short_name: "EMI Calc",
        description: "Calculate loan EMIs instantly",
        url: "/tools/emi-calculator",
        icons: [{ src: "/icons/calculator.png", sizes: "96x96" }],
      },
      {
        name: "PDF Tools",
        short_name: "PDF Tools",
        description: "Merge, split, compress PDFs",
        url: "/tools/pdf-merger",
        icons: [{ src: "/icons/pdf.png", sizes: "96x96" }],
      },
      {
        name: "Image Tools",
        short_name: "Images",
        description: "Compress, resize, convert images",
        url: "/tools/image-compressor",
        icons: [{ src: "/icons/image.png", sizes: "96x96" }],
      },
      {
        name: "QR Generator",
        short_name: "QR Code",
        description: "Generate QR codes instantly",
        url: "/tools/qr-code-generator",
        icons: [{ src: "/icons/qr.png", sizes: "96x96" }],
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
    iarc_rating_id: "",
    launch_handler: {
      client_mode: ["focus-existing", "auto"],
    },
    protocol_handlers: [],
    file_handlers: [],
  };
}

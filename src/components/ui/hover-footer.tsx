"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { Mail, ShieldCheck, ExternalLink } from "lucide-react";
import { LIVE_TOOLS } from "@/src/lib/toolRegistry";

export const TextHoverEffect = ({
  text,
  duration,
  className,
}: {
  text: string;
  duration?: number;
  automatic?: boolean;
  className?: string;
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [maskPosition, setMaskPosition] = useState({ cx: "50%", cy: "50%" });

  useEffect(() => {
    if (svgRef.current && cursor.x !== null && cursor.y !== null) {
      const svgRect = svgRef.current.getBoundingClientRect();
      const cxPercentage = ((cursor.x - svgRect.left) / svgRect.width) * 100;
      const cyPercentage = ((cursor.y - svgRect.top) / svgRect.height) * 100;
      setMaskPosition({
        cx: `${cxPercentage}%`,
        cy: `${cyPercentage}%`,
      });
    }
  }, [cursor]);

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox="0 0 300 100"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={(e) => setCursor({ x: e.clientX, y: e.clientY })}
      className={cn("select-none uppercase cursor-pointer w-full h-full", className)}
    >
      <defs>
        <linearGradient
          id="textGradient"
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {hovered && (
            <>
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="25%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#06b6d4" />
              <stop offset="75%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#6366f1" />
            </>
          )}
        </linearGradient>

        <motion.radialGradient
          id="revealMask"
          gradientUnits="userSpaceOnUse"
          r="20%"
          initial={{ cx: "50%", cy: "50%" }}
          animate={maskPosition}
          transition={{ duration: duration ?? 0, ease: "easeOut" }}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </motion.radialGradient>
        <mask id="textMask">
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill="url(#revealMask)"
          />
        </mask>
      </defs>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-zinc-700 font-[helvetica] text-6xl sm:text-7xl font-bold dark:stroke-zinc-800"
        style={{ opacity: hovered ? 0.7 : 0 }}
      >
        {text}
      </text>
      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth="0.3"
        className="fill-transparent stroke-[var(--accent-primary)] font-[helvetica] text-6xl sm:text-7xl font-bold opacity-60"
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{
          strokeDashoffset: 0,
          strokeDasharray: 1000,
        }}
        transition={{
          duration: 4,
          ease: "easeInOut",
        }}
      >
        {text}
      </motion.text>
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke="url(#textGradient)"
        strokeWidth="0.3"
        mask="url(#textMask)"
        className="fill-transparent font-[helvetica] text-6xl sm:text-7xl font-bold"
      >
        {text}
      </text>
    </svg>
  );
};

export const FooterBackgroundGradient = () => {
  return (
    <div
      className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-60 transition-all duration-700"
      style={{
        background:
          "radial-gradient(80% 80% at 50% 30%, var(--accent-glow) 0%, rgba(9, 9, 11, 0) 100%)",
      }}
    />
  );
};

export default function HoverFooter() {
  const footerLinks = [
    {
      // Every live category is linked here. Health, Units & Conversion and
      // Everyday Utilities were previously absent, which left their category
      // pages orphaned - reachable only from the XML sitemap.
      title: "Tool Categories",
      links: [
        { label: "All tools", href: "/tools" },
        { label: "Finance & Wealth", href: "/category/finance" },
        { label: "Calculators & Maths", href: "/category/math" },
        { label: "PDF Tools", href: "/category/pdf" },
        { label: "Image & Media", href: "/category/media" },
        { label: "Developer & Text Tools", href: "/category/developer" },
        { label: "Health & Lifestyle", href: "/category/health" },
        { label: "Units & Conversion", href: "/category/conversion" },
        { label: "Everyday Utilities", href: "/category/utility" },
      ],
    },
    {
      title: "Platform Info",
      links: [
        { label: "About Yuitility", href: "/about" },
        { label: "Guides & articles", href: "/blog" },
        { label: "Contact & Support", href: "/contact" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const contactEmails = [
    { label: "hello@yuitility.app", href: "mailto:hello@yuitility.app" },
    { label: "develop@yuitility.app", href: "mailto:develop@yuitility.app" },
    { label: "support@yuitility.app", href: "mailto:support@yuitility.app" },
  ];

  return (
    <footer className="w-full bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-20 relative">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-12 gap-x-8 md:gap-x-12 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <img src="/brand/yuitility-logo.png" alt="Yuitility Logo" width={32} height={32} loading="lazy" decoding="async" className="w-8 h-8 object-contain" />
              <span className="text-white text-2xl font-bold font-display tracking-tight">Yuitility</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              {`100% in-browser utilities. ${LIVE_TOOLS.length} working tools, zero server data retention, no upload step.`}
            </p>
            <a
              href="https://amvelt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors pt-2"
            >
              <span>Custom Dev & SEO by <strong>Amvelt.com</strong></span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Link Columns */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="text-white text-sm font-bold font-display uppercase tracking-wider mb-6">
                {section.title}
              </h4>
              <ul className="space-y-4 text-xs text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.label} className="overflow-hidden">
                    <Link
                      href={link.href}
                      className="hover:text-white transition-all duration-300 flex items-center gap-2 group py-1 w-fit"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] opacity-0 -ml-3 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_8px_var(--accent-primary)] shrink-0" />
                      <span className="group-hover:translate-x-0.5 transition-transform duration-350 font-medium">
                        {link.label}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Official Contact Section */}
          <div>
            <h4 className="text-white text-sm font-bold font-display uppercase tracking-wider mb-6">
              Official Contact
            </h4>
            <ul className="space-y-4.5 text-xs text-zinc-400">
              {contactEmails.map((item) => (
                <li key={item.label} className="flex items-center group py-0.5 overflow-hidden">
                  <Mail className="w-4 h-4 text-zinc-500 group-hover:text-[var(--accent-primary)] shrink-0 transition-colors mr-2.5" />
                  <a
                    href={item.href}
                    className="hover:text-white transition-all duration-300 flex items-center gap-2 font-mono py-0.5"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] opacity-0 -ml-3 group-hover:ml-0 group-hover:opacity-100 transition-all duration-300 shadow-[0_0_8px_var(--accent-primary)] shrink-0" />
                    <span className="group-hover:translate-x-0.5 transition-transform duration-350">
                      {item.label}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="border-t border-zinc-800 my-6" />

        {/* Footer Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-400 gap-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Client-Side WebAssembly & JS Engine</span>
          </div>
          <p>© {new Date().getFullYear()} Yuitility Platform. Free Forever.</p>
        </div>
      </div>

      {/* Full-width Big Text Hover Effect */}
      <div className="w-full lg:flex hidden h-[22rem] -mt-36 -mb-28 justify-center items-center pointer-events-auto">
        <TextHoverEffect text="YUITILITY" className="z-30" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  );
}

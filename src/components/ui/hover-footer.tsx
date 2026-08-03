"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/src/lib/utils";
import { Mail, ShieldCheck, ExternalLink } from "lucide-react";

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
        className="fill-transparent stroke-[#3ca2fa] font-[helvetica] text-6xl sm:text-7xl font-bold dark:stroke-[#3ca2fa99]"
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
      className="absolute inset-0 z-0 pointer-events-none"
      style={{
        background:
          "radial-gradient(125% 125% at 50% 10%, rgba(15, 23, 42, 0.5) 50%, rgba(60, 162, 250, 0.2) 100%)",
      }}
    />
  );
};

export default function HoverFooter() {
  const footerLinks = [
    {
      title: "Popular Categories",
      links: [
        { label: "Calculators & Math", href: "/category/math" },
        { label: "Finance & Wealth", href: "/category/finance" },
        { label: "PDF Operations", href: "/category/pdf" },
        { label: "Image & Media", href: "/category/media" },
        { label: "Developer Tools", href: "/category/developer" },
      ],
    },
    {
      title: "Platform Info",
      links: [
        { label: "About Yuitility", href: "/about" },
        { label: "SEO Blog Articles", href: "/blog" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" },
        { label: "Cookie Policy", href: "/cookies" },
      ],
    },
  ];

  const contactEmails = [
    { label: "hello@yuitility.app", href: "mailto:hello@yuitility.app" },
    { label: "develop.yuitility.app", href: "mailto:develop.yuitility.app" },
    { label: "support.yuitility.app", href: "mailto:support.yuitility.app" },
  ];

  return (
    <footer className="w-full bg-zinc-950 text-white relative overflow-hidden border-t border-zinc-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 z-20 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-8 pb-12">
          {/* Brand section */}
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2.5">
              <img src="/brand/yuitility-logo.png" alt="Yuitility Logo" className="w-8 h-8 object-contain" />
              <span className="text-white text-2xl font-bold font-display tracking-tight">Yuitility</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              100% In-Browser Privacy Utilities. 140+ free tools running with zero server data retention and 0ms latency.
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
              <h4 className="text-white text-sm font-bold font-display uppercase tracking-wider mb-5">
                {section.title}
              </h4>
              <ul className="space-y-2.5 text-xs text-zinc-400">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="hover:text-blue-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Official Contact Section */}
          <div>
            <h4 className="text-white text-sm font-bold font-display uppercase tracking-wider mb-5">
              Official Contact
            </h4>
            <ul className="space-y-3 text-xs text-zinc-400">
              {contactEmails.map((item) => (
                <li key={item.label} className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                  <a href={item.href} className="hover:text-blue-400 transition-colors font-mono">
                    {item.label}
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

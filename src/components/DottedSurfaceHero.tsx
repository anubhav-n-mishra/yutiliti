"use client";

import dynamic from "next/dynamic";

const DottedSurface = dynamic(() => import("./ui/dotted-surface"), { ssr: false });

export default function DottedSurfaceHero({ isDark = true }: { isDark?: boolean }) {
  return <DottedSurface isDark={isDark} />;
}

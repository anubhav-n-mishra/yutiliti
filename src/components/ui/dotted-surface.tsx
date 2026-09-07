"use client";

import { cn } from "@/src/lib/utils";
import React, { useEffect, useRef } from "react";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
  isDark?: boolean;
};

export function DottedSurface({
  className,
  size = 5,
  opacity = 0.65,
  isDark = true,
  ...props
}: DottedSurfaceProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let isMounted = true;
    let animationId: number;
    let width = 0;
    let height = 0;

    const AMOUNTX = 40;
    const AMOUNTY = 55;
    const SEPARATION = 140;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.parentElement?.clientHeight || window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    let count = 0;
    const camY = 340;
    const camZ = 1250;
    const pitch = -0.27; // camera tilt angle
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const totalX = AMOUNTX * SEPARATION;
    const totalZ = AMOUNTY * SEPARATION;

    const render = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(render);

      if (document.hidden || width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.45;
      const focalLength = Math.max(width, height) * 0.9;

      const baseR = isDark ? 59 : 37;
      const baseG = isDark ? 130 : 99;
      const baseB = isDark ? 246 : 235;

      for (let ix = 0; ix < AMOUNTX; ix++) {
        const x = ix * SEPARATION - totalX / 2;
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const z = iy * SEPARATION - totalZ / 2;
          const y =
            Math.sin((ix + count) * 0.3) * 45 +
            Math.sin((iy + count) * 0.5) * 45;

          const dx = x;
          const dy = y - camY;
          const dz = z - camZ;

          const yRot = dy * cosP - dz * sinP;
          const zRot = dy * sinP + dz * cosP;

          if (zRot >= -150) continue;

          const depth = -zRot;
          const scale = focalLength / depth;
          const screenX = centerX + dx * scale;
          const screenY = centerY - yRot * scale;

          if (screenX < -20 || screenX > width + 20 || screenY < -20 || screenY > height + 20) {
            continue;
          }

          const distFade = Math.max(0, Math.min(1, 1 - (depth - 500) / 2800));
          const dotAlpha = distFade * opacity;
          if (dotAlpha <= 0.01) continue;

          const radius = Math.max(0.6, size * scale * 0.65);

          ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${dotAlpha.toFixed(3)})`;
          ctx.beginPath();
          ctx.arc(screenX, screenY, radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      count += 0.035;
    };

    animationId = requestAnimationFrame(render);

    return () => {
      isMounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [size, opacity, isDark]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

export default DottedSurface;

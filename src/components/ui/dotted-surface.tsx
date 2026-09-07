"use client";

import { cn } from "@/src/lib/utils";
import React, { useEffect, useRef } from "react";

type DottedSurfaceProps = Omit<React.ComponentProps<"div">, "ref"> & {
  size?: number;
  opacity?: number;
  isDark?: boolean;
};

interface ParticlePoint {
  x: number;
  y: number;
  r: number;
}

export function DottedSurface({
  className,
  size = 4.5,
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
    let startTimeout: any;
    let width = 0;
    let height = 0;

    // Optimized grid density: 24x32 = 768 points (down from 2,200)
    const AMOUNTX = 24;
    const AMOUNTY = 32;
    const SEPARATION = 175;

    const handleResize = () => {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
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
    let lastFrameTime = 0;
    const FRAME_INTERVAL = 1000 / 40; // Cap at 40 FPS for ultra-low CPU

    const camY = 320;
    const camZ = 1200;
    const pitch = -0.26;
    const cosP = Math.cos(pitch);
    const sinP = Math.sin(pitch);
    const totalX = AMOUNTX * SEPARATION;
    const totalZ = AMOUNTY * SEPARATION;

    const baseR = isDark ? 59 : 37;
    const baseG = isDark ? 130 : 99;
    const baseB = isDark ? 246 : 235;

    // Pre-allocated alpha buckets to eliminate GC allocations during render
    const bucketLow: ParticlePoint[] = [];
    const bucketMid: ParticlePoint[] = [];
    const bucketHigh: ParticlePoint[] = [];

    const render = (now: number) => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(render);

      if (document.hidden || width === 0 || height === 0) return;

      // Throttle frame rate
      if (now - lastFrameTime < FRAME_INTERVAL) return;
      lastFrameTime = now;

      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height * 0.45;
      const focalLength = Math.max(width, height) * 0.85;

      bucketLow.length = 0;
      bucketMid.length = 0;
      bucketHigh.length = 0;

      for (let ix = 0; ix < AMOUNTX; ix++) {
        const x = ix * SEPARATION - totalX / 2;
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const z = iy * SEPARATION - totalZ / 2;
          const y =
            Math.sin((ix + count) * 0.3) * 42 +
            Math.sin((iy + count) * 0.5) * 42;

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

          if (screenX < -15 || screenX > width + 15 || screenY < -15 || screenY > height + 15) {
            continue;
          }

          const distFade = Math.max(0, Math.min(1, 1 - (depth - 450) / 2600));
          const dotAlpha = distFade * opacity;
          if (dotAlpha <= 0.02) continue;

          const radius = Math.max(0.6, size * scale * 0.6);

          if (dotAlpha < 0.25) {
            bucketLow.push({ x: screenX, y: screenY, r: radius });
          } else if (dotAlpha < 0.55) {
            bucketMid.push({ x: screenX, y: screenY, r: radius });
          } else {
            bucketHigh.push({ x: screenX, y: screenY, r: radius });
          }
        }
      }

      // Draw each bucket in a single batched path (3 draw calls total)
      if (bucketLow.length > 0) {
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${(opacity * 0.2).toFixed(2)})`;
        ctx.beginPath();
        for (let i = 0; i < bucketLow.length; i++) {
          const p = bucketLow[i];
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (bucketMid.length > 0) {
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${(opacity * 0.45).toFixed(2)})`;
        ctx.beginPath();
        for (let i = 0; i < bucketMid.length; i++) {
          const p = bucketMid[i];
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (bucketHigh.length > 0) {
        ctx.fillStyle = `rgba(${baseR}, ${baseG}, ${baseB}, ${(opacity * 0.75).toFixed(2)})`;
        ctx.beginPath();
        for (let i = 0; i < bucketHigh.length; i++) {
          const p = bucketHigh[i];
          ctx.moveTo(p.x + p.r, p.y);
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      count += 0.032;
    };

    // Defer animation loop start until main thread is idle after hydration
    const startAnimation = () => {
      if (!isMounted) return;
      animationId = requestAnimationFrame(render);
    };

    if (typeof (window as any).requestIdleCallback === "function") {
      (window as any).requestIdleCallback(() => {
        startTimeout = setTimeout(startAnimation, 300);
      });
    } else {
      startTimeout = setTimeout(startAnimation, 400);
    }

    return () => {
      isMounted = false;
      if (startTimeout) clearTimeout(startTimeout);
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

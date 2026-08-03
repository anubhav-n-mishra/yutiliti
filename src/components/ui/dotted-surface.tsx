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
  size = 6,
  opacity = 0.65,
  sizeAttenuation = true,
  vertexColors = true,
  isDark = true,
  ...props
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let isMounted = true;
    let animationId: number;
    let handleResize: () => void;
    let rendererInstance: any;

    import("three").then((THREE) => {
      if (!isMounted || !containerRef.current) return;

      const SEPARATION = 150;
      const AMOUNTX = 40;
      const AMOUNTY = 60;

      const scene = new THREE.Scene();
      scene.fog = new THREE.Fog(0xffffff, 2000, 10000);

      const camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        1,
        10000
      );
      camera.position.set(0, 355, 1220);

      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      rendererInstance = renderer;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setClearColor(scene.fog.color, 0);

      containerRef.current.appendChild(renderer.domElement);

      const positions: number[] = [];
      const colors: number[] = [];

      const geometry = new THREE.BufferGeometry();

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          const x = ix * SEPARATION - (AMOUNTX * SEPARATION) / 2;
          const y = 0;
          const z = iy * SEPARATION - (AMOUNTY * SEPARATION) / 2;

          positions.push(x, y, z);
          if (isDark) {
            colors.push(59 / 255, 130 / 255, 246 / 255);
          } else {
            colors.push(37 / 255, 99 / 255, 235 / 255);
          }
        }
      }

      geometry.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(positions, 3)
      );
      geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size,
        vertexColors,
        transparent: true,
        opacity,
        sizeAttenuation,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      let count = 0;

      const animate = () => {
        if (!isMounted) return;
        animationId = requestAnimationFrame(animate);

        const positionAttribute = geometry.attributes.position;
        const posArray = positionAttribute.array as Float32Array;

        let i = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            const index = i * 3;
            posArray[index + 1] =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iy + count) * 0.5) * 50;
            i++;
          }
        }

        positionAttribute.needsUpdate = true;
        renderer.render(scene, camera);
        count += 0.05;
      };

      handleResize = () => {
        if (!containerRef.current) return;
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      };

      window.addEventListener("resize", handleResize);
      animate();
    });

    return () => {
      isMounted = false;
      if (animationId) cancelAnimationFrame(animationId);
      if (handleResize) window.removeEventListener("resize", handleResize);
      if (rendererInstance && containerRef.current && rendererInstance.domElement) {
        try {
          containerRef.current.removeChild(rendererInstance.domElement);
          rendererInstance.dispose();
        } catch {
          // ignore cleanup errors
        }
      }
    };
  }, [size, opacity, sizeAttenuation, vertexColors, isDark]);

  return (
    <div
      ref={containerRef}
      className={cn("pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-60", className)}
      {...props}
    />
  );
}

export default DottedSurface;

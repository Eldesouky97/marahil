"use client";

import { Suspense, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import type { Mesh } from "three";
import { useTheme } from "@/context/ThemeProvider";

/**
 * Three.js needs literal colors, not CSS var() — same constraint as
 * chartColors.ts/useQrCode.ts (see CLAUDE.md). Hardcoded from globals.css's
 * --gold/--accent/--primary (light and dark) rather than read via
 * getComputedStyle, so the color swap on theme toggle is a plain derived
 * value instead of an effect resyncing state.
 */
const BRAND_COLORS = {
  light: { gold: "#f59e0b", accent: "#14b8a6", primary: "#0b3b6f" },
  dark: { gold: "#fbbf3d", accent: "#2dd4c0", primary: "#6fa8dc" },
} as const;

function BrandShape({ colors, spin }: { colors: { gold: string; accent: string; primary: string }; spin: boolean }) {
  const starRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!spin) return;
    if (starRef.current) starRef.current.rotation.y += delta * 0.35;
    if (ringRef.current) {
      ringRef.current.rotation.x += delta * 0.12;
      ringRef.current.rotation.z += delta * 0.18;
    }
  });

  return (
    <group>
      <Float speed={1.4} rotationIntensity={spin ? 0.5 : 0} floatIntensity={spin ? 0.9 : 0}>
        <mesh ref={starRef}>
          <icosahedronGeometry args={[1.05, 0]} />
          <meshStandardMaterial color={colors.gold} metalness={0.45} roughness={0.25} flatShading />
        </mesh>
      </Float>
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[1.85, 0.035, 16, 100]} />
        <meshStandardMaterial color={colors.accent} metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

/**
 * The Hero's 3D accent — an abstract star (icosahedron, echoing the logo's
 * star) orbited by a ring, in the brand's gold/teal. Client-only (mounted
 * via next/dynamic ssr:false in Hero3D.tsx) since Canvas needs the browser;
 * no drei <Environment> (would fetch an HDR map from an external CDN on
 * every load) — just two lights, kept fully self-contained.
 */
export function Hero3DScene() {
  const { theme } = useTheme();
  const [spin] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const colors = BRAND_COLORS[theme];

  return (
    <Canvas key={theme} camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 3]} intensity={1.3} color={colors.gold} />
      <directionalLight position={[-3, -2, -3]} intensity={0.5} color={colors.primary} />
      <Suspense fallback={null}>
        <BrandShape colors={colors} spin={spin} />
      </Suspense>
    </Canvas>
  );
}

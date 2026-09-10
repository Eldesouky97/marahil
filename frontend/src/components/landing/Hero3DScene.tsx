"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import { ExtrudeGeometry, Shape, type Mesh } from "three";
import { useTheme } from "@/context/ThemeProvider";

/**
 * Three.js needs literal colors, not CSS var() — same constraint as
 * chartColors.ts/useQrCode.ts (see CLAUDE.md). Hardcoded from globals.css's
 * --gold/--accent (light and dark) rather than read via getComputedStyle, so
 * the color swap on theme toggle is a plain derived value instead of an
 * effect resyncing state. Lights stay a fixed near-white regardless of
 * theme — a colored light multiplies with the material's own color, which
 * is what was turning the gold star muddy brown before this was warm-white.
 */
const BRAND_COLORS = {
  light: { gold: "#f59e0b", accent: "#14b8a6" },
  dark: { gold: "#fbbf3d", accent: "#2dd4c0" },
} as const;

/** A real 5-point star outline, extruded and centered — reads as "the logo's star", not an abstract gem. */
function useStarGeometry() {
  return useMemo(() => {
    const outerRadius = 1.1;
    const innerRadius = 0.45;
    const points = 5;
    const shape = new Shape();
    for (let i = 0; i < points * 2; i++) {
      const r = i % 2 === 0 ? outerRadius : innerRadius;
      const angle = (i * Math.PI) / points - Math.PI / 2;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    shape.closePath();
    const geometry = new ExtrudeGeometry(shape, {
      depth: 0.35,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.04,
      bevelSegments: 3,
    });
    geometry.center();
    return geometry;
  }, []);
}

function BrandShape({ colors, spin }: { colors: { gold: string; accent: string }; spin: boolean }) {
  const starRef = useRef<Mesh>(null);
  const ringRef = useRef<Mesh>(null);
  const starGeometry = useStarGeometry();

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
        <mesh ref={starRef} geometry={starGeometry} rotation={[0.5, 0, 0]}>
          <meshStandardMaterial color={colors.gold} metalness={0.35} roughness={0.3} />
        </mesh>
      </Float>
      <mesh ref={ringRef} rotation={[Math.PI / 3, 0.3, 0]}>
        <torusGeometry args={[1.9, 0.03, 16, 100]} />
        <meshStandardMaterial color={colors.accent} metalness={0.5} roughness={0.35} />
      </mesh>
    </group>
  );
}

/**
 * The Hero's 3D accent — an extruded 5-point star (echoing the logo's star)
 * orbited by a thin ring, in the brand's gold/teal. Client-only (mounted via
 * next/dynamic ssr:false in Hero3D.tsx) since Canvas needs the browser; no
 * drei <Environment> (would fetch an HDR map from an external CDN on every
 * load) — just neutral-white lights, kept fully self-contained.
 */
export function Hero3DScene() {
  const { theme } = useTheme();
  const [spin] = useState(() => !window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const colors = BRAND_COLORS[theme];

  return (
    <Canvas key={theme} camera={{ position: [0, 0, 5], fov: 40 }} dpr={[1, 2]} gl={{ alpha: true }}>
      <ambientLight intensity={0.85} />
      <directionalLight position={[3, 4, 4]} intensity={1.4} color="#ffffff" />
      <directionalLight position={[-3, -2, -2]} intensity={0.55} color="#ffffff" />
      <Suspense fallback={null}>
        <BrandShape colors={colors} spin={spin} />
      </Suspense>
    </Canvas>
  );
}

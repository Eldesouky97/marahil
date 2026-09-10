"use client";

import dynamic from "next/dynamic";

const Hero3DScene = dynamic(() => import("./Hero3DScene").then((m) => m.Hero3DScene), { ssr: false });

export function Hero3D() {
  return (
    <div className="mx-auto mb-4 h-40 w-40 sm:h-52 sm:w-52" aria-hidden="true">
      <Hero3DScene />
    </div>
  );
}

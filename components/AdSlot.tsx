"use client";

import { useEffect } from "react";
import { adConfig, getAdSlot, type AdPosition } from "@/lib/ads";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

type AdSlotProps = {
  position: AdPosition;
};

const positionStyles = {
  top: "min-h-24",
  sidebar: "min-h-72 sticky top-24",
  content: "min-h-32",
  footer: "min-h-24",
  "rail-left": "min-h-96 sticky top-24",
  "rail-right": "min-h-96 sticky top-24"
};

export function AdSlot({ position }: AdSlotProps) {
  const slot = getAdSlot(position);
  const canRenderAdSense = adConfig.enabled && adConfig.client && slot;

  useEffect(() => {
    if (!canRenderAdSense) return;
    try {
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch {
      // Ad blockers or delayed AdSense loading should never break the page.
    }
  }, [canRenderAdSense]);

  return (
    <aside
      aria-label="Publicidad"
      className={`rounded-md border border-dashed border-slate-300 bg-white px-4 py-5 text-center text-sm text-slate-500 ${positionStyles[position]}`}
    >
      <p className="ad-label mb-2 text-[11px] font-bold uppercase text-slate-400">
        Publicidad
      </p>
      {canRenderAdSense ? (
        <ins
          className="adsbygoogle block"
          data-ad-client={adConfig.client}
          data-ad-format="auto"
          data-ad-slot={slot}
          data-full-width-responsive="true"
        />
      ) : (
        <p>Espacio para anuncio Google AdSense</p>
      )}
    </aside>
  );
}

export function AdBannerTop() {
  return <AdSlot position="top" />;
}

export function AdSidebar() {
  return <AdSlot position="sidebar" />;
}

export function AdInContent() {
  return <AdSlot position="content" />;
}

export function AdFooter() {
  return <AdSlot position="footer" />;
}

export function AdRailLeft() {
  return <AdSlot position="rail-left" />;
}

export function AdRailRight() {
  return <AdSlot position="rail-right" />;
}

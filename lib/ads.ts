export type AdPosition =
  | "top"
  | "sidebar"
  | "content"
  | "footer"
  | "rail-left"
  | "rail-right";

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "ca-pub-6144599865368963";

export const adConfig = {
  enabled: process.env.NEXT_PUBLIC_ADSENSE_ENABLED !== "false",
  client: ADSENSE_CLIENT,
  slots: {
    top: process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP || "",
    content: process.env.NEXT_PUBLIC_ADSENSE_SLOT_CONTENT || "",
    sidebar: process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR || "",
    footer: process.env.NEXT_PUBLIC_ADSENSE_SLOT_FOOTER || "",
    "rail-left": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_LEFT || "",
    "rail-right": process.env.NEXT_PUBLIC_ADSENSE_SLOT_RAIL_RIGHT || ""
  } satisfies Record<AdPosition, string>
};

export function getAdSlot(position: AdPosition) {
  return adConfig.slots[position];
}

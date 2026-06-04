import { AdRailLeft, AdRailRight } from "@/components/AdSlot";

export function AdRailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-[1480px] grid-cols-1 gap-6 px-4 xl:grid-cols-[160px_minmax(0,1120px)_160px] 2xl:grid-cols-[200px_minmax(0,1120px)_200px]">
      <aside className="hidden xl:block" aria-label="Publicidad lateral izquierda">
        <AdRailLeft />
      </aside>
      <div className="min-w-0">{children}</div>
      <aside className="hidden xl:block" aria-label="Publicidad lateral derecha">
        <AdRailRight />
      </aside>
    </div>
  );
}

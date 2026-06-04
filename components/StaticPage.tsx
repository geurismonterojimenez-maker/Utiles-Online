import { Breadcrumbs } from "@/components/Breadcrumbs";

export function StaticPage({
  title,
  children
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main className="container-page py-10">
      <Breadcrumbs items={[{ label: title }]} />
      <article className="prose-lite mt-6 max-w-3xl rounded-md border border-slate-200 bg-white p-6">
        <h1 className="text-4xl font-black text-slate-950">{title}</h1>
        {children}
      </article>
    </main>
  );
}

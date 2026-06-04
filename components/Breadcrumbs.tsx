import Link from "next/link";

type Breadcrumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav aria-label="Migas de pan" className="text-sm text-slate-500">
      <ol className="flex flex-wrap items-center gap-2">
        <li>
          <Link className="hover:text-teal-700" href="/">
            Inicio
          </Link>
        </li>
        {items.map((item) => (
          <li className="flex items-center gap-2" key={item.label}>
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link className="hover:text-teal-700" href={item.href}>
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-slate-700">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

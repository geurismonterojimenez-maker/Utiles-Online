"use client";

import Link from "next/link";
import { useState } from "react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { categories } from "@/lib/tools";
import { siteConfig } from "@/lib/site";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-40 border-b backdrop-blur">
      <div className="container-page flex min-h-16 items-center justify-between gap-4">
        <Link className="site-logo focus-ring rounded-sm text-xl font-black text-teal-800" href="/">
          {siteConfig.name}
        </Link>
        <button
          aria-controls="main-menu"
          aria-expanded={open}
          aria-label="Abrir o cerrar menú"
          className="site-menu-button focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700 md:hidden"
          onClick={() => setOpen((value) => !value)}
          type="button"
        >
          Menú
        </button>
        <div className="hidden md:block">
          <ThemeToggle />
        </div>
        <nav
          className={`site-nav ${open ? "block" : "hidden"} absolute left-0 right-0 top-16 border-b px-4 py-4 md:static md:block md:border-0 md:bg-transparent md:p-0`}
          id="main-menu"
        >
          <ul className="site-nav-list flex flex-col gap-3 text-sm font-bold text-slate-700 md:flex-row md:items-center md:gap-5">
            {Object.values(categories).map((category) => (
              <li key={category.slug}>
                <Link className="site-nav-link hover:text-teal-700" href={`/categorias/${category.slug}`}>
                  {category.name}
                </Link>
              </li>
            ))}
            <li className="md:hidden">
              <ThemeToggle />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

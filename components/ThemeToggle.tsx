"use client";

import { useEffect, useState } from "react";

const key = "utilesonline-theme";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(key);
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const enabled = saved ? saved === "dark" : prefersDark;
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    localStorage.setItem(key, next ? "dark" : "light");
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <button
      aria-label="Cambiar modo claro u oscuro"
      className="theme-toggle focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-bold text-slate-700"
      onClick={toggle}
      type="button"
    >
      {dark ? "Claro" : "Oscuro"}
    </button>
  );
}

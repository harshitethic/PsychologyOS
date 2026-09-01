"use client";
import { useEffect, useState } from "react";

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("psy-theme");
    const isDark = saved === "dark";
    setDark(isDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "";
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    localStorage.setItem("psy-theme", next ? "dark" : "light");
    document.documentElement.dataset.theme = next ? "dark" : "";
  }

  return (
    <button
      type="button"
      className={compact ? "theme-toggle compact" : "theme-toggle"}
      onClick={toggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <span aria-hidden="true">{dark ? "☀" : "☾"}</span>
      <strong>{dark ? "Light" : "Dark"}</strong>
    </button>
  );
}

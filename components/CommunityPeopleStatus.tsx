"use client";

import { useEffect } from "react";

export function CommunityPeopleStatus() {
  useEffect(() => {
    const update = () => {
      document.querySelectorAll<HTMLElement>(".person-last-seen").forEach((el) => {
        const raw = el.dataset.lastActive;
        const dot = el.parentElement?.querySelector<HTMLElement>(".person-dot");
        if (!raw) {
          el.textContent = "never";
          if (dot) dot.dataset.active = "false";
          return;
        }
        const diff = Math.max(0, Date.now() - new Date(raw).getTime());
        const active = diff < 5 * 60 * 1000;
        if (dot) dot.dataset.active = active ? "true" : "false";
        if (active) {
          el.textContent = "online";
          return;
        }
        const minutes = Math.floor(diff / 60000);
        if (minutes < 60) el.textContent = `${Math.max(1, minutes)}m ago`;
        else if (minutes < 24 * 60) el.textContent = `${Math.max(1, Math.floor(minutes / 60))}h ago`;
        else el.textContent = `${Math.max(1, Math.floor(minutes / (24 * 60)))}d ago`;
      });
    };
    update();
    const timer = window.setInterval(update, 30000);
    return () => window.clearInterval(timer);
  }, []);
  return null;
}

"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

const PUBLIC_PREFIXES = ["/login", "/signup", "/admin"];

function hideChrome(pathname: string) {
  if (pathname === "/") return true;
  return PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

export function AppChrome({
  user,
  children,
}: {
  user: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const chromeHidden = hideChrome(pathname);

  return (
    <>
      {!chromeHidden && user ? <Sidebar user={user} /> : null}
      {children}
    </>
  );
}

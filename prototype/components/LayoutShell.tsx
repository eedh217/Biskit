"use client";

import { usePathname } from "next/navigation";
import Navigation from "@/components/Navigation";
import LNB from "@/components/LNB";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showLNB = !isHome;

  return (
    <>
      <Navigation />
      <div className="max-w-[1500px] mx-auto">
        {showLNB ? (
          <div className="flex">
            <LNB />
            <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
          </div>
        ) : (
          <main className="px-4 py-6">{children}</main>
        )}
      </div>
    </>
  );
}

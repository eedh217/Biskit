"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Navigation from "@/components/Navigation";
import LNB from "@/components/LNB";

const BREAKPOINT = 1500;

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const showLNB = !isHome;
  const [isLNBOpen, setIsLNBOpen] = useState(true);

  const handleResize = useCallback(() => {
    setIsLNBOpen(window.innerWidth > BREAKPOINT);
  }, []);

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <>
      <Navigation />
      <div className="max-w-[1500px] mx-auto">
        {showLNB ? (
          <div className="flex relative">
            <LNB isOpen={isLNBOpen} />
            {/* 토글 버튼: LNB와 컨텐츠 경계선 */}
            <button
              onClick={() => setIsLNBOpen((prev) => !prev)}
              className="absolute top-4 z-10 w-5 h-10 flex items-center justify-center bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 transition-all shadow-sm"
              style={{ left: isLNBOpen ? 220 : 0 }}
              title={isLNBOpen ? "메뉴 접기" : "메뉴 펼치기"}
            >
              <svg
                className={`w-3.5 h-3.5 text-gray-500 transition-transform ${isLNBOpen ? "" : "rotate-180"}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <main className="flex-1 min-w-0 px-6 py-6">{children}</main>
          </div>
        ) : (
          <main className="px-4 py-6">{children}</main>
        )}
      </div>
    </>
  );
}

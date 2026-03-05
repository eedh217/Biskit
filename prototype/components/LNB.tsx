"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface MenuItem3depth {
  label: string;
  href: string;
  disabled?: boolean;
}

interface MenuItem2depth {
  label: string;
  children: MenuItem3depth[];
}

function getMenuItems(depth1: string): MenuItem2depth[] {
  switch (depth1) {
    case "policy":
      return [
        {
          label: "사업소득",
          children: [
            { label: "월별 사업소득", href: "/policy/sps/monthly" },
            { label: "전체 사업소득", href: "/policy/sps/all" },
          ],
        },
      ];
    case "sps":
      return [
        {
          label: "사업소득",
          children: [
            { label: "월별 사업소득", href: "/sps/summary" },
            { label: "전체 사업소득", href: "/sps/all" },
          ],
        },
      ];
    default:
      return [];
  }
}

function getDepth1FromPathname(pathname: string): string | null {
  if (pathname.startsWith("/policy")) return "policy";
  if (pathname.startsWith("/sps")) return "sps";
  return null;
}

export default function LNB({ isOpen = true }: { isOpen?: boolean }) {
  const pathname = usePathname();
  const depth1 = getDepth1FromPathname(pathname);
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    사업소득: true,
  });

  if (!depth1) return null;

  const menuItems = getMenuItems(depth1);

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <aside
      className={`shrink-0 bg-gray-50 border-r border-gray-200 min-h-[calc(100vh-56px)] transition-all duration-300 overflow-hidden ${
        isOpen ? "w-[220px]" : "w-0 border-r-0"
      }`}
    >
      <nav className="py-4 w-[220px]">
        {menuItems.map((item2) => (
          <div key={item2.label}>
            {/* 2depth item */}
            <button
              onClick={() => toggleExpand(item2.label)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <span>{item2.label}</span>
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedItems[item2.label] ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {/* 3depth items */}
            {expandedItems[item2.label] && (
              <div className="ml-3">
                {item2.children.map((item3) => {
                  const isActive = pathname === item3.href;
                  if (item3.disabled) {
                    return (
                      <div
                        key={item3.href}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300" />
                        {item3.label}
                        <span className="text-xs bg-gray-200 text-gray-500 px-1.5 py-0.5 rounded ml-auto">
                          준비중
                        </span>
                      </div>
                    );
                  }
                  return (
                    <Link
                      key={item3.href}
                      href={item3.href}
                      className={`flex items-center gap-2 px-4 py-2 text-sm transition-colors ${
                        isActive
                          ? "text-blue-700 bg-blue-50 font-medium border-r-2 border-blue-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          isActive ? "bg-blue-600" : "bg-gray-400"
                        }`}
                      />
                      {item3.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </nav>
    </aside>
  );
}

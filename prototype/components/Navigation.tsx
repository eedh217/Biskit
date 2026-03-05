"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { label: "정책분석", href: "/policy/sps/monthly", prefix: "/policy" },
  { label: "화면", href: "/sps/summary", prefix: "/sps" },
  { label: "테스트케이스", href: "/testcases/sps/monthly", prefix: "/testcases" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-[1500px] mx-auto px-4">
        <div className="flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-lg text-blue-600 shrink-0 mr-6">
            Biskit
          </Link>

          {tabs.map((tab) => {
            const isActive = pathname.startsWith(tab.prefix);
            return (
              <Link
                key={tab.label}
                href={tab.href}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {tab.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

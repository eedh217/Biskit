"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface DropdownItem {
  href: string;
  label: string;
}

interface NavGroup {
  label: string;
  items: DropdownItem[];
}

const dropdownGroups: NavGroup[] = [
  {
    label: "정책분석",
    items: [
      { href: "/policy/worktype", label: "근로형태" },
      { href: "/policy/employee", label: "임직원" },
      { href: "/policy/payitem", label: "급여항목" },
      { href: "/policy/payroll", label: "급여대장" },
      { href: "/policy/payroll-detail", label: "급여내역" },
    ],
  },
  {
    label: "화면",
    items: [
      { href: "/manage/worktype", label: "근로형태" },
      { href: "/manage/employee", label: "임직원" },
      { href: "/manage/payitem", label: "급여항목" },
      { href: "/manage/payroll", label: "급여대장" },
    ],
  },
  {
    label: "테스트케이스",
    items: [
      { href: "/testcases?module=worktype", label: "근로형태" },
      { href: "/testcases?module=employee", label: "임직원" },
      { href: "/testcases?module=payitem", label: "급여항목" },
      { href: "/testcases?module=payroll", label: "급여대장" },
      { href: "/testcases?module=payroll-detail", label: "급여내역" },
    ],
  },
];

const directLinks = [
  { href: "/compare", label: "정책 비교" },
];

function DropdownMenu({ group, pathname }: { group: NavGroup; pathname: string }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setOpen(true);
  };

  const handleLeave = () => {
    timerRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const isGroupActive = group.items.some((item) => {
    const basePath = item.href.split("?")[0];
    return pathname.startsWith(basePath);
  });

  return (
    <div
      className="relative"
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
          isGroupActive
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        }`}
        onClick={() => setOpen(!open)}
      >
        {group.label} <span className="text-xs ml-0.5">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-[100]">
          {group.items.map((item) => {
            const basePath = item.href.split("?")[0];
            const isActive = pathname === basePath || pathname.startsWith(basePath + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-14 gap-1">
          <Link href="/" className="font-bold text-lg text-blue-600 shrink-0 mr-4">
            Biskit
          </Link>

          {/* 드롭다운 그룹 */}
          {dropdownGroups.map((group) => (
            <DropdownMenu key={group.label} group={group} pathname={pathname} />
          ))}

          {/* 직접 링크 */}
          {directLinks.map((item) => {
            const isActive =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive
                    ? "bg-blue-50 text-blue-700"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

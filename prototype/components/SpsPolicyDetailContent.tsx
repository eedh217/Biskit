"use client";

import MarkdownContent from "@/components/MarkdownContent";
import { useState } from "react";

interface Props {
  title: string;
  content: string;
  mdFile: string;
}

interface PolicySection {
  number: string;
  title: string;
  content: string;
}

function parseMarkdown(content: string): {
  overview: string;
  otherSections: PolicySection[];
} {
  // 제목 제거 (첫 번째 # 제목)
  let text = content.replace(/^#[^#].*\n/m, "");

  const lines = text.split("\n");
  const otherSections: PolicySection[] = [];
  let overview = "";
  let currentSection: PolicySection | null = null;

  let inOverview = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // --- 구분선은 무시
    if (line.trim() === "---") {
      continue;
    }

    // ## 1. 화면 개요 또는 기능 개요 시작
    if (line.match(/^##\s*1\.\s*(화면|기능)\s*개요/)) {
      inOverview = true;
      continue;
    }

    // ## 2. ~ 다른 섹션 시작
    const otherSectionMatch = line.match(/^##\s*(\d+)\.\s*(.+)/);
    if (otherSectionMatch && otherSectionMatch[1] !== "1") {
      // 이전 섹션 저장
      if (currentSection) {
        otherSections.push(currentSection);
      }

      // 개요 모드 종료
      inOverview = false;

      // 새 섹션 시작
      currentSection = {
        number: otherSectionMatch[1],
        title: otherSectionMatch[2],
        content: "",
      };
      continue;
    }

    // 내용 추가
    if (inOverview) {
      overview += line + "\n";
    } else if (currentSection) {
      currentSection.content += line + "\n";
    }
  }

  // 마지막 섹션 저장
  if (currentSection) {
    otherSections.push(currentSection);
  }

  return {
    overview: overview.trim(),
    otherSections,
  };
}

export default function SpsPolicyDetailContent({
  title,
  content,
  mdFile,
}: Props) {
  const { overview, otherSections } = parseMarkdown(content);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "2": true,
    "3": false,
    "4": false,
    "5": false,
    "6": false,
  });

  const toggleSection = (number: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [number]: !prev[number],
    }));
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        </div>
        <a
          href={`/api/policy/download?file=${encodeURIComponent(mdFile)}`}
          download
          className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          정책 다운로드
        </a>
      </div>

      {/* 화면 개요/기능 개요 카드 */}
      {overview && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            {title.includes("엑셀") ? "기능 개요" : "화면 개요"}
          </h2>
          <MarkdownContent content={overview} />
        </section>
      )}

      {/* 기타 섹션들 (아코디언 카드) */}
      <div className="space-y-4">
        {otherSections.map((section) => {
          const isExpanded = expandedSections[section.number];

          return (
            <div
              key={section.number}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* 아코디언 헤더 */}
              <button
                onClick={() => toggleSection(section.number)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-700 font-semibold text-sm">
                    {section.number}
                  </span>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {section.title}
                  </h2>
                </div>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                    isExpanded ? "rotate-180" : ""
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

              {/* 아코디언 내용 */}
              {isExpanded && (
                <div className="px-6 py-4 border-t border-gray-200 bg-white">
                  <MarkdownContent content={section.content} />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

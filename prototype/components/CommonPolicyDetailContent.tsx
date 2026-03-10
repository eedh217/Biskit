"use client";

import { CommonPolicy } from "@/types";
import MarkdownContent from "@/components/MarkdownContent";
import { useState } from "react";

interface Props {
  policy: CommonPolicy;
  content: string;
}

interface PolicySection {
  number: string;
  title: string;
  content: string;
}

function parseMarkdown(content: string): {
  general: string;
  policySections: PolicySection[];
} {
  // Frontmatter 제거 (---)
  let text = content.replace(/^---\s*\n[\s\S]*?\n---\s*\n/m, "");

  const lines = text.split("\n");
  const policySections: PolicySection[] = [];
  const generalLines: string[] = [];

  let currentSection: PolicySection | null = null;
  let inExcludeSection = false;

  const excludeSectionTitles = [
    "충돌 처리 규칙",
    "산출물 규칙",
    "질문 및 확인 규칙",
    "질문이 필요한 대표 사례",
    "질문 산출 방식",
    "질문 예시",
    "질문 완료 시 처리 규칙",
  ];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // 제외할 섹션 시작 확인
    if (line.startsWith("##") || line.startsWith("###")) {
      const sectionTitle = line.replace(/^#{2,3}\s+/, "").replace(/\(.*?\)/, "").trim();
      if (excludeSectionTitles.some(title => sectionTitle.includes(title) || title.includes(sectionTitle))) {
        inExcludeSection = true;
        continue;
      } else {
        inExcludeSection = false;
      }
    }

    // 제외 섹션 안에 있으면 스킵
    if (inExcludeSection) {
      continue;
    }

    // # 1. ~ # 6. 주요 섹션 시작
    const mainSectionMatch = line.match(/^# (\d+)\.\s+(.+)/);
    if (mainSectionMatch) {
      // 이전 섹션 저장
      if (currentSection) {
        policySections.push(currentSection);
      }

      // 새 섹션 시작
      currentSection = {
        number: mainSectionMatch[1],
        title: mainSectionMatch[2],
        content: "",
      };
      continue;
    }

    // 현재 주요 섹션 안에 있으면 content에 추가
    if (currentSection) {
      currentSection.content += line + "\n";
    } else {
      // 주요 섹션 밖이면 일반 섹션에 추가
      generalLines.push(line);
    }
  }

  // 마지막 섹션 저장
  if (currentSection) {
    policySections.push(currentSection);
  }

  return {
    general: generalLines.join("\n").trim(),
    policySections,
  };
}

export default function CommonPolicyDetailContent({ policy, content }: Props) {
  const { general, policySections } = parseMarkdown(content);

  // 디버깅
  console.log("policySections:", policySections);
  console.log("policySections.length:", policySections.length);

  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >({
    "1": true,
    "2": false,
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
          <h1 className="text-2xl font-bold text-gray-900">{policy.title}</h1>
          <p className="mt-2 text-gray-600">{policy.description}</p>
        </div>
        <a
          href={`/api/policy/download?file=${encodeURIComponent(
            policy.mdFile
          )}`}
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

      {/* 일반 섹션 (목표, 적용 범위 등) */}
      {general && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <MarkdownContent content={general} />
        </section>
      )}

      {/* 주요 정책 섹션들 (아코디언 카드) */}
      <div className="space-y-4">
        {policySections.map((section) => {
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

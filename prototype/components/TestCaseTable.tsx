"use client";

import { useState } from "react";
import { TestCase, TestCasePriority } from "@/types";
import SectionBadge from "./SectionBadge";

interface Props {
  cases: TestCase[];
  moduleName: string;
}

const priorityColors: Record<TestCasePriority, string> = {
  high: "bg-red-100 text-red-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-600",
};

const priorityLabels: Record<TestCasePriority, string> = {
  high: "High",
  medium: "Medium",
  low: "Low",
};

export default function TestCaseTable({ cases, moduleName }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterScreen, setFilterScreen] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const screens = [...new Set(cases.map((c) => c.screenId))];
  const categories = [...new Set(cases.map((c) => c.category))];

  const filtered = cases.filter((c) => {
    if (filterScreen !== "all" && c.screenId !== filterScreen) return false;
    if (filterPriority !== "all" && c.priority !== filterPriority) return false;
    if (filterCategory !== "all" && c.category !== filterCategory) return false;
    return true;
  });

  return (
    <div>
      <div className="flex flex-wrap gap-3 mb-4">
        <select
          value={filterScreen}
          onChange={(e) => setFilterScreen(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
        >
          <option value="all">전체 화면</option>
          {screens.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
        >
          <option value="all">전체 우선순위</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
        >
          <option value="all">전체 카테고리</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-500 self-center ml-auto">
          {filtered.length}개 테스트케이스
        </span>
      </div>

      <div className="space-y-2">
        {filtered.map((tc) => (
          <div
            key={tc.id}
            className="border border-gray-200 rounded-lg bg-white"
          >
            <button
              onClick={() =>
                setExpandedId(expandedId === tc.id ? null : tc.id)
              }
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="font-mono text-xs text-gray-400 w-24 shrink-0">
                {tc.id}
              </span>
              <span className="font-mono text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded shrink-0">
                {tc.screenId}
              </span>
              <span className="text-sm text-gray-900 flex-1">{tc.title}</span>
              <span
                className={`text-xs px-2 py-0.5 rounded font-medium shrink-0 ${priorityColors[tc.priority]}`}
              >
                {priorityLabels[tc.priority]}
              </span>
              <SectionBadge tag={tc.tag} />
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  expandedId === tc.id ? "rotate-180" : ""
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

            {expandedId === tc.id && (
              <div className="px-4 pb-4 pt-2 border-t border-gray-100 space-y-3">
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    사전조건
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {tc.precondition}
                  </p>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    테스트 절차
                  </span>
                  <ol className="list-decimal list-inside text-sm text-gray-700 mt-1 space-y-1">
                    {tc.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </div>
                <div>
                  <span className="text-xs font-medium text-gray-500 uppercase">
                    기대결과
                  </span>
                  <p className="text-sm text-gray-700 mt-1">
                    {tc.expectedResult}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

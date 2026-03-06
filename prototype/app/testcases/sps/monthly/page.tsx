"use client";

import { useState } from "react";
import {
  spsSummaryPolicy,
  spsMonthlyPolicy,
  spsAddPolicy,
  spsEditPolicy,
  spsExcelPolicy,
} from "@/lib/policyData";
import {
  generateTestCases,
  getTestCaseSummary,
} from "@/lib/testcaseGenerator";
import TestCaseTable from "@/components/TestCaseTable";
import { PolicyModule } from "@/types";

const tabs = [
  { id: "sps-summary", label: "사업소득 합산", policy: spsSummaryPolicy },
  { id: "sps-monthly", label: "사업소득 월별 리스트", policy: spsMonthlyPolicy },
  { id: "sps-add", label: "사업소득 추가 팝업", policy: spsAddPolicy },
  { id: "sps-edit", label: "사업소득 수정 팝업", policy: spsEditPolicy },
  { id: "sps-excel", label: "사업소득 엑셀 업로드", policy: spsExcelPolicy },
];

function TabSummary({ policy }: { policy: PolicyModule }) {
  const cases = generateTestCases(policy);
  const summary = getTestCaseSummary(cases);

  return (
    <div className="space-y-6">
      {/* 요약 카드 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{summary.total}</div>
          <div className="text-xs text-gray-500 mt-0.5">전체 TC</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-3 text-center">
          <div className="text-2xl font-bold text-red-700">{summary.byPriority.high}</div>
          <div className="text-xs text-red-600 mt-0.5">High</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3 text-center">
          <div className="text-2xl font-bold text-yellow-700">{summary.byPriority.medium}</div>
          <div className="text-xs text-yellow-600 mt-0.5">Medium</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{summary.byPriority.low}</div>
          <div className="text-xs text-green-600 mt-0.5">Low</div>
        </div>
      </div>

      {/* 카테고리별 분포 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          카테고리별 분포
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.byCategory).map(([cat, count]) => (
            <span
              key={cat}
              className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
            >
              {cat}
              <span className="bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 화면별 분포 */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <h3 className="text-sm font-medium text-gray-700 mb-3">
          화면별 분포
        </h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(summary.byScreen).map(([screen, count]) => (
            <span
              key={screen}
              className="inline-flex items-center gap-1.5 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
            >
              <span className="font-mono text-xs">{screen}</span>
              <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs font-medium">
                {count}
              </span>
            </span>
          ))}
        </div>
      </div>

      {/* 테스트케이스 목록 */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <TestCaseTable cases={cases} moduleName={policy.moduleName} />
      </div>
    </div>
  );
}

export default function TestCasesSpsMonthlyPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activePolicy = tabs.find((t) => t.id === activeTab)!.policy;

  // 전체 요약
  const allSummaries = tabs.map((t) => {
    const cases = generateTestCases(t.policy);
    const summary = getTestCaseSummary(cases);
    return { id: t.id, label: t.label, summary };
  });
  const totalTC = allSummaries.reduce((acc, s) => acc + s.summary.total, 0);
  const totalHigh = allSummaries.reduce((acc, s) => acc + s.summary.byPriority.high, 0);
  const totalMedium = allSummaries.reduce((acc, s) => acc + s.summary.byPriority.medium, 0);
  const totalLow = allSummaries.reduce((acc, s) => acc + s.summary.byPriority.low, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          테스트케이스 - 월별 사업소득
        </h1>
        <p className="mt-2 text-gray-600">
          정책 기반으로 자동 생성된 테스트케이스를 확인합니다.
        </p>
      </div>

      {/* 전체 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-white rounded-lg border border-gray-200 p-3 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalTC}</div>
          <div className="text-xs text-gray-500 mt-0.5">전체 TC</div>
        </div>
        <div className="bg-red-50 rounded-lg border border-red-200 p-3 text-center">
          <div className="text-2xl font-bold text-red-700">{totalHigh}</div>
          <div className="text-xs text-red-600 mt-0.5">High</div>
        </div>
        <div className="bg-yellow-50 rounded-lg border border-yellow-200 p-3 text-center">
          <div className="text-2xl font-bold text-yellow-700">{totalMedium}</div>
          <div className="text-xs text-yellow-600 mt-0.5">Medium</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-3 text-center">
          <div className="text-2xl font-bold text-green-700">{totalLow}</div>
          <div className="text-xs text-green-600 mt-0.5">Low</div>
        </div>
      </div>

      {/* 모듈별 TC 수 + 탭 선택 */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
        {allSummaries.map((s) => (
          <div
            key={s.id}
            className={`rounded-lg border p-3 text-center cursor-pointer transition-colors ${
              activeTab === s.id
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
            onClick={() => setActiveTab(s.id)}
          >
            <div className="text-xl font-bold">{s.summary.total}</div>
            <div className="text-xs mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* 탭 바 */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0 -mb-px overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <TabSummary policy={activePolicy} />
    </div>
  );
}

"use client";

import { useState } from "react";
import {
  spsAllListPolicy,
  spsAllAddPolicy,
  spsAllEditPolicy,
  spsExcelPolicy,
} from "@/lib/policyData";
import PolicyDetailContent from "@/components/PolicyDetailContent";

const tabs = [
  { id: "sps-all-list", label: "전체 사업소득", policy: spsAllListPolicy },
  { id: "sps-excel", label: "엑셀업로드", policy: spsExcelPolicy },
  { id: "sps-all-add", label: "전체 사업소득 추가", policy: spsAllAddPolicy },
  { id: "sps-all-edit", label: "전체 사업소득 수정", policy: spsAllEditPolicy },
];

export default function PolicySpsAllPage() {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activePolicy = tabs.find((t) => t.id === activeTab)!.policy;

  return (
    <div className="space-y-6">
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
      <PolicyDetailContent policy={activePolicy} />
    </div>
  );
}

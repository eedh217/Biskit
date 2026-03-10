"use client";

import { useState } from "react";
import SpsPolicyDetailContent from "@/components/SpsPolicyDetailContent";

interface TabData {
  id: string;
  label: string;
  content: string;
  mdFile: string;
}

interface Props {
  tabs: TabData[];
}

export default function SpsPolicyTabs({ tabs }: Props) {
  const [activeTab, setActiveTab] = useState(tabs[0].id);
  const activeTabData = tabs.find((t) => t.id === activeTab)!;

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
      <SpsPolicyDetailContent
        title={activeTabData.label}
        content={activeTabData.content}
        mdFile={activeTabData.mdFile}
      />
    </div>
  );
}

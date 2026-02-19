"use client";

import { useState } from "react";
import { allPolicies } from "@/lib/policyData";
import { generateCompareItems, countByTag } from "@/lib/policyParser";
import CompareTable from "@/components/CompareTable";

export default function ComparePage() {
  const [moduleAId, setModuleAId] = useState(allPolicies[0]?.id || "");
  const [moduleBId, setModuleBId] = useState(allPolicies[1]?.id || "");

  const policyA = allPolicies.find((p) => p.id === moduleAId);
  const policyB = allPolicies.find((p) => p.id === moduleBId);

  const items = policyA && policyB ? generateCompareItems(policyA, policyB) : [];
  const counts = countByTag(items);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">정책 비교</h1>
        <p className="mt-2 text-gray-600">
          두 모듈의 정책을 비교하여 공통 항목과 화면별 차이점을 확인합니다.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">모듈 A:</label>
            <select
              value={moduleAId}
              onChange={(e) => setModuleAId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allPolicies.map((p) => (
                <option key={p.id} value={p.id}>{p.moduleName}</option>
              ))}
            </select>
          </div>
          <span className="text-gray-400 text-lg">vs</span>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">모듈 B:</label>
            <select
              value={moduleBId}
              onChange={(e) => setModuleBId(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {allPolicies.map((p) => (
                <option key={p.id} value={p.id}>{p.moduleName}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <div className="text-3xl font-bold text-gray-900">{counts.total}</div>
          <div className="text-sm text-gray-500 mt-1">전체 비교 항목</div>
        </div>
        <div className="bg-green-50 rounded-lg border border-green-200 p-4 text-center">
          <div className="text-3xl font-bold text-green-700">
            {counts.common}
          </div>
          <div className="text-sm text-green-600 mt-1">공통 항목</div>
        </div>
        <div className="bg-purple-50 rounded-lg border border-purple-200 p-4 text-center">
          <div className="text-3xl font-bold text-purple-700">
            {counts.screenSpecific}
          </div>
          <div className="text-sm text-purple-600 mt-1">화면별 차이</div>
        </div>
      </div>

      {policyA && policyB && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <CompareTable
            items={items}
            moduleAName={policyA.moduleName}
            moduleBName={policyB.moduleName}
          />
        </div>
      )}
    </div>
  );
}

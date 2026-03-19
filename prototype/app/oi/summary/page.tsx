"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { OIMonthlySummary } from "@/types/sps";
import { getOIYearlySummary } from "@/lib/oiStore";
import { formatAmount } from "@/lib/formatUtils";

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = 2026; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
}

export default function OISummaryPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaries, setSummaries] = useState<OIMonthlySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(() => {
    setLoading(true);
    const data = getOIYearlySummary(selectedYear);
    setSummaries(data);
    setLoading(false);
  }, [selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRowClick = (month: number) => {
    router.push(`/oi/monthly?year=${selectedYear}&month=${month}`);
  };

  const yearOptions = getYearOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">기타소득 합산</h1>
        <div className="flex items-center gap-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {yearOptions.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  월
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  건수
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 지급액
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 필요경비
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 소득금액
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 소득세
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 지방소득세
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 실소득금액
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                  신고파일 최종생성일
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase w-24">
                  다운로드
                </th>
              </tr>
            </thead>
            <tbody>
              {summaries.map((s) => (
                <tr
                  key={s.month}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(s.month)}
                >
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {s.month}월
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {s.count}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalPaymentAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalNecessaryExpense)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalIncomeAmount)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalIncomeTax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalLocalTax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalNetIncome)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 text-center">
                    {s.reportFileDate || "-"}
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      className="px-3 py-1 text-xs text-blue-600 border border-blue-300 rounded hover:bg-blue-50"
                      style={{
                        visibility: s.reportFileDate ? "visible" : "hidden",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      다운로드
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

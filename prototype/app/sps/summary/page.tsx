"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { MonthlySummary } from "@/types/sps";
import {
  getYearlySummary,
  hasDecemberExceptionData,
  getDecemberExceptionBreakdown,
} from "@/lib/store";
import { formatAmount } from "@/lib/formatUtils";
import { downloadTemplate } from "@/lib/excelTemplate";
import { processExcelUpload, UploadResult } from "@/lib/excelUpload";
import ExcelUploadResultPopup from "@/components/sps/ExcelUploadResultPopup";
import Toast from "@/components/manage/Toast";

function getYearOptions(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  for (let y = 2026; y <= currentYear + 1; y++) {
    years.push(y);
  }
  return years;
}

export default function SPSSummaryPage() {
  const router = useRouter();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [summaries, setSummaries] = useState<MonthlySummary[]>([]);
  const [hasException, setHasException] = useState(false);
  const [exceptionBreakdown, setExceptionBreakdown] = useState<{
    sameYearPayment: MonthlySummary;
    afterYearPayment: MonthlySummary;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  // 엑셀 업로드 상태
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [showResultPopup, setShowResultPopup] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const loadData = useCallback(() => {
    setLoading(true);
    const data = getYearlySummary(selectedYear);
    setSummaries(data);

    const hasExc = hasDecemberExceptionData(selectedYear);
    setHasException(hasExc);

    if (hasExc) {
      const breakdown = getDecemberExceptionBreakdown(selectedYear);
      setExceptionBreakdown(breakdown);
    } else {
      setExceptionBreakdown(null);
    }

    setLoading(false);
  }, [selectedYear]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 업로드 중 이탈 방지
  useEffect(() => {
    if (!uploading) return;
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [uploading]);

  const handleFileUpload = async (file: File) => {
    setUploading(true);
    try {
      const response = await processExcelUpload(file);

      if (!response.success) {
        alert(response.error);
        return;
      }

      const result = response.result!;

      if (result.failCount === 0) {
        // 전체 성공 → 토스트
        loadData();
        setToastMessage("엑셀 업로드를 완료했습니다.");
      } else {
        // 부분 실패 또는 전체 실패 → 결과 팝업
        setUploadResult(result);
        setShowResultPopup(true);
      }
    } catch {
      alert("서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setUploading(false);
    }
  };

  const handleFileSelect = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".xlsx,.xls";
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    };
    fileInputRef.current = input;
    input.click();
  };

  const handleTemplateDownload = () => {
    downloadTemplate();
  };

  const handleResultPopupClose = () => {
    setShowResultPopup(false);
    setUploadResult(null);
    loadData();
  };

  const handleRowClick = (month: number) => {
    router.push(`/sps/monthly?year=${selectedYear}&month=${month}`);
  };

  const yearOptions = getYearOptions();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">사업소득 합산</h1>
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
          <div className="relative group">
            <button
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={uploading}
            >
              {uploading ? "업로드 중..." : "엑셀 업로드"}
            </button>
            {!uploading && (
              <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50 hidden group-hover:block">
                <button
                  onClick={handleFileSelect}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  파일올리기
                </button>
                <button
                  onClick={handleTemplateDownload}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  양식받기
                </button>
              </div>
            )}
          </div>
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
                  총 소득세
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 지방소득세
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  총 실지급액
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
                    {formatAmount(s.totalPayment)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalIncomeTax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalLocalTax)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900 text-right">
                    {formatAmount(s.totalNetPayment)}
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
              {/* 12월 예외 행 */}
              {hasException && exceptionBreakdown && (
                <>
                  <tr className="bg-gray-50/70 border-b border-gray-100">
                    <td className="px-4 py-2.5 text-xs text-gray-600 pl-8">
                      {selectedYear}년 지급
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {exceptionBreakdown.sameYearPayment.count}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.sameYearPayment.totalPayment
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.sameYearPayment.totalIncomeTax
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.sameYearPayment.totalLocalTax
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.sameYearPayment.totalNetPayment
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 text-center">
                    </td>
                    <td className="px-4 py-2.5"></td>
                  </tr>
                  <tr className="bg-gray-50/70">
                    <td className="px-4 py-2.5 text-xs text-gray-600 pl-8">
                      {selectedYear}년 이후 지급
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {exceptionBreakdown.afterYearPayment.count}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.afterYearPayment.totalPayment
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.afterYearPayment.totalIncomeTax
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.afterYearPayment.totalLocalTax
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-600 text-right">
                      {formatAmount(
                        exceptionBreakdown.afterYearPayment.totalNetPayment
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-xs text-gray-500 text-center">
                    </td>
                    <td className="px-4 py-2.5"></td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* 업로드 결과 팝업 */}
      {showResultPopup && uploadResult && (
        <ExcelUploadResultPopup
          result={uploadResult}
          onClose={handleResultPopupClose}
        />
      )}

      {/* 토스트 */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
          duration={1500}
        />
      )}
    </div>
  );
}

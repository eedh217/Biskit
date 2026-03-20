"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { OtherIncome } from "@/types/sps";
import {
  getOtherIncomesForMonthlyList,
  deleteOtherIncomes,
  deleteAllForMonth,
} from "@/lib/oiStore";
import { getIncomeTypeName } from "@/lib/incomeTypes";
import { formatAmount, formatDateTime } from "@/lib/formatUtils";
import SearchBar from "@/components/manage/SearchBar";
import Pagination from "@/components/manage/Pagination";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import OtherIncomeAddPopup from "@/components/oi/OtherIncomeAddPopup";
import OtherIncomeEditPopup from "@/components/oi/OtherIncomeEditPopup";

function MonthlyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  const year = yearParam ? parseInt(yearParam, 10) : NaN;
  const month = monthParam ? parseInt(monthParam, 10) : NaN;

  const isValid = !isNaN(year) && !isNaN(month) && month >= 1 && month <= 12;

  const [allData, setAllData] = useState<OtherIncome[]>([]);
  const [filteredData, setFilteredData] = useState<OtherIncome[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [confirmDialog, setConfirmDialog] = useState<{
    message: string;
    onConfirm: () => void;
  } | null>(null);
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editTarget, setEditTarget] = useState<OtherIncome | null>(null);

  const loadData = useCallback(() => {
    if (!isValid) return;
    const data = getOtherIncomesForMonthlyList(year, month);
    // 최근 등록 순
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, [year, month, isValid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applySearch = (data: OtherIncome[], query: string) => {
    let filtered: OtherIncome[];
    if (!query.trim()) {
      filtered = data;
    } else {
      const q = query.trim().toLowerCase();
      filtered = data.filter((item) => item.name.toLowerCase().includes(q));
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  // 상단 요약 (항상 전체 데이터 기준)
  const summary = useMemo(() => ({
    count: allData.length,
    totalPaymentAmount: allData.reduce((sum, i) => sum + i.paymentAmount, 0),
    totalNecessaryExpense: allData.reduce((sum, i) => sum + i.necessaryExpense, 0),
    totalIncomeAmount: allData.reduce((sum, i) => sum + i.incomeAmount, 0),
    totalIncomeTax: allData.reduce((sum, i) => sum + i.incomeTax, 0),
    totalLocalTax: allData.reduce((sum, i) => sum + i.localTax, 0),
    totalNetIncome: allData.reduce((sum, i) => sum + i.netIncome, 0),
  }), [allData]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filteredData.length / pageSize));
  const paged = filteredData.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 체크박스
  const allPageSelected = paged.length > 0 && paged.every((item) => selectedIds.has(item.id));

  const toggleSelectAll = () => {
    if (allPageSelected) {
      const next = new Set(selectedIds);
      paged.forEach((item) => next.delete(item.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paged.forEach((item) => next.add(item.id));
      setSelectedIds(next);
    }
  };

  const toggleSelectItem = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    setSelectedIds(next);
  };

  // 선택 삭제
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setConfirmDialog({
      message: `총 ${selectedIds.size}건의 리스트를 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`,
      onConfirm: () => {
        deleteOtherIncomes(Array.from(selectedIds));
        setConfirmDialog(null);
        setToast("기타소득 삭제를 완료했습니다.");
        loadData();
      },
    });
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    if (allData.length === 0) return;
    setConfirmDialog({
      message: `${year}년 ${month}월의 모든 기타소득(${allData.length}건)을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`,
      onConfirm: () => {
        deleteAllForMonth(year, month);
        setConfirmDialog(null);
        setToast("기타소득 전체 삭제를 완료했습니다.");
        loadData();
      },
    });
  };

  // 엑셀 다운로드 (개별 레코드 단위)
  const handleExcelDownload = (mode: "all" | "filtered" | "selected") => {
    let items: OtherIncome[];
    if (mode === "selected") {
      items = allData.filter((item) => selectedIds.has(item.id));
    } else if (mode === "filtered") {
      items = filteredData;
    } else {
      items = allData;
    }

    if (items.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const headers = [
      "귀속연도", "귀속월", "성명(상호)", "내외국인", "주민(사업자)등록번호",
      "소득구분", "지급연도", "지급월", "지급건수", "지급액", "필요경비", "소득금액",
      "소득세", "지방소득세", "실소득금액", "신고파일 최종 생성일",
    ];

    const rows = items.map((item) => [
      item.attributionYear,
      item.attributionMonth,
      item.name,
      item.isForeign === "Y" ? "외국인" : "내국인",
      item.idNumber,
      item.incomeType,
      item.paymentYear,
      item.paymentMonth,
      item.paymentCount,
      item.paymentAmount,
      item.necessaryExpense,
      item.incomeAmount,
      item.incomeTax,
      item.localTax,
      item.netIncome,
      item.reportFileDate ? formatDateTime(item.reportFileDate) : "-",
    ]);

    const bom = "\uFEFF";
    const csv = bom + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `기타소득_${year}년_${month}월.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 행 클릭 → 수정 팝업
  const handleRowClick = (item: OtherIncome) => {
    setEditTarget(item);
  };

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-600 mb-4">올바르지 않은 접근입니다.</p>
        <p className="text-sm text-gray-500 mb-6">연도와 월 파라미터가 필요합니다. (예: ?year=2026&month=1)</p>
        <button
          onClick={() => router.push("/oi/summary")}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          합산 화면으로 이동
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push("/oi/summary")}
          className="flex items-center gap-3 text-gray-500 hover:text-gray-700"
        >
          <span>&larr;</span>
          <h1 className="text-2xl font-bold text-gray-900">
            {year}년 {month}월 기타소득
          </h1>
        </button>
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          기타소득 추가
        </button>
      </div>

      {/* 상단 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">건수</p>
          <p className="text-lg font-bold text-gray-900">{summary.count}건</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 지급액</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalPaymentAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 필요경비</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalNecessaryExpense)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 소득금액</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalIncomeAmount)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 소득세</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalIncomeTax)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 지방소득세</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalLocalTax)}</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 실소득금액</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalNetIncome)}</p>
        </div>
      </div>

      {/* 검색 + 액션 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="성명(상호) 검색"
            onSearch={handleSearch}
            maxLength={50}
            allowSpecialChar={false}
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            총 <span className="font-semibold text-gray-900">{filteredData.length}</span>건
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PageSizeSelect value={pageSize} onChange={(s) => { setPageSize(s); setCurrentPage(1); }} />

          {/* 엑셀 다운로드 드롭다운 */}
          <div className="relative group">
            <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50">
              엑셀 다운로드
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[160px] z-50 hidden group-hover:block">
              <button
                onClick={() => handleExcelDownload("all")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                전체 다운로드
              </button>
              <button
                onClick={() => handleExcelDownload("filtered")}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                검색 결과 다운로드
              </button>
              <button
                onClick={() => handleExcelDownload("selected")}
                disabled={selectedIds.size === 0}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-40"
              >
                선택 다운로드 ({selectedIds.size}건)
              </button>
            </div>
          </div>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-40"
          >
            선택 삭제 ({selectedIds.size})
          </button>
          <button
            onClick={handleDeleteAll}
            disabled={allData.length === 0}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-40"
          >
            전체 삭제
          </button>
        </div>
      </div>

      {/* 안내문구 */}
      <p className="text-sm text-gray-500">
        ※ 간이지급명세서 신고파일 생성 후 신고파일 데이터에서 값이 수정된 대상자 또는 추가된 대상자는 상단 &apos;상세검색&apos;을 통해 검색 후 간이지급명세서 개별 생성이 가능합니다.
      </p>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[1200px]">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-3 w-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleSelectAll}
                  className="rounded"
                />
              </th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">귀속연도</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">귀속월</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">성명(상호)</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">주민(사업자)등록번호</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">소득구분</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">지급건수</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">지급액(A)</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">필요경비(B)</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">소득금액(A-B)</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">소득세</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">지방소득세</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">실소득금액</th>
              <th className="px-3 py-3 text-center text-xs font-medium text-gray-500">신고파일 최종 생성일</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={14} className="px-4 py-12 text-center text-sm text-gray-500">
                  {searchQuery ? "검색 결과가 없습니다." : "데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((item) => (
                <tr
                  key={item.id}
                  className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors"
                  onClick={() => handleRowClick(item)}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(item.id)}
                      onChange={() => toggleSelectItem(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{item.attributionYear}년</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{String(item.attributionMonth).padStart(2, "0")}월</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 font-mono">{item.idNumber}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {getIncomeTypeName(item.incomeType)}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{item.paymentCount}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.paymentAmount)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.necessaryExpense)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.incomeAmount)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.incomeTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.localTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right font-medium">{formatAmount(item.netIncome)}</td>
                  <td className="px-3 py-3 text-sm text-gray-500 text-center">{formatDateTime(item.reportFileDate)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          총 {filteredData.length}건 중 {(currentPage - 1) * pageSize + 1}~
          {Math.min(currentPage * pageSize, filteredData.length)}건
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Toast */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Confirm Dialog */}
      {confirmDialog && (
        <ConfirmDialog
          message={confirmDialog.message}
          onConfirm={confirmDialog.onConfirm}
          onCancel={() => setConfirmDialog(null)}
        />
      )}

      {/* Add Popup */}
      {showAddPopup && (
        <OtherIncomeAddPopup
          paymentYear={year}
          paymentMonth={month}
          onClose={() => setShowAddPopup(false)}
          onSaved={() => {
            setShowAddPopup(false);
            setToast("기타소득이 추가되었습니다.");
            loadData();
          }}
        />
      )}

      {/* Edit Popup */}
      {editTarget && (
        <OtherIncomeEditPopup
          record={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={() => {
            setEditTarget(null);
            setToast("기타소득이 수정되었습니다.");
            loadData();
          }}
          onDeleted={() => {
            setEditTarget(null);
            loadData();
          }}
        />
      )}
    </div>
  );
}

export default function OIMonthlyPage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <MonthlyContent />
    </Suspense>
  );
}

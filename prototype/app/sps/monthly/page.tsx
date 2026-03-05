"use client";

import { useState, useEffect, useCallback, Suspense, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { BusinessIncome, AggregatedRow } from "@/types/sps";
import {
  getBusinessIncomesForMonthlyList,
  aggregateForMonthlyList,
  deleteBusinessIncomes,
  deleteAllForMonth,
} from "@/lib/store";
import { getIndustryName } from "@/lib/industryCodes";
import { formatAmount } from "@/lib/formatUtils";
import SearchBar from "@/components/manage/SearchBar";
import Pagination from "@/components/manage/Pagination";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import BusinessIncomeAddPopup from "@/components/sps/BusinessIncomeAddPopup";
import BusinessIncomeEditPopup from "@/components/sps/BusinessIncomeEditPopup";
import BusinessIncomeGroupEditPopup from "@/components/sps/BusinessIncomeGroupEditPopup";

function MonthlyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const yearParam = searchParams.get("year");
  const monthParam = searchParams.get("month");

  const year = yearParam ? parseInt(yearParam, 10) : NaN;
  const month = monthParam ? parseInt(monthParam, 10) : NaN;

  const isValid = !isNaN(year) && !isNaN(month) && month >= 1 && month <= 12;

  const [allData, setAllData] = useState<BusinessIncome[]>([]);
  const [filteredRows, setFilteredRows] = useState<AggregatedRow[]>([]);
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
  const [editTarget, setEditTarget] = useState<BusinessIncome | null>(null);
  const [editTargetGroup, setEditTargetGroup] = useState<BusinessIncome[] | null>(null);

  const loadData = useCallback(() => {
    if (!isValid) return;
    const data = getBusinessIncomesForMonthlyList(year, month);
    // 최근 등록 순
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, [year, month, isValid]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applySearch = (data: BusinessIncome[], query: string) => {
    let filteredData: BusinessIncome[];
    if (!query.trim()) {
      filteredData = data;
    } else {
      const q = query.trim().toLowerCase();
      filteredData = data.filter((item) => item.name.toLowerCase().includes(q));
    }
    const aggregated = aggregateForMonthlyList(filteredData);
    setFilteredRows(aggregated);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  // 상단 요약 (항상 전체 개별 레코드 기준)
  const summary = {
    count: allData.length,
    totalPayment: allData.reduce((sum, i) => sum + i.paymentAmount, 0),
    totalIncomeTax: allData.reduce((sum, i) => sum + i.incomeTax, 0),
    totalLocalTax: allData.reduce((sum, i) => sum + i.localTax, 0),
    totalNetPayment: allData.reduce((sum, i) => sum + i.netPayment, 0),
  };

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const paged = filteredRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 체크박스: 합산행 선택 시 내부 모든 레코드 ID 선택/해제
  const allPageSelected = paged.length > 0 && paged.every((row) =>
    row.records.every((r) => selectedIds.has(r.id))
  );

  const toggleSelectAll = () => {
    if (allPageSelected) {
      const next = new Set(selectedIds);
      paged.forEach((row) => row.records.forEach((r) => next.delete(r.id)));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paged.forEach((row) => row.records.forEach((r) => next.add(r.id)));
      setSelectedIds(next);
    }
  };

  const toggleSelectRow = (row: AggregatedRow) => {
    const next = new Set(selectedIds);
    const allSelected = row.records.every((r) => next.has(r.id));
    if (allSelected) {
      row.records.forEach((r) => next.delete(r.id));
    } else {
      row.records.forEach((r) => next.add(r.id));
    }
    setSelectedIds(next);
  };

  const isRowSelected = (row: AggregatedRow) =>
    row.records.every((r) => selectedIds.has(r.id));

  // 선택 삭제
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setConfirmDialog({
      message: `선택한 ${selectedIds.size}건의 사업소득을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`,
      onConfirm: () => {
        deleteBusinessIncomes(Array.from(selectedIds));
        setConfirmDialog(null);
        setToast("사업소득 삭제를 완료했습니다.");
        loadData();
      },
    });
  };

  // 전체 삭제
  const handleDeleteAll = () => {
    if (allData.length === 0) return;
    setConfirmDialog({
      message: `${year}년 ${month}월의 모든 사업소득(${allData.length}건)을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`,
      onConfirm: () => {
        deleteAllForMonth(year, month);
        setConfirmDialog(null);
        setToast("사업소득 전체 삭제를 완료했습니다.");
        loadData();
      },
    });
  };

  // 엑셀 다운로드 (개별 레코드 단위)
  const handleExcelDownload = (mode: "all" | "filtered" | "selected") => {
    let items: BusinessIncome[];
    if (mode === "selected") {
      items = allData.filter((item) => selectedIds.has(item.id));
    } else if (mode === "filtered") {
      // filtered rows의 모든 개별 레코드
      items = filteredRows.flatMap((row) => row.records);
    } else {
      items = allData;
    }

    if (items.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const headers = [
      "귀속연도", "귀속월", "성명(상호)", "내외국인", "주민(사업자)등록번호",
      "업종코드", "업종명", "지급연도", "지급월", "지급액", "세율", "소득세", "지방소득세", "실지급액",
    ];

    const rows = items.map((item) => [
      item.attributionYear,
      item.attributionMonth,
      item.name,
      item.isForeign === "Y" ? "외국인" : "내국인",
      item.idNumber,
      item.industryCode,
      getIndustryName(item.industryCode),
      item.paymentYear,
      item.paymentMonth,
      item.paymentAmount,
      `${(item.taxRate * 100).toFixed(0)}%`,
      item.incomeTax,
      item.localTax,
      item.netPayment,
    ]);

    const bom = "\uFEFF";
    const csv = bom + [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `사업소득_${year}년_${month}월.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // 행 클릭 → 합산행이면 그룹 수정 팝업, 아니면 기존 수정 팝업
  const handleRowClick = (row: AggregatedRow) => {
    if (row.isAggregated) {
      setEditTargetGroup(row.records);
    } else {
      setEditTarget(row.records[0]);
    }
  };

  // Add popup callbacks
  const handleAddSaved = () => {
    setShowAddPopup(false);
    setToast("사업소득 추가를 완료했습니다.");
    loadData();
  };

  const handleEditSaved = () => {
    setEditTarget(null);
    setToast("사업소득 수정을 완료했습니다.");
    loadData();
  };

  const handleEditDeleted = () => {
    setEditTarget(null);
    setToast("사업소득 삭제를 완료했습니다.");
    loadData();
  };

  const handleGroupEditSaved = () => {
    setEditTargetGroup(null);
    setToast("사업소득 그룹 수정을 완료했습니다.");
    loadData();
  };

  const handleGroupEditDeleted = () => {
    setEditTargetGroup(null);
    setToast("사업소득 삭제를 완료했습니다.");
    loadData();
  };

  if (!isValid) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-lg text-gray-600 mb-4">올바르지 않은 접근입니다.</p>
        <p className="text-sm text-gray-500 mb-6">연도와 월 파라미터가 필요합니다. (예: ?year=2026&month=1)</p>
        <button
          onClick={() => router.push("/sps/summary")}
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
          onClick={() => router.push("/sps/summary")}
          className="flex items-center gap-3 text-gray-500 hover:text-gray-700"
        >
          <span>&larr;</span>
          <h1 className="text-2xl font-bold text-gray-900">
            {year}년 {month}월 사업소득
          </h1>
        </button>
        <button
          onClick={() => setShowAddPopup(true)}
          className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          사업소득 추가
        </button>
      </div>

      {/* 상단 요약 */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">건수</p>
          <p className="text-lg font-bold text-gray-900">{summary.count}건</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <p className="text-xs text-gray-500">총 지급액</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalPayment)}</p>
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
          <p className="text-xs text-gray-500">총 실지급액</p>
          <p className="text-lg font-bold text-gray-900">{formatAmount(summary.totalNetPayment)}</p>
        </div>
      </div>

      {/* 검색 + 액션 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <SearchBar
          placeholder="성명(상호) 검색"
          onSearch={handleSearch}
          maxLength={50}
          allowSpecialChar={false}
        />
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

      {/* 안내문구 (정책 2.3) */}
      <p className="text-sm text-gray-500">
        ※ 간이지급명세서 신고파일 생성 후 신고파일 데이터에서 값이 수정된 대상자 또는 추가된 대상자는 상단 &apos;상세검색&apos;을 통해 검색 후 간이지급명세서 개별 생성이 가능합니다.
      </p>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[900px]">
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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">귀속연월</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">성명(상호)</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">주민(사업자)등록번호</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">업종코드</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">지급액</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">소득세</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">지방소득세</th>
              <th className="px-3 py-3 text-right text-xs font-medium text-gray-500">실지급액</th>
            </tr>
          </thead>
          <tbody>
            {paged.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-gray-500">
                  {searchQuery ? "검색 결과가 없습니다." : "데이터가 없습니다."}
                </td>
              </tr>
            ) : (
              paged.map((row) => (
                <tr
                  key={row.groupKey}
                  className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                    row.isAggregated ? "bg-amber-50/50" : ""
                  }`}
                  onClick={() => handleRowClick(row)}
                >
                  <td className="px-3 py-3" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={isRowSelected(row)}
                      onChange={() => toggleSelectRow(row)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    {row.attributionYear}.{String(row.attributionMonth).padStart(2, "0")}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{row.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 font-mono">{row.idNumber}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    <span className="text-xs text-gray-500">{row.industryCode}</span>{" "}
                    {getIndustryName(row.industryCode)}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">
                    <span>{formatAmount(row.paymentAmount)}</span>
                    {row.isAggregated && (
                      <span className="ml-1.5 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-amber-100 text-amber-800">
                        {row.records.length}건 합산
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(row.incomeTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(row.localTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right font-medium">{formatAmount(row.netPayment)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          총 {filteredRows.length}행 ({allData.length}건) 중 {(currentPage - 1) * pageSize + 1}~
          {Math.min(currentPage * pageSize, filteredRows.length)}행
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 팝업 */}
      {showAddPopup && (
        <BusinessIncomeAddPopup
          paymentYear={year}
          paymentMonth={month}
          onClose={() => setShowAddPopup(false)}
          onSaved={handleAddSaved}
        />
      )}

      {editTarget && (
        <BusinessIncomeEditPopup
          data={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEditSaved}
          onDeleted={handleEditDeleted}
        />
      )}

      {editTargetGroup && (
        <BusinessIncomeGroupEditPopup
          records={editTargetGroup}
          onClose={() => setEditTargetGroup(null)}
          onSaved={handleGroupEditSaved}
          onDeleted={handleGroupEditDeleted}
        />
      )}

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
    </div>
  );
}

export default function SPSMonthlyPage() {
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

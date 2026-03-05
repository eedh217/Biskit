"use client";

import { useState, useEffect, useCallback } from "react";
import { BusinessIncome } from "@/types/sps";
import { getBusinessIncomes, deleteBusinessIncomes } from "@/lib/store";
import { getIndustryName } from "@/lib/industryCodes";
import { formatAmount } from "@/lib/formatUtils";
import SearchBar from "@/components/manage/SearchBar";
import Pagination from "@/components/manage/Pagination";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import AllBusinessIncomeAddPopup from "@/components/sps/AllBusinessIncomeAddPopup";
import AllBusinessIncomeEditPopup from "@/components/sps/AllBusinessIncomeEditPopup";

export default function SPSAllPage() {
  const [allData, setAllData] = useState<BusinessIncome[]>([]);
  const [filtered, setFiltered] = useState<BusinessIncome[]>([]);
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

  const loadData = useCallback(() => {
    const data = getBusinessIncomes();
    // 최근 등록 순
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const applySearch = (data: BusinessIncome[], query: string) => {
    if (!query.trim()) {
      setFiltered(data);
    } else {
      const q = query.trim().toLowerCase();
      setFiltered(data.filter((item) => item.name.toLowerCase().includes(q)));
    }
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

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

  const toggleSelect = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // 선택 삭제
  const handleDeleteSelected = () => {
    if (selectedIds.size === 0) return;
    setConfirmDialog({
      message: `총 ${selectedIds.size}개의 리스트를 삭제하시겠습니까?`,
      onConfirm: () => {
        deleteBusinessIncomes(Array.from(selectedIds));
        setConfirmDialog(null);
        setToast("삭제가 완료되었습니다.");
        loadData();
      },
    });
  };

  // 엑셀 다운로드
  const handleExcelDownload = () => {
    let items: BusinessIncome[];

    if (selectedIds.size > 0) {
      // 선택한 리스트만
      items = filtered.filter((item) => selectedIds.has(item.id));
    } else if (searchQuery.trim()) {
      // 검색 결과
      items = filtered;
    } else {
      // 전체
      items = allData;
    }

    if (items.length === 0) {
      alert("다운로드할 데이터가 없습니다.");
      return;
    }

    const headers = [
      "귀속연도", "귀속월", "지급연도", "지급월", "성명(상호)", "주민(사업자)등록번호",
      "업종코드", "업종명", "지급액", "소득세", "지방소득세", "실지급액",
    ];

    const rows = items.map((item) => [
      item.attributionYear,
      item.attributionMonth,
      item.paymentYear,
      item.paymentMonth,
      item.name,
      item.idNumber,
      item.industryCode,
      getIndustryName(item.industryCode),
      item.paymentAmount,
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
    a.download = "전체 사업소득.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 행 클릭 → 수정 팝업
  const handleRowClick = (item: BusinessIncome) => {
    setEditTarget(item);
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
    setToast("삭제 완료되었습니다.");
    // 삭제 후 초기 상태 리셋
    setSearchQuery("");
    const data = getBusinessIncomes();
    data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setAllData(data);
    setFiltered(data);
    setCurrentPage(1);
    setSelectedIds(new Set());
  };

  // 페이지 사이즈 변경 시 데이터 위치 유지
  const handlePageSizeChange = (newSize: number) => {
    const firstItemIndex = (currentPage - 1) * pageSize;
    const newPage = Math.floor(firstItemIndex / newSize) + 1;
    setPageSize(newSize);
    setCurrentPage(Math.max(1, newPage));
  };

  return (
    <div className="space-y-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">전체 사업소득</h1>
        <div className="flex items-center gap-2">
          <div className="relative group">
            <button className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">
              엑셀 업로드
            </button>
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 min-w-[140px] z-50 hidden group-hover:block">
              <button
                onClick={() => {
                  const input = document.createElement("input");
                  input.type = "file";
                  input.accept = ".xlsx,.xls";
                  input.onchange = () => {
                    alert("엑셀 업로드 기능은 추후 구현 예정입니다.");
                  };
                  input.click();
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                파일올리기
              </button>
              <button
                onClick={() => {
                  alert("양식 다운로드 기능은 추후 구현 예정입니다.");
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                양식받기
              </button>
            </div>
          </div>
          <button
            onClick={() => setShowAddPopup(true)}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            사업소득 추가
          </button>
        </div>
      </div>

      {/* 검색 + 액션 바 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <SearchBar
            placeholder="성명(상호)를 입력해주세요."
            onSearch={handleSearch}
            maxLength={50}
            allowSpecialChar={false}
          />
          <span className="text-sm text-gray-500 whitespace-nowrap">
            총 <span className="font-semibold text-gray-900">{filtered.length}</span>건
          </span>
        </div>
        <div className="flex items-center gap-2">
          <PageSizeSelect value={pageSize} onChange={handlePageSizeChange} />

          <button
            onClick={handleExcelDownload}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
          >
            엑셀 다운로드
          </button>

          <button
            onClick={handleDeleteSelected}
            disabled={selectedIds.size === 0 || filtered.length === 0}
            className="px-3 py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            선택 삭제 ({selectedIds.size})
          </button>
        </div>
      </div>

      {/* 데이터 테이블 */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full min-w-[1100px]">
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
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">지급연도</th>
              <th className="px-3 py-3 text-left text-xs font-medium text-gray-500">지급월</th>
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
                <td colSpan={12} className="px-4 py-12 text-center text-sm text-gray-500">
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
                      onChange={() => toggleSelect(item.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900">{item.attributionYear}년</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{String(item.attributionMonth).padStart(2, "0")}월</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{item.paymentYear}년</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{String(item.paymentMonth).padStart(2, "0")}월</td>
                  <td className="px-3 py-3 text-sm text-gray-900">{item.name}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 font-mono">{item.idNumber}</td>
                  <td className="px-3 py-3 text-sm text-gray-900">
                    <span className="text-xs text-gray-500">{item.industryCode}</span>{" "}
                    {getIndustryName(item.industryCode)}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.paymentAmount)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.incomeTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right">{formatAmount(item.localTax)}</td>
                  <td className="px-3 py-3 text-sm text-gray-900 text-right font-medium">{formatAmount(item.netPayment)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-500">
          총 {filtered.length}건
          {filtered.length > 0 && (
            <> 중 {(currentPage - 1) * pageSize + 1}~{Math.min(currentPage * pageSize, filtered.length)}건</>
          )}
        </span>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* 팝업 */}
      {showAddPopup && (
        <AllBusinessIncomeAddPopup
          onClose={() => setShowAddPopup(false)}
          onSaved={handleAddSaved}
        />
      )}

      {editTarget && (
        <AllBusinessIncomeEditPopup
          data={editTarget}
          onClose={() => setEditTarget(null)}
          onSaved={handleEditSaved}
          onDeleted={handleEditDeleted}
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

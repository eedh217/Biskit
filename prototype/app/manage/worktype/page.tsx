"use client";

import { useState, useEffect, useCallback } from "react";
import { getWorkTypes, deleteWorkTypes } from "@/lib/store";
import { WorkType } from "@/types/manage";
import SearchBar from "@/components/manage/SearchBar";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Pagination from "@/components/manage/Pagination";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import WorkTypeAddPopup from "@/components/manage/WorkTypeAddPopup";
import WorkTypeEditPopup from "@/components/manage/WorkTypeEditPopup";

export default function WorkTypeListPage() {
  const [allData, setAllData] = useState<WorkType[]>([]);
  const [filtered, setFiltered] = useState<WorkType[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<WorkType | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [closeConfirm, setCloseConfirm] = useState<{ popup: "add" | "edit"; onConfirm: () => void } | null>(null);

  const reload = useCallback(() => {
    const data = getWorkTypes();
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, [searchQuery]);

  useEffect(() => { reload(); }, [reload]);

  const applySearch = (data: WorkType[], query: string) => {
    if (!query.trim()) {
      setFiltered(data);
    } else {
      const q = query.trim().toLowerCase();
      setFiltered(data.filter((w) => w.name.toLowerCase().includes(q) || w.code.toLowerCase().includes(q)));
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // 체크박스
  const allPageSelected = pagedData.length > 0 && pagedData.every((w) => selectedIds.has(w.id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pagedData.forEach((w) => next.delete(w.id));
    } else {
      pagedData.forEach((w) => next.add(w.id));
    }
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  // 삭제
  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirm({
      message: `총 ${selectedIds.size}개의 리스트를 삭제하시겠습니까?`,
      onConfirm: () => {
        deleteWorkTypes([...selectedIds]);
        setConfirm(null);
        setToast("삭제가 완료되었습니다.");
        reload();
      },
    });
  };

  // 엑셀 다운로드 (간단 CSV)
  const handleExcelDownload = () => {
    let target: WorkType[];
    if (selectedIds.size > 0) {
      target = filtered.filter((w) => selectedIds.has(w.id));
    } else {
      target = filtered;
    }
    const header = "근로형태명,근로형태 코드";
    const rows = target.map((w) => `${w.name},${w.code}`);
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HRIS_근로형태_리스트.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // 팝업 닫기 (이탈 방지)
  const handleAddClose = () => {
    setCloseConfirm({
      popup: "add",
      onConfirm: () => { setShowAdd(false); setCloseConfirm(null); },
    });
  };
  const handleEditClose = () => {
    setCloseConfirm({
      popup: "edit",
      onConfirm: () => { setEditTarget(null); setCloseConfirm(null); },
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">근로형태 관리</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + 추가
        </button>
      </div>

      <SearchBar
        placeholder="근로형태명 또는 근로형태 코드를 입력해주세요."
        onSearch={handleSearch}
        maxLength={10}
        allowSpecialChar={false}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{filtered.length}</span>건
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExcelDownload}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
          >
            엑셀 다운로드
          </button>
          <button
            onClick={handleDelete}
            disabled={selectedIds.size === 0}
            className="px-3 py-1.5 text-sm border border-red-300 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            선택 삭제 ({selectedIds.size})
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-12 px-3 py-3">
                <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="rounded" />
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">근로형태명</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">근로형태 코드</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              pagedData.map((w) => (
                <tr
                  key={w.id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer"
                  onClick={() => setEditTarget(w)}
                >
                  <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(w.id)}
                      onChange={() => toggleOne(w.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{w.name}</td>
                  <td className="px-4 py-3 text-gray-700 font-mono">{w.code}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <PageSizeSelect value={pageSize} onChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {/* 추가 팝업 */}
      {showAdd && (
        <WorkTypeAddPopup
          onClose={handleAddClose}
          onSuccess={() => {
            setShowAdd(false);
            setToast("근로형태 추가를 완료했습니다.");
            reload();
          }}
        />
      )}

      {/* 수정 팝업 */}
      {editTarget && (
        <WorkTypeEditPopup
          workType={editTarget}
          onClose={handleEditClose}
          onSuccess={() => {
            setEditTarget(null);
            setToast("근로형태 수정을 완료했습니다.");
            reload();
          }}
        />
      )}

      {/* 이탈 방지 confirm */}
      {closeConfirm && (
        <ConfirmDialog
          message={
            closeConfirm.popup === "add"
              ? "근로형태 추가를 취소하시겠습니까?"
              : "근로형태 수정을 취소하시겠습니까?"
          }
          onConfirm={closeConfirm.onConfirm}
          onCancel={() => setCloseConfirm(null)}
        />
      )}

      {/* 삭제 confirm */}
      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* 토스트 */}
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

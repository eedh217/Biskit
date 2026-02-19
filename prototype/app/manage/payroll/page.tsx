"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getPayrolls, deletePayrolls } from "@/lib/store";
import { Payroll } from "@/types/manage";
import SearchBar from "@/components/manage/SearchBar";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Pagination from "@/components/manage/Pagination";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import DeleteFailPopup from "@/components/manage/DeleteFailPopup";
import PayrollAddPopup from "@/components/manage/PayrollAddPopup";
import PayrollEditPopup from "@/components/manage/PayrollEditPopup";

export default function PayrollListPage() {
  const router = useRouter();
  const [allData, setAllData] = useState<Payroll[]>([]);
  const [filtered, setFiltered] = useState<Payroll[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Payroll | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [closeConfirm, setCloseConfirm] = useState<{ popup: "add" | "edit"; onConfirm: () => void } | null>(null);
  const [deleteFail, setDeleteFail] = useState<{ name: string; reason: string }[] | null>(null);

  const reload = useCallback(() => {
    const data = getPayrolls();
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, [searchQuery]);

  useEffect(() => { reload(); }, [reload]);

  const applySearch = (data: Payroll[], query: string) => {
    if (!query.trim()) {
      setFiltered(data);
    } else {
      const q = query.trim().toLowerCase();
      setFiltered(data.filter((p) => p.payrollName.toLowerCase().includes(q)));
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allPageSelected = pagedData.length > 0 && pagedData.every((p) => selectedIds.has(p.id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pagedData.forEach((p) => next.delete(p.id));
    } else {
      pagedData.forEach((p) => next.add(p.id));
    }
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirm({
      message: `총 ${selectedIds.size}개의 리스트를 삭제하시겠습니까?`,
      onConfirm: () => {
        const result = deletePayrolls([...selectedIds]);
        setConfirm(null);
        if (result.failedIds && result.failedIds.length > 0) {
          const failedItems = allData.filter((p) => result.failedIds!.includes(p.id)).map((p) => ({
            name: p.payrollName,
            reason: "확정된 급여대장은 삭제 불가",
          }));
          setDeleteFail(failedItems);
        }
        if (result.deletedCount > 0) {
          setToast(`${result.deletedCount}건 삭제가 완료되었습니다.`);
        }
        reload();
      },
    });
  };

  const handleExcelDownload = () => {
    let target: Payroll[];
    if (selectedIds.size > 0) {
      target = filtered.filter((p) => selectedIds.has(p.id));
    } else {
      target = filtered;
    }
    const header = "급여대장명,귀속연도,귀속월,지급일자,확정여부";
    const rows = target.map((p) => `${p.payrollName},${p.year},${p.month},${p.payDate},${p.confirmed ? "확정" : "미확정"}`);
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HRIS_급여대장_리스트.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRowClick = (payroll: Payroll) => {
    router.push(`/manage/payroll-detail/${payroll.id}`);
  };

  const handleEditClick = (e: React.MouseEvent, payroll: Payroll) => {
    e.stopPropagation();
    setEditTarget(payroll);
  };

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
        <h1 className="text-2xl font-bold text-gray-900">급여대장 관리</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + 추가
        </button>
      </div>

      <SearchBar
        placeholder="급여대장명을 입력해주세요."
        onSearch={handleSearch}
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
              <th className="text-left px-4 py-3 font-medium text-gray-600">급여대장명</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">귀속연도</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">귀속월</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">지급일자</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 w-24">확정여부</th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 w-20">수정</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              pagedData.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer"
                  onClick={() => handleRowClick(p)}
                >
                  <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(p.id)}
                      onChange={() => toggleOne(p.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-4 py-3 text-gray-900">{p.payrollName}</td>
                  <td className="px-4 py-3 text-gray-700">{p.year}</td>
                  <td className="px-4 py-3 text-gray-700">{p.month}월</td>
                  <td className="px-4 py-3 text-gray-700">{p.payDate}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                      p.confirmed ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                    }`}>
                      {p.confirmed ? "확정" : "미확정"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button
                      onClick={(e) => handleEditClick(e, p)}
                      className="px-2 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 text-gray-700"
                    >
                      수정
                    </button>
                  </td>
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

      {showAdd && (
        <PayrollAddPopup
          onClose={handleAddClose}
          onSuccess={() => {
            setShowAdd(false);
            setToast("급여대장 추가를 완료했습니다.");
            reload();
          }}
        />
      )}

      {editTarget && (
        <PayrollEditPopup
          payroll={editTarget}
          onClose={handleEditClose}
          onSuccess={() => {
            setEditTarget(null);
            setToast("급여대장 수정을 완료했습니다.");
            reload();
          }}
        />
      )}

      {closeConfirm && (
        <ConfirmDialog
          message={
            closeConfirm.popup === "add"
              ? "급여대장 추가를 취소하시겠습니까?"
              : "급여대장 수정을 취소하시겠습니까?"
          }
          onConfirm={closeConfirm.onConfirm}
          onCancel={() => setCloseConfirm(null)}
        />
      )}

      {confirm && (
        <ConfirmDialog
          message={confirm.message}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {deleteFail && (
        <DeleteFailPopup
          items={deleteFail}
          onClose={() => setDeleteFail(null)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

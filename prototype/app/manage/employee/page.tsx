"use client";

import { useState, useEffect, useCallback } from "react";
import { getEmployees, deleteEmployees, getWorkTypeName } from "@/lib/store";
import { Employee } from "@/types/manage";
import SearchBar from "@/components/manage/SearchBar";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Pagination from "@/components/manage/Pagination";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import EmployeeAddPopup from "@/components/manage/EmployeeAddPopup";
import EmployeeEditPopup from "@/components/manage/EmployeeEditPopup";

function formatDate(d: string) {
  if (!d || d.length !== 8) return "";
  return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
}

export default function EmployeeListPage() {
  const [allData, setAllData] = useState<Employee[]>([]);
  const [filtered, setFiltered] = useState<Employee[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAdd, setShowAdd] = useState(false);
  const [editTarget, setEditTarget] = useState<Employee | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [closeConfirm, setCloseConfirm] = useState<{ popup: "add" | "edit"; onConfirm: () => void } | null>(null);

  const reload = useCallback(() => {
    const data = getEmployees();
    setAllData(data);
    applySearch(data, searchQuery);
    setSelectedIds(new Set());
  }, [searchQuery]);

  useEffect(() => { reload(); }, [reload]);

  const applySearch = (data: Employee[], query: string) => {
    if (!query.trim()) {
      setFiltered(data);
    } else {
      const q = query.trim().toLowerCase();
      setFiltered(data.filter((e) =>
        e.employeeNumber.toLowerCase().includes(q) || e.name.toLowerCase().includes(q)
      ));
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(allData, query);
  };

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allPageSelected = pagedData.length > 0 && pagedData.every((e) => selectedIds.has(e.id));
  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) pagedData.forEach((e) => next.delete(e.id));
    else pagedData.forEach((e) => next.add(e.id));
    setSelectedIds(next);
  };
  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelectedIds(next);
  };

  const handleDelete = () => {
    if (selectedIds.size === 0) return;
    setConfirm({
      message: `총 ${selectedIds.size}개의 리스트를 삭제하시겠습니까?`,
      onConfirm: () => {
        deleteEmployees([...selectedIds]);
        setConfirm(null);
        setToast("삭제가 완료되었습니다.");
        reload();
      },
    });
  };

  const handleExcelDownload = () => {
    let target: Employee[];
    if (selectedIds.size > 0) {
      target = filtered.filter((e) => selectedIds.has(e.id));
    } else {
      target = filtered;
    }
    const header = "사번,성명,내외국인 여부,이메일,입사일,퇴사일,연락처,장애여부";
    const rows = target.map((e) =>
      `${e.employeeNumber},${e.name},${e.nationality},${e.email},${formatDate(e.hireDate)},${formatDate(e.resignDate)},${e.phone},${e.disabilityStatus}`
    );
    const csv = "\uFEFF" + [header, ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HIRS_유저_리스트.csv";
    a.click();
    URL.revokeObjectURL(url);
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
        <h1 className="text-2xl font-bold text-gray-900">임직원 관리</h1>
        <button
          onClick={() => setShowAdd(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
        >
          + 추가
        </button>
      </div>

      <SearchBar
        placeholder="사번 또는 성명을 입력해주세요."
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

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-12 px-3 py-3">
                <input type="checkbox" checked={allPageSelected} onChange={toggleAll} className="rounded" />
              </th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">사번</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">성명</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">내외국인</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">이메일</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">입사일</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">퇴사일</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">연락처</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 whitespace-nowrap">장애여부</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              pagedData.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer"
                  onClick={() => setEditTarget(emp)}
                >
                  <td className="px-3 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedIds.has(emp.id)}
                      onChange={() => toggleOne(emp.id)}
                      className="rounded"
                    />
                  </td>
                  <td className="px-3 py-3 font-mono text-gray-900 whitespace-nowrap">{emp.employeeNumber}</td>
                  <td className="px-3 py-3 text-gray-900 whitespace-nowrap">{emp.name}</td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{emp.nationality}</td>
                  <td className="px-3 py-3 text-gray-700">{emp.email}</td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{formatDate(emp.hireDate)}</td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{formatDate(emp.resignDate)}</td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{emp.phone}</td>
                  <td className="px-3 py-3 text-gray-700 whitespace-nowrap">{emp.disabilityStatus}</td>
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
        <EmployeeAddPopup
          onClose={handleAddClose}
          onSuccess={() => {
            setShowAdd(false);
            setToast("임직원 추가를 완료했습니다.");
            reload();
          }}
        />
      )}

      {editTarget && (
        <EmployeeEditPopup
          employee={editTarget}
          onClose={handleEditClose}
          onSuccess={() => {
            setEditTarget(null);
            setToast("임직원 수정을 완료했습니다.");
            reload();
          }}
        />
      )}

      {closeConfirm && (
        <ConfirmDialog
          message={
            closeConfirm.popup === "add"
              ? "임직원 추가를 취소하시겠습니까?"
              : "임직원 수정을 취소하시겠습니까?"
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

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </div>
  );
}

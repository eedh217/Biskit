"use client";

import { useState } from "react";
import { getEligibleEmployees, addEmployeeToPayroll } from "@/lib/store";
import { Employee } from "@/types/manage";

interface Props {
  payrollId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayrollDetailAddEmployeePopup({ payrollId, onClose, onSuccess }: Props) {
  const [eligible] = useState<Employee[]>(() => getEligibleEmployees(payrollId));
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");

  const filtered = eligible.filter((e) => {
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return e.employeeNumber.toLowerCase().includes(q) || e.name.toLowerCase().includes(q);
  });

  const allSelected = filtered.length > 0 && filtered.every((e) => selectedIds.has(e.id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allSelected) {
      filtered.forEach((e) => next.delete(e.id));
    } else {
      filtered.forEach((e) => next.add(e.id));
    }
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelectedIds(next);
  };

  const handleSubmit = () => {
    if (selectedIds.size === 0) return;
    addEmployeeToPayroll(payrollId, [...selectedIds]);
    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">임직원 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="사번 또는 성명으로 검색"
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex-1 overflow-auto p-6">
          {eligible.length === 0 ? (
            <p className="text-center text-gray-400 py-8">추가 가능한 임직원이 없습니다.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="w-10 px-3 py-2">
                    <input type="checkbox" checked={allSelected} onChange={toggleAll} className="rounded" />
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">사번</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">성명</th>
                  <th className="text-left px-3 py-2 font-medium text-gray-600">입사일</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  <tr key={emp.id} className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer" onClick={() => toggleOne(emp.id)}>
                    <td className="px-3 py-2 text-center">
                      <input type="checkbox" checked={selectedIds.has(emp.id)} onChange={() => toggleOne(emp.id)} className="rounded" />
                    </td>
                    <td className="px-3 py-2 text-gray-700 font-mono">{emp.employeeNumber}</td>
                    <td className="px-3 py-2 text-gray-900">{emp.name}</td>
                    <td className="px-3 py-2 text-gray-700">{emp.hireDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <span className="text-sm text-gray-600">{selectedIds.size}명 선택</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={selectedIds.size === 0}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              추가
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

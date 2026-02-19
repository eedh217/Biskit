"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  getPayrolls, getPayrollDetails, getPayItems, getPayrollItemConfigsForPayroll,
  getEmployeeName, getEmployeeNumber, removeEmployeesFromPayroll,
  confirmPayroll, unconfirmPayroll,
} from "@/lib/store";
import { Payroll, PayItem, PayrollDetailItem, PayrollItemConfig } from "@/types/manage";
import SearchBar from "@/components/manage/SearchBar";
import PageSizeSelect from "@/components/manage/PageSizeSelect";
import Pagination from "@/components/manage/Pagination";
import Toast from "@/components/manage/Toast";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import PayrollDetailAddEmployeePopup from "@/components/manage/PayrollDetailAddEmployeePopup";
import PayrollDetailManageItemsPopup from "@/components/manage/PayrollDetailManageItemsPopup";
import PayrollDetailEditPopup from "@/components/manage/PayrollDetailEditPopup";

function formatAmount(val: number | null | undefined): string {
  if (val === null || val === undefined) return "-";
  return val.toLocaleString();
}

export default function PayrollDetailPage() {
  const params = useParams();
  const router = useRouter();
  const payrollId = params.payrollId as string;

  const [payroll, setPayroll] = useState<Payroll | null>(null);
  const [details, setDetails] = useState<PayrollDetailItem[]>([]);
  const [payItems, setPayItemsState] = useState<PayItem[]>([]);
  const [configs, setConfigs] = useState<PayrollItemConfig[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtered, setFiltered] = useState<PayrollDetailItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [pageSize, setPageSize] = useState(30);
  const [currentPage, setCurrentPage] = useState(1);

  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showManageItems, setShowManageItems] = useState(false);
  const [editTarget, setEditTarget] = useState<PayrollDetailItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

  const reload = useCallback(() => {
    const payrolls = getPayrolls();
    const pr = payrolls.find((p) => p.id === payrollId);
    setPayroll(pr || null);

    const d = getPayrollDetails(payrollId);
    setDetails(d);
    const pi = getPayItems();
    setPayItemsState(pi);
    const c = getPayrollItemConfigsForPayroll(payrollId);
    setConfigs(c);

    applySearch(d, searchQuery);
    setSelectedIds(new Set());
  }, [payrollId, searchQuery]);

  useEffect(() => { reload(); }, [reload]);

  const applySearch = (data: PayrollDetailItem[], query: string) => {
    if (!query.trim()) {
      setFiltered(data);
    } else {
      const q = query.trim().toLowerCase();
      setFiltered(data.filter((d) => {
        const empName = getEmployeeName(d.employeeId).toLowerCase();
        const empNum = getEmployeeNumber(d.employeeId).toLowerCase();
        return empName.includes(q) || empNum.includes(q);
      }));
    }
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    applySearch(details, query);
  };

  const enabledPayItems = payItems.filter((pi) =>
    configs.some((c) => c.payItemId === pi.id && c.enabled)
  );
  const payColumns = enabledPayItems.filter((p) => p.category === "지급항목");
  const deductColumns = enabledPayItems.filter((p) => p.category === "공제항목");

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pagedData = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const allPageSelected = pagedData.length > 0 && pagedData.every((d) => selectedIds.has(d.id));

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) {
      pagedData.forEach((d) => next.delete(d.id));
    } else {
      pagedData.forEach((d) => next.add(d.id));
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
      message: `총 ${selectedIds.size}명의 임직원을 급여내역에서 삭제하시겠습니까?`,
      onConfirm: () => {
        removeEmployeesFromPayroll(payrollId, [...selectedIds]);
        setConfirm(null);
        setToast("삭제가 완료되었습니다.");
        reload();
      },
    });
  };

  const handleConfirmToggle = () => {
    if (!payroll) return;
    if (payroll.confirmed) {
      setConfirm({
        message: "급여 확정을 해제하시겠습니까? 해제 후 수정이 가능합니다.",
        onConfirm: () => {
          unconfirmPayroll(payrollId);
          setConfirm(null);
          setToast("급여 확정이 해제되었습니다.");
          reload();
        },
      });
    } else {
      setConfirm({
        message: "급여를 확정하시겠습니까? 확정 후 수정이 불가합니다.",
        onConfirm: () => {
          confirmPayroll(payrollId);
          setConfirm(null);
          setToast("급여가 확정되었습니다.");
          reload();
        },
      });
    }
  };

  const calcSum = (detail: PayrollDetailItem, category: string) => {
    const items = enabledPayItems.filter((p) => p.category === category);
    let sum = 0;
    let hasValue = false;
    items.forEach((pi) => {
      const val = detail.amounts[pi.id];
      if (val !== null && val !== undefined) {
        sum += val;
        hasValue = true;
      }
    });
    return hasValue ? sum : null;
  };

  const handleExcelDownload = () => {
    const target = selectedIds.size > 0
      ? filtered.filter((d) => selectedIds.has(d.id))
      : filtered;

    const headers = [
      "사번", "성명",
      ...payColumns.map((p) => p.itemName),
      "지급합계",
      ...deductColumns.map((p) => p.itemName),
      "공제합계",
    ];

    const rows = target.map((d) => {
      const empNum = getEmployeeNumber(d.employeeId);
      const empName = getEmployeeName(d.employeeId);
      const payVals = payColumns.map((p) => d.amounts[p.id] ?? "");
      const paySum = calcSum(d, "지급항목") ?? "";
      const dedVals = deductColumns.map((p) => d.amounts[p.id] ?? "");
      const dedSum = calcSum(d, "공제항목") ?? "";
      return [empNum, empName, ...payVals, paySum, ...dedVals, dedSum].join(",");
    });

    const csv = "\uFEFF" + [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "HRIS_급여내역_리스트.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!payroll) {
    return (
      <div className="space-y-4">
        <button onClick={() => router.push("/manage/payroll")} className="text-sm text-blue-600 hover:underline">
          &larr; 급여대장 목록으로
        </button>
        <p className="text-gray-400">급여대장을 찾을 수 없습니다.</p>
      </div>
    );
  }

  const isConfirmed = payroll.confirmed;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <button onClick={() => router.push("/manage/payroll")} className="text-sm text-blue-600 hover:underline">
          &larr; 급여대장 목록
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{payroll.payrollName}</h1>
        {isConfirmed && (
          <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-700">확정</span>
        )}
      </div>

      <div className="text-sm text-gray-500">
        귀속: {payroll.year}년 {payroll.month}월 | 지급일: {payroll.payDate}
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={() => setShowAddEmployee(true)}
          disabled={isConfirmed}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          + 임직원 추가
        </button>
        <button
          onClick={() => setShowManageItems(true)}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        >
          급여항목 관리
        </button>
        <button
          onClick={handleConfirmToggle}
          className={`px-3 py-1.5 text-sm rounded-md ${
            isConfirmed
              ? "border border-orange-300 text-orange-600 hover:bg-orange-50"
              : "border border-green-300 text-green-600 hover:bg-green-50"
          }`}
        >
          {isConfirmed ? "급여확정 해제" : "급여확정"}
        </button>
        <button
          onClick={handleDelete}
          disabled={selectedIds.size === 0 || isConfirmed}
          className="px-3 py-1.5 text-sm border border-red-300 rounded-md text-red-600 hover:bg-red-50 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          선택 삭제 ({selectedIds.size})
        </button>
        <button
          onClick={handleExcelDownload}
          className="px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700"
        >
          엑셀 다운로드
        </button>
      </div>

      <SearchBar
        placeholder="사번 또는 성명을 입력해주세요."
        onSearch={handleSearch}
      />

      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">
          총 <span className="font-semibold text-gray-900">{filtered.length}</span>명
        </span>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        <table className="w-full text-sm whitespace-nowrap">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="w-10 px-3 py-3 sticky left-0 bg-gray-50 z-10">
                <input
                  type="checkbox"
                  checked={allPageSelected}
                  onChange={toggleAll}
                  disabled={isConfirmed}
                  className="rounded"
                />
              </th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 sticky left-10 bg-gray-50 z-10">사번</th>
              <th className="text-left px-3 py-3 font-medium text-gray-600 sticky left-[7.5rem] bg-gray-50 z-10">성명</th>
              {payColumns.map((p) => (
                <th key={p.id} className="text-right px-3 py-3 font-medium text-green-700 min-w-[100px]">{p.itemName}</th>
              ))}
              <th className="text-right px-3 py-3 font-medium text-green-900 bg-green-50 min-w-[100px]">지급합계</th>
              {deductColumns.map((p) => (
                <th key={p.id} className="text-right px-3 py-3 font-medium text-red-700 min-w-[100px]">{p.itemName}</th>
              ))}
              <th className="text-right px-3 py-3 font-medium text-red-900 bg-red-50 min-w-[100px]">공제합계</th>
            </tr>
          </thead>
          <tbody>
            {pagedData.length === 0 ? (
              <tr>
                <td colSpan={3 + payColumns.length + 1 + deductColumns.length + 1} className="px-4 py-12 text-center text-gray-400">
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              pagedData.map((d) => {
                const paySum = calcSum(d, "지급항목");
                const dedSum = calcSum(d, "공제항목");
                return (
                  <tr
                    key={d.id}
                    className="border-b border-gray-100 hover:bg-blue-50/30 cursor-pointer"
                    onClick={() => setEditTarget(d)}
                  >
                    <td className="px-3 py-3 text-center sticky left-0 bg-white z-10" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        checked={selectedIds.has(d.id)}
                        onChange={() => toggleOne(d.id)}
                        disabled={isConfirmed}
                        className="rounded"
                      />
                    </td>
                    <td className="px-3 py-3 text-gray-700 font-mono sticky left-10 bg-white z-10">{getEmployeeNumber(d.employeeId)}</td>
                    <td className="px-3 py-3 text-gray-900 sticky left-[7.5rem] bg-white z-10">{getEmployeeName(d.employeeId)}</td>
                    {payColumns.map((p) => (
                      <td key={p.id} className="px-3 py-3 text-right text-gray-700">{formatAmount(d.amounts[p.id])}</td>
                    ))}
                    <td className="px-3 py-3 text-right font-medium text-green-800 bg-green-50/50">{formatAmount(paySum)}</td>
                    {deductColumns.map((p) => (
                      <td key={p.id} className="px-3 py-3 text-right text-gray-700">{formatAmount(d.amounts[p.id])}</td>
                    ))}
                    <td className="px-3 py-3 text-right font-medium text-red-800 bg-red-50/50">{formatAmount(dedSum)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <PageSizeSelect value={pageSize} onChange={(s) => { setPageSize(s); setCurrentPage(1); }} />
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
      </div>

      {showAddEmployee && (
        <PayrollDetailAddEmployeePopup
          payrollId={payrollId}
          onClose={() => setShowAddEmployee(false)}
          onSuccess={() => {
            setShowAddEmployee(false);
            setToast("임직원 추가를 완료했습니다.");
            reload();
          }}
        />
      )}

      {showManageItems && (
        <PayrollDetailManageItemsPopup
          payrollId={payrollId}
          isConfirmed={isConfirmed}
          onClose={() => setShowManageItems(false)}
          onSuccess={() => {
            setShowManageItems(false);
            reload();
          }}
        />
      )}

      {editTarget && (
        <PayrollDetailEditPopup
          payrollId={payrollId}
          detail={editTarget}
          isConfirmed={isConfirmed}
          onClose={() => setEditTarget(null)}
          onSuccess={() => {
            setEditTarget(null);
            setToast("급여내역 수정을 완료했습니다.");
            reload();
          }}
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

"use client";

import { useState, FormEvent } from "react";
import { updatePayrollDetailAmount, getPayItems, getPayrollItemConfigsForPayroll, getEmployeeName, getEmployeeNumber } from "@/lib/store";
import { PayrollDetailItem } from "@/types/manage";

interface Props {
  payrollId: string;
  detail: PayrollDetailItem;
  isConfirmed: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayrollDetailEditPopup({ payrollId, detail, isConfirmed, onClose, onSuccess }: Props) {
  const payItems = getPayItems();
  const configs = getPayrollItemConfigsForPayroll(payrollId);
  const enabledConfigs = configs.filter((c) => c.enabled);
  const enabledPayItems = payItems.filter((p) => enabledConfigs.some((c) => c.payItemId === p.id));

  const [amounts, setAmounts] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    enabledPayItems.forEach((pi) => {
      const val = detail.amounts[pi.id];
      init[pi.id] = val !== null && val !== undefined ? String(val) : "";
    });
    return init;
  });

  const empName = getEmployeeName(detail.employeeId);
  const empNumber = getEmployeeNumber(detail.employeeId);

  const handleAmountChange = (payItemId: string, value: string) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    setAmounts((prev) => ({ ...prev, [payItemId]: cleaned }));
  };

  const formatNumber = (val: string) => {
    if (!val) return "";
    return Number(val).toLocaleString();
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isConfirmed) return;

    const newAmounts: Record<string, number | null> = {};
    enabledPayItems.forEach((pi) => {
      const val = amounts[pi.id];
      newAmounts[pi.id] = val ? Number(val) : null;
    });

    updatePayrollDetailAmount(payrollId, detail.id, newAmounts);
    onSuccess();
  };

  const payItemsByCategory = (category: string) =>
    enabledPayItems.filter((p) => p.category === category);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">급여내역 수정</h2>
            <p className="text-sm text-gray-500">{empNumber} - {empName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-auto p-6 space-y-6">
          {isConfirmed && (
            <div className="bg-orange-50 border border-orange-200 rounded-md px-4 py-2 text-sm text-orange-700">
              확정된 급여대장은 수정할 수 없습니다.
            </div>
          )}

          {/* 지급항목 */}
          {payItemsByCategory("지급항목").length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-green-700 mb-3">지급항목</h3>
              <div className="space-y-3">
                {payItemsByCategory("지급항목").map((pi) => (
                  <div key={pi.id}>
                    <label className="block text-sm text-gray-700 mb-1">{pi.itemName}</label>
                    <input
                      type="text"
                      value={isConfirmed ? formatNumber(amounts[pi.id]) : amounts[pi.id]}
                      onChange={(e) => handleAmountChange(pi.id, e.target.value)}
                      disabled={isConfirmed}
                      placeholder="0"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isConfirmed ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 공제항목 */}
          {payItemsByCategory("공제항목").length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-red-700 mb-3">공제항목</h3>
              <div className="space-y-3">
                {payItemsByCategory("공제항목").map((pi) => (
                  <div key={pi.id}>
                    <label className="block text-sm text-gray-700 mb-1">{pi.itemName}</label>
                    <input
                      type="text"
                      value={isConfirmed ? formatNumber(amounts[pi.id]) : amounts[pi.id]}
                      onChange={(e) => handleAmountChange(pi.id, e.target.value)}
                      disabled={isConfirmed}
                      placeholder="0"
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        isConfirmed ? "bg-gray-100 text-gray-500" : ""
                      }`}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              {isConfirmed ? "닫기" : "취소"}
            </button>
            {!isConfirmed && (
              <button
                type="submit"
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                저장
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

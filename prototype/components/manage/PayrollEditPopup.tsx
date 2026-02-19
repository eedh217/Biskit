"use client";

import { useState, FormEvent } from "react";
import { updatePayroll } from "@/lib/store";
import { Payroll } from "@/types/manage";

interface Props {
  payroll: Payroll;
  onClose: () => void;
  onSuccess: () => void;
}

interface FieldError {
  payrollName?: string;
  payDate?: string;
}

const currentYear = new Date().getFullYear();
const years = [currentYear - 1, currentYear, currentYear + 1];
const months = Array.from({ length: 12 }, (_, i) => i + 1);

export default function PayrollEditPopup({ payroll, onClose, onSuccess }: Props) {
  const [payrollName, setPayrollName] = useState(payroll.payrollName);
  const [year, setYear] = useState(payroll.year);
  const [month, setMonth] = useState(payroll.month);
  const [payDate, setPayDate] = useState(payroll.payDate);
  const [errors, setErrors] = useState<FieldError>({});

  const isConfirmed = payroll.confirmed;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (isConfirmed) return;

    const newErrors: FieldError = {};

    if (!payrollName.trim()) newErrors.payrollName = "급여대장명을 입력해주세요.";
    else if (payrollName.length > 50) newErrors.payrollName = "최대 50자까지 입력 가능합니다.";

    if (!payDate) newErrors.payDate = "지급일자를 선택해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = updatePayroll(payroll.id, { payrollName: payrollName.trim(), year, month, payDate });
    if (!result.success) {
      setErrors({ payDate: result.error });
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            급여대장 수정
            {isConfirmed && <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">(확정됨 - 읽기전용)</span>}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              급여대장명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={payrollName}
              onChange={(e) => setPayrollName(e.target.value)}
              maxLength={50}
              disabled={isConfirmed}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isConfirmed ? "bg-gray-100 text-gray-500" : ""
              } ${errors.payrollName ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.payrollName && <p className="mt-1 text-xs text-red-500">{errors.payrollName}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                귀속연도 <span className="text-red-500">*</span>
              </label>
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                disabled={isConfirmed}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isConfirmed ? "bg-gray-100 text-gray-500" : ""
                }`}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}년</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                귀속월 <span className="text-red-500">*</span>
              </label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                disabled={isConfirmed}
                className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  isConfirmed ? "bg-gray-100 text-gray-500" : ""
                }`}
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}월</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              지급일자 <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={payDate}
              onChange={(e) => setPayDate(e.target.value)}
              disabled={isConfirmed}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isConfirmed ? "bg-gray-100 text-gray-500" : ""
              } ${errors.payDate ? "border-red-400" : "border-gray-300"}`}
            />
            {errors.payDate && <p className="mt-1 text-xs text-red-500">{errors.payDate}</p>}
          </div>

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

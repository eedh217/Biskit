"use client";

import { useState, FormEvent } from "react";
import { updatePayItem } from "@/lib/store";
import { PayItem } from "@/types/manage";

interface Props {
  payItem: PayItem;
  onClose: () => void;
  onSuccess: () => void;
}

interface FieldError {
  payCode?: string;
  itemName?: string;
}

const payTypes: Record<string, string[]> = {
  "지급항목": ["기본급", "수당", "상여금"],
  "공제항목": ["4대보험", "세금", "기타공제"],
};

export default function PayItemEditPopup({ payItem, onClose, onSuccess }: Props) {
  const [payCode, setPayCode] = useState(payItem.payCode);
  const [itemName, setItemName] = useState(payItem.itemName);
  const [itemType, setItemType] = useState(payItem.itemType);
  const [errors, setErrors] = useState<FieldError>({});

  const validateField = (field: string, value: string): string | undefined => {
    if (!value.trim()) return undefined;
    if (field === "payCode") {
      if (/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(value)) return "특수문자는 입력하실 수 없습니다.";
      if (value.length > 10) return "최대 10자까지 입력 가능합니다.";
    }
    if (field === "itemName") {
      if (/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(value)) return "특수문자는 입력하실 수 없습니다.";
      if (value.length > 30) return "최대 30자까지 입력 가능합니다.";
    }
    return undefined;
  };

  const handleBlur = (field: string, value: string) => {
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    if (!payCode.trim()) newErrors.payCode = "급여코드를 입력해주세요.";
    else {
      const err = validateField("payCode", payCode);
      if (err) newErrors.payCode = err;
    }

    if (!itemName.trim()) newErrors.itemName = "항목명을 입력해주세요.";
    else {
      const err = validateField("itemName", itemName);
      if (err) newErrors.itemName = err;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = updatePayItem(payItem.id, {
      category: payItem.category,
      payCode: payCode.trim(),
      itemName: itemName.trim(),
      itemType,
    });
    if (!result.success) {
      setErrors({ payCode: result.error });
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">급여항목 수정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">구분</label>
            <div className="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm text-gray-600">
              {payItem.category}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              급여코드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={payCode}
              onChange={(e) => setPayCode(e.target.value)}
              onBlur={() => handleBlur("payCode", payCode)}
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.payCode ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.payCode && <p className="mt-1 text-xs text-red-500">{errors.payCode}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              항목명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              onBlur={() => handleBlur("itemName", itemName)}
              maxLength={30}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.itemName ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.itemName && <p className="mt-1 text-xs text-red-500">{errors.itemName}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              유형 <span className="text-red-500">*</span>
            </label>
            <select
              value={itemType}
              onChange={(e) => setItemType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {payTypes[payItem.category].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

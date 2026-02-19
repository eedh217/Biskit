"use client";

import { useState, FormEvent } from "react";
import { updateWorkType } from "@/lib/store";
import { WorkType } from "@/types/manage";

interface Props {
  workType: WorkType;
  onClose: () => void;
  onSuccess: () => void;
}

interface FieldError {
  name?: string;
  code?: string;
}

export default function WorkTypeEditPopup({ workType, onClose, onSuccess }: Props) {
  const [name, setName] = useState(workType.name);
  const [code, setCode] = useState(workType.code);
  const [errors, setErrors] = useState<FieldError>({});

  const validateField = (field: "name" | "code", value: string): string | undefined => {
    if (!value.trim()) return undefined;
    if (/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(value)) return "특수문자는 입력하실 수 없습니다.";
    if (value.length > 10) return "최대 10자까지 입력 가능합니다.";
    return undefined;
  };

  const handleBlur = (field: "name" | "code", value: string) => {
    const err = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: err }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FieldError = {};

    if (!name.trim()) newErrors.name = "근로형태명을 입력해주세요.";
    else {
      const nameErr = validateField("name", name);
      if (nameErr) newErrors.name = nameErr;
    }

    if (!code.trim()) newErrors.code = "근로형태 코드를 입력해주세요.";
    else {
      const codeErr = validateField("code", code);
      if (codeErr) newErrors.code = codeErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = updateWorkType(workType.id, name.trim(), code.trim());
    if (!result.success) {
      setErrors({ code: result.error });
      return;
    }

    onSuccess();
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">근로형태 수정</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              근로형태명 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name", name)}
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              근로형태 코드 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              onBlur={() => handleBlur("code", code)}
              maxLength={10}
              className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.code ? "border-red-400" : "border-gray-300"
              }`}
            />
            {errors.code && <p className="mt-1 text-xs text-red-500">{errors.code}</p>}
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

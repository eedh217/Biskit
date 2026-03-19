"use client";

import { useState, useCallback, useRef } from "react";
import { IncomeTypeCode } from "@/types/sps";
import { INCOME_TYPES, isValidIncomeType } from "@/lib/incomeTypes";
import { calculateOITax } from "@/lib/oiTaxCalculation";
import { validateIdNumberLength, validateAttributionDate as validateAttrDate } from "@/lib/oiValidation";
import { addOtherIncome, getOtherIncomes } from "@/lib/oiStore";
import { formatAmount, parseAmountInput, displayAmountInput } from "@/lib/formatUtils";
import ConfirmDialog from "@/components/manage/ConfirmDialog";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const NAME_ALLOWED_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s&'\-\.·()]*$/;

export default function AllOtherIncomeAddPopup({ onClose, onSaved }: Props) {
  const [paymentYear, setPaymentYear] = useState<string>("");
  const [paymentMonth, setPaymentMonth] = useState<string>("");
  const [attrYear, setAttrYear] = useState<string>("");
  const [attrMonth, setAttrMonth] = useState<string>("");
  const [name, setName] = useState("");
  const [isForeign, setIsForeign] = useState<"N" | "Y">("N");
  const [idNumber, setIdNumber] = useState("");
  const [incomeType, setIncomeType] = useState<IncomeTypeCode | "">("");
  const [paymentCountRaw, setPaymentCountRaw] = useState("");
  const [paymentAmountRaw, setPaymentAmountRaw] = useState("");
  const [necessaryExpenseRaw, setNecessaryExpenseRaw] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taxResult, setTaxResult] = useState<{
    incomeAmount: number;
    incomeTax: number;
    localTax: number;
    netIncome: number;
  } | null>(null);

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);

  const initialRef = useRef({
    paymentYear: "", paymentMonth: "", attrYear: "", attrMonth: "", name: "", isForeign: "N" as const,
    idNumber: "", incomeType: "", paymentCountRaw: "", paymentAmountRaw: "", necessaryExpenseRaw: "",
  });

  const isDirty = useCallback(() => {
    const init = initialRef.current;
    return (
      paymentYear !== init.paymentYear ||
      paymentMonth !== init.paymentMonth ||
      attrYear !== init.attrYear ||
      attrMonth !== init.attrMonth ||
      name !== init.name ||
      isForeign !== init.isForeign ||
      idNumber !== init.idNumber ||
      incomeType !== init.incomeType ||
      paymentCountRaw !== init.paymentCountRaw ||
      paymentAmountRaw !== init.paymentAmountRaw ||
      necessaryExpenseRaw !== init.necessaryExpenseRaw
    );
  }, [paymentYear, paymentMonth, attrYear, attrMonth, name, isForeign, idNumber, incomeType, paymentCountRaw, paymentAmountRaw, necessaryExpenseRaw]);

  const handleClose = () => {
    if (isDirty()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  const setError = (field: string, message: string | null) => {
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  };

  const recalculate = useCallback(() => {
    const paymentAmount = parseInt(paymentAmountRaw, 10);
    const necessaryExpense = parseInt(necessaryExpenseRaw, 10);

    if (isNaN(paymentAmount) || isNaN(necessaryExpense) || paymentAmount < 0 || necessaryExpense < 0) {
      setTaxResult(null);
      return;
    }

    const result = calculateOITax(paymentAmount, necessaryExpense);
    setTaxResult(result);
  }, [paymentAmountRaw, necessaryExpenseRaw]);

  // Blur handlers
  const handlePaymentYearBlur = () => {
    if (!paymentYear) {
      setError("paymentYear", "필수 입력 항목입니다.");
    } else {
      setError("paymentYear", null);
    }
    validateAttrDateFields();
  };

  const handlePaymentMonthBlur = () => {
    if (!paymentMonth) {
      setError("paymentMonth", "필수 입력 항목입니다.");
    } else {
      setError("paymentMonth", null);
    }
    validateAttrDateFields();
  };

  const handleAttrYearBlur = () => {
    if (!attrYear) {
      setError("attrYear", "필수 입력 항목입니다.");
    } else {
      setError("attrYear", null);
    }
    validateAttrDateFields();
  };

  const handleAttrMonthBlur = () => {
    if (!attrMonth) {
      setError("attrMonth", "필수 입력 항목입니다.");
    } else {
      setError("attrMonth", null);
    }
    validateAttrDateFields();
  };

  const validateAttrDateFields = () => {
    if (attrYear && attrMonth && paymentYear && paymentMonth) {
      const err = validateAttrDate(Number(attrYear), Number(attrMonth), Number(paymentYear), Number(paymentMonth));
      setError("attrDate", err);
    } else {
      setError("attrDate", null);
    }
  };

  const handleNameBlur = () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setError("name", "필수 입력 항목입니다.");
    } else {
      setError("name", null);
    }
  };

  const handleIdNumberBlur = () => {
    if (!idNumber) {
      setError("idNumber", "필수 입력 항목입니다.");
      return;
    }
    const lengthErr = validateIdNumberLength(idNumber);
    if (lengthErr) {
      setError("idNumber", lengthErr);
      return;
    }
    setError("idNumber", null);
  };

  const handleIncomeTypeBlur = () => {
    if (!incomeType) {
      setError("incomeType", "필수 입력 항목입니다.");
    } else {
      setError("incomeType", null);
    }
  };

  const handlePaymentCountBlur = () => {
    if (!paymentCountRaw) {
      setError("paymentCount", "필수 입력 항목입니다.");
    } else if (parseInt(paymentCountRaw, 10) === 0) {
      setError("paymentCount", "지급건수는 1건 이상 입력해야 합니다.");
    } else {
      setError("paymentCount", null);
    }
  };

  const handlePaymentAmountBlur = () => {
    if (!paymentAmountRaw) {
      setError("paymentAmount", "필수 입력 항목입니다.");
    } else if (parseInt(paymentAmountRaw, 10) === 0) {
      setError("paymentAmount", "지급액은 1원 이상 입력해야 합니다.");
    } else {
      setError("paymentAmount", null);
    }
    validateNecessaryExpenseRule();
    setTimeout(recalculate, 0);
  };

  const handleNecessaryExpenseBlur = () => {
    if (!necessaryExpenseRaw) {
      setError("necessaryExpense", "필수 입력 항목입니다.");
    } else {
      setError("necessaryExpense", null);
    }
    validateNecessaryExpenseRule();
    setTimeout(recalculate, 0);
  };

  const validateNecessaryExpenseRule = () => {
    if (paymentAmountRaw && necessaryExpenseRaw) {
      const paymentAmount = parseInt(paymentAmountRaw, 10);
      const necessaryExpense = parseInt(necessaryExpenseRaw, 10);

      if (!isNaN(paymentAmount) && !isNaN(necessaryExpense)) {
        const minExpense = Math.floor(paymentAmount * 0.6);

        if (necessaryExpense < minExpense) {
          setError("necessaryExpense", `필요경비는 지급액의 60% 이상이어야 합니다. (최소: ${formatAmount(minExpense)})`);
        } else if (necessaryExpense > paymentAmount) {
          setError("necessaryExpense", "필요경비는 지급액을 초과할 수 없습니다.");
        } else {
          setError("necessaryExpense", null);
        }
      }
    }
  };

  const handleNameChange = (v: string) => {
    if (v.length > 50) return;
    if (!NAME_ALLOWED_PATTERN.test(v)) return;
    setName(v);
  };

  const handleIdNumberChange = (v: string) => {
    const cleaned = v.replace(/[^0-9]/g, "");
    if (cleaned.length > 13) return;
    setIdNumber(cleaned);
  };

  const handlePaymentCountChange = (v: string) => {
    const cleaned = v.replace(/[^0-9]/g, "");
    if (cleaned.length > 5) return;
    setPaymentCountRaw(cleaned);
  };

  const handlePaymentAmountChange = (v: string) => {
    const parsed = parseAmountInput(v);
    if (parsed.length > 12) return;
    setPaymentAmountRaw(parsed);
  };

  const handleNecessaryExpenseChange = (v: string) => {
    const parsed = parseAmountInput(v);
    if (parsed.length > 12) return;
    setNecessaryExpenseRaw(parsed);
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};

    if (!paymentYear) newErrors.paymentYear = "필수 입력 항목입니다.";
    if (!paymentMonth) newErrors.paymentMonth = "필수 입력 항목입니다.";
    if (!attrYear) newErrors.attrYear = "필수 입력 항목입니다.";
    if (!attrMonth) newErrors.attrMonth = "필수 입력 항목입니다.";
    if (!name.trim()) newErrors.name = "필수 입력 항목입니다.";
    if (!idNumber) newErrors.idNumber = "필수 입력 항목입니다.";
    if (!incomeType) newErrors.incomeType = "필수 입력 항목입니다.";

    if (!paymentCountRaw) {
      newErrors.paymentCount = "필수 입력 항목입니다.";
    } else if (parseInt(paymentCountRaw, 10) === 0) {
      newErrors.paymentCount = "지급건수는 1건 이상 입력해야 합니다.";
    }

    if (!paymentAmountRaw) {
      newErrors.paymentAmount = "필수 입력 항목입니다.";
    } else if (parseInt(paymentAmountRaw, 10) === 0) {
      newErrors.paymentAmount = "지급액은 1원 이상 입력해야 합니다.";
    }

    if (!necessaryExpenseRaw) {
      newErrors.necessaryExpense = "필수 입력 항목입니다.";
    }

    if (idNumber) {
      const lenErr = validateIdNumberLength(idNumber);
      if (lenErr) newErrors.idNumber = lenErr;
    }

    if (attrYear && attrMonth && paymentYear && paymentMonth) {
      const dateErr = validateAttrDate(Number(attrYear), Number(attrMonth), Number(paymentYear), Number(paymentMonth));
      if (dateErr) newErrors.attrDate = dateErr;
    }

    // 필요경비 60% 규칙
    if (paymentAmountRaw && necessaryExpenseRaw) {
      const paymentAmount = parseInt(paymentAmountRaw, 10);
      const necessaryExpense = parseInt(necessaryExpenseRaw, 10);

      if (!isNaN(paymentAmount) && !isNaN(necessaryExpense)) {
        const minExpense = Math.floor(paymentAmount * 0.6);

        if (necessaryExpense < minExpense) {
          newErrors.necessaryExpense = `필요경비는 지급액의 60% 이상이어야 합니다. (최소: ${formatAmount(minExpense)})`;
        } else if (necessaryExpense > paymentAmount) {
          newErrors.necessaryExpense = "필요경비는 지급액을 초과할 수 없습니다.";
        }
      }
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // incomeType 검증
    if (!isValidIncomeType(incomeType)) {
      newErrors.incomeType = "유효하지 않은 소득구분입니다.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 중복 검사
    const all = getOtherIncomes();
    const dup = all.some(
      (item) =>
        item.paymentYear === Number(paymentYear) &&
        item.paymentMonth === Number(paymentMonth) &&
        item.attributionYear === Number(attrYear) &&
        item.attributionMonth === Number(attrMonth) &&
        item.idNumber === idNumber &&
        item.incomeType === incomeType
    );
    if (dup) {
      alert("지급연월, 귀속연월, 주민(사업자)등록번호, 소득구분이 동일한 기타소득이 존재합니다.");
      return;
    }

    doSave();
  };

  const doSave = () => {
    // incomeType이 빈 문자열이 아님을 여기서 확실히 보장
    if (!isValidIncomeType(incomeType)) {
      alert("유효하지 않은 소득구분입니다.");
      return;
    }

    const paymentCount = parseInt(paymentCountRaw, 10);
    const paymentAmount = parseInt(paymentAmountRaw, 10);
    const necessaryExpense = parseInt(necessaryExpenseRaw, 10);

    const result = addOtherIncome({
      name: name.trim(),
      isForeign,
      idNumber,
      incomeType, // 이제 타입 안전
      attributionYear: Number(attrYear),
      attributionMonth: Number(attrMonth),
      paymentYear: Number(paymentYear),
      paymentMonth: Number(paymentMonth),
      paymentCount,
      paymentAmount,
      necessaryExpense,
    });

    if (!result.success) {
      alert(result.error || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    onSaved();
  };

  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let y = 2026; y <= currentYear; y++) yearOptions.push(y);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">기타소득 추가</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              &times;
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
            {/* 지급연도/월 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급연도 / 지급월 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={paymentYear}
                  onChange={(e) => { setPaymentYear(e.target.value); setError("paymentYear", null); }}
                  onBlur={handlePaymentYearBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}년</option>
                  ))}
                </select>
                <select
                  value={paymentMonth}
                  onChange={(e) => { setPaymentMonth(e.target.value); setError("paymentMonth", null); }}
                  onBlur={handlePaymentMonthBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>
              {errors.paymentYear && <p className="text-xs text-red-500 mt-1">{errors.paymentYear}</p>}
              {errors.paymentMonth && <p className="text-xs text-red-500 mt-1">{errors.paymentMonth}</p>}
            </div>

            {/* 귀속연도/월 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                귀속연도 / 귀속월 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={attrYear}
                  onChange={(e) => { setAttrYear(e.target.value); setError("attrYear", null); }}
                  onBlur={handleAttrYearBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}년</option>
                  ))}
                </select>
                <select
                  value={attrMonth}
                  onChange={(e) => { setAttrMonth(e.target.value); setError("attrMonth", null); }}
                  onBlur={handleAttrMonthBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>
              {errors.attrYear && <p className="text-xs text-red-500 mt-1">{errors.attrYear}</p>}
              {errors.attrMonth && <p className="text-xs text-red-500 mt-1">{errors.attrMonth}</p>}
              {errors.attrDate && <p className="text-xs text-red-500 mt-1">{errors.attrDate}</p>}
            </div>

            {/* 성명 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                성명(상호) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="성명 또는 상호 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* 내외국인 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내외국인 구분
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={isForeign === "N"}
                    onChange={() => setIsForeign("N")}
                    className="text-blue-600"
                  />
                  내국인
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={isForeign === "Y"}
                    onChange={() => setIsForeign("Y")}
                    className="text-blue-600"
                  />
                  외국인
                </label>
              </div>
            </div>

            {/* 주민(사업자)등록번호 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                주민(사업자)등록번호 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={idNumber}
                onChange={(e) => handleIdNumberChange(e.target.value)}
                onBlur={handleIdNumberBlur}
                placeholder="숫자만 입력 (10자리 또는 13자리)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.idNumber && <p className="text-xs text-red-500 mt-1">{errors.idNumber}</p>}
            </div>

            {/* 소득구분 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                소득구분 <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col gap-2">
                {INCOME_TYPES.map((it) => (
                  <label key={it.code} className="flex items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={incomeType === it.code}
                      onChange={() => {
                        setIncomeType(it.code as IncomeTypeCode);
                        setError("incomeType", null);
                      }}
                      onBlur={handleIncomeTypeBlur}
                      className="text-blue-600"
                    />
                    {it.name}
                  </label>
                ))}
              </div>
              {errors.incomeType && <p className="text-xs text-red-500 mt-1">{errors.incomeType}</p>}
            </div>

            {/* 지급건수 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급건수 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={paymentCountRaw}
                onChange={(e) => handlePaymentCountChange(e.target.value)}
                onBlur={handlePaymentCountBlur}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.paymentCount && <p className="text-xs text-red-500 mt-1">{errors.paymentCount}</p>}
            </div>

            {/* 지급액(A) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급액(A) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayAmountInput(paymentAmountRaw)}
                onChange={(e) => handlePaymentAmountChange(e.target.value)}
                onBlur={handlePaymentAmountBlur}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.paymentAmount && <p className="text-xs text-red-500 mt-1">{errors.paymentAmount}</p>}
            </div>

            {/* 필요경비(B) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                필요경비(B) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={displayAmountInput(necessaryExpenseRaw)}
                onChange={(e) => handleNecessaryExpenseChange(e.target.value)}
                onBlur={handleNecessaryExpenseBlur}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {errors.necessaryExpense && <p className="text-xs text-red-500 mt-1">{errors.necessaryExpense}</p>}
            </div>

            {/* 자동 계산 영역 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">자동 계산</h3>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">소득금액(A-B)</span>
                <span className="text-sm font-medium text-gray-900">
                  {taxResult ? formatAmount(taxResult.incomeAmount) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">소득세 (20%)</span>
                <span className="text-sm font-medium text-gray-900">
                  {taxResult ? formatAmount(taxResult.incomeTax) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">지방소득세 (10%)</span>
                <span className="text-sm font-medium text-gray-900">
                  {taxResult ? formatAmount(taxResult.localTax) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm font-medium text-gray-700">실소득금액</span>
                <span className="text-sm font-bold text-gray-900">
                  {taxResult ? formatAmount(taxResult.netIncome) : "-"}
                </span>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="text-xs text-gray-500 space-y-1 bg-blue-50 p-3 rounded-lg">
              <p>※ 기타소득의 소득세율은 20%로 고정됩니다.</p>
              <p>※ 필요경비는 지급액의 60% 이상이어야 합니다.</p>
              <p>※ 소액부징수(소득세액이 1천원 미만)인 경우, 소득세가 면제됩니다.</p>
              <p>※ 실소득금액 = 소득금액 - 소득세 - 지방소득세</p>
            </div>
          </div>

          <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              취소
            </button>
            <button
              onClick={handleSubmit}
              disabled={hasErrors}
              className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              저장
            </button>
          </div>
        </div>
      </div>

      {showCloseConfirm && (
        <ConfirmDialog
          message="기타소득 추가를 취소하시겠습니까?"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}
    </>
  );
}

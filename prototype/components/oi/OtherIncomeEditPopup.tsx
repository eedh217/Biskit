"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { OtherIncome, IncomeTypeCode } from "@/types/sps";
import { INCOME_TYPES, isValidIncomeType } from "@/lib/incomeTypes";
import { calculateOITax } from "@/lib/oiTaxCalculation";
import { validateIdNumberLength, validateAttributionDate as validateAttrDate } from "@/lib/oiValidation";
import { updateOtherIncome, deleteOtherIncomes, getOtherIncomes } from "@/lib/oiStore";
import { formatAmount, parseAmountInput, displayAmountInput } from "@/lib/formatUtils";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import Toast from "@/components/manage/Toast";

interface Props {
  record: OtherIncome;
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
}

const NAME_ALLOWED_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s&'\-\.·()]*$/;

export default function OtherIncomeEditPopup({ record, onClose, onSaved, onDeleted }: Props) {
  const [attrYear, setAttrYear] = useState<string>(String(record.attributionYear));
  const [attrMonth, setAttrMonth] = useState<string>(String(record.attributionMonth));
  const [name, setName] = useState(record.name);
  const [isForeign, setIsForeign] = useState<"N" | "Y">(record.isForeign);
  const [idNumber, setIdNumber] = useState(record.idNumber);
  const [incomeType, setIncomeType] = useState<IncomeTypeCode>(record.incomeType);
  const [paymentCountRaw, setPaymentCountRaw] = useState(String(record.paymentCount));
  const [paymentAmountRaw, setPaymentAmountRaw] = useState(String(record.paymentAmount));
  const [necessaryExpenseRaw, setNecessaryExpenseRaw] = useState(String(record.necessaryExpense));

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taxResult, setTaxResult] = useState(() => {
    return calculateOITax(record.paymentAmount, record.necessaryExpense);
  });

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const initialRef = useRef({
    attrYear: String(record.attributionYear),
    attrMonth: String(record.attributionMonth),
    name: record.name,
    isForeign: record.isForeign,
    idNumber: record.idNumber,
    incomeType: record.incomeType,
    paymentCountRaw: String(record.paymentCount),
    paymentAmountRaw: String(record.paymentAmount),
    necessaryExpenseRaw: String(record.necessaryExpense),
  });

  const isDirty = useCallback(() => {
    const init = initialRef.current;
    return (
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
  }, [attrYear, attrMonth, name, isForeign, idNumber, incomeType, paymentCountRaw, paymentAmountRaw, necessaryExpenseRaw]);

  const handleClose = () => {
    if (isDirty()) {
      setShowCloseConfirm(true);
    } else {
      onClose();
    }
  };

  // ESC 키 및 브라우저 뒤로가기 이벤트 처리
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        handleClose();
      }
    };

    const handlePopState = () => {
      handleClose();
    };

    // 히스토리 스택에 상태 추가
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

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
      return;
    }

    const result = calculateOITax(paymentAmount, necessaryExpense);
    setTaxResult(result);
  }, [paymentAmountRaw, necessaryExpenseRaw]);

  // Blur handlers (similar to Add popup)
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
    if (attrYear && attrMonth) {
      const err = validateAttrDate(Number(attrYear), Number(attrMonth), record.paymentYear, record.paymentMonth);
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
    } else {
      // 수정 팝업에서는 0원 허용
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

  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    deleteOtherIncomes([record.id]);
    setShowDeleteConfirm(false);
    setToast("기타소득이 삭제되었습니다.");
    setTimeout(() => {
      onDeleted();
    }, 1500);
  };

  const handleSubmit = () => {
    // Validate all fields
    const newErrors: Record<string, string> = {};

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
    }

    if (!necessaryExpenseRaw) {
      newErrors.necessaryExpense = "필수 입력 항목입니다.";
    }

    if (idNumber) {
      const lenErr = validateIdNumberLength(idNumber);
      if (lenErr) newErrors.idNumber = lenErr;
    }

    if (attrYear && attrMonth) {
      const dateErr = validateAttrDate(Number(attrYear), Number(attrMonth), record.paymentYear, record.paymentMonth);
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

    // 중복 검사 (본인 제외)
    const all = getOtherIncomes();
    const dup = all.some(
      (item) =>
        item.id !== record.id &&
        item.paymentYear === record.paymentYear &&
        item.paymentMonth === record.paymentMonth &&
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
    // incomeType 타입 안전성 보장
    if (!isValidIncomeType(incomeType)) {
      alert("유효하지 않은 소득구분입니다.");
      return;
    }

    const paymentCount = parseInt(paymentCountRaw, 10);
    const paymentAmount = parseInt(paymentAmountRaw, 10);
    const necessaryExpense = parseInt(necessaryExpenseRaw, 10);
    const tax = calculateOITax(paymentAmount, necessaryExpense);

    const result = updateOtherIncome(record.id, {
      name: name.trim(),
      isForeign,
      idNumber,
      incomeType,
      attributionYear: Number(attrYear),
      attributionMonth: Number(attrMonth),
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
            <h2 className="text-lg font-semibold text-gray-900">기타소득 수정</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              &times;
            </button>
          </div>

          <div className="px-6 py-4 space-y-4">
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
              <p className="text-xs text-gray-500 mt-1">※ 수정 시 0원 입력 가능합니다.</p>
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
                  {formatAmount(taxResult.incomeAmount)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">소득세 (20%)</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatAmount(taxResult.incomeTax)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">지방소득세 (10%)</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatAmount(taxResult.localTax)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm font-medium text-gray-700">실소득금액</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatAmount(taxResult.netIncome)}
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

          <div className="flex justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50"
            >
              삭제
            </button>
            <div className="flex gap-2">
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
      </div>

      {showCloseConfirm && (
        <ConfirmDialog
          message="기타소득 수정을 취소하시겠습니까?"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message="기타소득을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다."
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { INDUSTRY_CODES, isExceptionIndustry, GRATUITY_CODE } from "@/lib/industryCodes";
import { determineTaxRate, calculateTax, needsTaxRateSelection } from "@/lib/taxCalculation";
import {
  validateIdNumberLength,
  validateIdNumberCheckDigit,
  validateHospitalIdNumber,
  validateAttributionDate,
} from "@/lib/spsValidation";
import { addBusinessIncome, getBusinessIncomes } from "@/lib/store";
import { formatAmount, parseAmountInput, displayAmountInput } from "@/lib/formatUtils";
import ConfirmDialog from "@/components/manage/ConfirmDialog";

interface Props {
  onClose: () => void;
  onSaved: () => void;
}

const NAME_ALLOWED_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s&'\-\.·()]*$/;

export default function AllBusinessIncomeAddPopup({ onClose, onSaved }: Props) {
  const [payYear, setPayYear] = useState<string>("");
  const [payMonth, setPayMonth] = useState<string>("");
  const [attrYear, setAttrYear] = useState<string>("");
  const [attrMonth, setAttrMonth] = useState<string>("");
  const [name, setName] = useState("");
  const [isForeign, setIsForeign] = useState<"N" | "Y">("N");
  const [idNumber, setIdNumber] = useState("");
  const [industryCode, setIndustryCode] = useState("");
  const [paymentAmountRaw, setPaymentAmountRaw] = useState("");
  const [selectedTaxRate, setSelectedTaxRate] = useState<number>(3);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [taxResult, setTaxResult] = useState<{
    taxRate: number;
    incomeTax: number;
    localTax: number;
    netPayment: number;
  } | null>(null);

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showExceptionConfirm, setShowExceptionConfirm] = useState(false);

  const initialRef = useRef({
    payYear: "", payMonth: "", attrYear: "", attrMonth: "",
    name: "", isForeign: "N" as const, idNumber: "", industryCode: "", paymentAmountRaw: "",
  });

  const isDirty = useCallback(() => {
    const init = initialRef.current;
    return (
      payYear !== init.payYear ||
      payMonth !== init.payMonth ||
      attrYear !== init.attrYear ||
      attrMonth !== init.attrMonth ||
      name !== init.name ||
      isForeign !== init.isForeign ||
      idNumber !== init.idNumber ||
      industryCode !== init.industryCode ||
      paymentAmountRaw !== init.paymentAmountRaw
    );
  }, [payYear, payMonth, attrYear, attrMonth, name, isForeign, idNumber, industryCode, paymentAmountRaw]);

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

  const doRecalc = (
    code: string,
    foreign: "N" | "Y",
    amtRaw: string,
    rate: number
  ) => {
    const amount = parseInt(amtRaw, 10);
    if (!code || isNaN(amount) || amount < 0) {
      setTaxResult(null);
      return;
    }
    const taxRate = determineTaxRate(code, foreign, rate);
    const result = calculateTax(amount, taxRate);
    setTaxResult(result);
  };

  // blur handlers
  const handlePayYearBlur = () => {
    if (!payYear) {
      setError("payYear", "필수 입력 항목입니다.");
    } else {
      setError("payYear", null);
    }
    validateAttrDate(attrYear, attrMonth, payYear, payMonth);
  };

  const handlePayMonthBlur = () => {
    if (!payMonth) {
      setError("payMonth", "필수 입력 항목입니다.");
    } else {
      setError("payMonth", null);
    }
    validateAttrDate(attrYear, attrMonth, payYear, payMonth);
  };

  const handleAttrYearBlur = () => {
    if (!attrYear) {
      setError("attrYear", "필수 입력 항목입니다.");
    } else {
      setError("attrYear", null);
    }
    validateAttrDate(attrYear, attrMonth, payYear, payMonth);
    tryRecalc();
  };

  const handleAttrMonthBlur = () => {
    if (!attrMonth) {
      setError("attrMonth", "필수 입력 항목입니다.");
    } else {
      setError("attrMonth", null);
    }
    validateAttrDate(attrYear, attrMonth, payYear, payMonth);
    tryRecalc();
  };

  const validateAttrDate = (ay: string, am: string, py: string, pm: string) => {
    if (ay && am && py && pm) {
      const err = validateAttributionDate(Number(ay), Number(am), Number(py), Number(pm));
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
    const checkErr = validateIdNumberCheckDigit(idNumber);
    if (checkErr) {
      setError("idNumber", checkErr);
      return;
    }
    if (industryCode) {
      const hospErr = validateHospitalIdNumber(industryCode, idNumber);
      if (hospErr) {
        setError("idNumber", hospErr);
        return;
      }
    }
    setError("idNumber", null);
    tryRecalc();
  };

  const handleIndustryCodeBlur = () => {
    if (!industryCode) {
      setError("industryCode", "필수 입력 항목입니다.");
      return;
    }
    if (idNumber) {
      const hospErr = validateHospitalIdNumber(industryCode, idNumber);
      if (hospErr) {
        setError("industryCode", hospErr);
        return;
      }
    }
    setError("industryCode", null);
    tryRecalc();
  };

  const handlePaymentAmountBlur = () => {
    if (!paymentAmountRaw) {
      setError("paymentAmount", "필수 입력 항목입니다.");
    } else {
      setError("paymentAmount", null);
    }
    tryRecalc();
  };

  const tryRecalc = () => {
    setTimeout(() => {
      if (industryCode && paymentAmountRaw) {
        const amount = parseInt(paymentAmountRaw, 10);
        if (!isNaN(amount) && amount >= 0) {
          const taxRate = determineTaxRate(industryCode, isForeign, selectedTaxRate);
          const result = calculateTax(amount, taxRate);
          setTaxResult(result);
        }
      }
    }, 0);
  };

  const handleIndustryCodeChange = (code: string) => {
    setIndustryCode(code);
    setError("industryCode", null);
    if (code && paymentAmountRaw) {
      const amount = parseInt(paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(code, isForeign, selectedTaxRate);
        const result = calculateTax(amount, taxRate);
        setTaxResult(result);
      }
    } else {
      setTaxResult(null);
    }
    if (idNumber && code) {
      const hospErr = validateHospitalIdNumber(code, idNumber);
      if (hospErr) {
        setError("industryCode", hospErr);
      }
    }
  };

  const handleIsForeignChange = (val: "N" | "Y") => {
    setIsForeign(val);
    if (industryCode && paymentAmountRaw) {
      const amount = parseInt(paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(industryCode, val, selectedTaxRate);
        const result = calculateTax(amount, taxRate);
        setTaxResult(result);
      }
    }
  };

  const handleTaxRateChange = (rate: number) => {
    setSelectedTaxRate(rate);
    if (industryCode && paymentAmountRaw) {
      const amount = parseInt(paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(industryCode, isForeign, rate);
        const result = calculateTax(amount, taxRate);
        setTaxResult(result);
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

  const handlePaymentAmountChange = (v: string) => {
    const parsed = parseAmountInput(v);
    if (parsed.length > 12) return;
    setPaymentAmountRaw(parsed);
  };

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};

    if (!payYear) newErrors.payYear = "필수 입력 항목입니다.";
    if (!payMonth) newErrors.payMonth = "필수 입력 항목입니다.";
    if (!attrYear) newErrors.attrYear = "필수 입력 항목입니다.";
    if (!attrMonth) newErrors.attrMonth = "필수 입력 항목입니다.";
    if (!name.trim()) newErrors.name = "필수 입력 항목입니다.";
    if (!idNumber) newErrors.idNumber = "필수 입력 항목입니다.";
    if (!industryCode) newErrors.industryCode = "필수 입력 항목입니다.";
    if (!paymentAmountRaw) newErrors.paymentAmount = "필수 입력 항목입니다.";

    if (idNumber) {
      const lenErr = validateIdNumberLength(idNumber);
      if (lenErr) newErrors.idNumber = lenErr;
      else {
        const chkErr = validateIdNumberCheckDigit(idNumber);
        if (chkErr) newErrors.idNumber = chkErr;
      }
    }

    if (industryCode && idNumber) {
      const hospErr = validateHospitalIdNumber(industryCode, idNumber);
      if (hospErr) newErrors.industryCode = hospErr;
    }

    if (attrYear && attrMonth && payYear && payMonth) {
      const dateErr = validateAttributionDate(Number(attrYear), Number(attrMonth), Number(payYear), Number(payMonth));
      if (dateErr) newErrors.attrDate = dateErr;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // 중복 검사
    const all = getBusinessIncomes();
    const dup = all.some(
      (item) =>
        item.paymentYear === Number(payYear) &&
        item.paymentMonth === Number(payMonth) &&
        item.attributionYear === Number(attrYear) &&
        item.attributionMonth === Number(attrMonth) &&
        item.idNumber === idNumber &&
        item.industryCode === industryCode
    );
    if (dup) {
      alert("주민(사업자)등록번호, 귀속연월, 업종코드가 동일한 사업소득이 존재합니다.");
      return;
    }

    // 예외 업종 확인
    if (
      isExceptionIndustry(industryCode) &&
      Number(attrYear) !== Number(payYear)
    ) {
      setShowExceptionConfirm(true);
      return;
    }

    doSave();
  };

  const doSave = () => {
    const amount = parseInt(paymentAmountRaw, 10);
    const taxRate = determineTaxRate(industryCode, isForeign, selectedTaxRate);
    const tax = calculateTax(amount, taxRate);

    const result = addBusinessIncome({
      name: name.trim(),
      isForeign,
      idNumber,
      industryCode,
      attributionYear: Number(attrYear),
      attributionMonth: Number(attrMonth),
      paymentYear: Number(payYear),
      paymentMonth: Number(payMonth),
      paymentAmount: amount,
      taxRate: tax.taxRate,
      incomeTax: tax.incomeTax,
      localTax: tax.localTax,
      netPayment: tax.netPayment,
    });

    if (!result.success) {
      alert(result.error || "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      return;
    }

    onSaved();
  };

  const showTaxRateRadio = needsTaxRateSelection(industryCode, isForeign);
  const displayTaxRate = industryCode
    ? industryCode === GRATUITY_CODE
      ? "5%"
      : showTaxRateRadio
      ? `${selectedTaxRate}%`
      : "3%"
    : "-";

  const currentYear = new Date().getFullYear();
  const payYearOptions: number[] = [];
  for (let y = 2025; y <= currentYear + 1; y++) payYearOptions.push(y);
  const attrYearOptions: number[] = [];
  for (let y = 2025; y <= currentYear; y++) attrYearOptions.push(y);

  const hasErrors = Object.keys(errors).length > 0;

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">사업소득 추가</h2>
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
                  value={payYear}
                  onChange={(e) => { setPayYear(e.target.value); setError("payYear", null); }}
                  onBlur={handlePayYearBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {payYearOptions.map((y) => (
                    <option key={y} value={y}>{y}년</option>
                  ))}
                </select>
                <select
                  value={payMonth}
                  onChange={(e) => { setPayMonth(e.target.value); setError("payMonth", null); }}
                  onBlur={handlePayMonthBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>
              {errors.payYear && <p className="text-xs text-red-500 mt-1">{errors.payYear}</p>}
              {errors.payMonth && <p className="text-xs text-red-500 mt-1">{errors.payMonth}</p>}
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
                  {attrYearOptions.map((y) => (
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
                내외국인 구분 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={isForeign === "N"}
                    onChange={() => handleIsForeignChange("N")}
                    className="text-blue-600"
                  />
                  내국인
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={isForeign === "Y"}
                    onChange={() => handleIsForeignChange("Y")}
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

            {/* 업종코드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업종코드 <span className="text-red-500">*</span>
              </label>
              <select
                value={industryCode}
                onChange={(e) => handleIndustryCodeChange(e.target.value)}
                onBlur={handleIndustryCodeBlur}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">선택</option>
                {INDUSTRY_CODES.map((ic) => (
                  <option key={ic.code} value={ic.code}>
                    {ic.name} ({ic.code})
                  </option>
                ))}
              </select>
              {errors.industryCode && <p className="text-xs text-red-500 mt-1">{errors.industryCode}</p>}
            </div>

            {/* 지급액 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급액 <span className="text-red-500">*</span>
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

            {/* 자동 계산 영역 */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <h3 className="text-sm font-medium text-gray-700">자동 계산</h3>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">세율(%)</span>
                {showTaxRateRadio ? (
                  <div className="flex gap-3">
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        checked={selectedTaxRate === 3}
                        onChange={() => handleTaxRateChange(3)}
                        className="text-blue-600"
                      />
                      3%
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        checked={selectedTaxRate === 20}
                        onChange={() => handleTaxRateChange(20)}
                        className="text-blue-600"
                      />
                      20%
                    </label>
                  </div>
                ) : (
                  <span className="text-sm font-medium text-gray-900">{displayTaxRate}</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">소득세</span>
                <span className="text-sm font-medium text-gray-900">
                  {taxResult ? formatAmount(taxResult.incomeTax) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">지방소득세</span>
                <span className="text-sm font-medium text-gray-900">
                  {taxResult ? formatAmount(taxResult.localTax) : "-"}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm font-medium text-gray-700">실지급액</span>
                <span className="text-sm font-bold text-gray-900">
                  {taxResult ? formatAmount(taxResult.netPayment) : "-"}
                </span>
              </div>
            </div>

            {/* 안내 문구 */}
            <div className="text-xs text-gray-500 space-y-1 bg-blue-50 p-3 rounded-lg">
              <p>※ 지급총액 입력 시 업종코드에 따라 세율이 자동 적용되어 소득세, 지방소득세가 계산됩니다.</p>
              <p>※ 소액부징수(소득세액이 1천원 미만)인 경우, 소득세가 면제됩니다.</p>
              <p>※ 직업운동가(940904) 중 프로스포츠 구단과의 계약기간이 3년 이하인 외국인 직업 운동가일 경우, 세율 20%</p>
              <p>※ 봉사료 수취자(940905) 중 「소득세법 시행령」제184조의2에 해당하는 봉사료 수입금액의 경우, 세율 5%</p>
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
          message="사업소득 추가를 취소하시겠습니까?"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      {showExceptionConfirm && (
        <ConfirmDialog
          message={`해당 데이터는 ${attrYear}년 12월 사업소득에 표시됩니다.`}
          onConfirm={() => {
            setShowExceptionConfirm(false);
            doSave();
          }}
          onCancel={() => setShowExceptionConfirm(false)}
        />
      )}
    </>
  );
}

"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { BusinessIncome } from "@/types/sps";
import { INDUSTRY_CODES, isExceptionIndustry, GRATUITY_CODE } from "@/lib/industryCodes";
import { determineTaxRate, calculateTax, needsTaxRateSelection } from "@/lib/taxCalculation";
import {
  validateIdNumberLength,
  validateIdNumberCheckDigit,
  validateHospitalIdNumber,
  validateAttributionDate,
} from "@/lib/spsValidation";
import { updateBusinessIncome, deleteBusinessIncomes, getBusinessIncomes } from "@/lib/store";
import { formatAmount, parseAmountInput, displayAmountInput } from "@/lib/formatUtils";
import ConfirmDialog from "@/components/manage/ConfirmDialog";
import Toast from "@/components/manage/Toast";

interface Props {
  records: BusinessIncome[];
  onClose: () => void;
  onSaved: () => void;
  onDeleted: () => void;
  onRefresh?: () => void;
}

interface TabFormState {
  id: string;
  paymentYear: number;
  paymentMonth: number;
  attrYear: string;
  attrMonth: string;
  name: string;
  isForeign: "N" | "Y";
  idNumber: string;
  industryCode: string;
  paymentAmountRaw: string;
  selectedTaxRate: number;
  taxResult: {
    taxRate: number;
    incomeTax: number;
    localTax: number;
    netPayment: number;
  };
  errors: Record<string, string>;
}

const NAME_ALLOWED_PATTERN = /^[a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s&'\-\.·()]*$/;

function createTabState(record: BusinessIncome): TabFormState {
  return {
    id: record.id,
    paymentYear: record.paymentYear,
    paymentMonth: record.paymentMonth,
    attrYear: String(record.attributionYear),
    attrMonth: String(record.attributionMonth),
    name: record.name,
    isForeign: record.isForeign,
    idNumber: record.idNumber,
    industryCode: record.industryCode,
    paymentAmountRaw: String(record.paymentAmount),
    selectedTaxRate: record.taxRate === 0.20 ? 20 : record.taxRate === 0.05 ? 5 : 3,
    taxResult: {
      taxRate: record.taxRate,
      incomeTax: record.incomeTax,
      localTax: record.localTax,
      netPayment: record.netPayment,
    },
    errors: {},
  };
}

export default function BusinessIncomeEditPopup({ records, onClose, onSaved, onDeleted, onRefresh }: Props) {
  const [tabs, setTabs] = useState<TabFormState[]>(() =>
    records
      .sort((a, b) => a.paymentYear * 100 + a.paymentMonth - (b.paymentYear * 100 + b.paymentMonth))
      .map(createTabState)
  );
  const [activeTabIndex, setActiveTabIndex] = useState(0);

  const [showCloseConfirm, setShowCloseConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showExceptionConfirm, setShowExceptionConfirm] = useState(false);
  const [showTabSwitchConfirm, setShowTabSwitchConfirm] = useState(false);
  const [targetTabIndex, setTargetTabIndex] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Field refs for focus management
  const attrYearRef = useRef<HTMLSelectElement>(null);
  const attrMonthRef = useRef<HTMLSelectElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const idNumberRef = useRef<HTMLInputElement>(null);
  const industryCodeRef = useRef<HTMLSelectElement>(null);
  const paymentAmountRef = useRef<HTMLInputElement>(null);

  const initialRef = useRef(
    records.map((r) => ({
      id: r.id,
      attrYear: String(r.attributionYear),
      attrMonth: String(r.attributionMonth),
      name: r.name,
      isForeign: r.isForeign,
      idNumber: r.idNumber,
      industryCode: r.industryCode,
      paymentAmountRaw: String(r.paymentAmount),
    }))
  );

  // Fixed mode based on initial records count - does not change during deletion
  const [isMulti] = useState(records.length > 1);

  const isDirty = useCallback(() => {
    return tabs.some((tab) => {
      const init = initialRef.current.find((i) => i.id === tab.id);
      if (!init) return true;
      return (
        tab.attrYear !== init.attrYear ||
        tab.attrMonth !== init.attrMonth ||
        tab.name !== init.name ||
        tab.isForeign !== init.isForeign ||
        tab.idNumber !== init.idNumber ||
        tab.industryCode !== init.industryCode ||
        tab.paymentAmountRaw !== init.paymentAmountRaw
      );
    });
  }, [tabs]);

  const isCurrentTabDirty = useCallback(() => {
    const tab = tabs[activeTabIndex];
    const init = initialRef.current.find((i) => i.id === tab.id);
    if (!init) return true;
    return (
      tab.attrYear !== init.attrYear ||
      tab.attrMonth !== init.attrMonth ||
      tab.name !== init.name ||
      tab.isForeign !== init.isForeign ||
      tab.idNumber !== init.idNumber ||
      tab.industryCode !== init.industryCode ||
      tab.paymentAmountRaw !== init.paymentAmountRaw
    );
  }, [tabs, activeTabIndex]);

  const restoreCurrentTab = useCallback(() => {
    const tab = tabs[activeTabIndex];
    const init = initialRef.current.find((i) => i.id === tab.id);
    if (!init) return;

    const original = records.find((r) => r.id === tab.id);
    if (!original) return;

    const restored = createTabState(original);
    setTabs((prev) => prev.map((t, i) => (i === activeTabIndex ? restored : t)));
  }, [tabs, activeTabIndex, records]);

  const focusFirstError = useCallback(() => {
    const tab = tabs[activeTabIndex];
    const errors = tab.errors;

    if (errors.attrYear || errors.attrDate || errors.duplicate) {
      attrYearRef.current?.focus();
    } else if (errors.attrMonth) {
      attrMonthRef.current?.focus();
    } else if (errors.name) {
      nameRef.current?.focus();
    } else if (errors.idNumber) {
      idNumberRef.current?.focus();
    } else if (errors.industryCode) {
      industryCodeRef.current?.focus();
    } else if (errors.paymentAmount) {
      paymentAmountRef.current?.focus();
    }
  }, [tabs, activeTabIndex]);

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

  const updateTab = (index: number, updates: Partial<TabFormState>) => {
    setTabs((prev) => prev.map((t, i) => (i === index ? { ...t, ...updates } : t)));
  };

  const setTabError = (index: number, field: string, message: string | null) => {
    setTabs((prev) =>
      prev.map((t, i) => {
        if (i !== index) return t;
        const next = { ...t.errors };
        if (message) next[field] = message;
        else delete next[field];
        return { ...t, errors: next };
      })
    );
  };

  const recalcTab = (index: number, code?: string, foreign?: "N" | "Y", amtRaw?: string, rate?: number) => {
    const tab = tabs[index];
    const ic = code ?? tab.industryCode;
    const fg = foreign ?? tab.isForeign;
    const raw = amtRaw ?? tab.paymentAmountRaw;
    const r = rate ?? tab.selectedTaxRate;
    if (ic && raw) {
      const amount = parseInt(raw, 10);
      if (!isNaN(amount) && amount >= 0) {
        const taxRate = determineTaxRate(ic, fg, r);
        const result = calculateTax(amount, taxRate);
        updateTab(index, { taxResult: result });
      }
    }
  };

  // Handlers for active tab
  const handleAttrYearChange = (value: string) => {
    updateTab(activeTabIndex, { attrYear: value });
    setTabError(activeTabIndex, "attrYear", null);
  };

  const handleAttrMonthChange = (value: string) => {
    updateTab(activeTabIndex, { attrMonth: value });
    setTabError(activeTabIndex, "attrMonth", null);
  };

  const handleAttrYearBlur = () => {
    const tab = tabs[activeTabIndex];
    if (!tab.attrYear) {
      setTabError(activeTabIndex, "attrYear", "필수 입력 항목입니다.");
    } else {
      setTabError(activeTabIndex, "attrYear", null);
    }
    validateAttrDate(activeTabIndex);
  };

  const handleAttrMonthBlur = () => {
    const tab = tabs[activeTabIndex];
    if (!tab.attrMonth) {
      setTabError(activeTabIndex, "attrMonth", "필수 입력 항목입니다.");
    } else {
      setTabError(activeTabIndex, "attrMonth", null);
    }
    validateAttrDate(activeTabIndex);
  };

  const validateAttrDate = (index: number) => {
    const tab = tabs[index];
    if (tab.attrYear && tab.attrMonth) {
      const err = validateAttributionDate(
        Number(tab.attrYear),
        Number(tab.attrMonth),
        tab.paymentYear,
        tab.paymentMonth
      );
      setTabError(index, "attrDate", err);
    } else {
      setTabError(index, "attrDate", null);
    }
  };

  const handleNameChange = (v: string) => {
    if (v.length > 50) return;
    if (!NAME_ALLOWED_PATTERN.test(v)) return;
    updateTab(activeTabIndex, { name: v });
  };

  const handleNameBlur = () => {
    const tab = tabs[activeTabIndex];
    const trimmed = tab.name.trim();
    if (!trimmed) {
      setTabError(activeTabIndex, "name", "필수 입력 항목입니다.");
    } else {
      setTabError(activeTabIndex, "name", null);
    }
  };

  const handleIsForeignChange = (val: "N" | "Y") => {
    const tab = tabs[activeTabIndex];
    updateTab(activeTabIndex, { isForeign: val });
    if (tab.industryCode && tab.paymentAmountRaw) {
      const amount = parseInt(tab.paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(tab.industryCode, val, tab.selectedTaxRate);
        const result = calculateTax(amount, taxRate);
        updateTab(activeTabIndex, { isForeign: val, taxResult: result });
      }
    }
  };

  const handleIdNumberChange = (v: string) => {
    const cleaned = v.replace(/[^0-9]/g, "");
    if (cleaned.length > 13) return;
    updateTab(activeTabIndex, { idNumber: cleaned });
  };

  const handleIdNumberBlur = () => {
    const tab = tabs[activeTabIndex];
    if (!tab.idNumber) {
      setTabError(activeTabIndex, "idNumber", "필수 입력 항목입니다.");
      return;
    }
    const lengthErr = validateIdNumberLength(tab.idNumber);
    if (lengthErr) {
      setTabError(activeTabIndex, "idNumber", lengthErr);
      return;
    }
    const checkErr = validateIdNumberCheckDigit(tab.idNumber);
    if (checkErr) {
      setTabError(activeTabIndex, "idNumber", checkErr);
      return;
    }
    if (tab.industryCode) {
      const hospErr = validateHospitalIdNumber(tab.industryCode, tab.idNumber);
      if (hospErr) {
        setTabError(activeTabIndex, "idNumber", hospErr);
        return;
      }
    }
    setTabError(activeTabIndex, "idNumber", null);
    recalcTab(activeTabIndex);
  };

  const handleIndustryCodeChange = (code: string) => {
    const tab = tabs[activeTabIndex];
    updateTab(activeTabIndex, { industryCode: code });
    setTabError(activeTabIndex, "industryCode", null);
    if (code && tab.paymentAmountRaw) {
      const amount = parseInt(tab.paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(code, tab.isForeign, tab.selectedTaxRate);
        const result = calculateTax(amount, taxRate);
        updateTab(activeTabIndex, { industryCode: code, taxResult: result });
      }
    }
    if (tab.idNumber && code) {
      const hospErr = validateHospitalIdNumber(code, tab.idNumber);
      if (hospErr) {
        setTabError(activeTabIndex, "industryCode", hospErr);
      }
    }
  };

  const handleIndustryCodeBlur = () => {
    const tab = tabs[activeTabIndex];
    if (!tab.industryCode) {
      setTabError(activeTabIndex, "industryCode", "필수 입력 항목입니다.");
      return;
    }
    if (tab.idNumber) {
      const hospErr = validateHospitalIdNumber(tab.industryCode, tab.idNumber);
      if (hospErr) {
        setTabError(activeTabIndex, "industryCode", hospErr);
        return;
      }
    }
    setTabError(activeTabIndex, "industryCode", null);
    recalcTab(activeTabIndex);
  };

  const handlePaymentAmountChange = (v: string) => {
    const parsed = parseAmountInput(v);
    if (parsed.length > 12) return;
    updateTab(activeTabIndex, { paymentAmountRaw: parsed });
  };

  const handlePaymentAmountBlur = () => {
    const tab = tabs[activeTabIndex];
    if (!tab.paymentAmountRaw) {
      setTabError(activeTabIndex, "paymentAmount", "필수 입력 항목입니다.");
    } else {
      setTabError(activeTabIndex, "paymentAmount", null);
    }
    recalcTab(activeTabIndex);
  };

  const handleTaxRateChange = (rate: number) => {
    const tab = tabs[activeTabIndex];
    updateTab(activeTabIndex, { selectedTaxRate: rate });
    if (tab.industryCode && tab.paymentAmountRaw) {
      const amount = parseInt(tab.paymentAmountRaw, 10);
      if (!isNaN(amount)) {
        const taxRate = determineTaxRate(tab.industryCode, tab.isForeign, rate);
        const result = calculateTax(amount, taxRate);
        updateTab(activeTabIndex, { selectedTaxRate: rate, taxResult: result });
      }
    }
  };

  // Delete current tab's record
  const handleDelete = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    const deletedTab = tabs[activeTabIndex];
    const deletedId = deletedTab.id;
    const currentIndex = activeTabIndex;
    const currentLength = tabs.length;

    deleteBusinessIncomes([deletedId]);
    setShowDeleteConfirm(false);

    if (currentLength <= 1) {
      // Last record deleted, close popup
      onDeleted();
      return;
    }

    // Remove from initialRef
    initialRef.current = initialRef.current.filter((r) => r.id !== deletedId);
    setTabs(prev => prev.filter(t => t.id !== deletedId));
    setActiveTabIndex(Math.min(currentIndex, currentLength - 2));
    setToast("사업소득 삭제를 완료했습니다.");
    onRefresh?.();
  };

  // Validate current tab only
  const validateCurrentTab = (): boolean => {
    const tab = tabs[activeTabIndex];
    const newErrors: Record<string, string> = {};

    if (!tab.attrYear) newErrors.attrYear = "필수 입력 항목입니다.";
    if (!tab.attrMonth) newErrors.attrMonth = "필수 입력 항목입니다.";
    if (!tab.name.trim()) newErrors.name = "필수 입력 항목입니다.";
    if (!tab.idNumber) newErrors.idNumber = "필수 입력 항목입니다.";
    if (!tab.industryCode) newErrors.industryCode = "필수 입력 항목입니다.";
    if (!tab.paymentAmountRaw) newErrors.paymentAmount = "필수 입력 항목입니다.";

    if (tab.idNumber) {
      const lenErr = validateIdNumberLength(tab.idNumber);
      if (lenErr) newErrors.idNumber = lenErr;
      else {
        const chkErr = validateIdNumberCheckDigit(tab.idNumber);
        if (chkErr) newErrors.idNumber = chkErr;
      }
    }

    if (tab.industryCode && tab.idNumber) {
      const hospErr = validateHospitalIdNumber(tab.industryCode, tab.idNumber);
      if (hospErr) newErrors.industryCode = hospErr;
    }

    if (tab.attrYear && tab.attrMonth) {
      const dateErr = validateAttributionDate(
        Number(tab.attrYear),
        Number(tab.attrMonth),
        tab.paymentYear,
        tab.paymentMonth
      );
      if (dateErr) newErrors.attrDate = dateErr;
    }

    // Duplicate check (excluding self)
    const all = getBusinessIncomes();
    const dup = all.some(
      (item) =>
        item.id !== tab.id &&
        item.paymentYear === tab.paymentYear &&
        item.paymentMonth === tab.paymentMonth &&
        item.attributionYear === Number(tab.attrYear) &&
        item.attributionMonth === Number(tab.attrMonth) &&
        item.idNumber === tab.idNumber &&
        item.industryCode === tab.industryCode
    );
    if (dup) {
      newErrors.duplicate = "지급연월, 귀속연월, 주민(사업자)등록번호, 업종코드가 동일한 사업소득이 존재합니다.";
    }

    setTabs((prev) =>
      prev.map((t, i) => (i === activeTabIndex ? { ...t, errors: newErrors } : t))
    );

    return Object.keys(newErrors).length === 0;
  };

  // Validate all tabs
  const validateAllTabs = (): number | null => {
    let firstErrorTab: number | null = null;

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i];
      const newErrors: Record<string, string> = {};

      if (!tab.attrYear) newErrors.attrYear = "필수 입력 항목입니다.";
      if (!tab.attrMonth) newErrors.attrMonth = "필수 입력 항목입니다.";
      if (!tab.name.trim()) newErrors.name = "필수 입력 항목입니다.";
      if (!tab.idNumber) newErrors.idNumber = "필수 입력 항목입니다.";
      if (!tab.industryCode) newErrors.industryCode = "필수 입력 항목입니다.";
      if (!tab.paymentAmountRaw) newErrors.paymentAmount = "필수 입력 항목입니다.";

      if (tab.idNumber) {
        const lenErr = validateIdNumberLength(tab.idNumber);
        if (lenErr) newErrors.idNumber = lenErr;
        else {
          const chkErr = validateIdNumberCheckDigit(tab.idNumber);
          if (chkErr) newErrors.idNumber = chkErr;
        }
      }

      if (tab.industryCode && tab.idNumber) {
        const hospErr = validateHospitalIdNumber(tab.industryCode, tab.idNumber);
        if (hospErr) newErrors.industryCode = hospErr;
      }

      if (tab.attrYear && tab.attrMonth) {
        const dateErr = validateAttributionDate(
          Number(tab.attrYear),
          Number(tab.attrMonth),
          tab.paymentYear,
          tab.paymentMonth
        );
        if (dateErr) newErrors.attrDate = dateErr;
      }

      // Duplicate check (excluding self)
      const all = getBusinessIncomes();
      const dup = all.some(
        (item) =>
          item.id !== tab.id &&
          item.paymentYear === tab.paymentYear &&
          item.paymentMonth === tab.paymentMonth &&
          item.attributionYear === Number(tab.attrYear) &&
          item.attributionMonth === Number(tab.attrMonth) &&
          item.idNumber === tab.idNumber &&
          item.industryCode === tab.industryCode
      );
      if (dup) {
        newErrors.duplicate = "지급연월, 귀속연월, 주민(사업자)등록번호, 업종코드가 동일한 사업소득이 존재합니다.";
      }

      if (Object.keys(newErrors).length > 0) {
        setTabs((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, errors: newErrors } : t))
        );
        if (firstErrorTab === null) firstErrorTab = i;
      } else {
        setTabs((prev) =>
          prev.map((t, idx) => (idx === i ? { ...t, errors: {} } : t))
        );
      }
    }

    return firstErrorTab;
  };

  const doSaveCurrent = () => {
    const tab = tabs[activeTabIndex];
    const amount = parseInt(tab.paymentAmountRaw, 10);
    const taxRate = determineTaxRate(tab.industryCode, tab.isForeign, tab.selectedTaxRate);
    const tax = calculateTax(amount, taxRate);

    const result = updateBusinessIncome(tab.id, {
      attributionYear: Number(tab.attrYear),
      attributionMonth: Number(tab.attrMonth),
      name: tab.name.trim(),
      isForeign: tab.isForeign,
      idNumber: tab.idNumber,
      industryCode: tab.industryCode,
      paymentAmount: amount,
      taxRate: tax.taxRate,
      incomeTax: tax.incomeTax,
      localTax: tax.localTax,
      netPayment: tax.netPayment,
    });

    if (!result.success) {
      alert(result.error || "저장 중 오류가 발생했습니다.");
      return false;
    }

    // Update initialRef to reflect saved state
    initialRef.current = initialRef.current.map((init) =>
      init.id === tab.id
        ? {
            id: tab.id,
            attrYear: tab.attrYear,
            attrMonth: tab.attrMonth,
            name: tab.name,
            isForeign: tab.isForeign,
            idNumber: tab.idNumber,
            industryCode: tab.industryCode,
            paymentAmountRaw: tab.paymentAmountRaw,
          }
        : init
    );

    return true;
  };

  const handleSubmit = () => {
    // Validate current tab only
    const isValid = validateCurrentTab();
    if (!isValid) {
      return;
    }

    // Check exception industry - only show confirm for single mode
    const tab = tabs[activeTabIndex];
    const hasException =
      isExceptionIndustry(tab.industryCode) && Number(tab.attrYear) !== tab.paymentYear;

    if (hasException && !isMulti) {
      // Single mode: show confirm
      setShowExceptionConfirm(true);
      return;
    }

    // Multi mode or no exception: save current tab directly
    const saved = doSaveCurrent();
    if (saved) {
      onSaved();
    }
  };

  const doSaveAll = () => {
    for (const tab of tabs) {
      const amount = parseInt(tab.paymentAmountRaw, 10);
      const taxRate = determineTaxRate(tab.industryCode, tab.isForeign, tab.selectedTaxRate);
      const tax = calculateTax(amount, taxRate);

      const result = updateBusinessIncome(tab.id, {
        attributionYear: Number(tab.attrYear),
        attributionMonth: Number(tab.attrMonth),
        name: tab.name.trim(),
        isForeign: tab.isForeign,
        idNumber: tab.idNumber,
        industryCode: tab.industryCode,
        paymentAmount: amount,
        taxRate: tax.taxRate,
        incomeTax: tax.incomeTax,
        localTax: tax.localTax,
        netPayment: tax.netPayment,
      });

      if (!result.success) {
        alert(result.error || "저장 중 오류가 발생했습니다.");
        return;
      }
    }

    onSaved();
  };

  const handleTabClick = (targetIndex: number) => {
    if (targetIndex === activeTabIndex) return;

    const currentTab = tabs[activeTabIndex];
    const hasErrors = Object.keys(currentTab.errors).length > 0;

    if (hasErrors) {
      // Focus first error field
      focusFirstError();
      return;
    }

    const dirty = isCurrentTabDirty();
    if (dirty) {
      // Show confirm
      setTargetTabIndex(targetIndex);
      setShowTabSwitchConfirm(true);
      return;
    }

    // No errors and not dirty, switch tab directly
    setActiveTabIndex(targetIndex);
  };

  const confirmTabSwitch = () => {
    if (targetTabIndex === null) return;

    // Save current tab
    const saved = doSaveCurrent();
    if (saved) {
      setShowTabSwitchConfirm(false);
      setActiveTabIndex(targetTabIndex);
      setTargetTabIndex(null);
      onRefresh?.();
    }
  };

  const cancelTabSwitch = () => {
    if (targetTabIndex === null) return;

    // Restore current tab to original state
    restoreCurrentTab();
    setShowTabSwitchConfirm(false);
    setActiveTabIndex(targetTabIndex);
    setTargetTabIndex(null);
  };

  const currentYear = new Date().getFullYear();
  const yearOptions: number[] = [];
  for (let y = 2025; y <= currentYear; y++) yearOptions.push(y);

  const tab = tabs[activeTabIndex];
  if (!tab) return null;

  const showTaxRateRadio = needsTaxRateSelection(tab.industryCode, tab.isForeign);
  const displayTaxRate = tab.industryCode
    ? tab.industryCode === GRATUITY_CODE
      ? "5%"
      : showTaxRateRadio
      ? `${tab.selectedTaxRate}%`
      : "3%"
    : "-";

  const hasCurrentTabErrors = Object.keys(tab.errors).length > 0;

  // Delete confirm message differs by mode
  const deleteConfirmMessage = isMulti
    ? `${tab.paymentYear}년 ${tab.paymentMonth}월 지급 건을 삭제하시겠습니까?\n삭제한 정보는 복구할 수 없습니다.`
    : "사업소득을 삭제하시겠습니까? 삭제한 정보는 복구할 수 없습니다.";

  // Exception confirm message (single mode only)
  const exceptionConfirmMessage = `해당 데이터는 ${tab.attrYear}년 12월 사업소득에 표시됩니다.`;

  return (
    <>
      <div className="fixed inset-0 z-[80] flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" onClick={handleClose} />
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">사업소득 수정</h2>
            <button onClick={handleClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">
              &times;
            </button>
          </div>

          {/* Tabs - only shown in multi mode */}
          {isMulti && (
            <div className="flex border-b border-gray-200 px-6 pt-2 gap-1 overflow-x-auto">
              {tabs.map((t, i) => {
                const hasTabErrors = Object.keys(t.errors).length > 0;
                return (
                  <button
                    key={t.id}
                    onClick={() => handleTabClick(i)}
                    className={`px-4 py-2 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                      i === activeTabIndex
                        ? "border-blue-600 text-blue-600"
                        : hasTabErrors
                        ? "border-transparent text-red-500 hover:text-red-700"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    {t.paymentYear}.{String(t.paymentMonth).padStart(2, "0")} 지급
                    {hasTabErrors && <span className="ml-1 text-red-500">!</span>}
                  </button>
                );
              })}
            </div>
          )}

          <div className="px-6 py-4 space-y-4">
            {/* 귀속연도/월 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                귀속연도 / 귀속월 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  ref={attrYearRef}
                  value={tab.attrYear}
                  onChange={(e) => handleAttrYearChange(e.target.value)}
                  onBlur={handleAttrYearBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {yearOptions.map((y) => (
                    <option key={y} value={y}>{y}년</option>
                  ))}
                </select>
                <select
                  ref={attrMonthRef}
                  value={tab.attrMonth}
                  onChange={(e) => handleAttrMonthChange(e.target.value)}
                  onBlur={handleAttrMonthBlur}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">선택</option>
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>{m}월</option>
                  ))}
                </select>
              </div>
              {tab.errors.attrYear && <p className="text-xs text-red-500 mt-1">{tab.errors.attrYear}</p>}
              {tab.errors.attrMonth && <p className="text-xs text-red-500 mt-1">{tab.errors.attrMonth}</p>}
              {tab.errors.attrDate && <p className="text-xs text-red-500 mt-1">{tab.errors.attrDate}</p>}
            </div>

            {/* 성명(상호) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                성명(상호) <span className="text-red-500">*</span>
              </label>
              <input
                ref={nameRef}
                type="text"
                value={tab.name}
                onChange={(e) => handleNameChange(e.target.value)}
                onBlur={handleNameBlur}
                placeholder="성명 또는 상호 입력"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tab.errors.name && <p className="text-xs text-red-500 mt-1">{tab.errors.name}</p>}
            </div>

            {/* 내외국인 구분 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                내외국인 구분 <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={tab.isForeign === "N"}
                    onChange={() => handleIsForeignChange("N")}
                    className="text-blue-600"
                  />
                  내국인
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={tab.isForeign === "Y"}
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
                ref={idNumberRef}
                type="text"
                value={tab.idNumber}
                onChange={(e) => handleIdNumberChange(e.target.value)}
                onBlur={handleIdNumberBlur}
                placeholder="숫자만 입력 (10자리 또는 13자리)"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tab.errors.idNumber && <p className="text-xs text-red-500 mt-1">{tab.errors.idNumber}</p>}
            </div>

            {/* 업종코드 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                업종코드 <span className="text-red-500">*</span>
              </label>
              <select
                ref={industryCodeRef}
                value={tab.industryCode}
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
              {tab.errors.industryCode && <p className="text-xs text-red-500 mt-1">{tab.errors.industryCode}</p>}
            </div>

            {/* 지급액 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                지급액 <span className="text-red-500">*</span>
              </label>
              <input
                ref={paymentAmountRef}
                type="text"
                value={displayAmountInput(tab.paymentAmountRaw)}
                onChange={(e) => handlePaymentAmountChange(e.target.value)}
                onBlur={handlePaymentAmountBlur}
                placeholder="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {tab.errors.paymentAmount && <p className="text-xs text-red-500 mt-1">{tab.errors.paymentAmount}</p>}
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
                        checked={tab.selectedTaxRate === 3}
                        onChange={() => handleTaxRateChange(3)}
                        className="text-blue-600"
                      />
                      3%
                    </label>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="radio"
                        checked={tab.selectedTaxRate === 20}
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
                  {formatAmount(tab.taxResult.incomeTax)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">지방소득세</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatAmount(tab.taxResult.localTax)}
                </span>
              </div>

              <div className="flex items-center justify-between border-t border-gray-200 pt-2">
                <span className="text-sm font-medium text-gray-700">실지급액</span>
                <span className="text-sm font-bold text-gray-900">
                  {formatAmount(tab.taxResult.netPayment)}
                </span>
              </div>
            </div>

            {/* 중복 에러 */}
            {tab.errors.duplicate && (
              <p className="text-xs text-red-500 bg-red-50 p-2 rounded">{tab.errors.duplicate}</p>
            )}

            {/* 안내 문구 */}
            <div className="text-xs text-gray-500 space-y-1 bg-blue-50 p-3 rounded-lg">
              <p>※ 지급총액 입력 시 업종코드에 따라 세율이 자동 적용되어 소득세, 지방소득세가 계산됩니다.</p>
              <p>※ 소액부징수(소득세액이 1천원 미만)인 경우, 소득세가 면제됩니다.</p>
              <p>※ 직업운동가(940904) 중 프로스포츠 구단과의 계약기간이 3년 이하인 외국인 직업 운동가일 경우, 세율 20%</p>
              <p>※ 봉사료 수취자(940905) 중 「소득세법 시행령」제184조의2에 해당하는 봉사료 수입금액의 경우, 세율 5%</p>
            </div>
          </div>

          <div className="flex justify-between px-6 py-4 border-t border-gray-200">
            <button
              onClick={handleDelete}
              className="px-4 py-2 text-sm text-red-600 bg-red-50 rounded-md hover:bg-red-100"
            >
              {isMulti ? "이 건 삭제" : "삭제"}
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
                disabled={hasCurrentTabErrors}
                className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                수정
              </button>
            </div>
          </div>
        </div>
      </div>

      {showCloseConfirm && (
        <ConfirmDialog
          message="사업소득 수정을 취소하시겠습니까?"
          onConfirm={onClose}
          onCancel={() => setShowCloseConfirm(false)}
        />
      )}

      {showDeleteConfirm && (
        <ConfirmDialog
          message={deleteConfirmMessage}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showExceptionConfirm && (
        <ConfirmDialog
          message={exceptionConfirmMessage}
          onConfirm={() => {
            setShowExceptionConfirm(false);
            const saved = doSaveCurrent();
            if (saved) {
              onSaved();
            }
          }}
          onCancel={() => setShowExceptionConfirm(false)}
        />
      )}

      {showTabSwitchConfirm && (
        <ConfirmDialog
          message="수정한 내용을 저장하시겠습니까?"
          onConfirm={confirmTabSwitch}
          onCancel={cancelTabSwitch}
        />
      )}

      {toast && <Toast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

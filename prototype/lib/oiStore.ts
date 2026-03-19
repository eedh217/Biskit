import { OtherIncome, OIMonthlySummary } from "@/types/sps";
import { calculateOITax } from "./oiTaxCalculation";

const OI_KEY = "sps_other_incomes";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── 시드 데이터 ─────────────────────────────────────

const defaultData: OtherIncome[] = [
  // 2026년 1월 - 자문/고문
  {
    id: "oi01",
    name: "김자문",
    isForeign: "N",
    idNumber: "7501011234567",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 1,
    paymentYear: 2026,
    paymentMonth: 1,
    paymentCount: 3,
    paymentAmount: 5000000,
    necessaryExpense: 3000000,
    incomeAmount: 2000000,
    incomeTax: 400000,
    localTax: 40000,
    netIncome: 1560000,
    reportFileDate: null,
    createdAt: "2026-01-15T09:00:00",
  },
  // 2026년 1월 - 자문/고문 외 인적용역
  {
    id: "oi02",
    name: "이용역",
    isForeign: "N",
    idNumber: "8001011234567",
    incomeType: "자문/고문 외 인적용역",
    attributionYear: 2026,
    attributionMonth: 1,
    paymentYear: 2026,
    paymentMonth: 1,
    paymentCount: 1,
    paymentAmount: 2000000,
    necessaryExpense: 1200000,
    incomeAmount: 800000,
    incomeTax: 160000,
    localTax: 16000,
    netIncome: 624000,
    reportFileDate: null,
    createdAt: "2026-01-16T10:00:00",
  },
  // 2026년 1월 - 소액부징수 케이스 (소득세 < 1000원)
  {
    id: "oi03",
    name: "박소액",
    isForeign: "N",
    idNumber: "9001011234567",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 1,
    paymentYear: 2026,
    paymentMonth: 1,
    paymentCount: 1,
    paymentAmount: 10000,
    necessaryExpense: 6000,
    incomeAmount: 4000,
    incomeTax: 0,
    localTax: 0,
    netIncome: 4000,
    reportFileDate: null,
    createdAt: "2026-01-17T11:00:00",
  },
  // 2026년 2월
  {
    id: "oi04",
    name: "정고문",
    isForeign: "N",
    idNumber: "8501011234567",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 2,
    paymentYear: 2026,
    paymentMonth: 2,
    paymentCount: 2,
    paymentAmount: 3000000,
    necessaryExpense: 1800000,
    incomeAmount: 1200000,
    incomeTax: 240000,
    localTax: 24000,
    netIncome: 936000,
    reportFileDate: null,
    createdAt: "2026-02-10T09:00:00",
  },
  // 2026년 2월 - 외국인
  {
    id: "oi05",
    name: "John Smith",
    isForeign: "Y",
    idNumber: "8801015234567",
    incomeType: "자문/고문 외 인적용역",
    attributionYear: 2026,
    attributionMonth: 2,
    paymentYear: 2026,
    paymentMonth: 2,
    paymentCount: 1,
    paymentAmount: 10000000,
    necessaryExpense: 6000000,
    incomeAmount: 4000000,
    incomeTax: 800000,
    localTax: 80000,
    netIncome: 3120000,
    reportFileDate: null,
    createdAt: "2026-02-12T14:00:00",
  },
  // 2026년 3월
  {
    id: "oi06",
    name: "최전문",
    isForeign: "N",
    idNumber: "7801011234567",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 3,
    paymentYear: 2026,
    paymentMonth: 3,
    paymentCount: 5,
    paymentAmount: 8000000,
    necessaryExpense: 5000000,
    incomeAmount: 3000000,
    incomeTax: 600000,
    localTax: 60000,
    netIncome: 2340000,
    reportFileDate: null,
    createdAt: "2026-03-01T09:00:00",
  },
  // 2026년 3월 - 사업자번호 (10자리)
  {
    id: "oi07",
    name: "컨설팅법인",
    isForeign: "N",
    idNumber: "1234567890",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 3,
    paymentYear: 2026,
    paymentMonth: 3,
    paymentCount: 1,
    paymentAmount: 15000000,
    necessaryExpense: 9000000,
    incomeAmount: 6000000,
    incomeTax: 1200000,
    localTax: 120000,
    netIncome: 4680000,
    reportFileDate: null,
    createdAt: "2026-03-05T10:00:00",
  },
  // 2025년 12월 데이터
  {
    id: "oi08",
    name: "김연말",
    isForeign: "N",
    idNumber: "8301011234567",
    incomeType: "자문/고문 외 인적용역",
    attributionYear: 2025,
    attributionMonth: 12,
    paymentYear: 2025,
    paymentMonth: 12,
    paymentCount: 2,
    paymentAmount: 4000000,
    necessaryExpense: 2400000,
    incomeAmount: 1600000,
    incomeTax: 320000,
    localTax: 32000,
    netIncome: 1248000,
    reportFileDate: null,
    createdAt: "2025-12-20T09:00:00",
  },
  // 2026년 1월 - 추가 데이터
  {
    id: "oi09",
    name: "강컨설",
    isForeign: "N",
    idNumber: "9101011234567",
    incomeType: "자문/고문",
    attributionYear: 2026,
    attributionMonth: 1,
    paymentYear: 2026,
    paymentMonth: 1,
    paymentCount: 4,
    paymentAmount: 6000000,
    necessaryExpense: 3600000,
    incomeAmount: 2400000,
    incomeTax: 480000,
    localTax: 48000,
    netIncome: 1872000,
    reportFileDate: null,
    createdAt: "2026-01-20T09:00:00",
  },
  // 2026년 4월
  {
    id: "oi10",
    name: "윤전문가",
    isForeign: "N",
    idNumber: "8601011234567",
    incomeType: "자문/고문 외 인적용역",
    attributionYear: 2026,
    attributionMonth: 4,
    paymentYear: 2026,
    paymentMonth: 4,
    paymentCount: 1,
    paymentAmount: 7000000,
    necessaryExpense: 4200000,
    incomeAmount: 2800000,
    incomeTax: 560000,
    localTax: 56000,
    netIncome: 2184000,
    reportFileDate: null,
    createdAt: "2026-04-10T09:00:00",
  },
];

// ─── CRUD ─────────────────────────────────────

function getAll(): OtherIncome[] {
  if (typeof window === "undefined") return defaultData;
  const raw = localStorage.getItem(OI_KEY);
  if (!raw) {
    localStorage.setItem(OI_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(raw);
}

function saveAll(data: OtherIncome[]) {
  localStorage.setItem(OI_KEY, JSON.stringify(data));
}

export function getOtherIncomes(): OtherIncome[] {
  return getAll();
}

export function getOtherIncomeById(id: string): OtherIncome | undefined {
  return getAll().find((item) => item.id === id);
}

export function addOtherIncome(
  data: Omit<OtherIncome, "id" | "createdAt" | "reportFileDate" | "incomeAmount" | "incomeTax" | "localTax" | "netIncome">
): { success: boolean; error?: string } {
  const list = getAll();

  // 중복 검사
  const dup = list.some(
    (item) =>
      item.paymentYear === data.paymentYear &&
      item.paymentMonth === data.paymentMonth &&
      item.attributionYear === data.attributionYear &&
      item.attributionMonth === data.attributionMonth &&
      item.idNumber === data.idNumber &&
      item.incomeType === data.incomeType
  );
  if (dup) {
    return {
      success: false,
      error: "지급연월, 귀속연월, 주민(사업자)등록번호, 소득구분이 동일한 기타소득이 존재합니다.",
    };
  }

  // 세금 계산
  const taxResult = calculateOITax(data.paymentAmount, data.necessaryExpense);

  const item: OtherIncome = {
    ...data,
    ...taxResult,
    id: generateId(),
    reportFileDate: null,
    createdAt: new Date().toISOString(),
  };
  saveAll([item, ...list]);
  return { success: true };
}

export function updateOtherIncome(
  id: string,
  data: Partial<Omit<OtherIncome, "id" | "createdAt" | "reportFileDate" | "incomeAmount" | "incomeTax" | "localTax" | "netIncome">>
): { success: boolean; error?: string } {
  const list = getAll();
  const target = list.find((item) => item.id === id);
  if (!target) return { success: false, error: "데이터를 찾을 수 없습니다." };

  const merged = { ...target, ...data };

  // 중복 검사
  const dup = list.some(
    (item) =>
      item.id !== id &&
      item.paymentYear === merged.paymentYear &&
      item.paymentMonth === merged.paymentMonth &&
      item.attributionYear === merged.attributionYear &&
      item.attributionMonth === merged.attributionMonth &&
      item.idNumber === merged.idNumber &&
      item.incomeType === merged.incomeType
  );
  if (dup) {
    return {
      success: false,
      error: "지급연월, 귀속연월, 주민(사업자)등록번호, 소득구분이 동일한 기타소득이 존재합니다.",
    };
  }

  // 세금 재계산
  const taxResult = calculateOITax(merged.paymentAmount, merged.necessaryExpense);

  const updated = list.map((item) =>
    item.id === id ? { ...merged, ...taxResult } : item
  );
  saveAll(updated);
  return { success: true };
}

export function deleteOtherIncomes(ids: string[]): { success: boolean; deletedCount: number } {
  const list = getAll();
  const remaining = list.filter((item) => !ids.includes(item.id));
  saveAll(remaining);
  return { success: true, deletedCount: list.length - remaining.length };
}

// ─── 월별 조회 및 합산 ─────────────────────────────────────

/**
 * 지급연월 기준 데이터 조회 (월별 리스트 화면용)
 * 기타소득은 예외 규칙 없음 - 단순 지급연월 기준
 */
export function getOtherIncomesForMonthlyList(
  year: number,
  month: number
): OtherIncome[] {
  const all = getAll();
  return all.filter(
    (item) => item.paymentYear === year && item.paymentMonth === month
  );
}

/**
 * 연간 월별 합산 데이터 생성
 */
export function getOIYearlySummary(year: number): OIMonthlySummary[] {
  const summaries: OIMonthlySummary[] = [];

  for (let month = 1; month <= 12; month++) {
    const items = getOtherIncomesForMonthlyList(year, month);
    summaries.push({
      month,
      count: items.length,
      totalPaymentAmount: items.reduce((sum, i) => sum + i.paymentAmount, 0),
      totalNecessaryExpense: items.reduce((sum, i) => sum + i.necessaryExpense, 0),
      totalIncomeAmount: items.reduce((sum, i) => sum + i.incomeAmount, 0),
      totalIncomeTax: items.reduce((sum, i) => sum + i.incomeTax, 0),
      totalLocalTax: items.reduce((sum, i) => sum + i.localTax, 0),
      totalNetIncome: items.reduce((sum, i) => sum + i.netIncome, 0),
      reportFileDate: null,
    });
  }

  return summaries;
}

/**
 * 전체 삭제 (특정 지급연월의 모든 데이터)
 */
export function deleteAllForMonth(year: number, month: number): { success: boolean; deletedCount: number } {
  const monthItems = getOtherIncomesForMonthlyList(year, month);
  const idsToDelete = new Set(monthItems.map((item) => item.id));
  const all = getAll();
  const remaining = all.filter((item) => !idsToDelete.has(item.id));
  saveAll(remaining);
  return { success: true, deletedCount: idsToDelete.size };
}

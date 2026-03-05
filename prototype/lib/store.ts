import { BusinessIncome, MonthlySummary, AggregatedRow } from "@/types/sps";
import { isExceptionIndustry } from "./industryCodes";
import { determineTaxRate, calculateTax } from "./taxCalculation";

const SPS_KEY = "sps_business_incomes";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── 시드 데이터 ─────────────────────────────────────

const defaultData: BusinessIncome[] = [
  // 2026년 1월 - 일반 데이터
  {
    id: "bi01", name: "김철수", isForeign: "N", idNumber: "9001011234567",
    industryCode: "940903", attributionYear: 2026, attributionMonth: 1,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 3000000,
    taxRate: 0.03, incomeTax: 90000, localTax: 9000, netPayment: 2901000,
    reportFileDate: null, createdAt: "2026-01-15T09:00:00",
  },
  {
    id: "bi02", name: "이영희", isForeign: "N", idNumber: "9503152345678",
    industryCode: "940926", attributionYear: 2026, attributionMonth: 1,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 5000000,
    taxRate: 0.03, incomeTax: 150000, localTax: 15000, netPayment: 4835000,
    reportFileDate: null, createdAt: "2026-01-15T09:01:00",
  },
  // 2026년 1월 - 소액부징수 케이스
  {
    id: "bi03", name: "박민수", isForeign: "N", idNumber: "8807201567890",
    industryCode: "940913", attributionYear: 2026, attributionMonth: 1,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 30000,
    taxRate: 0.03, incomeTax: 0, localTax: 0, netPayment: 30000,
    reportFileDate: null, createdAt: "2026-01-16T10:00:00",
  },
  // 2026년 2월
  {
    id: "bi04", name: "정수진", isForeign: "N", idNumber: "9208152678901",
    industryCode: "940600", attributionYear: 2026, attributionMonth: 2,
    paymentYear: 2026, paymentMonth: 2, paymentAmount: 2000000,
    taxRate: 0.03, incomeTax: 60000, localTax: 6000, netPayment: 1934000,
    reportFileDate: null, createdAt: "2026-02-10T09:00:00",
  },
  {
    id: "bi05", name: "최동현", isForeign: "N", idNumber: "8512101234567",
    industryCode: "940903", attributionYear: 2026, attributionMonth: 2,
    paymentYear: 2026, paymentMonth: 2, paymentAmount: 1500000,
    taxRate: 0.03, incomeTax: 45000, localTax: 4500, netPayment: 1450500,
    reportFileDate: null, createdAt: "2026-02-12T14:00:00",
  },
  // 2026년 3월
  {
    id: "bi06", name: "한지민", isForeign: "N", idNumber: "9105051234567",
    industryCode: "940304", attributionYear: 2026, attributionMonth: 3,
    paymentYear: 2026, paymentMonth: 3, paymentAmount: 10000000,
    taxRate: 0.03, incomeTax: 300000, localTax: 30000, netPayment: 9670000,
    reportFileDate: null, createdAt: "2026-03-01T09:00:00",
  },
  // 봉사료 5% 케이스
  {
    id: "bi07", name: "강호텔", isForeign: "N", idNumber: "7801011234567",
    industryCode: "940905", attributionYear: 2026, attributionMonth: 3,
    paymentYear: 2026, paymentMonth: 3, paymentAmount: 800000,
    taxRate: 0.05, incomeTax: 40000, localTax: 4000, netPayment: 756000,
    reportFileDate: null, createdAt: "2026-03-02T09:00:00",
  },
  // 외국인 직업운동가 20% 케이스
  {
    id: "bi08", name: "John Smith", isForeign: "Y", idNumber: "8505105123456",
    industryCode: "940904", attributionYear: 2026, attributionMonth: 3,
    paymentYear: 2026, paymentMonth: 3, paymentAmount: 50000000,
    taxRate: 0.20, incomeTax: 10000000, localTax: 1000000, netPayment: 39000000,
    reportFileDate: null, createdAt: "2026-03-03T11:00:00",
  },
  // 병의원 사업자번호 10자리
  {
    id: "bi09", name: "서울의원", isForeign: "N", idNumber: "1234567890",
    industryCode: "851101", attributionYear: 2026, attributionMonth: 2,
    paymentYear: 2026, paymentMonth: 2, paymentAmount: 4000000,
    taxRate: 0.03, incomeTax: 120000, localTax: 12000, netPayment: 3868000,
    reportFileDate: null, createdAt: "2026-02-20T09:00:00",
  },
  // 예외 업종 - 보험설계사 (귀속2025, 지급2026) → 2025년 12월에 표시
  {
    id: "bi10", name: "보험김", isForeign: "N", idNumber: "8001011234567",
    industryCode: "940906", attributionYear: 2025, attributionMonth: 8,
    paymentYear: 2026, paymentMonth: 2, paymentAmount: 1200000,
    taxRate: 0.03, incomeTax: 36000, localTax: 3600, netPayment: 1160400,
    reportFileDate: null, createdAt: "2026-02-05T09:00:00",
  },
  // 예외 업종 - 음료배달 (귀속2025, 지급2026) → 2025년 12월에 표시
  {
    id: "bi11", name: "음료배달이", isForeign: "N", idNumber: "7501011234567",
    industryCode: "940907", attributionYear: 2025, attributionMonth: 5,
    paymentYear: 2026, paymentMonth: 3, paymentAmount: 800000,
    taxRate: 0.03, incomeTax: 24000, localTax: 2400, netPayment: 773600,
    reportFileDate: null, createdAt: "2026-03-01T10:00:00",
  },
  // 예외 업종 - 보험설계사 (귀속2025, 지급2025 동일) → 2025년 지급월에 표시 (예외 미적용)
  {
    id: "bi12", name: "보험박", isForeign: "N", idNumber: "8201011234567",
    industryCode: "940906", attributionYear: 2025, attributionMonth: 6,
    paymentYear: 2025, paymentMonth: 6, paymentAmount: 900000,
    taxRate: 0.03, incomeTax: 27000, localTax: 2700, netPayment: 870300,
    reportFileDate: null, createdAt: "2025-06-10T09:00:00",
  },
  // 2026년 1월 - 추가 데이터
  {
    id: "bi13", name: "노프리", isForeign: "N", idNumber: "9301011234567",
    industryCode: "940926", attributionYear: 2026, attributionMonth: 1,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 7000000,
    taxRate: 0.03, incomeTax: 210000, localTax: 21000, netPayment: 6769000,
    reportFileDate: null, createdAt: "2026-01-20T09:00:00",
  },
  // 외국인 일반 3% 케이스
  {
    id: "bi14", name: "Wang Li", isForeign: "Y", idNumber: "9001015234567",
    industryCode: "940903", attributionYear: 2026, attributionMonth: 1,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 2500000,
    taxRate: 0.03, incomeTax: 75000, localTax: 7500, netPayment: 2417500,
    reportFileDate: null, createdAt: "2026-01-22T09:00:00",
  },
  // 예외 업종 - 방문판매원 (귀속2025, 지급2026) → 2025년 12월에 표시
  {
    id: "bi15", name: "방문판매최", isForeign: "N", idNumber: "8301011234567",
    industryCode: "940908", attributionYear: 2025, attributionMonth: 10,
    paymentYear: 2026, paymentMonth: 1, paymentAmount: 600000,
    taxRate: 0.03, incomeTax: 18000, localTax: 1800, netPayment: 580200,
    reportFileDate: null, createdAt: "2026-01-05T09:00:00",
  },
  // 2025년 12월 일반 데이터 (예외와 함께 12월에 표시)
  {
    id: "bi16", name: "김연말", isForeign: "N", idNumber: "8801011234567",
    industryCode: "940903", attributionYear: 2025, attributionMonth: 12,
    paymentYear: 2025, paymentMonth: 12, paymentAmount: 2000000,
    taxRate: 0.03, incomeTax: 60000, localTax: 6000, netPayment: 1934000,
    reportFileDate: null, createdAt: "2025-12-20T09:00:00",
  },
  // 예외 업종 - 보험김 추가건 (bi10과 합산 대상: 귀속2025-08, 지급2026-03)
  {
    id: "bi17", name: "보험김", isForeign: "N", idNumber: "8001011234567",
    industryCode: "940906", attributionYear: 2025, attributionMonth: 8,
    paymentYear: 2026, paymentMonth: 3, paymentAmount: 800000,
    taxRate: 0.03, incomeTax: 24000, localTax: 2400, netPayment: 773600,
    reportFileDate: null, createdAt: "2026-03-01T09:00:00",
  },
  // 예외 업종 - 보험김 추가건 (bi10과 합산 대상: 귀속2025-08, 지급2026-04)
  {
    id: "bi18", name: "보험김", isForeign: "N", idNumber: "8001011234567",
    industryCode: "940906", attributionYear: 2025, attributionMonth: 8,
    paymentYear: 2026, paymentMonth: 4, paymentAmount: 500000,
    taxRate: 0.03, incomeTax: 15000, localTax: 1500, netPayment: 483500,
    reportFileDate: null, createdAt: "2026-03-02T09:00:00",
  },
  // 예외 업종 - 방문판매최 추가건 (bi15와 합산 대상: 귀속2025-10, 지급2026-02)
  {
    id: "bi19", name: "방문판매최", isForeign: "N", idNumber: "8301011234567",
    industryCode: "940908", attributionYear: 2025, attributionMonth: 10,
    paymentYear: 2026, paymentMonth: 2, paymentAmount: 400000,
    taxRate: 0.03, incomeTax: 12000, localTax: 1200, netPayment: 386800,
    reportFileDate: null, createdAt: "2026-02-10T09:00:00",
  },
  // 예외 업종 - 보험김 12월 지급건 (bi10/bi17/bi18과 합산 대상: 귀속2025-08, 지급2025-12)
  {
    id: "bi20", name: "보험김", isForeign: "N", idNumber: "8001011234567",
    industryCode: "940906", attributionYear: 2025, attributionMonth: 8,
    paymentYear: 2025, paymentMonth: 12, paymentAmount: 300000,
    taxRate: 0.03, incomeTax: 9000, localTax: 900, netPayment: 290100,
    reportFileDate: null, createdAt: "2025-12-15T09:00:00",
  },
];

// ─── CRUD ─────────────────────────────────────

function getAll(): BusinessIncome[] {
  if (typeof window === "undefined") return defaultData;
  const raw = localStorage.getItem(SPS_KEY);
  if (!raw) {
    localStorage.setItem(SPS_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(raw);
}

function saveAll(data: BusinessIncome[]) {
  localStorage.setItem(SPS_KEY, JSON.stringify(data));
}

export function getBusinessIncomes(): BusinessIncome[] {
  return getAll();
}

export function getBusinessIncomeById(id: string): BusinessIncome | undefined {
  return getAll().find((item) => item.id === id);
}

export function addBusinessIncome(
  data: Omit<BusinessIncome, "id" | "createdAt" | "reportFileDate">
): { success: boolean; error?: string } {
  const list = getAll();
  const dup = list.some(
    (item) =>
      item.paymentYear === data.paymentYear &&
      item.paymentMonth === data.paymentMonth &&
      item.attributionYear === data.attributionYear &&
      item.attributionMonth === data.attributionMonth &&
      item.idNumber === data.idNumber &&
      item.industryCode === data.industryCode
  );
  if (dup) {
    return { success: false, error: "지급연월, 귀속연월, 주민(사업자)등록번호, 업종코드가 동일한 사업소득이 존재합니다." };
  }

  const item: BusinessIncome = {
    ...data,
    id: generateId(),
    reportFileDate: null,
    createdAt: new Date().toISOString(),
  };
  saveAll([item, ...list]);
  return { success: true };
}

export function updateBusinessIncome(
  id: string,
  data: Partial<Omit<BusinessIncome, "id" | "createdAt" | "reportFileDate">>
): { success: boolean; error?: string } {
  const list = getAll();
  const target = list.find((item) => item.id === id);
  if (!target) return { success: false, error: "데이터를 찾을 수 없습니다." };

  const merged = { ...target, ...data };

  const dup = list.some(
    (item) =>
      item.id !== id &&
      item.paymentYear === merged.paymentYear &&
      item.paymentMonth === merged.paymentMonth &&
      item.attributionYear === merged.attributionYear &&
      item.attributionMonth === merged.attributionMonth &&
      item.idNumber === merged.idNumber &&
      item.industryCode === merged.industryCode
  );
  if (dup) {
    return { success: false, error: "지급연월, 귀속연월, 주민(사업자)등록번호, 업종코드가 동일한 사업소득이 존재합니다." };
  }

  const updated = list.map((item) =>
    item.id === id ? { ...item, ...data } : item
  );
  saveAll(updated);
  return { success: true };
}

export function deleteBusinessIncomes(ids: string[]): { success: boolean; deletedCount: number } {
  const list = getAll();
  const remaining = list.filter((item) => !ids.includes(item.id));
  saveAll(remaining);
  return { success: true, deletedCount: list.length - remaining.length };
}

// ─── 귀속기준 예외 규칙을 적용한 조회 ─────────────────────

/**
 * 특정 연도/월에 표시할 데이터를 반환
 * 귀속기준 예외 규칙:
 * - 예외 업종(940906/907/908) + 귀속연도≠지급연도 → 귀속연도 12월에 표시
 * - 그 외 → 지급연월 기준
 */
export function getBusinessIncomesForSummaryMonth(
  year: number,
  month: number
): BusinessIncome[] {
  const all = getAll();

  return all.filter((item) => {
    if (isExceptionIndustry(item.industryCode) && item.attributionYear !== item.paymentYear) {
      // 예외: 귀속연도 12월에 표시
      return item.attributionYear === year && month === 12;
    }
    // 일반: 지급연월 기준
    return item.paymentYear === year && item.paymentMonth === month;
  });
}

/**
 * 연간 월별 합산 데이터 생성
 */
export function getYearlySummary(year: number): MonthlySummary[] {
  const summaries: MonthlySummary[] = [];

  for (let month = 1; month <= 12; month++) {
    const items = getBusinessIncomesForSummaryMonth(year, month);
    summaries.push({
      month,
      count: items.length,
      totalPayment: items.reduce((sum, i) => sum + i.paymentAmount, 0),
      totalIncomeTax: items.reduce((sum, i) => sum + i.incomeTax, 0),
      totalLocalTax: items.reduce((sum, i) => sum + i.localTax, 0),
      totalNetPayment: items.reduce((sum, i) => sum + i.netPayment, 0),
      reportFileDate: null,
    });
  }

  return summaries;
}

/**
 * 12월 예외 데이터 존재 여부 확인
 */
export function hasDecemberExceptionData(year: number): boolean {
  const all = getAll();
  return all.some(
    (item) =>
      isExceptionIndustry(item.industryCode) &&
      item.attributionYear === year &&
      item.attributionYear !== item.paymentYear
  );
}

/**
 * 12월 예외 데이터 분류: "YYYY년 지급" vs "YYYY년 이후 지급"
 */
export function getDecemberExceptionBreakdown(year: number): {
  sameYearPayment: MonthlySummary;
  afterYearPayment: MonthlySummary;
} {
  const all = getAll();

  // YYYY년 지급: 지급연월이 YYYY년 12월인 전체 데이터 (업종 무관)
  // 단, 예외 업종(940906/907/908)은 귀속연도 ≠ 지급연도인 경우 제외
  const sameYear = all.filter((item) => {
    if (item.paymentYear !== year || item.paymentMonth !== 12) return false;
    if (isExceptionIndustry(item.industryCode) && item.attributionYear !== item.paymentYear) return false;
    return true;
  });

  // YYYY년 이후 지급: 귀속연도 = year이고 지급연도 > year인 예외 업종 데이터
  const decItems = getBusinessIncomesForSummaryMonth(year, 12);
  const afterYear = decItems.filter(
    (item) => item.attributionYear === year && item.paymentYear > year
  );

  const aggregate = (items: BusinessIncome[]): MonthlySummary => ({
    month: 12,
    count: items.length,
    totalPayment: items.reduce((sum, i) => sum + i.paymentAmount, 0),
    totalIncomeTax: items.reduce((sum, i) => sum + i.incomeTax, 0),
    totalLocalTax: items.reduce((sum, i) => sum + i.localTax, 0),
    totalNetPayment: items.reduce((sum, i) => sum + i.netPayment, 0),
    reportFileDate: null,
  });

  return {
    sameYearPayment: aggregate(sameYear),
    afterYearPayment: aggregate(afterYear),
  };
}

/**
 * 지급연월 기준 데이터 조회 (월별 리스트 화면용)
 */
export function getBusinessIncomesForMonthlyList(
  year: number,
  month: number
): BusinessIncome[] {
  return getBusinessIncomesForSummaryMonth(year, month);
}

/**
 * 전체 삭제 (특정 지급연월의 모든 데이터)
 */
/**
 * 월별 리스트용 합산 행 생성
 * - 예외 업종: 귀속연월 + 주민등록번호 + 업종코드로 그룹핑, 금액 합산
 * - 비예외 업종: 개별 행 그대로
 */
export function aggregateForMonthlyList(items: BusinessIncome[]): AggregatedRow[] {
  const result: AggregatedRow[] = [];
  const exceptionGroups = new Map<string, BusinessIncome[]>();
  const pendingDecember: BusinessIncome[] = [];

  for (const item of items) {
    if (isExceptionIndustry(item.industryCode) && item.attributionYear !== item.paymentYear) {
      // 조건①: 예외업종 + 귀속연도≠지급연도 → exceptionGroups에 추가
      const key = `${item.attributionYear}-${item.attributionMonth}-${item.idNumber}-${item.industryCode}`;
      if (!exceptionGroups.has(key)) {
        exceptionGroups.set(key, []);
      }
      exceptionGroups.get(key)!.push(item);
    } else if (
      isExceptionIndustry(item.industryCode) &&
      item.attributionYear === item.paymentYear &&
      item.paymentMonth === 12
    ) {
      // 조건② 후보: 예외업종 + 귀속연도=지급연도 + 지급월12 → 임시 저장
      pendingDecember.push(item);
    } else {
      // 비예외: 개별 행
      result.push({
        groupKey: item.id,
        isAggregated: false,
        records: [item],
        attributionYear: item.attributionYear,
        attributionMonth: item.attributionMonth,
        name: item.name,
        idNumber: item.idNumber,
        industryCode: item.industryCode,
        paymentAmount: item.paymentAmount,
        incomeTax: item.incomeTax,
        localTax: item.localTax,
        netPayment: item.netPayment,
      });
    }
  }

  // 조건② 처리: pendingDecember 레코드를 기존 exceptionGroups에 합류 또는 개별 행 처리
  for (const item of pendingDecember) {
    const key = `${item.attributionYear}-${item.attributionMonth}-${item.idNumber}-${item.industryCode}`;
    if (exceptionGroups.has(key)) {
      // 동일 그룹이 존재하면 합류
      exceptionGroups.get(key)!.push(item);
    } else {
      // 동일 그룹이 없으면 개별 행
      result.push({
        groupKey: item.id,
        isAggregated: false,
        records: [item],
        attributionYear: item.attributionYear,
        attributionMonth: item.attributionMonth,
        name: item.name,
        idNumber: item.idNumber,
        industryCode: item.industryCode,
        paymentAmount: item.paymentAmount,
        incomeTax: item.incomeTax,
        localTax: item.localTax,
        netPayment: item.netPayment,
      });
    }
  }

  // 예외 그룹 처리
  for (const [key, records] of exceptionGroups) {
    const first = records[0];
    const isAggregated = records.length > 1;
    result.push({
      groupKey: key,
      isAggregated,
      records,
      attributionYear: first.attributionYear,
      attributionMonth: first.attributionMonth,
      name: first.name,
      idNumber: first.idNumber,
      industryCode: first.industryCode,
      paymentAmount: records.reduce((sum, r) => sum + r.paymentAmount, 0),
      incomeTax: records.reduce((sum, r) => sum + r.incomeTax, 0),
      localTax: records.reduce((sum, r) => sum + r.localTax, 0),
      netPayment: records.reduce((sum, r) => sum + r.netPayment, 0),
    });
  }

  return result;
}

/**
 * 전체 삭제 (특정 지급연월의 모든 데이터)
 */
export function deleteAllForMonth(year: number, month: number): { success: boolean; deletedCount: number } {
  const monthItems = getBusinessIncomesForSummaryMonth(year, month);
  const idsToDelete = new Set(monthItems.map((item) => item.id));
  const all = getAll();
  const remaining = all.filter((item) => !idsToDelete.has(item.id));
  saveAll(remaining);
  return { success: true, deletedCount: idsToDelete.size };
}

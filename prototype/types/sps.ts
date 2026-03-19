export interface BusinessIncome {
  id: string;
  name: string;
  isForeign: "N" | "Y";
  idNumber: string;
  industryCode: string;
  attributionYear: number;
  attributionMonth: number;
  paymentYear: number;
  paymentMonth: number;
  paymentAmount: number;
  taxRate: number;
  incomeTax: number;
  localTax: number;
  netPayment: number;
  reportFileDate: string | null;
  createdAt: string;
}

export interface MonthlySummary {
  month: number;
  count: number;
  totalPayment: number;
  totalIncomeTax: number;
  totalLocalTax: number;
  totalNetPayment: number;
  reportFileDate: string | null;
}

export type BusinessIncomeFormData = Omit<BusinessIncome, "id" | "createdAt" | "reportFileDate" | "incomeTax" | "localTax" | "netPayment" | "taxRate"> & {
  taxRate?: number;
};

export interface AggregatedRow {
  groupKey: string;
  isAggregated: boolean;
  records: BusinessIncome[];
  attributionYear: number;
  attributionMonth: number;
  name: string;
  idNumber: string;
  industryCode: string;
  paymentAmount: number;
  incomeTax: number;
  localTax: number;
  netPayment: number;
  reportFileDate: string | null;
}

// ============================================
// Other Income (기타소득) Types
// ============================================

export interface OtherIncome {
  id: string;
  name: string;
  isForeign: "N" | "Y";
  idNumber: string;
  incomeType: "자문/고문" | "자문/고문 외 인적용역";
  attributionYear: number;
  attributionMonth: number;
  paymentYear: number;
  paymentMonth: number;
  paymentCount: number;
  paymentAmount: number;
  necessaryExpense: number;
  incomeAmount: number;
  incomeTax: number;
  localTax: number;
  netIncome: number;
  reportFileDate: string | null;
  createdAt: string;
}

export interface OIMonthlySummary {
  month: number;
  count: number;
  totalPaymentAmount: number;
  totalNecessaryExpense: number;
  totalIncomeAmount: number;
  totalIncomeTax: number;
  totalLocalTax: number;
  totalNetIncome: number;
  reportFileDate: string | null;
}

export type OtherIncomeFormData = Omit<OtherIncome, "id" | "createdAt" | "reportFileDate" | "incomeAmount" | "incomeTax" | "localTax" | "netIncome">;

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
}

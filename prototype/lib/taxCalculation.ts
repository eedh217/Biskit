import { GRATUITY_CODE, ATHLETE_CODE } from "./industryCodes";

export function determineTaxRate(
  industryCode: string,
  isForeign: "N" | "Y",
  selectedRate?: number
): number {
  if (industryCode === GRATUITY_CODE) return 0.05;
  if (isForeign === "Y" && industryCode === ATHLETE_CODE && selectedRate !== undefined) {
    return selectedRate === 20 ? 0.20 : 0.03;
  }
  return 0.03;
}

export function needsTaxRateSelection(industryCode: string, isForeign: "N" | "Y"): boolean {
  return isForeign === "Y" && industryCode === ATHLETE_CODE;
}

export interface TaxResult {
  taxRate: number;
  incomeTax: number;
  localTax: number;
  netPayment: number;
}

export function calculateTax(paymentAmount: number, taxRate: number): TaxResult {
  let incomeTax = Math.floor(paymentAmount * taxRate);

  // 소액부징수: 소득세 < 1,000원이면 0원
  if (incomeTax < 1000) {
    incomeTax = 0;
  }

  // 지방소득세: 소득세가 0이면 0, 아니면 소득세 × 0.1 절사
  const localTax = incomeTax === 0 ? 0 : Math.floor(incomeTax * 0.1);

  const netPayment = paymentAmount - incomeTax - localTax;

  return { taxRate, incomeTax, localTax, netPayment };
}

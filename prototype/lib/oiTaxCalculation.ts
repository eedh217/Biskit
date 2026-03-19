/**
 * 기타소득 세금 계산 로직
 *
 * 핵심 규칙:
 * - 세율: 20% 고정
 * - 필요경비: 지급액의 60% 이상
 * - 소득금액 = 지급액 - 필요경비
 * - 소득세 = 소득금액 × 0.2 (절사)
 * - 소액부징수: 소득세 < 1,000원 → 0원
 * - 지방소득세 = 소득세 × 0.1 (절사)
 * - 실소득금액 = 소득금액 - 소득세 - 지방소득세
 */

export interface OITaxResult {
  incomeAmount: number;
  incomeTax: number;
  localTax: number;
  netIncome: number;
}

/**
 * 기타소득 세금 계산
 * @param paymentAmount 지급액
 * @param necessaryExpense 필요경비
 * @returns 계산 결과 (소득금액, 소득세, 지방소득세, 실소득금액)
 */
export function calculateOITax(
  paymentAmount: number,
  necessaryExpense: number
): OITaxResult {
  // 소득금액 = 지급액 - 필요경비
  const incomeAmount = paymentAmount - necessaryExpense;

  // 소득세 = 소득금액 × 0.2 (절사)
  let incomeTax = Math.floor(incomeAmount * 0.2);

  // 소액부징수: 소득세 < 1,000원이면 0원
  if (incomeTax < 1000) {
    incomeTax = 0;
  }

  // 지방소득세: 소득세가 0이면 0, 아니면 소득세 × 0.1 절사
  const localTax = incomeTax === 0 ? 0 : Math.floor(incomeTax * 0.1);

  // 실소득금액 = 소득금액 - 소득세 - 지방소득세
  const netIncome = incomeAmount - incomeTax - localTax;

  return {
    incomeAmount,
    incomeTax,
    localTax,
    netIncome,
  };
}

/**
 * 필요경비 60% 규칙 검증
 * @param paymentAmount 지급액
 * @param necessaryExpense 필요경비
 * @returns 검증 통과 여부
 */
export function validateNecessaryExpense(
  paymentAmount: number,
  necessaryExpense: number
): boolean {
  const minExpense = Math.floor(paymentAmount * 0.6);
  return necessaryExpense >= minExpense && necessaryExpense <= paymentAmount;
}

/**
 * 최소 필요경비 계산 (60%)
 * @param paymentAmount 지급액
 * @returns 최소 필요경비
 */
export function getMinNecessaryExpense(paymentAmount: number): number {
  return Math.floor(paymentAmount * 0.6);
}

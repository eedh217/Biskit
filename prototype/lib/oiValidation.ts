import { OtherIncome } from "@/types/sps";
import { validateNecessaryExpense } from "./oiTaxCalculation";

/**
 * 기타소득 검증 로직
 *
 * 핵심 차이점:
 * - 체크디지트 검증 제외 (자릿수만 확인)
 * - 필요경비 60% 규칙 검증
 * - 중복 검증: (지급연월, 귀속연월, 주민번호, 소득구분)
 */

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * ID번호 자릿수 검증 (체크디지트 검증 제외)
 * @param idNumber 주민(사업자)등록번호
 * @returns 에러 메시지 (null이면 통과)
 */
export function validateIdNumberLength(idNumber: string): string | null {
  if (!idNumber) return null;
  if (idNumber.length !== 10 && idNumber.length !== 13) {
    return "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.";
  }
  return null;
}

/**
 * 귀속연월 ≤ 지급연월 검증
 * @param attrYear 귀속연도
 * @param attrMonth 귀속월
 * @param payYear 지급연도
 * @param payMonth 지급월
 * @returns 에러 메시지 (null이면 통과)
 */
export function validateAttributionDate(
  attrYear: number,
  attrMonth: number,
  payYear: number,
  payMonth: number
): string | null {
  if (attrYear > payYear || (attrYear === payYear && attrMonth > payMonth)) {
    return "귀속연월은 지급연월보다 이전 날짜여야합니다.";
  }
  return null;
}

/**
 * 필요경비 60% 규칙 검증
 * @param paymentAmount 지급액
 * @param necessaryExpense 필요경비
 * @returns 에러 메시지 (null이면 통과)
 */
export function validateNecessaryExpenseRule(
  paymentAmount: number,
  necessaryExpense: number
): string | null {
  if (!validateNecessaryExpense(paymentAmount, necessaryExpense)) {
    const minExpense = Math.floor(paymentAmount * 0.6);
    return `필요경비는 지급액의 60% 이상(${minExpense.toLocaleString()}원 이상)이어야 합니다.`;
  }
  return null;
}

/**
 * 중복 검사
 * @param list 기타소득 전체 목록
 * @param payYear 지급연도
 * @param payMonth 지급월
 * @param attrYear 귀속연도
 * @param attrMonth 귀속월
 * @param idNumber 주민(사업자)등록번호
 * @param incomeType 소득구분
 * @param excludeId 제외할 ID (수정 시 사용)
 * @returns 중복 여부
 */
export function checkDuplicate(
  list: OtherIncome[],
  payYear: number,
  payMonth: number,
  attrYear: number,
  attrMonth: number,
  idNumber: string,
  incomeType: "자문/고문" | "자문/고문 외 인적용역",
  excludeId?: string
): boolean {
  return list.some(
    (item) =>
      item.id !== excludeId &&
      item.paymentYear === payYear &&
      item.paymentMonth === payMonth &&
      item.attributionYear === attrYear &&
      item.attributionMonth === attrMonth &&
      item.idNumber === idNumber &&
      item.incomeType === incomeType
  );
}

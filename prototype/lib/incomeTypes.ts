import { IncomeTypeCode } from "@/types/sps";

export interface IncomeType {
  code: IncomeTypeCode;
  name: string;
}

export const INCOME_TYPES: IncomeType[] = [
  { code: "자문/고문", name: "자문/고문" },
  { code: "자문/고문 외 인적용역", name: "자문/고문 외 인적용역" },
];

/**
 * 문자열이 유효한 소득구분 코드인지 확인하는 타입 가드 함수
 */
export function isValidIncomeType(value: string): value is IncomeTypeCode {
  return value === "자문/고문" || value === "자문/고문 외 인적용역";
}

/**
 * 문자열을 IncomeTypeCode로 안전하게 변환
 * @returns 유효한 코드면 해당 코드, 아니면 null
 */
export function toIncomeTypeCode(value: string): IncomeTypeCode | null {
  return isValidIncomeType(value) ? value : null;
}

/**
 * 소득구분 코드에 해당하는 이름을 반환
 */
export function getIncomeTypeName(code: IncomeTypeCode): string {
  return INCOME_TYPES.find((it) => it.code === code)?.name || code;
}

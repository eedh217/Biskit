export interface IncomeType {
  code: "자문/고문" | "자문/고문 외 인적용역";
  name: string;
}

export const INCOME_TYPES: IncomeType[] = [
  { code: "자문/고문", name: "자문/고문" },
  { code: "자문/고문 외 인적용역", name: "자문/고문 외 인적용역" },
];

export function getIncomeTypeName(code: "자문/고문" | "자문/고문 외 인적용역"): string {
  return INCOME_TYPES.find((it) => it.code === code)?.name || code;
}

export interface IndustryCode {
  code: string;
  name: string;
}

export const INDUSTRY_CODES: IndustryCode[] = [
  { code: "940304", name: "가수" },
  { code: "940305", name: "성악가 등" },
  { code: "940301", name: "작곡가" },
  { code: "940100", name: "저술가/작가" },
  { code: "940200", name: "화가관련 예술가" },
  { code: "940302", name: "배우" },
  { code: "940303", name: "모델" },
  { code: "940500", name: "연예보조" },
  { code: "940306", name: "1인미디어 콘텐츠창작자" },
  { code: "940926", name: "소프트웨어 프리랜서" },
  { code: "940911", name: "기타 모집수당" },
  { code: "940923", name: "대출모집인" },
  { code: "940924", name: "신용카드 회원모집인" },
  { code: "940907", name: "음료배달" },
  { code: "940908", name: "방문판매원" },
  { code: "940929", name: "중고자동차 판매원" },
  { code: "940910", name: "다단계판매" },
  { code: "940912", name: "간병인" },
  { code: "940915", name: "목욕관리사" },
  { code: "940916", name: "행사도우미" },
  { code: "940600", name: "자문·고문" },
  { code: "940901", name: "바둑기사" },
  { code: "940902", name: "꽃꽂이교사" },
  { code: "940903", name: "학원강사" },
  { code: "940920", name: "학습지 방문강사" },
  { code: "940921", name: "교육교구 방문강사" },
  { code: "940925", name: "방과후강사" },
  { code: "940913", name: "대리운전" },
  { code: "940918", name: "퀵서비스" },
  { code: "940917", name: "심부름용역" },
  { code: "940919", name: "물품운반" },
  { code: "940914", name: "캐디" },
  { code: "940904", name: "직업운동가" },
  { code: "940906", name: "보험설계사" },
  { code: "940922", name: "대여제품 방문점검원" },
  { code: "940927", name: "관광통역안내사" },
  { code: "940928", name: "어린이 통학버스기사" },
  { code: "940905", name: "봉사료수취자" },
  { code: "851101", name: "병의원" },
  { code: "940909", name: "기타자영업" },
];

export const EXCEPTION_INDUSTRY_CODES = ["940906", "940907", "940908"];
export const HOSPITAL_CODE = "851101";
export const GRATUITY_CODE = "940905";
export const ATHLETE_CODE = "940904";

export function getIndustryName(code: string): string {
  return INDUSTRY_CODES.find((ic) => ic.code === code)?.name || code;
}

export function isExceptionIndustry(code: string): boolean {
  return EXCEPTION_INDUSTRY_CODES.includes(code);
}

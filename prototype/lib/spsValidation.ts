import { HOSPITAL_CODE } from "./industryCodes";
import { BusinessIncome } from "@/types/sps";

// 주민등록번호 체크디짓 검증 (13자리)
function validateResidentNumber(num: string): boolean {
  if (num.length !== 13) return false;
  const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    sum += parseInt(num[i]) * weights[i];
  }
  const checkDigit = (11 - (sum % 11)) % 10;
  return checkDigit === parseInt(num[12]);
}

// 사업자등록번호 체크디짓 검증 (10자리)
function validateBusinessNumber(num: string): boolean {
  if (num.length !== 10) return false;
  const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(num[i]) * weights[i];
  }
  sum += Math.floor((parseInt(num[8]) * 5) / 10);
  const checkDigit = (10 - (sum % 10)) % 10;
  return checkDigit === parseInt(num[9]);
}

export interface ValidationError {
  field: string;
  message: string;
}

// ID번호 자릿수 검증
export function validateIdNumberLength(idNumber: string): string | null {
  if (!idNumber) return null;
  if (idNumber.length !== 10 && idNumber.length !== 13) {
    return "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.";
  }
  return null;
}

// ID번호 체크디짓 검증
export function validateIdNumberCheckDigit(idNumber: string): string | null {
  if (!idNumber) return null;
  if (idNumber.length === 13) {
    if (!validateResidentNumber(idNumber)) {
      return "유효하지 않은 주민(사업자)등록번호입니다.";
    }
  } else if (idNumber.length === 10) {
    if (!validateBusinessNumber(idNumber)) {
      return "유효하지 않은 주민(사업자)등록번호입니다.";
    }
  }
  return null;
}

// 병의원 업종 예외 검사
export function validateHospitalIdNumber(industryCode: string, idNumber: string): string | null {
  if (industryCode === HOSPITAL_CODE && idNumber.length > 10) {
    return "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다.";
  }
  return null;
}

// 귀속연월 ≤ 지급연월 검증
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

// 중복 검사
export function checkDuplicate(
  list: BusinessIncome[],
  attrYear: number,
  attrMonth: number,
  idNumber: string,
  industryCode: string,
  excludeId?: string
): boolean {
  return list.some(
    (item) =>
      item.id !== excludeId &&
      item.attributionYear === attrYear &&
      item.attributionMonth === attrMonth &&
      item.idNumber === idNumber &&
      item.industryCode === industryCode
  );
}

import * as XLSX from "xlsx";
import { TEMPLATE_COLUMN_CODES, FailRow } from "./excelTemplate";
import { INDUSTRY_CODES } from "./industryCodes";
import { validateIdNumberCheckDigit } from "./spsValidation";
import { determineTaxRate, calculateTax } from "./taxCalculation";
import { addBusinessIncome, getBusinessIncomes } from "./store";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const VALID_INDUSTRY_CODES = new Set(INDUSTRY_CODES.map((ic) => ic.code));

export interface UploadResult {
  totalCount: number;
  successCount: number;
  failCount: number;
  failRows: FailRow[];
}

interface RawRow {
  name: unknown;
  attributionYear: unknown;
  attributionMonth: unknown;
  paymentYear: unknown;
  paymentMonth: unknown;
  iino: unknown;
  isForeign: unknown;
  industryCode: unknown;
  paymentSum: unknown;
  taxRate: unknown;
}

function toStr(val: unknown): string {
  if (val === null || val === undefined) return "";
  return String(val).trim();
}

function isInteger(val: unknown): boolean {
  if (val === null || val === undefined || val === "") return false;
  const num = Number(val);
  return Number.isFinite(num) && Number.isInteger(num);
}

function validateRow(
  raw: RawRow,
  rowIndex: number,
  existingKeys: Set<string>
): { error: string | null } {
  const name = toStr(raw.name);
  const attrYear = toStr(raw.attributionYear);
  const attrMonth = toStr(raw.attributionMonth);
  const payYear = toStr(raw.paymentYear);
  const payMonth = toStr(raw.paymentMonth);
  const iino = toStr(raw.iino);
  const isForeign = toStr(raw.isForeign);
  const industryCode = toStr(raw.industryCode);
  const paymentSum = toStr(raw.paymentSum);
  const taxRate = toStr(raw.taxRate);

  // 1. 필수값 미입력 (세율 제외)
  if (!name || !attrYear || !attrMonth || !payYear || !payMonth || !iino || !isForeign || !industryCode || !paymentSum) {
    return { error: "세율을 제외한 모든 컬럼이 필수입력값입니다." };
  }

  // 2. 귀속연도 숫자 검증
  if (!isInteger(raw.attributionYear)) {
    return { error: "귀속연도는 숫자로 입력해주세요." };
  }

  // 3. 귀속연도 범위 검증
  const currentYear = new Date().getFullYear();
  const attrYearNum = Number(raw.attributionYear);
  if (attrYearNum < 2025 || attrYearNum > currentYear) {
    return { error: `귀속연도는 2025년부터 ${currentYear}년까지 입력 가능합니다.` };
  }

  // 4. 지급연도 숫자 검증
  if (!isInteger(raw.paymentYear)) {
    return { error: "지급연도는 숫자로 입력해주세요." };
  }

  // 5. 지급연도 범위 검증
  const payYearNum = Number(raw.paymentYear);
  if (payYearNum < 2025 || payYearNum > currentYear + 1) {
    return { error: `지급연도는 2025년부터 ${currentYear + 1}년까지 입력 가능합니다.` };
  }

  // 6. 귀속월 범위 검증
  const attrMonthNum = Number(raw.attributionMonth);
  if (!isInteger(raw.attributionMonth) || attrMonthNum < 1 || attrMonthNum > 12) {
    return { error: "귀속월은 1~12 내 숫자로 입력해주세요." };
  }

  // 7. 지급월 범위 검증
  const payMonthNum = Number(raw.paymentMonth);
  if (!isInteger(raw.paymentMonth) || payMonthNum < 1 || payMonthNum > 12) {
    return { error: "지급월은 1~12 내 숫자로 입력해주세요." };
  }

  // 8. 지급연월 vs 귀속연월 선후관계
  const ay = Number(raw.attributionYear);
  const am = Number(raw.attributionMonth);
  const py = Number(raw.paymentYear);
  const pm = Number(raw.paymentMonth);
  if (py < ay || (py === ay && pm < am)) {
    return { error: "지급연월은 귀속연월 이후 날짜여야 합니다." };
  }

  // 9. 내외국인 구분 검증
  if (isForeign !== "N" && isForeign !== "Y") {
    return { error: "내외국인 구분은 N, Y로 입력해주세요." };
  }

  // 10. 업종코드 유효성
  if (!VALID_INDUSTRY_CODES.has(industryCode)) {
    return { error: "유효하지 않은 업종코드입니다." };
  }

  // 11. 지급액 숫자 검증
  if (!isInteger(raw.paymentSum)) {
    return { error: "지급액은 숫자만 입력 가능합니다." };
  }

  // 12. 지급액 양수 검증
  const paymentAmount = Number(raw.paymentSum);
  if (paymentAmount <= 0) {
    return { error: "지급액을 양수로 입력해주세요." };
  }

  // 13. 지급액 자릿수 검증
  if (paymentSum.replace(/^-/, "").length > 12) {
    return { error: "지급액은 최대 12자리까지 입력 가능합니다." };
  }

  // 14. 성명(상호) 길이 검증
  if (name.length > 50) {
    return { error: "성명(상호)는 최대 50자까지 입력 가능합니다." };
  }

  // 15. 주민(사업자)등록번호 자릿수 검증
  const cleanedIino = iino.replace(/[^0-9]/g, "");
  if (cleanedIino.length > 13) {
    return { error: "주민(사업자)등록번호는 최대 13자리까지 입력 가능합니다." };
  }

  // 16. 주민등록번호 형식 검증 (13자리인 경우)
  if (cleanedIino.length === 13) {
    const checkErr = validateIdNumberCheckDigit(cleanedIino);
    if (checkErr) {
      return { error: "유효하지 않은 주민등록번호 형식입니다." };
    }
  }

  // 17. 외국인 직업운동가 세율 검증
  if (isForeign === "Y" && industryCode === "940904") {
    if (!taxRate || (taxRate !== "3" && taxRate !== "20")) {
      return { error: "외국인 직업운동가일 경우, 세율을 3 또는 20으로 입력해주세요." };
    }
  }

  // 18. 중복 데이터 검사 (기존 데이터 + 이번 업로드 내 선행 행)
  const dupKey = `${py}-${pm}-${ay}-${am}-${cleanedIino}-${industryCode}`;
  if (existingKeys.has(dupKey)) {
    return { error: "지급연월 기준 귀속연월, 주민(사업자)등록번호, 업종코드가 동일한 사업소득이 존재합니다." };
  }

  return { error: null };
}

export async function processExcelUpload(file: File): Promise<{
  success: boolean;
  error?: string;
  result?: UploadResult;
}> {
  // 파일 크기 체크
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "파일 크기는 최대 10MB까지 허용됩니다." };
  }

  // 파일 읽기
  const buffer = await file.arrayBuffer();
  let workbook: XLSX.WorkBook;
  try {
    workbook = XLSX.read(buffer, { type: "array" });
  } catch {
    return { success: false, error: "양식에 맞지 않는 엑셀파일입니다." };
  }

  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) {
    return { success: false, error: "양식에 맞지 않는 엑셀파일입니다." };
  }

  // 전체 데이터를 배열로 변환
  const allRows: unknown[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: "",
    raw: true,
  });

  // Row 11 (index 10): 컬럼코드 구조 검증
  if (allRows.length < 11) {
    return { success: false, error: "양식에 맞지 않는 엑셀파일입니다." };
  }

  const codeRow = allRows[10]; // 0-indexed: row 11
  const expectedCodes = [...TEMPLATE_COLUMN_CODES];
  const isStructureValid =
    expectedCodes.length <= codeRow.length &&
    expectedCodes.every((code, i) => toStr(codeRow[i]) === code);

  if (!isStructureValid) {
    return { success: false, error: "양식에 맞지 않는 엑셀파일입니다." };
  }

  // Row 13부터 데이터 (index 12+), Row 12(index 11)는 샘플이므로 스킵
  const dataRows = allRows.slice(12);

  // 빈 행 제외 (모든 셀이 비어있으면 스킵)
  const nonEmptyRows = dataRows.filter((row) =>
    row.some((cell) => cell !== null && cell !== undefined && toStr(cell) !== "")
  );

  if (nonEmptyRows.length === 0) {
    return {
      success: false,
      error: "데이터가 없습니다. 데이터 입력 후 파일을 업로드해주세요.",
    };
  }

  // 기존 데이터 키 셋 생성 (중복 검사용)
  const existingData = getBusinessIncomes();
  const existingKeys = new Set(
    existingData.map(
      (item) =>
        `${item.paymentYear}-${item.paymentMonth}-${item.attributionYear}-${item.attributionMonth}-${item.idNumber}-${item.industryCode}`
    )
  );

  const failRows: FailRow[] = [];
  let successCount = 0;

  for (let i = 0; i < nonEmptyRows.length; i++) {
    const row = nonEmptyRows[i];
    const rawRow: RawRow = {
      name: row[0],
      attributionYear: row[1],
      attributionMonth: row[2],
      paymentYear: row[3],
      paymentMonth: row[4],
      iino: row[5],
      isForeign: row[6],
      industryCode: row[7],
      paymentSum: row[8],
      taxRate: row[9],
    };

    const rowIndex = 13 + i; // 실제 엑셀 행 번호
    const { error } = validateRow(rawRow, rowIndex, existingKeys);

    if (error) {
      failRows.push({
        rowIndex,
        name: toStr(rawRow.name),
        attributionYear: toStr(rawRow.attributionYear),
        attributionMonth: toStr(rawRow.attributionMonth),
        paymentYear: toStr(rawRow.paymentYear),
        paymentMonth: toStr(rawRow.paymentMonth),
        iino: toStr(rawRow.iino),
        isForeign: toStr(rawRow.isForeign),
        industryCode: toStr(rawRow.industryCode),
        paymentSum: toStr(rawRow.paymentSum),
        taxRate: toStr(rawRow.taxRate),
        failReason: error,
      });
      continue;
    }

    // 검증 통과 → 세율 결정 & 세금 계산
    const name = toStr(rawRow.name);
    const isForeign = toStr(rawRow.isForeign) as "N" | "Y";
    const industryCode = toStr(rawRow.industryCode);
    const cleanedIino = toStr(rawRow.iino).replace(/[^0-9]/g, "");
    const paymentAmount = Number(rawRow.paymentSum);
    const ay = Number(rawRow.attributionYear);
    const am = Number(rawRow.attributionMonth);
    const py = Number(rawRow.paymentYear);
    const pm = Number(rawRow.paymentMonth);

    // 세율 결정
    let selectedRate: number | undefined;
    if (isForeign === "Y" && industryCode === "940904") {
      selectedRate = Number(toStr(rawRow.taxRate));
    }
    const taxRate = determineTaxRate(industryCode, isForeign, selectedRate);
    const taxResult = calculateTax(paymentAmount, taxRate);

    // 저장
    const saveResult = addBusinessIncome({
      name,
      isForeign,
      idNumber: cleanedIino,
      industryCode,
      attributionYear: ay,
      attributionMonth: am,
      paymentYear: py,
      paymentMonth: pm,
      paymentAmount,
      taxRate: taxResult.taxRate,
      incomeTax: taxResult.incomeTax,
      localTax: taxResult.localTax,
      netPayment: taxResult.netPayment,
    });

    if (saveResult.success) {
      // 중복 키 추가 (이번 업로드 내 후행 행과의 중복 검사용)
      const dupKey = `${py}-${pm}-${ay}-${am}-${cleanedIino}-${industryCode}`;
      existingKeys.add(dupKey);
      successCount++;
    } else {
      failRows.push({
        rowIndex,
        name,
        attributionYear: ay,
        attributionMonth: am,
        paymentYear: py,
        paymentMonth: pm,
        iino: cleanedIino,
        isForeign,
        industryCode,
        paymentSum: paymentAmount,
        taxRate: toStr(rawRow.taxRate),
        failReason: saveResult.error || "저장 중 오류가 발생했습니다.",
      });
    }
  }

  return {
    success: true,
    result: {
      totalCount: nonEmptyRows.length,
      successCount,
      failCount: failRows.length,
      failRows,
    },
  };
}

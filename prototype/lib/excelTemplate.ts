import * as XLSX from "xlsx";

// 컬럼 코드 순서 (양식 구조 검증에도 사용)
export const TEMPLATE_COLUMN_CODES = [
  "name",
  "attributionYear",
  "attributionMonth",
  "paymentYear",
  "paymentMonth",
  "iino",
  "isForeign",
  "industryCode",
  "paymentSum",
  "taxRate",
] as const;

const COLUMN_NAMES = [
  "*성명(상호)",
  "*귀속연도",
  "*귀속월",
  "*지급연도",
  "*지급월",
  "*주민(사업자)등록번호",
  "*내외국인 구분 (내국인:N, 외국인:Y)",
  "*업종코드",
  "*지급액",
  "세율",
];

const SAMPLE_ROW = [
  "홍길동",
  2026,
  1,
  2026,
  1,
  "9001011234567",
  "N",
  "940903",
  3000000,
  "",
];

const GUIDE_ROWS = [
  ["간이지급명세서 사업소득 엑셀 업로드 양식"],
  [],
  ["[입력 안내]"],
  ["1. Row 13부터 데이터를 입력하세요. (Row 12는 샘플 데이터로 업로드 시 자동 무시됩니다.)"],
  ["2. *표시 항목은 필수 입력입니다."],
  ["3. 내외국인 구분은 내국인: N, 외국인: Y로 입력하세요."],
  ["4. 세율은 외국인(Y) + 직업운동가(940904)일 경우에만 3 또는 20을 입력하세요. 그 외는 비워두세요."],
  ["5. 주민(사업자)등록번호는 숫자만 입력하세요. (10자리: 사업자등록번호, 13자리: 주민등록번호)"],
  ["6. 업종코드는 유효한 코드를 입력하세요. (예: 940903 학원강사, 940906 보험설계사)"],
];

export function downloadTemplate(): void {
  const wb = XLSX.utils.book_new();

  const rows: (string | number | null)[][] = [];

  // Row 1~9: 안내
  for (const row of GUIDE_ROWS) {
    rows.push(row);
  }

  // Row 10: 컬럼명
  rows.push(COLUMN_NAMES);

  // Row 11: 컬럼코드
  rows.push([...TEMPLATE_COLUMN_CODES]);

  // Row 12: 샘플 데이터
  rows.push(SAMPLE_ROW);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // 컬럼 너비 설정
  ws["!cols"] = [
    { wch: 20 }, // name
    { wch: 12 }, // attributionYear
    { wch: 10 }, // attributionMonth
    { wch: 12 }, // paymentYear
    { wch: 10 }, // paymentMonth
    { wch: 22 }, // iino
    { wch: 30 }, // isForeign
    { wch: 12 }, // industryCode
    { wch: 15 }, // paymentSum
    { wch: 10 }, // taxRate
  ];

  XLSX.utils.book_append_sheet(wb, ws, "사업소득");

  XLSX.writeFile(wb, "간이지급명세서_사업소득_업로드_양식.xlsx");
}

export interface FailRow {
  rowIndex: number;
  name: string;
  attributionYear: string | number;
  attributionMonth: string | number;
  paymentYear: string | number;
  paymentMonth: string | number;
  iino: string;
  isForeign: string;
  industryCode: string;
  paymentSum: string | number;
  taxRate: string | number;
  failReason: string;
}

export function downloadFailData(failRows: FailRow[]): void {
  const wb = XLSX.utils.book_new();

  const header = [...COLUMN_NAMES, "실패사유"];
  const rows: (string | number)[][] = [header];

  for (const row of failRows) {
    rows.push([
      row.name ?? "",
      row.attributionYear ?? "",
      row.attributionMonth ?? "",
      row.paymentYear ?? "",
      row.paymentMonth ?? "",
      row.iino ?? "",
      row.isForeign ?? "",
      row.industryCode ?? "",
      row.paymentSum ?? "",
      row.taxRate ?? "",
      row.failReason,
    ]);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  ws["!cols"] = [
    { wch: 20 },
    { wch: 12 },
    { wch: 10 },
    { wch: 12 },
    { wch: 10 },
    { wch: 22 },
    { wch: 30 },
    { wch: 12 },
    { wch: 15 },
    { wch: 10 },
    { wch: 40 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, "실패목록");

  const today = new Date();
  const dateStr =
    String(today.getFullYear()) +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  XLSX.writeFile(wb, `사업소득업로드_실패목록_${dateStr}.xlsx`);
}

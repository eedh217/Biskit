export interface SpsPolicyTab {
  id: string;
  label: string;
  mdFile: string;
}

// 월별 사업소득 정책 탭 설정
export const spsMonthlyTabs: SpsPolicyTab[] = [
  {
    id: "sps-summary",
    label: "사업소득 합산",
    mdFile: "BI/policy_사업소득합산_merged.md",
  },
  {
    id: "sps-excel",
    label: "엑셀업로드",
    mdFile: "BI/policy_사업소득엑셀업로드_merged.md",
  },
  {
    id: "sps-monthly",
    label: "사업소득 월별 리스트",
    mdFile: "BI/policy_사업소득월별리스트_merged.md",
  },
  {
    id: "sps-add",
    label: "사업소득 추가",
    mdFile: "BI/policy_사업소득추가팝업_merged.md",
  },
  {
    id: "sps-edit",
    label: "사업소득 수정",
    mdFile: "BI/policy_사업소득수정팝업_merged.md",
  },
];

// 전체 사업소득 정책 탭 설정
export const spsAllTabs: SpsPolicyTab[] = [
  {
    id: "sps-all-list",
    label: "전체 사업소득",
    mdFile: "BI/policy_전체사업소득_merged.md",
  },
  {
    id: "sps-excel",
    label: "엑셀업로드",
    mdFile: "BI/policy_사업소득엑셀업로드_merged.md",
  },
  {
    id: "sps-all-add",
    label: "전체 사업소득 추가",
    mdFile: "BI/policy_전체사업소득추가팝업_merged.md",
  },
  {
    id: "sps-all-edit",
    label: "전체 사업소득 수정",
    mdFile: "BI/policy_전체사업소득수정팝업_merged.md",
  },
];

// 월별 기타소득 정책 탭 설정
export const oiMonthlyTabs: SpsPolicyTab[] = [
  {
    id: "oi-summary",
    label: "기타소득 합산",
    mdFile: "OI/policy_기타소득합산.md",
  },
  {
    id: "oi-excel",
    label: "엑셀업로드",
    mdFile: "OI/policy_기타소득엑셀업로드.md",
  },
  {
    id: "oi-monthly",
    label: "기타소득 월별 리스트",
    mdFile: "OI/policy_기타소득월별리스트.md",
  },
  {
    id: "oi-add",
    label: "기타소득 추가",
    mdFile: "OI/policy_기타소득추가팝업.md",
  },
  {
    id: "oi-edit",
    label: "기타소득 수정",
    mdFile: "OI/policy_기타소득수정팝업.md",
  },
];

// 전체 기타소득 정책 탭 설정
export const oiAllTabs: SpsPolicyTab[] = [
  {
    id: "oi-all-list",
    label: "전체 기타소득",
    mdFile: "OI/policy_전체기타소득.md",
  },
  {
    id: "oi-excel",
    label: "엑셀업로드",
    mdFile: "OI/policy_기타소득엑셀업로드.md",
  },
  {
    id: "oi-all-add",
    label: "전체 기타소득 추가",
    mdFile: "OI/policy_전체기타소득추가팝업.md",
  },
  {
    id: "oi-all-edit",
    label: "전체 기타소득 수정",
    mdFile: "OI/policy_전체기타소득수정팝업.md",
  },
];

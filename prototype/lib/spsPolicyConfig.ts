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
    mdFile: "policy_사업소득합산_merged.md",
  },
  {
    id: "sps-excel",
    label: "엑셀업로드",
    mdFile: "policy_사업소득엑셀업로드_merged.md",
  },
  {
    id: "sps-monthly",
    label: "사업소득 월별 리스트",
    mdFile: "policy_사업소득월별리스트_merged.md",
  },
  {
    id: "sps-add",
    label: "사업소득 추가",
    mdFile: "policy_사업소득추가팝업_merged.md",
  },
  {
    id: "sps-edit",
    label: "사업소득 수정",
    mdFile: "policy_사업소득수정팝업_merged.md",
  },
];

// 전체 사업소득 정책 탭 설정
export const spsAllTabs: SpsPolicyTab[] = [
  {
    id: "sps-all-list",
    label: "전체 사업소득",
    mdFile: "policy_전체사업소득_merged.md",
  },
  {
    id: "sps-excel",
    label: "엑셀업로드",
    mdFile: "policy_사업소득엑셀업로드_merged.md",
  },
  {
    id: "sps-all-add",
    label: "전체 사업소득 추가",
    mdFile: "policy_전체사업소득추가팝업_merged.md",
  },
  {
    id: "sps-all-edit",
    label: "전체 사업소득 수정",
    mdFile: "policy_전체사업소득수정팝업_merged.md",
  },
];

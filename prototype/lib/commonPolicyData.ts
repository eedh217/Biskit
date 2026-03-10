import { CommonPolicy } from "@/types";

export const commonPolicies: CommonPolicy[] = [
  {
    id: "common-ui",
    title: "공통 UI 정책",
    description: "B2B 관리자 페이지의 UI 공통 정책",
    mdFile: "common-ui-policy.md",
  },
  {
    id: "excel-upload",
    title: "엑셀 업로드 정책",
    description: "엑셀 업로드 기능 공통 정책",
    mdFile: "excel-upload-policy.md",
  },
];

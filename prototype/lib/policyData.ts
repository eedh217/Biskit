import { PolicyModule, PolicyField, TableColumn } from "@/types";
import * as summaryContent from "./policyContent/sps-summary";
import * as monthlyContent from "./policyContent/sps-monthly";
import * as addContent from "./policyContent/sps-add";
import * as editContent from "./policyContent/sps-edit";
import * as excelContent from "./policyContent/sps-excel";
import * as allListContent from "./policyContent/sps-all-list";
import * as allAddContent from "./policyContent/sps-all-add";
import * as allEditContent from "./policyContent/sps-all-edit";

// ─── 사업소득 합산 (SPS_BI_01) ─────────────────────────────

const spsSummaryFields: PolicyField[] = [
  {
    name: "연도",
    required: true,
    type: "select",
    options: ["2026", "2027"],
    description: "2026년 ~ (현재 연도 + 1)년. 기본값: 현재 연도.",
  },
];

const spsSummaryTableColumns: TableColumn[] = [
  { name: "월", type: "문자열", note: "1월~12월 고정" },
  { name: "건수(소득자건수)", type: "숫자", note: "해당 월 소득 지급 건수 합계" },
  { name: "총 지급액", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "총 소득세", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "총 지방소득세", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "총 실지급액", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "신고파일 최종생성일", type: "YYYY-MM-DD", note: "미생성 시 \"-\"" },
  { name: "다운로드", type: "버튼", note: "미생성 시 visibility:hidden" },
];

export const spsSummaryPolicy: PolicyModule = {
  id: "sps-summary",
  moduleName: "사업소득 합산",
  features: "연도별 월별 사업소득 합산 조회 / 신고파일 다운로드 / 엑셀 업로드",
  screens: [
    {
      screenId: "SPS_BI_01",
      screenName: "합산 화면",
      description: "선택한 연도의 1월~12월 사업소득 월별 합산 조회",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_01",
    search: {
      target: "연도 셀렉박스",
      placeholder: "연도 선택",
      specialCharAllowed: false,
    },
    sort: "월 오름차순 (1월~12월 고정)",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "YYYY년_M월_간이지급명세서",
    rowClickAction: "해당 월의 사업소득 월별 리스트(SPS_BI_02)로 이동",
  },
  addPopup: {
    screenId: "SPS_BI_01",
    confirmMessage: "",
    toastMessage: "",
  },
  editPopup: {
    screenId: "SPS_BI_01",
    confirmMessage: "",
    toastMessage: "",
  },
  fields: spsSummaryFields,
  tableColumns: spsSummaryTableColumns,
  deletePolicy: {
    type: "해당 없음",
    description: ["합산 화면에서는 삭제 기능 없음"],
  },
  extraPolicies: [
    {
      title: "귀속 기준 예외 규칙",
      description: "보험설계사(940906)/음료배달(940907)/방문판매원(940908) 업종이면서 귀속연도≠지급연도인 경우, 해당 데이터는 귀속연도 12월 합산에 포함. 12월 하단에 'YYYY년 지급'/'YYYY년 이후 지급' 추가 행 표시.",
    },
    {
      title: "엑셀 업로드",
      description: ".xlsx/.xls 파일 업로드. 최대 10MB. 행별 검증 후 성공 건만 저장. 실패 목록 다운로드 제공.",
    },
  ],
  detailedContent: summaryContent,
  sourceFile: "policy_사업소득합산_merged.md",
};

// ─── 사업소득 월별 리스트 (SPS_BI_02) ─────────────────────────────

const spsMonthlyFields: PolicyField[] = [];

const spsMonthlyTableColumns: TableColumn[] = [
  { name: "귀속연월", type: "YYYY.MM" },
  { name: "성명(상호)", type: "문자열", note: "최대 50자" },
  { name: "주민(사업자)등록번호", type: "문자열", note: "10자리 또는 13자리" },
  { name: "업종코드", type: "문자열", note: "코드 + 업종명" },
  { name: "지급액", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "소득세", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "지방소득세", type: "금액", note: "천 단위 콤마 + 원" },
  { name: "실지급액", type: "금액", note: "천 단위 콤마 + 원" },
];

export const spsMonthlyPolicy: PolicyModule = {
  id: "sps-monthly",
  moduleName: "사업소득 월별 리스트",
  features: "월별 사업소득 조회 / 추가 / 수정 / 삭제 / 엑셀 다운로드",
  screens: [
    {
      screenId: "SPS_BI_02",
      screenName: "월별 리스트 화면",
      description: "특정 지급연월의 사업소득 상세 리스트 조회, 검색, 삭제, 엑셀 다운로드",
    },
    {
      screenId: "SPS_BI_03",
      screenName: "추가 팝업",
      description: "사업소득 신규 추가 (자동 세액 계산)",
    },
    {
      screenId: "SPS_BI_04",
      screenName: "수정 팝업",
      description: "사업소득 수정/삭제 (모든 필드 수정 가능)",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_02",
    search: {
      target: "성명(상호)",
      placeholder: "성명(상호)을 입력해주세요.",
      maxLength: 50,
      specialCharAllowed: false,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "사업소득_YYYY년_M월",
    rowClickAction: "수정 팝업(SPS_BI_04) 노출",
  },
  addPopup: {
    screenId: "SPS_BI_03",
    confirmMessage: "사업소득 추가를 취소하시겠습니까?",
    toastMessage: "사업소득 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "SPS_BI_04",
    confirmMessage: "사업소득 수정을 취소하시겠습니까?",
    toastMessage: "사업소득 수정을 완료했습니다.",
  },
  fields: spsMonthlyFields,
  tableColumns: spsMonthlyTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "선택 삭제 및 전체 삭제 지원",
    ],
    warning: "삭제한 정보는 복구할 수 없습니다.",
  },
  extraPolicies: [
    {
      title: "상단 요약 정보",
      description: "항상 전체 데이터(검색/페이징 무관) 기준으로 건수, 총 지급액, 총 소득세, 총 지방소득세, 총 실지급액 표시.",
    },
    {
      title: "엑셀 다운로드 모드",
      description: "전체 다운로드 / 검색 결과 다운로드 / 선택 다운로드 3가지 모드 제공.",
    },
    {
      title: "전체 삭제",
      description: "해당 지급연월의 모든 사업소득을 일괄 삭제. 확인 다이얼로그 제공.",
    },
    {
      title: "예외 업종 12월 지급 합류 규칙",
      description: "예외 업종(940906/907/908)에서 귀속연도=지급연도이고 지급월이 12월인 데이터는, 동일 귀속연월+주민번호+업종코드로 귀속연도≠지급연도인 예외 데이터가 존재할 경우 해당 그룹에 합산하여 표시.",
    },
  ],
  detailedContent: monthlyContent,
  sourceFile: "policy_사업소득월별리스트_merged.md",
};

// ─── 사업소득 추가 팝업 (SPS_BI_03) ─────────────────────────────

const spsAddFields: PolicyField[] = [
  {
    name: "귀속연도",
    required: true,
    type: "select",
    options: ["2025", "2026"],
    description: "2025년 ~ 현재연도. placeholder: \"선택\".",
  },
  {
    name: "귀속월",
    required: true,
    type: "select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    description: "1월~12월. placeholder: \"선택\".",
  },
  {
    name: "성명(상호)",
    required: true,
    type: "text",
    maxLength: 50,
    validation: ["허용 문자: 한글·영문·숫자·공백·&·'·-·.·(가운뎃점)", "공백만 입력 시 필수 에러"],
    errorMessages: { required: "필수 입력 항목입니다." },
    description: "허용되지 않은 문자는 입력 불가.",
  },
  {
    name: "내외국인 구분",
    required: true,
    type: "radio",
    options: ["내국인", "외국인"],
    description: "기본값: 내국인.",
  },
  {
    name: "주민(사업자)등록번호",
    required: true,
    type: "text",
    maxLength: 13,
    validation: [
      "숫자만 입력 가능",
      "10자리 또는 13자리만 허용",
      "체크디짓 알고리즘 검증",
      "병의원(851101) 선택 시 10자리 이하만 허용",
    ],
    errorMessages: {
      length: "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.",
      checkDigit: "유효하지 않은 주민(사업자)등록번호입니다.",
      hospital: "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다.",
    },
  },
  {
    name: "업종코드",
    required: true,
    type: "select",
    description: "40개 업종코드 목록 중 선택. placeholder: \"선택\".",
  },
  {
    name: "지급액",
    required: true,
    type: "number",
    description: "0 이상 정수만 허용. 최대 12자리. 천 단위 콤마 표시.",
    validation: ["숫자만 입력 가능", "앞자리 0 자동 제거"],
    errorMessages: { required: "필수 입력 항목입니다." },
  },
];

const spsAddTableColumns: TableColumn[] = [
  { name: "세율(%)", type: "퍼센트", note: "기본 3%, 봉사료 5%, 외국인+운동가 3%/20% 선택" },
  { name: "소득세", type: "금액", note: "지급액 × 세율 (절사). 소액부징수: <1,000원 → 0원" },
  { name: "지방소득세", type: "금액", note: "소득세 × 0.1 (절사). 소득세 0원이면 0원" },
  { name: "실지급액", type: "금액", note: "지급액 - 소득세 - 지방소득세" },
];

export const spsAddPolicy: PolicyModule = {
  id: "sps-add",
  moduleName: "사업소득 추가 팝업",
  features: "사업소득 신규 추가 / 자동 세액 계산 / 귀속 기준 예외 확인",
  screens: [
    {
      screenId: "SPS_BI_03",
      screenName: "추가 팝업",
      description: "사업소득 데이터 추가. 입력 시 세율·소득세·지방소득세·실지급액 자동 계산.",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_03",
    search: { target: "", placeholder: "", specialCharAllowed: false },
    sort: "",
    pageSizeOptions: [],
    defaultPageSize: 0,
    excelFileName: "",
    rowClickAction: "",
  },
  addPopup: {
    screenId: "SPS_BI_03",
    confirmMessage: "사업소득 추가를 취소하시겠습니까?",
    toastMessage: "사업소득 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "SPS_BI_03",
    confirmMessage: "",
    toastMessage: "",
  },
  fields: spsAddFields,
  tableColumns: spsAddTableColumns,
  deletePolicy: {
    type: "해당 없음",
    description: ["추가 팝업에서는 삭제 기능 없음"],
  },
  extraPolicies: [
    {
      title: "세율 결정 로직",
      description: "기본 3%. 봉사료수취자(940905) → 5% 고정. 외국인+직업운동가(940904) → 라디오 버튼으로 3%/20% 선택 (기본 3%).",
    },
    {
      title: "소액부징수",
      description: "소득세가 1,000원 미만이면 소득세=0원, 지방소득세=0원.",
    },
    {
      title: "중복 검사",
      description: "submit 시 귀속연월 + 주민(사업자)등록번호 + 업종코드가 동일한 데이터 존재 시 등록 차단.",
    },
    {
      title: "귀속 기준 예외 확인",
      description: "예외 업종(940906/940907/940908) + 귀속연도≠지급연도 시 confirm: \"해당 데이터는 YYYY년 12월 사업소득에 표시됩니다.\"",
    },
  ],
  detailedContent: addContent,
  sourceFile: "policy_사업소득추가팝업_merged.md",
};

// ─── 사업소득 수정 팝업 (SPS_BI_04) ─────────────────────────────

const spsEditFields: PolicyField[] = [
  {
    name: "귀속연도",
    required: true,
    type: "select",
    description: "수정 가능. 2025년 ~ 현재연도.",
  },
  {
    name: "귀속월",
    required: true,
    type: "select",
    description: "수정 가능. 1월~12월.",
  },
  {
    name: "성명(상호)",
    required: true,
    type: "text",
    maxLength: 50,
    description: "수정 가능. 허용 문자: 한글·영문·숫자·공백·허용 특수문자.",
    validation: ["허용 문자: 한글·영문·숫자·공백·&·'·-·.·(가운뎃점)", "공백만 입력 시 필수 에러"],
    errorMessages: { required: "필수 입력 항목입니다." },
  },
  {
    name: "내외국인 구분",
    required: true,
    type: "radio",
    options: ["내국인", "외국인"],
    description: "수정 가능. 변경 시 세율 조건부 전환 트리거.",
  },
  {
    name: "주민(사업자)등록번호",
    required: true,
    type: "text",
    maxLength: 13,
    description: "수정 가능. 마스킹 없이 전체 표시.",
    validation: [
      "숫자만 입력 가능",
      "10자리 또는 13자리만 허용",
      "체크디짓 알고리즘 검증",
      "병의원(851101) 선택 시 10자리 이하만 허용",
    ],
    errorMessages: {
      length: "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.",
      checkDigit: "유효하지 않은 주민(사업자)등록번호입니다.",
      hospital: "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다.",
    },
  },
  {
    name: "업종코드",
    required: true,
    type: "select",
    description: "수정 가능.",
  },
  {
    name: "지급액",
    required: true,
    type: "number",
    description: "수정 가능. 0 이상 정수, 최대 12자리.",
  },
];

const spsEditTableColumns: TableColumn[] = [
  { name: "세율(%)", type: "퍼센트", note: "추가 팝업과 동일 로직" },
  { name: "소득세", type: "금액", note: "자동 계산" },
  { name: "지방소득세", type: "금액", note: "자동 계산" },
  { name: "실지급액", type: "금액", note: "자동 계산" },
];

export const spsEditPolicy: PolicyModule = {
  id: "sps-edit",
  moduleName: "사업소득 수정 팝업",
  features: "사업소득 수정 / 삭제 / 모든 필드 수정 가능 / 자동 세액 재계산",
  screens: [
    {
      screenId: "SPS_BI_04",
      screenName: "수정 팝업",
      description: "기존 사업소득 데이터 수정 또는 삭제. 모든 필드(귀속연월/성명/내외국인/주민번호/업종코드/지급액) 수정 가능.",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_04",
    search: { target: "", placeholder: "", specialCharAllowed: false },
    sort: "",
    pageSizeOptions: [],
    defaultPageSize: 0,
    excelFileName: "",
    rowClickAction: "",
  },
  addPopup: {
    screenId: "SPS_BI_04",
    confirmMessage: "",
    toastMessage: "",
  },
  editPopup: {
    screenId: "SPS_BI_04",
    confirmMessage: "사업소득 수정을 취소하시겠습니까?",
    toastMessage: "사업소득 수정을 완료했습니다.",
  },
  fields: spsEditFields,
  tableColumns: spsEditTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "조건 없이 항상 삭제 가능",
    ],
    warning: "사업소득을 삭제하시겠습니까? 삭제한 정보는 복구할 수 없습니다.",
  },
  extraPolicies: [
    {
      title: "세율 결정 로직",
      description: "기본 3%. 봉사료수취자(940905) → 5% 고정. 외국인+직업운동가(940904) → 라디오 버튼으로 3%/20% 선택 (기본 3%). 내외국인 변경 시 세율 조건부 전환 트리거.",
    },
    {
      title: "소액부징수",
      description: "소득세가 1,000원 미만이면 소득세=0원, 지방소득세=0원.",
    },
    {
      title: "삭제 동작",
      description: "단건: 삭제 완료 시 토스트 노출 후 SPS_BI_02 리스트 초기 상태로 복귀. 다건: 탭별 \"이 건 삭제\" 가능, 삭제 즉시 SPS_BI_02 리스트/요약 갱신(팝업 유지), 마지막 건 삭제 시 팝업 자동 닫힘.",
    },
    {
      title: "중복 검사",
      description: "submit 시 자기 자신을 제외하고 귀속연월 + 주민번호 + 업종코드 중복 검사. 다건 시 각 탭별 독립 검사.",
    },
    {
      title: "귀속 기준 예외 확인",
      description: "단건: 예외 업종 + 귀속연도≠지급연도 시 confirm \"해당 데이터는 YYYY년 12월 사업소득에 표시됩니다.\" / 다건: \"예외 업종 데이터가 포함되어 있습니다. 귀속연도 12월에 표시됩니다.\"",
    },
    {
      title: "탭 구조 (다건 모드)",
      description: "합산 행 클릭 시 탭 기반 편집. 탭 라벨: \"YYYY.MM 지급\". 지급연월 오름차순 정렬. 에러 있는 탭에 \"!\" 표시. 단건 진입 시 탭 숨김.",
    },
    {
      title: "일괄 검증·저장",
      description: "\"수정\" 버튼 클릭 시 모든 탭 일괄 검증. 검증 실패 시 첫 번째 에러 탭으로 자동 전환. 모든 탭 통과 시 일괄 저장.",
    },
    {
      title: "그룹 분리",
      description: "귀속연월/업종코드/주민번호 수정 시 그룹핑 키 변경으로 기존 그룹에서 자연 분리. 별도 안내 없이 저장 후 리스트 갱신 시 반영.",
    },
    {
      title: "단건/다건 동적 전환",
      description: "다건에서 탭 삭제로 1건 남으면 자동으로 단건 모드 전환 (탭 UI 사라짐, 삭제 버튼 텍스트 변경).",
    },
  ],
  detailedContent: editContent,
  sourceFile: "policy_사업소득수정팝업_merged.md",
};

// ─── 사업소득 엑셀 업로드 ─────────────────────────────

const spsExcelFields: PolicyField[] = [
  { name: "성명(상호)", required: true, type: "text", maxLength: 50 },
  { name: "귀속연도", required: true, type: "number", description: "정수" },
  { name: "귀속월", required: true, type: "number", description: "1~12" },
  { name: "지급연도", required: true, type: "number", description: "정수" },
  { name: "지급월", required: true, type: "number", description: "1~12" },
  { name: "주민(사업자)등록번호", required: true, type: "text", maxLength: 13 },
  { name: "내외국인", required: true, type: "enum", options: ["N", "Y"] },
  { name: "업종코드", required: true, type: "text", description: "유효한 업종코드" },
  { name: "지급총액", required: true, type: "number", description: "양의 정수, 최대 12자리" },
  { name: "세율", required: false, type: "number", description: "외국인+직업운동가인 경우만 필수 (3 또는 20)" },
];

const spsExcelTableColumns: TableColumn[] = [];

export const spsExcelPolicy: PolicyModule = {
  id: "sps-excel",
  moduleName: "사업소득 엑셀 업로드",
  features: "엑셀 파일로 사업소득 대량 업로드 / 행별 검증 / 실패 목록 다운로드",
  screens: [
    {
      screenId: "SPS_BI_01",
      screenName: "엑셀 업로드",
      description: "사업소득 합산 화면에서 엑셀 파일 업로드. .xlsx/.xls만 허용, 최대 10MB.",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_01",
    search: { target: "", placeholder: "", specialCharAllowed: false },
    sort: "",
    pageSizeOptions: [],
    defaultPageSize: 0,
    excelFileName: "사업소득업로드_실패목록_YYYYMMDD",
    rowClickAction: "",
  },
  addPopup: {
    screenId: "SPS_BI_01",
    confirmMessage: "",
    toastMessage: "사업소득 엑셀 업로드를 완료했습니다.",
  },
  editPopup: {
    screenId: "SPS_BI_01",
    confirmMessage: "",
    toastMessage: "",
  },
  fields: spsExcelFields,
  tableColumns: spsExcelTableColumns,
  deletePolicy: {
    type: "해당 없음",
    description: ["엑셀 업로드에서는 삭제 기능 없음"],
  },
  extraPolicies: [
    {
      title: "파일 사양",
      description: ".xlsx/.xls만 허용. 최대 10MB. 단일 파일만 업로드 가능. Row 13부터 데이터.",
    },
    {
      title: "행별 검증",
      description: "성공 행은 즉시 저장, 실패 행은 건너뜀. 검증 순서: 필수값 → 연도/월 범위 → 귀속≤지급 → 내외국인 → 업종코드 → 금액 → 자릿수 → 체크디짓 → 세율 → 중복.",
    },
    {
      title: "결과 화면",
      description: "전체/성공/실패 건수 표시. 실패 목록(주민번호+사유) 표시. 실패 데이터 다운로드 버튼 제공.",
    },
  ],
  detailedContent: excelContent,
  sourceFile: "policy_사업소득엑셀업로드_merged.md",
};

// ─── 전체 사업소득 (SPS_BI_05) ─────────────────────────────

const spsAllListTableColumns: TableColumn[] = [
  { name: "귀속연도", type: "YYYY년", note: "좌측 정렬" },
  { name: "귀속월", type: "MM월", note: "좌측 정렬" },
  { name: "지급연도", type: "YYYY년", note: "좌측 정렬" },
  { name: "지급월", type: "MM월", note: "좌측 정렬" },
  { name: "성명(상호)", type: "문자열", note: "좌측 정렬" },
  { name: "주민(사업자)등록번호", type: "문자열", note: "마스킹 없이 전체 표시" },
  { name: "업종코드", type: "문자열", note: "좌측 정렬" },
  { name: "지급액", type: "금액", note: "천 단위 콤마 + 원, 우측 정렬" },
  { name: "소득세", type: "금액", note: "천 단위 콤마 + 원, 우측 정렬" },
  { name: "지방소득세", type: "금액", note: "천 단위 콤마 + 원, 우측 정렬" },
  { name: "실지급액", type: "금액", note: "천 단위 콤마 + 원, 우측 정렬" },
];

export const spsAllListPolicy: PolicyModule = {
  id: "sps-all-list",
  moduleName: "전체 사업소득",
  features: "전체 사업소득 조회 / 검색 / 추가 / 수정 / 삭제 / 엑셀 다운로드 / 엑셀 업로드",
  screens: [
    {
      screenId: "SPS_BI_05",
      screenName: "전체 사업소득 화면",
      description: "등록된 모든 사업소득 데이터를 월별 필터 없이 조회·관리. 귀속 예외 규칙 미적용, 원본 값 그대로 표시.",
    },
    {
      screenId: "SPS_BI_06",
      screenName: "전체 사업소득 추가 팝업",
      description: "지급연도/지급월을 포함한 사업소득 신규 추가 (자동 세액 계산)",
    },
    {
      screenId: "SPS_BI_07",
      screenName: "전체 사업소득 수정 팝업",
      description: "모든 필드 수정 가능, 지급액 0원 허용, 삭제 기능 포함",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_05",
    search: {
      target: "성명(상호)",
      placeholder: "성명(상호)를 입력해주세요.",
      maxLength: 50,
      specialCharAllowed: false,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "전체 사업소득",
    rowClickAction: "수정 팝업(SPS_BI_07) 노출",
  },
  addPopup: {
    screenId: "SPS_BI_06",
    confirmMessage: "사업소득 추가를 취소하시겠습니까?",
    toastMessage: "사업소득 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "SPS_BI_07",
    confirmMessage: "사업소득 수정을 취소하시겠습니까?",
    toastMessage: "사업소득 수정을 완료했습니다.",
  },
  fields: [],
  tableColumns: spsAllListTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "선택 삭제 지원",
      "SPS_BI_01/SPS_BI_02 화면과 데이터 연동",
    ],
    warning: "총 N개의 리스트를 삭제하시겠습니까?",
  },
  extraPolicies: [
    {
      title: "데이터 표시 규칙",
      description: "귀속 기준 예외 규칙 미적용. 모든 데이터를 저장된 원본 값(귀속연도/귀속월/지급연도/지급월) 그대로 표시.",
    },
    {
      title: "데이터 연동",
      description: "추가/수정/삭제 시 SPS_BI_01(사업소득 합산) 및 SPS_BI_02(사업소득 월별 리스트) 화면과 양방향 연동.",
    },
    {
      title: "엑셀 다운로드 규칙",
      description: "검색하지 않았을 경우: 전체 리스트. 검색했을 경우: 검색 결과. 리스트 선택 후 클릭 시: 선택한 리스트만. 금액은 숫자 형식(콤마/'원' 없이) 저장.",
    },
    {
      title: "엑셀 업로드",
      description: "SPS_BI_01 엑셀 업로드 기능과 동일. 업로드 완료 후 전체 사업소득 리스트 자동 갱신.",
    },
  ],
  detailedContent: allListContent,
  sourceFile: "policy_전체사업소득_merged.md",
};

// ─── 전체 사업소득 추가 팝업 (SPS_BI_06) ─────────────────────────────

const spsAllAddFields: PolicyField[] = [
  {
    name: "지급연도",
    required: true,
    type: "select",
    options: ["2025", "2026", "2027"],
    description: "2025년 ~ (현재연도 + 1)년. placeholder: \"선택\".",
  },
  {
    name: "지급월",
    required: true,
    type: "select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    description: "1월~12월. placeholder: \"선택\".",
  },
  {
    name: "귀속연도",
    required: true,
    type: "select",
    options: ["2025", "2026"],
    description: "2025년 ~ 현재연도. placeholder: \"선택\".",
  },
  {
    name: "귀속월",
    required: true,
    type: "select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    description: "1월~12월. placeholder: \"선택\".",
  },
  {
    name: "성명(상호)",
    required: true,
    type: "text",
    maxLength: 50,
    validation: ["허용 문자: 한글·영문·숫자·공백·&·'·-·.·(가운뎃점)", "공백만 입력 시 필수 에러"],
    errorMessages: { required: "필수 입력 항목입니다." },
    description: "허용되지 않은 문자는 입력 불가.",
  },
  {
    name: "내외국인 구분",
    required: true,
    type: "radio",
    options: ["내국인", "외국인"],
    description: "기본값: 내국인.",
  },
  {
    name: "주민(사업자)등록번호",
    required: true,
    type: "text",
    maxLength: 13,
    validation: [
      "숫자만 입력 가능",
      "10자리 또는 13자리만 허용",
      "체크디짓 알고리즘 검증",
      "병의원(851101) 선택 시 10자리 이하만 허용",
    ],
    errorMessages: {
      length: "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.",
      checkDigit: "유효하지 않은 주민(사업자)등록번호입니다.",
      hospital: "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다.",
    },
  },
  {
    name: "업종코드",
    required: true,
    type: "select",
    description: "40개 업종코드 목록 중 선택. placeholder: \"선택\".",
  },
  {
    name: "지급액",
    required: true,
    type: "number",
    description: "0 이상 정수만 허용. 최대 12자리. 천 단위 콤마 표시.",
    validation: ["숫자만 입력 가능", "앞자리 0 자동 제거"],
    errorMessages: { required: "필수 입력 항목입니다." },
  },
];

const spsAllAddCalcColumns: TableColumn[] = [
  { name: "세율(%)", type: "퍼센트", note: "기본 3%, 봉사료 5%, 외국인+운동가 3%/20% 선택" },
  { name: "소득세", type: "금액", note: "지급액 × 세율 (절사). 소액부징수: <1,000원 → 0원" },
  { name: "지방소득세", type: "금액", note: "소득세 × 0.1 (절사). 소득세 0원이면 0원" },
  { name: "실지급액", type: "금액", note: "지급액 - 소득세 - 지방소득세" },
];

export const spsAllAddPolicy: PolicyModule = {
  id: "sps-all-add",
  moduleName: "전체 사업소득 추가 팝업",
  features: "사업소득 신규 추가 / 지급연도·지급월 직접 입력 / 자동 세액 계산 / 귀속 기준 예외 확인",
  screens: [
    {
      screenId: "SPS_BI_06",
      screenName: "전체 사업소득 추가 팝업",
      description: "SPS_BI_03과 동일 기능 + 지급연도/지급월 입력 필드 추가. 특정 지급연월에 종속되지 않음.",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_06",
    search: { target: "", placeholder: "", specialCharAllowed: false },
    sort: "",
    pageSizeOptions: [],
    defaultPageSize: 0,
    excelFileName: "",
    rowClickAction: "",
  },
  addPopup: {
    screenId: "SPS_BI_06",
    confirmMessage: "사업소득 추가를 취소하시겠습니까?",
    toastMessage: "사업소득 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "SPS_BI_06",
    confirmMessage: "",
    toastMessage: "",
  },
  fields: spsAllAddFields,
  tableColumns: spsAllAddCalcColumns,
  deletePolicy: {
    type: "해당 없음",
    description: ["추가 팝업에서는 삭제 기능 없음"],
  },
  extraPolicies: [
    {
      title: "SPS_BI_03 대비 차이점",
      description: "지급연도(2025~현재+1)와 지급월(1~12)을 사용자가 직접 셀렉트박스로 선택. SPS_BI_03에서는 부모 화면이 고정값을 전달.",
    },
    {
      title: "귀속연월 유효성",
      description: "지급연월과 귀속연월이 모두 선택된 상태에서 blur 시 검사. 귀속연월 > 지급연월이면 에러: \"귀속연월은 지급연월보다 이전 날짜여야합니다.\"",
    },
    {
      title: "세율 결정 로직",
      description: "기본 3%. 봉사료수취자(940905) → 5% 고정. 외국인+직업운동가(940904) → 라디오 버튼으로 3%/20% 선택 (기본 3%).",
    },
    {
      title: "소액부징수",
      description: "소득세가 1,000원 미만이면 소득세=0원, 지방소득세=0원.",
    },
    {
      title: "중복 검사",
      description: "submit 시 입력한 지급연월 기준으로 귀속연월 + 주민(사업자)등록번호 + 업종코드가 동일한 데이터 존재 시 등록 차단.",
    },
    {
      title: "귀속 기준 예외 확인",
      description: "예외 업종(940906/940907/940908) + 귀속연도≠지급연도 시 confirm: \"해당 데이터는 YYYY년 12월 사업소득에 표시됩니다.\"",
    },
  ],
  detailedContent: allAddContent,
  sourceFile: "policy_전체사업소득추가팝업_merged.md",
};

// ─── 전체 사업소득 수정 팝업 (SPS_BI_07) ─────────────────────────────

const spsAllEditFields: PolicyField[] = [
  {
    name: "지급연도",
    required: true,
    type: "select",
    description: "수정 가능. 2025년 ~ (현재연도 + 1)년.",
  },
  {
    name: "지급월",
    required: true,
    type: "select",
    description: "수정 가능. 1월~12월.",
  },
  {
    name: "귀속연도",
    required: true,
    type: "select",
    description: "수정 가능. 2025년 ~ 현재연도.",
  },
  {
    name: "귀속월",
    required: true,
    type: "select",
    description: "수정 가능. 1월~12월.",
  },
  {
    name: "성명(상호)",
    required: true,
    type: "text",
    maxLength: 50,
    description: "수정 가능. 허용 문자: 한글·영문·숫자·공백·허용 특수문자.",
  },
  {
    name: "내외국인 구분",
    required: true,
    type: "radio",
    description: "수정 가능. 변경 시 세율 조건부 전환 트리거.",
  },
  {
    name: "주민(사업자)등록번호",
    required: true,
    type: "text",
    maxLength: 13,
    description: "수정 가능. 마스킹 없이 전체 표시.",
    validation: [
      "숫자만 입력 가능",
      "10자리 또는 13자리만 허용",
      "체크디짓 알고리즘 검증",
      "병의원(851101) 선택 시 10자리 이하만 허용",
    ],
    errorMessages: {
      length: "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다.",
      checkDigit: "유효하지 않은 주민(사업자)등록번호입니다.",
      hospital: "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다.",
    },
  },
  {
    name: "업종코드",
    required: true,
    type: "select",
    description: "수정 가능.",
  },
  {
    name: "지급액",
    required: true,
    type: "number",
    description: "수정 가능. 0원 입력 허용. 최대 12자리.",
  },
];

const spsAllEditCalcColumns: TableColumn[] = [
  { name: "세율(%)", type: "퍼센트", note: "추가 팝업과 동일 로직" },
  { name: "소득세", type: "금액", note: "자동 계산" },
  { name: "지방소득세", type: "금액", note: "자동 계산" },
  { name: "실지급액", type: "금액", note: "자동 계산" },
];

export const spsAllEditPolicy: PolicyModule = {
  id: "sps-all-edit",
  moduleName: "전체 사업소득 수정 팝업",
  features: "사업소득 수정 / 삭제 / 모든 필드 수정 가능 / 자동 세액 재계산",
  screens: [
    {
      screenId: "SPS_BI_07",
      screenName: "전체 사업소득 수정 팝업",
      description: "모든 필드(지급연월/귀속연월/성명/내외국인/주민번호/업종코드/지급액) 수정 가능. 지급액 0원 허용.",
    },
  ],
  listScreen: {
    screenId: "SPS_BI_07",
    search: { target: "", placeholder: "", specialCharAllowed: false },
    sort: "",
    pageSizeOptions: [],
    defaultPageSize: 0,
    excelFileName: "",
    rowClickAction: "",
  },
  addPopup: {
    screenId: "SPS_BI_07",
    confirmMessage: "",
    toastMessage: "",
  },
  editPopup: {
    screenId: "SPS_BI_07",
    confirmMessage: "사업소득 수정을 취소하시겠습니까?",
    toastMessage: "사업소득 수정을 완료했습니다.",
  },
  fields: spsAllEditFields,
  tableColumns: spsAllEditCalcColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "항상 삭제 가능 (삭제 불가능한 경우 없음)",
      "삭제 후 SPS_BI_05 화면으로 이동 (초기 상태 리셋)",
    ],
    warning: "사업소득을 삭제하시겠습니까? 삭제한 정보는 복구할 수 없습니다.",
  },
  extraPolicies: [
    {
      title: "SPS_BI_04 대비 차이점",
      description: "지급연도/지급월이 표시되고 수정 가능. 성명·내외국인·주민번호도 수정 가능. 삭제 후 SPS_BI_05로 이동(SPS_BI_04는 SPS_BI_02로 이동).",
    },
    {
      title: "SPS_BI_06 대비 차이점",
      description: "지급액 0원 허용. 삭제 기능(항상 삭제 가능). 중복 검사 시 자기 자신 제외.",
    },
    {
      title: "에러 시 수정 버튼 비활성화",
      description: "유효성 에러가 1건 이상 존재하면 수정 버튼 비활성화. 모든 에러 해소 시 활성화.",
    },
    {
      title: "중복 검사",
      description: "submit 시 자기 자신을 제외하고 입력한 지급연월 기준으로 귀속연월 + 주민번호 + 업종코드 중복 검사.",
    },
    {
      title: "삭제 동작",
      description: "삭제 버튼 클릭 → confirm → 삭제 처리 → 토스트(\"삭제 완료되었습니다.\") → SPS_BI_05 초기 상태 리셋. 변경사항 존재 여부 무관하게 바로 삭제 confirm.",
    },
  ],
  detailedContent: allEditContent,
  sourceFile: "policy_전체사업소득수정팝업_merged.md",
};

// ─── 전체 정책 목록 ─────────────────────────────────────

export const allPolicies: PolicyModule[] = [
  spsSummaryPolicy,
  spsMonthlyPolicy,
  spsAddPolicy,
  spsEditPolicy,
  spsExcelPolicy,
  spsAllListPolicy,
  spsAllAddPolicy,
  spsAllEditPolicy,
];

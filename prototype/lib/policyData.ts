import { PolicyModule, PolicyField, TableColumn } from "@/types";

const employeeFields: PolicyField[] = [
  {
    name: "사번",
    required: true,
    type: "text",
    maxLength: 30,
    validation: ["중복 불가 (submit 시점)"],
    errorMessages: { duplicate: "중복된 사번은 사용하실 수 없습니다." },
    description: '허용 특수문자 32개: !"#$%&\'()*+,-./:;<>=?@[₩]^_`{|}~',
  },
  {
    name: "성명",
    required: true,
    type: "text",
    maxLength: 30,
    validation: ["특수문자 불가"],
    errorMessages: { specialChar: "특수문자는 입력하실 수 없습니다." },
  },
  {
    name: "내외국인 여부",
    required: true,
    type: "enum",
    options: ["내국인", "외국인"],
    description: "선택에 따라 분기 입력 필드 변경",
  },
  {
    name: "주민등록번호",
    required: true,
    type: "split-input",
    description: "내국인 선택 시 필수. 인풋박스 2개(앞 6자리 - 뒤 7자리). 숫자만 입력 가능.",
    validation: [
      "앞 6자리 날짜 유효성",
      "뒤 7자리 첫 숫자: 1900년대(1,2) / 2000년대(3,4)",
    ],
    errorMessages: { invalid: "유효하지 않은 주민등록번호입니다." },
  },
  {
    name: "외국인등록번호",
    required: false,
    type: "split-input",
    description:
      "외국인 선택 시 여권번호와 택 1 필수. 인풋박스 2개(앞 6자리 - 뒤 7자리). 숫자만 입력 가능.",
    validation: [
      "앞 6자리 날짜 유효성",
      "뒤 7자리 첫 숫자: 1900년대(5,6) / 2000년대(7,8)",
    ],
    errorMessages: { invalid: "유효하지 않은 외국인등록번호입니다." },
  },
  {
    name: "여권번호",
    required: false,
    type: "text",
    description:
      "외국인 선택 시 외국인등록번호와 택 1 필수. 특수문자 불가. 선택 시 생년월일/성별 추가 필수.",
  },
  {
    name: "국적",
    required: true,
    type: "select",
    description: "외국인 선택 시 필수. 전세계 국가 리스트, 가나다순 정렬.",
  },
  {
    name: "거주구분",
    required: true,
    type: "radio",
    options: ["거주자", "비거주자"],
  },
  {
    name: "장애여부",
    required: true,
    type: "enum",
    options: [
      "비장애인",
      "장애인복지법상 장애인",
      "국가유공자 중증환자",
      "중증환자",
    ],
  },
  {
    name: "이메일",
    required: true,
    type: "email",
    validation: ["blur: 형식 검사", "submit: 퇴사일 NULL인 임직원과 중복 불가"],
    errorMessages: {
      format: "이메일 형식이 맞지 않습니다.",
      duplicate: "근로자 중 중복된 이메일이 등록되어 있습니다.",
    },
  },
  {
    name: "연락처",
    required: true,
    type: "text",
    maxLength: 30,
    description: "허용 문자: + ( ) - 숫자",
  },
  {
    name: "휴대폰번호",
    required: true,
    type: "split-input",
    description: "인풋박스 3개(3자리 - 3자리 - 4자리). 숫자만 입력 가능.",
  },
  {
    name: "입사일",
    required: true,
    type: "date",
    description: "YYYYMMDD",
    validation: ["blur 시 유효성 검사"],
    errorMessages: { invalid: "유효하지 않은 날짜입니다." },
  },
  {
    name: "퇴사일",
    required: false,
    type: "date",
    description: "YYYYMMDD. NULL 허용(선택 입력)",
    validation: ["blur 시 유효성 검사"],
    errorMessages: { invalid: "유효하지 않은 날짜입니다." },
  },
  {
    name: "주소",
    required: true,
    type: "address",
    description:
      "외부 무료 주소 검색 API 사용. 주소 검색 팝업 제공. 결과 클릭 시 우편번호/주소 자동 입력, 상세주소 포커스 이동.",
  },
];

const employeeTableColumns: TableColumn[] = [
  { name: "사번", type: "문자열" },
  { name: "성명", type: "문자열" },
  { name: "내외국인 여부", type: "ENUM", note: "내국인 / 외국인" },
  { name: "이메일", type: "문자열" },
  { name: "입사일", type: "YYYYMMDD" },
  { name: "퇴사일", type: "YYYYMMDD / NULL", note: "NULL일 경우 빈 값 표시" },
  { name: "연락처", type: "문자열" },
  {
    name: "장애여부",
    type: "ENUM",
    note: "비장애인 / 장애인복지법상 장애인 / 국가유공자 중증환자 / 중증환자",
  },
];

const workTypeFields: PolicyField[] = [
  {
    name: "근로형태명",
    required: true,
    type: "text",
    maxLength: 10,
    validation: ["특수문자 불가", "최대 글자 수 초과 검사"],
    errorMessages: {
      specialChar: "특수문자는 입력하실 수 없습니다.",
      maxLength: "최대 10자까지 입력 가능합니다.",
    },
  },
  {
    name: "근로형태 코드",
    required: true,
    type: "text",
    maxLength: 10,
    validation: [
      "특수문자 불가",
      "최대 글자 수 초과 검사",
      "중복 불가 (submit 시점)",
    ],
    errorMessages: {
      specialChar: "특수문자는 입력하실 수 없습니다.",
      maxLength: "최대 10자까지 입력 가능합니다.",
      duplicate: "중복된 근로형태 코드는 사용하실 수 없습니다.",
    },
  },
];

const workTypeTableColumns: TableColumn[] = [
  { name: "근로형태명", type: "문자열", note: "최대 10자" },
  { name: "근로형태 코드", type: "문자열", note: "최대 10자" },
];

export const employeePolicy: PolicyModule = {
  id: "employee",
  moduleName: "임직원 관리",
  features: "임직원 추가 / 수정 / 삭제",
  screens: [
    {
      screenId: "HRIS_EP_01",
      screenName: "리스트 화면",
      description: "임직원 리스트 조회, 검색, 삭제, 엑셀 다운로드",
    },
    {
      screenId: "HRIS_EP_02",
      screenName: "추가 팝업",
      description: "임직원 신규 추가",
    },
    {
      screenId: "HRIS_EP_03",
      screenName: "수정 팝업",
      description: "임직원 정보 수정 (사번 읽기 전용)",
    },
  ],
  listScreen: {
    screenId: "HRIS_EP_01",
    search: {
      target: "사번 OR 성명",
      placeholder: "사번 또는 성명을 입력해주세요.",
      specialCharAllowed: true,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "HIRS_유저_리스트",
    rowClickAction: "수정 팝업(HRIS_EP_03) 노출, DB PK(id) 전달",
  },
  addPopup: {
    screenId: "HRIS_EP_02",
    confirmMessage: "임직원 추가를 취소하시겠습니까?",
    toastMessage: "임직원 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "HRIS_EP_03",
    confirmMessage: "임직원 수정을 취소하시겠습니까?",
    toastMessage: "임직원 수정을 완료했습니다.",
    readonlyFields: ["사번"],
  },
  fields: employeeFields,
  tableColumns: employeeTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "급여/연말정산 데이터 함께 삭제",
      "삭제 후 복구 불가",
      "삭제된 사번은 재사용 가능",
    ],
  },
};

export const workTypePolicy: PolicyModule = {
  id: "worktype",
  moduleName: "근로형태 관리",
  features: "근로형태 추가 / 수정 / 삭제",
  screens: [
    {
      screenId: "HRIS_WT_01",
      screenName: "리스트 화면",
      description: "근로형태 리스트 조회, 검색, 삭제, 엑셀 다운로드",
    },
    {
      screenId: "HRIS_WT_02",
      screenName: "추가 팝업",
      description: "근로형태 신규 추가",
    },
    {
      screenId: "HRIS_WT_03",
      screenName: "수정 팝업",
      description: "근로형태 정보 수정",
    },
  ],
  listScreen: {
    screenId: "HRIS_WT_01",
    search: {
      target: "근로형태명 OR 근로형태 코드",
      placeholder: "근로형태명 또는 근로형태 코드를 입력해주세요.",
      maxLength: 10,
      specialCharAllowed: false,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "HRIS_근로형태_리스트",
    rowClickAction: "수정 팝업(HRIS_WT_03) 노출, DB PK(id) 전달",
  },
  addPopup: {
    screenId: "HRIS_WT_02",
    confirmMessage: "근로형태 추가를 취소하시겠습니까?",
    toastMessage: "근로형태 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "HRIS_WT_03",
    confirmMessage: "근로형태 수정을 취소하시겠습니까?",
    toastMessage: "근로형태 수정을 완료했습니다.",
  },
  fields: workTypeFields,
  tableColumns: workTypeTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "삭제된 근로형태를 사용 중인 임직원의 근로형태 값을 NULL로 변경",
    ],
    warning:
      "해당 근로형태를 사용 중인 임직원이 N명 있습니다. 삭제 시 해당 임직원의 근로형태가 초기화됩니다. 삭제하시겠습니까?",
  },
  extraPolicies: [
    {
      title: "임직원 관리 연관 - 근로형태 입력 필드",
      description:
        "임직원 추가/수정 팝업에 근로형태 셀렉박스 추가. 단일선택, 근로형태명만 표시, 가나다순 정렬, 선택값(필수 아님).",
    },
    {
      title: "근로형태 삭제 시 임직원 연관 처리",
      description:
        "삭제 시 해당 근로형태가 지정된 임직원의 근로형태 값을 NULL로 변경. 삭제 API에서 연관 처리 수행.",
    },
  ],
};

// ─── 급여항목 ─────────────────────────────────────

const payItemFields: PolicyField[] = [
  {
    name: "구분",
    required: true,
    type: "radio",
    options: ["지급항목", "공제항목"],
    description: "선택에 따라 유형 옵션이 변경됨",
  },
  {
    name: "급여코드",
    required: true,
    type: "text",
    maxLength: 10,
    validation: ["중복 불가 (submit 시점)", "특수문자 불가"],
    errorMessages: {
      duplicate: "중복된 급여코드는 사용하실 수 없습니다.",
      specialChar: "특수문자는 입력하실 수 없습니다.",
      maxLength: "최대 10자까지 입력 가능합니다.",
    },
  },
  {
    name: "항목명",
    required: true,
    type: "text",
    maxLength: 30,
    validation: ["특수문자 불가"],
    errorMessages: {
      specialChar: "특수문자는 입력하실 수 없습니다.",
      maxLength: "최대 30자까지 입력 가능합니다.",
    },
  },
  {
    name: "유형",
    required: true,
    type: "select",
    description: "구분이 지급항목이면: 기본급, 수당, 상여금. 공제항목이면: 4대보험, 세금, 기타공제.",
    options: ["기본급", "수당", "상여금", "4대보험", "세금", "기타공제"],
  },
];

const payItemTableColumns: TableColumn[] = [
  { name: "구분", type: "ENUM", note: "지급항목 / 공제항목" },
  { name: "급여코드", type: "문자열", note: "최대 10자" },
  { name: "항목명", type: "문자열", note: "최대 30자" },
  { name: "유형", type: "ENUM", note: "구분에 따라 옵션 변동" },
];

export const payItemPolicy: PolicyModule = {
  id: "payitem",
  moduleName: "급여항목 관리",
  features: "급여항목 추가 / 수정 / 삭제",
  screens: [
    {
      screenId: "HRIS_PI_01",
      screenName: "리스트 화면",
      description: "급여항목 리스트 조회, 검색, 삭제, 엑셀 다운로드",
    },
    {
      screenId: "HRIS_PI_02",
      screenName: "추가 팝업",
      description: "급여항목 신규 추가",
    },
    {
      screenId: "HRIS_PI_03",
      screenName: "수정 팝업",
      description: "급여항목 정보 수정 (구분 읽기 전용)",
    },
  ],
  listScreen: {
    screenId: "HRIS_PI_01",
    search: {
      target: "급여코드 OR 항목명",
      placeholder: "급여코드 또는 항목명을 입력해주세요.",
      maxLength: 30,
      specialCharAllowed: false,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "HRIS_급여항목_리스트",
    rowClickAction: "수정 팝업(HRIS_PI_03) 노출, DB PK(id) 전달",
  },
  addPopup: {
    screenId: "HRIS_PI_02",
    confirmMessage: "급여항목 추가를 취소하시겠습니까?",
    toastMessage: "급여항목 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "HRIS_PI_03",
    confirmMessage: "급여항목 수정을 취소하시겠습니까?",
    toastMessage: "급여항목 수정을 완료했습니다.",
    readonlyFields: ["구분"],
  },
  fields: payItemFields,
  tableColumns: payItemTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "확정된 급여대장에서 사용 중인 급여항목은 삭제 불가",
    ],
    warning: "확정된 급여대장에서 사용 중인 항목이 포함되어 있어 삭제할 수 없습니다.",
  },
};

// ─── 급여대장 ─────────────────────────────────────

const payrollFields: PolicyField[] = [
  {
    name: "급여대장명",
    required: true,
    type: "text",
    maxLength: 50,
    validation: ["최대 글자 수 초과 검사"],
    errorMessages: {
      maxLength: "최대 50자까지 입력 가능합니다.",
    },
  },
  {
    name: "귀속연도",
    required: true,
    type: "select",
    options: ["2024", "2025", "2026"],
    description: "드롭다운 선택",
  },
  {
    name: "귀속월",
    required: true,
    type: "select",
    options: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
    description: "드롭다운 선택",
  },
  {
    name: "지급일자",
    required: true,
    type: "date",
    description: "YYYY-MM-DD. 귀속연월 이후 날짜만 허용.",
    validation: ["지급일자 >= 귀속연월 첫째날"],
    errorMessages: { invalid: "지급일자는 귀속연월 이후여야 합니다." },
  },
];

const payrollTableColumns: TableColumn[] = [
  { name: "급여대장명", type: "문자열", note: "최대 50자" },
  { name: "귀속연도", type: "숫자" },
  { name: "귀속월", type: "숫자" },
  { name: "지급일자", type: "YYYY-MM-DD" },
  { name: "확정여부", type: "ENUM", note: "확정 / 미확정" },
  { name: "수정", type: "버튼", note: "수정 팝업 열기" },
];

export const payrollPolicy: PolicyModule = {
  id: "payroll",
  moduleName: "급여대장 관리",
  features: "급여대장 추가 / 수정 / 삭제 / 확정·해제",
  screens: [
    {
      screenId: "HRIS_PR_01",
      screenName: "리스트 화면",
      description: "급여대장 리스트 조회, 검색, 삭제, 엑셀 다운로드",
    },
    {
      screenId: "HRIS_PR_02",
      screenName: "추가 팝업",
      description: "급여대장 신규 추가",
    },
    {
      screenId: "HRIS_PR_03",
      screenName: "수정 팝업",
      description: "급여대장 정보 수정 (확정 시 readonly)",
    },
  ],
  listScreen: {
    screenId: "HRIS_PR_01",
    search: {
      target: "급여대장명",
      placeholder: "급여대장명을 입력해주세요.",
      specialCharAllowed: true,
    },
    sort: "최근 등록 순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "HRIS_급여대장_리스트",
    rowClickAction: "급여내역 상세 화면으로 이동 (payrollId 전달)",
  },
  addPopup: {
    screenId: "HRIS_PR_02",
    confirmMessage: "급여대장 추가를 취소하시겠습니까?",
    toastMessage: "급여대장 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "HRIS_PR_03",
    confirmMessage: "급여대장 수정을 취소하시겠습니까?",
    toastMessage: "급여대장 수정을 완료했습니다.",
    readonlyFields: ["확정된 급여대장의 모든 필드"],
  },
  fields: payrollFields,
  tableColumns: payrollTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "삭제 후 복구 불가",
      "확정된 급여대장은 삭제 불가",
      "급여내역 데이터 함께 삭제",
    ],
    warning: "확정된 급여대장은 삭제할 수 없습니다.",
  },
  extraPolicies: [
    {
      title: "급여대장 확정/해제",
      description: "확정 시 급여대장 수정/삭제 불가. 급여내역 상세에서 확정/해제 토글.",
    },
    {
      title: "행 클릭 동작",
      description: "급여대장 리스트에서 행 클릭 시 급여내역 상세 페이지로 이동. 수정 팝업은 별도 수정 버튼으로 접근.",
    },
  ],
};

// ─── 급여내역 상세 ─────────────────────────────────────

const payrollDetailFields: PolicyField[] = [
  {
    name: "사번",
    required: true,
    type: "text",
    description: "임직원 추가 팝업에서 선택",
  },
  {
    name: "성명",
    required: true,
    type: "text",
    description: "임직원 추가 시 자동 입력",
  },
  {
    name: "급여항목별 금액",
    required: false,
    type: "number",
    description: "활성화된 급여항목별 금액 입력. 콤마 포맷.",
  },
];

const payrollDetailTableColumns: TableColumn[] = [
  { name: "사번", type: "문자열" },
  { name: "성명", type: "문자열" },
  { name: "(동적) 지급항목들", type: "숫자", note: "활성화된 지급항목 컬럼" },
  { name: "지급합계", type: "숫자", note: "지급항목 합산" },
  { name: "(동적) 공제항목들", type: "숫자", note: "활성화된 공제항목 컬럼" },
  { name: "공제합계", type: "숫자", note: "공제항목 합산" },
];

export const payrollDetailPolicy: PolicyModule = {
  id: "payroll-detail",
  moduleName: "급여내역 상세",
  features: "급여내역 조회 / 임직원 추가·삭제 / 급여항목 관리 / 급여확정·해제",
  screens: [
    {
      screenId: "HRIS_PD_01",
      screenName: "리스트 화면",
      description: "급여내역 상세 리스트 (동적 컬럼)",
    },
    {
      screenId: "HRIS_PD_02",
      screenName: "임직원 추가 팝업",
      description: "급여대장에 임직원 추가 (귀속연월 겹침 필터)",
    },
    {
      screenId: "HRIS_PD_03",
      screenName: "급여항목 관리 팝업",
      description: "급여항목 활성/비활성 토글",
    },
    {
      screenId: "HRIS_PD_04",
      screenName: "상세 수정 팝업",
      description: "임직원별 급여 금액 수정",
    },
  ],
  listScreen: {
    screenId: "HRIS_PD_01",
    search: {
      target: "사번 OR 성명",
      placeholder: "사번 또는 성명을 입력해주세요.",
      specialCharAllowed: true,
    },
    sort: "사번 오름차순",
    pageSizeOptions: [15, 30, 50, 100],
    defaultPageSize: 30,
    excelFileName: "HRIS_급여내역_리스트",
    rowClickAction: "상세 수정 팝업(HRIS_PD_04) 노출",
  },
  addPopup: {
    screenId: "HRIS_PD_02",
    confirmMessage: "임직원 추가를 취소하시겠습니까?",
    toastMessage: "임직원 추가를 완료했습니다.",
  },
  editPopup: {
    screenId: "HRIS_PD_04",
    confirmMessage: "급여내역 수정을 취소하시겠습니까?",
    toastMessage: "급여내역 수정을 완료했습니다.",
    readonlyFields: ["확정된 급여대장의 모든 필드"],
  },
  fields: payrollDetailFields,
  tableColumns: payrollDetailTableColumns,
  deletePolicy: {
    type: "물리삭제",
    description: [
      "급여내역에서 임직원 삭제",
      "확정된 급여대장에서는 삭제 불가",
    ],
  },
  extraPolicies: [
    {
      title: "동적 컬럼",
      description: "급여항목 관리에서 활성화된 항목만 테이블 컬럼으로 표시. 지급항목 → 지급합계 → 공제항목 → 공제합계 순서.",
    },
    {
      title: "급여확정/해제",
      description: "확정 시 모든 편집 비활성화 (임직원 추가/삭제, 금액 수정, 항목 관리). 해제 시 편집 가능 상태로 복원.",
    },
    {
      title: "임직원 추가 필터",
      description: "귀속연월과 근무기간이 겹치는 임직원 중 미추가 임직원만 추가 가능.",
    },
  ],
};

export const allPolicies: PolicyModule[] = [workTypePolicy, employeePolicy, payItemPolicy, payrollPolicy, payrollDetailPolicy];

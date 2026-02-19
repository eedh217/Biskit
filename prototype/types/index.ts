export type PolicyTag = "공통" | "화면별" | "보완" | "공통 권장" | "공통 기본값";

export interface PolicyField {
  name: string;
  required: boolean;
  type: string;
  maxLength?: number;
  validation?: string[];
  errorMessages?: Record<string, string>;
  description?: string;
  options?: string[];
}

export interface TableColumn {
  name: string;
  type: string;
  note?: string;
}

export interface PolicySection {
  id: string;
  title: string;
  tag: PolicyTag;
  items: PolicyItem[];
}

export interface PolicyItem {
  label: string;
  value: string;
  tag: PolicyTag;
  subItems?: PolicyItem[];
}

export interface PolicyScreen {
  screenId: string;
  screenName: string;
  description: string;
}

export interface PolicyModule {
  id: string;
  moduleName: string;
  features: string;
  screens: PolicyScreen[];
  listScreen: ListScreenPolicy;
  addPopup: PopupPolicy;
  editPopup: PopupPolicy;
  fields: PolicyField[];
  tableColumns: TableColumn[];
  deletePolicy: DeletePolicy;
  extraPolicies?: ExtraPolicy[];
}

export interface ListScreenPolicy {
  screenId: string;
  search: {
    target: string;
    placeholder: string;
    maxLength?: number;
    specialCharAllowed: boolean;
  };
  sort: string;
  pageSizeOptions: number[];
  defaultPageSize: number;
  excelFileName: string;
  rowClickAction: string;
}

export interface PopupPolicy {
  screenId: string;
  confirmMessage: string;
  toastMessage: string;
  readonlyFields?: string[];
}

export interface DeletePolicy {
  type: string;
  description: string[];
  warning?: string;
}

export interface ExtraPolicy {
  title: string;
  description: string;
}

export interface CompareItem {
  category: string;
  attribute: string;
  moduleA: string;
  moduleB: string;
  tag: PolicyTag;
  isDifferent: boolean;
}

export type TestCaseStatus = "pass" | "fail" | "pending";
export type TestCasePriority = "high" | "medium" | "low";

export interface TestCase {
  id: string;
  screenId: string;
  category: string;
  title: string;
  precondition: string;
  steps: string[];
  expectedResult: string;
  priority: TestCasePriority;
  tag: PolicyTag;
}

import { Employee, WorkType, PayItem, Payroll, PayrollDetailItem, PayrollItemConfig } from "@/types/manage";

const EMPLOYEE_KEY = "hris_employees";
const WORKTYPE_KEY = "hris_worktypes";
const PAYITEM_KEY = "hris_payitems";
const PAYROLL_KEY = "hris_payrolls";
const PAYROLL_DETAIL_KEY = "hris_payroll_details";
const PAYROLL_ITEM_CONFIG_KEY = "hris_payroll_item_configs";

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ─── 근로형태 ─────────────────────────────────────

const defaultWorkTypes: WorkType[] = [
  { id: "wt1", name: "정규직", code: "FT001", createdAt: "2025-01-15T09:00:00" },
  { id: "wt2", name: "계약직", code: "CT001", createdAt: "2025-01-15T09:01:00" },
  { id: "wt3", name: "파트타임", code: "PT001", createdAt: "2025-01-16T10:00:00" },
  { id: "wt4", name: "인턴", code: "IN001", createdAt: "2025-02-01T09:00:00" },
  { id: "wt5", name: "프리랜서", code: "FL001", createdAt: "2025-02-10T14:00:00" },
];

export function getWorkTypes(): WorkType[] {
  if (typeof window === "undefined") return defaultWorkTypes;
  const raw = localStorage.getItem(WORKTYPE_KEY);
  if (!raw) {
    localStorage.setItem(WORKTYPE_KEY, JSON.stringify(defaultWorkTypes));
    return defaultWorkTypes;
  }
  return JSON.parse(raw);
}

function saveWorkTypes(data: WorkType[]) {
  localStorage.setItem(WORKTYPE_KEY, JSON.stringify(data));
}

export function addWorkType(name: string, code: string): { success: boolean; error?: string } {
  const list = getWorkTypes();
  if (list.some((w) => w.code === code)) {
    return { success: false, error: "중복된 근로형태 코드는 사용하실 수 없습니다." };
  }
  const item: WorkType = { id: generateId(), name, code, createdAt: new Date().toISOString() };
  saveWorkTypes([item, ...list]);
  return { success: true };
}

export function updateWorkType(id: string, name: string, code: string): { success: boolean; error?: string } {
  const list = getWorkTypes();
  if (list.some((w) => w.code === code && w.id !== id)) {
    return { success: false, error: "중복된 근로형태 코드는 사용하실 수 없습니다." };
  }
  const updated = list.map((w) => (w.id === id ? { ...w, name, code } : w));
  saveWorkTypes(updated);
  return { success: true };
}

export function deleteWorkTypes(ids: string[]): { success: boolean; deletedCount: number } {
  const list = getWorkTypes();
  // 임직원의 workTypeId를 null로 변경
  const employees = getEmployees();
  const updatedEmployees = employees.map((e) =>
    ids.includes(e.workTypeId) ? { ...e, workTypeId: "" } : e
  );
  saveEmployees(updatedEmployees);

  const remaining = list.filter((w) => !ids.includes(w.id));
  saveWorkTypes(remaining);
  return { success: true, deletedCount: ids.length };
}

// ─── 임직원 ─────────────────────────────────────

const defaultEmployees: Employee[] = [
  {
    id: "emp1", employeeNumber: "EMP001", name: "김철수", nationality: "내국인",
    residentNumber1: "900101", residentNumber2: "1234567",
    residenceType: "거주자", disabilityStatus: "비장애인",
    email: "kim@company.com", phone: "02-1234-5678",
    mobile1: "010", mobile2: "1234", mobile3: "5678",
    hireDate: "20230101", resignDate: "",
    address: "서울시 강남구 테헤란로 123", addressDetail: "4층", zipCode: "06234",
    workTypeId: "wt1", createdAt: "2025-01-10T09:00:00",
    foreignerNumber1: "", foreignerNumber2: "", passportNumber: "", birthDate: "", gender: undefined, country: "",
  },
  {
    id: "emp2", employeeNumber: "EMP002", name: "이영희", nationality: "내국인",
    residentNumber1: "950315", residentNumber2: "2345678",
    residenceType: "거주자", disabilityStatus: "비장애인",
    email: "lee@company.com", phone: "02-9876-5432",
    mobile1: "010", mobile2: "9876", mobile3: "5432",
    hireDate: "20230301", resignDate: "",
    address: "서울시 서초구 서초대로 456", addressDetail: "2층", zipCode: "06500",
    workTypeId: "wt1", createdAt: "2025-01-12T10:00:00",
    foreignerNumber1: "", foreignerNumber2: "", passportNumber: "", birthDate: "", gender: undefined, country: "",
  },
  {
    id: "emp3", employeeNumber: "EMP003", name: "박민수", nationality: "내국인",
    residentNumber1: "880720", residentNumber2: "1567890",
    residenceType: "거주자", disabilityStatus: "장애인복지법상 장애인",
    email: "park@company.com", phone: "031-111-2222",
    mobile1: "010", mobile2: "1111", mobile3: "2222",
    hireDate: "20240601", resignDate: "",
    address: "경기도 성남시 분당구 판교로 789", addressDetail: "10층", zipCode: "13480",
    workTypeId: "wt2", createdAt: "2025-02-01T09:00:00",
    foreignerNumber1: "", foreignerNumber2: "", passportNumber: "", birthDate: "", gender: undefined, country: "",
  },
  {
    id: "emp4", employeeNumber: "EMP004", name: "John Smith", nationality: "외국인",
    foreignerNumber1: "850510", foreignerNumber2: "5123456",
    country: "미국", residenceType: "거주자", disabilityStatus: "비장애인",
    email: "john@company.com", phone: "02-3333-4444",
    mobile1: "010", mobile2: "3333", mobile3: "4444",
    hireDate: "20240901", resignDate: "",
    address: "서울시 용산구 이태원로 100", addressDetail: "3층", zipCode: "04340",
    workTypeId: "wt1", createdAt: "2025-02-05T11:00:00",
    residentNumber1: "", residentNumber2: "", passportNumber: "", birthDate: "", gender: undefined,
  },
  {
    id: "emp5", employeeNumber: "EMP005", name: "정수진", nationality: "내국인",
    residentNumber1: "920815", residentNumber2: "2678901",
    residenceType: "거주자", disabilityStatus: "비장애인",
    email: "jung@company.com", phone: "02-5555-6666",
    mobile1: "010", mobile2: "5555", mobile3: "6666",
    hireDate: "20220301", resignDate: "20241231",
    address: "서울시 마포구 월드컵북로 200", addressDetail: "1층", zipCode: "03900",
    workTypeId: "wt3", createdAt: "2025-01-05T08:00:00",
    foreignerNumber1: "", foreignerNumber2: "", passportNumber: "", birthDate: "", gender: undefined, country: "",
  },
];

export function getEmployees(): Employee[] {
  if (typeof window === "undefined") return defaultEmployees;
  const raw = localStorage.getItem(EMPLOYEE_KEY);
  if (!raw) {
    localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(defaultEmployees));
    return defaultEmployees;
  }
  return JSON.parse(raw);
}

function saveEmployees(data: Employee[]) {
  localStorage.setItem(EMPLOYEE_KEY, JSON.stringify(data));
}

export function addEmployee(data: Omit<Employee, "id" | "createdAt">): { success: boolean; error?: string } {
  const list = getEmployees();
  if (list.some((e) => e.employeeNumber === data.employeeNumber)) {
    return { success: false, error: "중복된 사번은 사용하실 수 없습니다." };
  }
  const activeEmails = list.filter((e) => !e.resignDate);
  if (activeEmails.some((e) => e.email === data.email)) {
    return { success: false, error: "근로자 중 중복된 이메일이 등록되어 있습니다." };
  }
  const item: Employee = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  saveEmployees([item, ...list]);
  return { success: true };
}

export function updateEmployee(id: string, data: Omit<Employee, "id" | "createdAt">): { success: boolean; error?: string } {
  const list = getEmployees();
  const current = list.find((e) => e.id === id);
  if (!current) return { success: false, error: "임직원을 찾을 수 없습니다." };

  if (current.email !== data.email) {
    const activeEmails = list.filter((e) => !e.resignDate && e.id !== id);
    if (activeEmails.some((e) => e.email === data.email)) {
      return { success: false, error: "근로자 중 중복된 이메일이 등록되어 있습니다." };
    }
  }

  const updated = list.map((e) => (e.id === id ? { ...e, ...data, id: e.id, createdAt: e.createdAt } : e));
  saveEmployees(updated);
  return { success: true };
}

export function deleteEmployees(ids: string[]): { success: boolean; deletedCount: number } {
  const list = getEmployees();
  const remaining = list.filter((e) => !ids.includes(e.id));
  saveEmployees(remaining);
  return { success: true, deletedCount: ids.length };
}

export function getWorkTypeName(workTypeId: string): string {
  if (!workTypeId) return "";
  const list = getWorkTypes();
  return list.find((w) => w.id === workTypeId)?.name || "";
}

// ─── 급여항목 ─────────────────────────────────────

const defaultPayItems: PayItem[] = [
  { id: "pi1", category: "지급항목", payCode: "PAY001", itemName: "기본급", itemType: "기본급", createdAt: "2025-01-15T09:00:00" },
  { id: "pi2", category: "지급항목", payCode: "PAY002", itemName: "식대", itemType: "수당", createdAt: "2025-01-15T09:01:00" },
  { id: "pi3", category: "지급항목", payCode: "PAY003", itemName: "상여금", itemType: "상여금", createdAt: "2025-01-16T10:00:00" },
  { id: "pi4", category: "공제항목", payCode: "DED001", itemName: "국민연금", itemType: "4대보험", createdAt: "2025-02-01T09:00:00" },
  { id: "pi5", category: "공제항목", payCode: "DED002", itemName: "건강보험", itemType: "4대보험", createdAt: "2025-02-10T14:00:00" },
];

export function getPayItems(): PayItem[] {
  if (typeof window === "undefined") return defaultPayItems;
  const raw = localStorage.getItem(PAYITEM_KEY);
  if (!raw) {
    localStorage.setItem(PAYITEM_KEY, JSON.stringify(defaultPayItems));
    return defaultPayItems;
  }
  return JSON.parse(raw);
}

function savePayItems(data: PayItem[]) {
  localStorage.setItem(PAYITEM_KEY, JSON.stringify(data));
}

export function addPayItem(data: Omit<PayItem, "id" | "createdAt">): { success: boolean; error?: string } {
  const list = getPayItems();
  if (list.some((p) => p.payCode === data.payCode)) {
    return { success: false, error: "중복된 급여코드는 사용하실 수 없습니다." };
  }
  const item: PayItem = { ...data, id: generateId(), createdAt: new Date().toISOString() };
  savePayItems([item, ...list]);
  return { success: true };
}

export function updatePayItem(id: string, data: Omit<PayItem, "id" | "createdAt">): { success: boolean; error?: string } {
  const list = getPayItems();
  if (list.some((p) => p.payCode === data.payCode && p.id !== id)) {
    return { success: false, error: "중복된 급여코드는 사용하실 수 없습니다." };
  }
  const updated = list.map((p) => (p.id === id ? { ...p, ...data, id: p.id, createdAt: p.createdAt } : p));
  savePayItems(updated);
  return { success: true };
}

export function deletePayItems(ids: string[]): { success: boolean; deletedCount: number; failedIds?: string[] } {
  const list = getPayItems();
  const payrolls = getPayrolls();
  const confirmedPayrollIds = payrolls.filter((p) => p.confirmed).map((p) => p.id);

  if (confirmedPayrollIds.length > 0) {
    const configs = getPayrollItemConfigs();
    const usedInConfirmed = new Set(
      configs.filter((c) => confirmedPayrollIds.includes(c.payrollId) && c.enabled).map((c) => c.payItemId)
    );
    const failedIds = ids.filter((id) => usedInConfirmed.has(id));
    if (failedIds.length > 0) {
      const deletableIds = ids.filter((id) => !usedInConfirmed.has(id));
      if (deletableIds.length > 0) {
        const remaining = list.filter((p) => !deletableIds.includes(p.id));
        savePayItems(remaining);
      }
      return { success: false, deletedCount: deletableIds.length, failedIds };
    }
  }

  const remaining = list.filter((p) => !ids.includes(p.id));
  savePayItems(remaining);
  return { success: true, deletedCount: ids.length };
}

// ─── 급여대장 ─────────────────────────────────────

const defaultPayrolls: Payroll[] = [
  { id: "pr1", payrollName: "2025년 1월 급여", year: 2025, month: 1, payDate: "2025-01-25", confirmed: true, createdAt: "2025-01-10T09:00:00" },
  { id: "pr2", payrollName: "2025년 2월 급여", year: 2025, month: 2, payDate: "2025-02-25", confirmed: false, createdAt: "2025-02-10T09:00:00" },
];

export function getPayrolls(): Payroll[] {
  if (typeof window === "undefined") return defaultPayrolls;
  const raw = localStorage.getItem(PAYROLL_KEY);
  if (!raw) {
    localStorage.setItem(PAYROLL_KEY, JSON.stringify(defaultPayrolls));
    return defaultPayrolls;
  }
  return JSON.parse(raw);
}

function savePayrolls(data: Payroll[]) {
  localStorage.setItem(PAYROLL_KEY, JSON.stringify(data));
}

export function addPayroll(data: { payrollName: string; year: number; month: number; payDate: string }): { success: boolean; error?: string } {
  const payDateObj = new Date(data.payDate);
  const attrFirstDay = new Date(data.year, data.month - 1, 1);
  if (payDateObj < attrFirstDay) {
    return { success: false, error: "지급일자는 귀속연월 이후여야 합니다." };
  }
  const item: Payroll = { ...data, id: generateId(), confirmed: false, createdAt: new Date().toISOString() };
  const list = getPayrolls();
  savePayrolls([item, ...list]);
  return { success: true };
}

export function updatePayroll(id: string, data: { payrollName: string; year: number; month: number; payDate: string }): { success: boolean; error?: string } {
  const list = getPayrolls();
  const target = list.find((p) => p.id === id);
  if (!target) return { success: false, error: "급여대장을 찾을 수 없습니다." };
  if (target.confirmed) return { success: false, error: "확정된 급여대장은 수정할 수 없습니다." };

  const payDateObj = new Date(data.payDate);
  const attrFirstDay = new Date(data.year, data.month - 1, 1);
  if (payDateObj < attrFirstDay) {
    return { success: false, error: "지급일자는 귀속연월 이후여야 합니다." };
  }

  const updated = list.map((p) => (p.id === id ? { ...p, ...data } : p));
  savePayrolls(updated);
  return { success: true };
}

export function deletePayrolls(ids: string[]): { success: boolean; deletedCount: number; failedIds?: string[] } {
  const list = getPayrolls();
  const failedIds = ids.filter((id) => list.find((p) => p.id === id)?.confirmed);
  if (failedIds.length === ids.length) {
    return { success: false, deletedCount: 0, failedIds };
  }
  const deletableIds = ids.filter((id) => !failedIds.includes(id));
  const remaining = list.filter((p) => !deletableIds.includes(p.id));
  savePayrolls(remaining);

  // 연관 급여내역/설정도 삭제
  deletableIds.forEach((pid) => {
    const details = getPayrollDetails(pid);
    if (details.length > 0) {
      savePayrollDetails(pid, []);
    }
    removePayrollItemConfigs(pid);
  });

  return { success: failedIds.length === 0, deletedCount: deletableIds.length, failedIds: failedIds.length > 0 ? failedIds : undefined };
}

export function confirmPayroll(id: string): { success: boolean } {
  const list = getPayrolls();
  const updated = list.map((p) => (p.id === id ? { ...p, confirmed: true } : p));
  savePayrolls(updated);
  return { success: true };
}

export function unconfirmPayroll(id: string): { success: boolean } {
  const list = getPayrolls();
  const updated = list.map((p) => (p.id === id ? { ...p, confirmed: false } : p));
  savePayrolls(updated);
  return { success: true };
}

// ─── 급여내역 상세 ─────────────────────────────────────

const defaultPayrollDetails: Record<string, PayrollDetailItem[]> = {
  pr1: [
    { id: "pd1", payrollId: "pr1", employeeId: "emp1", amounts: { pi1: 3000000, pi2: 200000, pi3: null, pi4: 135000, pi5: 112000 }, createdAt: "2025-01-15T09:00:00" },
    { id: "pd2", payrollId: "pr1", employeeId: "emp2", amounts: { pi1: 3500000, pi2: 200000, pi3: 500000, pi4: 157500, pi5: 131250 }, createdAt: "2025-01-15T09:01:00" },
  ],
  pr2: [
    { id: "pd3", payrollId: "pr2", employeeId: "emp1", amounts: { pi1: 3000000, pi2: 200000, pi3: null, pi4: 135000, pi5: 112000 }, createdAt: "2025-02-15T09:00:00" },
  ],
};

function getDetailKey(payrollId: string) {
  return `${PAYROLL_DETAIL_KEY}_${payrollId}`;
}

export function getPayrollDetails(payrollId: string): PayrollDetailItem[] {
  if (typeof window === "undefined") return defaultPayrollDetails[payrollId] || [];
  const raw = localStorage.getItem(getDetailKey(payrollId));
  if (!raw) {
    const defaults = defaultPayrollDetails[payrollId] || [];
    if (defaults.length > 0) {
      localStorage.setItem(getDetailKey(payrollId), JSON.stringify(defaults));
    }
    return defaults;
  }
  return JSON.parse(raw);
}

function savePayrollDetails(payrollId: string, data: PayrollDetailItem[]) {
  localStorage.setItem(getDetailKey(payrollId), JSON.stringify(data));
}

export function addEmployeeToPayroll(payrollId: string, employeeIds: string[]): { success: boolean } {
  const list = getPayrollDetails(payrollId);
  const existing = new Set(list.map((d) => d.employeeId));
  const newItems = employeeIds
    .filter((eid) => !existing.has(eid))
    .map((eid) => ({
      id: generateId(),
      payrollId,
      employeeId: eid,
      amounts: {} as Record<string, number | null>,
      createdAt: new Date().toISOString(),
    }));
  savePayrollDetails(payrollId, [...newItems, ...list]);
  return { success: true };
}

export function removeEmployeesFromPayroll(payrollId: string, detailIds: string[]): { success: boolean; deletedCount: number } {
  const list = getPayrollDetails(payrollId);
  const remaining = list.filter((d) => !detailIds.includes(d.id));
  savePayrollDetails(payrollId, remaining);
  return { success: true, deletedCount: detailIds.length };
}

export function updatePayrollDetailAmount(payrollId: string, detailId: string, amounts: Record<string, number | null>): { success: boolean } {
  const list = getPayrollDetails(payrollId);
  const updated = list.map((d) => (d.id === detailId ? { ...d, amounts } : d));
  savePayrollDetails(payrollId, updated);
  return { success: true };
}

// ─── 급여항목 설정 (PayrollItemConfig) ─────────────────

const defaultPayrollItemConfigs: PayrollItemConfig[] = [
  { payrollId: "pr1", payItemId: "pi1", enabled: true },
  { payrollId: "pr1", payItemId: "pi2", enabled: true },
  { payrollId: "pr1", payItemId: "pi3", enabled: true },
  { payrollId: "pr1", payItemId: "pi4", enabled: true },
  { payrollId: "pr1", payItemId: "pi5", enabled: true },
  { payrollId: "pr2", payItemId: "pi1", enabled: true },
  { payrollId: "pr2", payItemId: "pi2", enabled: true },
  { payrollId: "pr2", payItemId: "pi4", enabled: true },
  { payrollId: "pr2", payItemId: "pi5", enabled: true },
];

export function getPayrollItemConfigs(): PayrollItemConfig[] {
  if (typeof window === "undefined") return defaultPayrollItemConfigs;
  const raw = localStorage.getItem(PAYROLL_ITEM_CONFIG_KEY);
  if (!raw) {
    localStorage.setItem(PAYROLL_ITEM_CONFIG_KEY, JSON.stringify(defaultPayrollItemConfigs));
    return defaultPayrollItemConfigs;
  }
  return JSON.parse(raw);
}

function savePayrollItemConfigs(data: PayrollItemConfig[]) {
  localStorage.setItem(PAYROLL_ITEM_CONFIG_KEY, JSON.stringify(data));
}

export function getPayrollItemConfigsForPayroll(payrollId: string): PayrollItemConfig[] {
  return getPayrollItemConfigs().filter((c) => c.payrollId === payrollId);
}

export function togglePayrollItem(payrollId: string, payItemId: string, enabled: boolean): { success: boolean } {
  const all = getPayrollItemConfigs();
  const idx = all.findIndex((c) => c.payrollId === payrollId && c.payItemId === payItemId);
  if (idx >= 0) {
    all[idx] = { ...all[idx], enabled };
  } else {
    all.push({ payrollId, payItemId, enabled });
  }
  savePayrollItemConfigs(all);

  // 비활성화 시 해당 급여항목의 금액을 null로 초기화
  if (!enabled) {
    const details = getPayrollDetails(payrollId);
    const updated = details.map((d) => {
      const newAmounts = { ...d.amounts };
      newAmounts[payItemId] = null;
      return { ...d, amounts: newAmounts };
    });
    savePayrollDetails(payrollId, updated);
  }

  return { success: true };
}

function removePayrollItemConfigs(payrollId: string) {
  const all = getPayrollItemConfigs();
  const remaining = all.filter((c) => c.payrollId !== payrollId);
  savePayrollItemConfigs(remaining);
}

export function getEligibleEmployees(payrollId: string): Employee[] {
  const payrolls = getPayrolls();
  const payroll = payrolls.find((p) => p.id === payrollId);
  if (!payroll) return [];

  const employees = getEmployees();
  const details = getPayrollDetails(payrollId);
  const existingEmpIds = new Set(details.map((d) => d.employeeId));

  const attrYear = payroll.year;
  const attrMonth = payroll.month;

  return employees.filter((emp) => {
    if (existingEmpIds.has(emp.id)) return false;

    // 입사일 체크: 귀속연월 마지막날 이전에 입사
    const hireDate = emp.hireDate;
    if (!hireDate) return false;
    const hireYear = parseInt(hireDate.substring(0, 4));
    const hireMonth = parseInt(hireDate.substring(4, 6));
    const lastDayOfAttr = new Date(attrYear, attrMonth, 0);
    const hireDateObj = new Date(hireYear, hireMonth - 1, parseInt(hireDate.substring(6, 8)));
    if (hireDateObj > lastDayOfAttr) return false;

    // 퇴사일 체크: 퇴사일이 없거나 귀속연월 첫날 이후
    if (emp.resignDate) {
      const resignYear = parseInt(emp.resignDate.substring(0, 4));
      const resignMonth = parseInt(emp.resignDate.substring(4, 6));
      const resignDay = parseInt(emp.resignDate.substring(6, 8));
      const resignDateObj = new Date(resignYear, resignMonth - 1, resignDay);
      const firstDayOfAttr = new Date(attrYear, attrMonth - 1, 1);
      if (resignDateObj < firstDayOfAttr) return false;
    }

    return true;
  });
}

export function getPayItemName(payItemId: string): string {
  const list = getPayItems();
  return list.find((p) => p.id === payItemId)?.itemName || "";
}

export function getEmployeeName(employeeId: string): string {
  const list = getEmployees();
  return list.find((e) => e.id === employeeId)?.name || "";
}

export function getEmployeeNumber(employeeId: string): string {
  const list = getEmployees();
  return list.find((e) => e.id === employeeId)?.employeeNumber || "";
}

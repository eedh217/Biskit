export interface Employee {
  id: string;
  employeeNumber: string;
  name: string;
  nationality: "내국인" | "외국인";
  residentNumber1?: string;
  residentNumber2?: string;
  foreignerNumber1?: string;
  foreignerNumber2?: string;
  passportNumber?: string;
  birthDate?: string;
  gender?: "남" | "여";
  country?: string;
  residenceType: "거주자" | "비거주자";
  disabilityStatus: string;
  email: string;
  phone: string;
  mobile1: string;
  mobile2: string;
  mobile3: string;
  hireDate: string;
  resignDate: string;
  address: string;
  addressDetail: string;
  zipCode: string;
  workTypeId: string;
  createdAt: string;
}

export interface WorkType {
  id: string;
  name: string;
  code: string;
  createdAt: string;
}

export interface PayItem {
  id: string;
  category: "지급항목" | "공제항목";
  payCode: string;
  itemName: string;
  itemType: string;
  createdAt: string;
}

export interface Payroll {
  id: string;
  payrollName: string;
  year: number;
  month: number;
  payDate: string;
  confirmed: boolean;
  createdAt: string;
}

export interface PayrollDetailItem {
  id: string;
  payrollId: string;
  employeeId: string;
  amounts: Record<string, number | null>;
  createdAt: string;
}

export interface PayrollItemConfig {
  payrollId: string;
  payItemId: string;
  enabled: boolean;
}

export type EmployeeFormData = Omit<Employee, "id" | "createdAt">;
export type WorkTypeFormData = Omit<WorkType, "id" | "createdAt">;
export type PayItemFormData = Omit<PayItem, "id" | "createdAt">;
export type PayrollFormData = Omit<Payroll, "id" | "createdAt" | "confirmed">;

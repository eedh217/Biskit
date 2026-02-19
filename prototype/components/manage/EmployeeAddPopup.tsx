"use client";

import { useState, FormEvent } from "react";
import { addEmployee, getWorkTypes } from "@/lib/store";
import { Employee } from "@/types/manage";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

type FormErrors = Partial<Record<string, string>>;

export default function EmployeeAddPopup({ onClose, onSuccess }: Props) {
  const workTypes = getWorkTypes();

  const [form, setForm] = useState({
    employeeNumber: "",
    name: "",
    nationality: "내국인" as "내국인" | "외국인",
    residentNumber1: "", residentNumber2: "",
    foreignerNumber1: "", foreignerNumber2: "",
    passportNumber: "", birthDate: "", gender: "" as "" | "남" | "여",
    country: "",
    residenceType: "거주자" as "거주자" | "비거주자",
    disabilityStatus: "비장애인",
    email: "",
    phone: "",
    mobile1: "010", mobile2: "", mobile3: "",
    hireDate: "", resignDate: "",
    address: "", addressDetail: "", zipCode: "",
    workTypeId: "",
  });
  const [idType, setIdType] = useState<"foreign" | "passport">("foreign");
  const [errors, setErrors] = useState<FormErrors>({});

  const set = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleNationalityChange = (val: "내국인" | "외국인") => {
    setForm((prev) => ({
      ...prev,
      nationality: val,
      residentNumber1: "", residentNumber2: "",
      foreignerNumber1: "", foreignerNumber2: "",
      passportNumber: "", birthDate: "", gender: "" as "",
      country: "",
    }));
    setErrors({});
  };

  // blur 유효성 검사
  const handleBlur = (field: string) => {
    const v = (form as Record<string, string>)[field] || "";
    let err: string | undefined;

    if (field === "name" && v && /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(v)) {
      err = "특수문자는 입력하실 수 없습니다.";
    }
    if (field === "email" && v && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      err = "이메일 형식이 맞지 않습니다.";
    }
    if ((field === "hireDate" || field === "resignDate") && v) {
      if (!/^\d{8}$/.test(v) || isNaN(Date.parse(`${v.slice(0,4)}-${v.slice(4,6)}-${v.slice(6,8)}`))) {
        err = "유효하지 않은 날짜입니다.";
      }
    }
    if (field === "residentNumber1" && v && form.nationality === "내국인") {
      if (!/^\d{6}$/.test(v)) err = "유효하지 않은 주민등록번호입니다.";
    }
    if (field === "residentNumber2" && v && form.nationality === "내국인") {
      if (!/^[1-4]\d{6}$/.test(v)) err = "유효하지 않은 주민등록번호입니다.";
    }
    if (field === "foreignerNumber2" && v && form.nationality === "외국인") {
      if (!/^[5-8]\d{6}$/.test(v)) err = "유효하지 않은 외국인등록번호입니다.";
    }

    if (err) setErrors((prev) => ({ ...prev, [field]: err }));
    else setErrors((prev) => { const n = { ...prev }; delete n[field]; return n; });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (!form.employeeNumber.trim()) newErrors.employeeNumber = "사번을 입력해주세요.";
    if (!form.name.trim()) newErrors.name = "성명을 입력해주세요.";
    if (form.name && /[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s]/.test(form.name)) newErrors.name = "특수문자는 입력하실 수 없습니다.";

    if (form.nationality === "내국인") {
      if (!form.residentNumber1 || !form.residentNumber2) newErrors.residentNumber1 = "주민등록번호를 입력해주세요.";
    } else {
      if (idType === "foreign" && (!form.foreignerNumber1 || !form.foreignerNumber2)) {
        newErrors.foreignerNumber1 = "외국인등록번호를 입력해주세요.";
      }
      if (idType === "passport") {
        if (!form.passportNumber) newErrors.passportNumber = "여권번호를 입력해주세요.";
        if (!form.birthDate) newErrors.birthDate = "생년월일을 입력해주세요.";
        if (!form.gender) newErrors.gender = "성별을 선택해주세요.";
      }
      if (!form.country) newErrors.country = "국적을 선택해주세요.";
    }

    if (!form.email.trim()) newErrors.email = "이메일을 입력해주세요.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) newErrors.email = "이메일 형식이 맞지 않습니다.";
    if (!form.phone.trim()) newErrors.phone = "연락처를 입력해주세요.";
    if (!form.mobile2 || !form.mobile3) newErrors.mobile2 = "휴대폰번호를 입력해주세요.";
    if (!form.hireDate.trim()) newErrors.hireDate = "입사일을 입력해주세요.";
    if (!form.address.trim()) newErrors.address = "주소를 입력해주세요.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const data: Omit<Employee, "id" | "createdAt"> = {
      ...form,
      gender: (form.gender || undefined) as "남" | "여" | undefined,
    };

    const result = addEmployee(data);
    if (!result.success) {
      if (result.error?.includes("사번")) newErrors.employeeNumber = result.error;
      else if (result.error?.includes("이메일")) newErrors.email = result.error;
      setErrors(newErrors);
      return;
    }

    onSuccess();
  };

  const countries = ["미국","영국","캐나다","일본","중국","베트남","태국","인도","독일","프랑스","호주","브라질","필리핀","인도네시아","러시아","멕시코","네덜란드","스웨덴","스위스","싱가포르"];

  const inputClass = (field: string) =>
    `w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  const smallInputClass = (field: string) =>
    `px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
      errors[field] ? "border-red-400" : "border-gray-300"
    }`;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white flex items-center justify-between px-6 py-4 border-b border-gray-200 z-10">
          <h2 className="text-lg font-semibold text-gray-900">임직원 추가</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 사번 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">사번 <span className="text-red-500">*</span></label>
            <input type="text" value={form.employeeNumber} onChange={(e) => set("employeeNumber", e.target.value)} maxLength={30} className={inputClass("employeeNumber")} />
            {errors.employeeNumber && <p className="mt-1 text-xs text-red-500">{errors.employeeNumber}</p>}
          </div>

          {/* 성명 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">성명 <span className="text-red-500">*</span></label>
            <input type="text" value={form.name} onChange={(e) => set("name", e.target.value)} onBlur={() => handleBlur("name")} maxLength={30} className={inputClass("name")} />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          {/* 내외국인 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">내외국인 여부 <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {(["내국인", "외국인"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="nationality" checked={form.nationality === opt} onChange={() => handleNationalityChange(opt)} />
                  {opt}
                </label>
              ))}
            </div>
          </div>

          {/* 내국인: 주민등록번호 */}
          {form.nationality === "내국인" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">주민등록번호 <span className="text-red-500">*</span></label>
              <div className="flex items-center gap-2">
                <input type="text" value={form.residentNumber1} onChange={(e) => set("residentNumber1", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("residentNumber1")} maxLength={6} placeholder="앞 6자리" className={smallInputClass("residentNumber1") + " w-32"} />
                <span className="text-gray-400">-</span>
                <input type="text" value={form.residentNumber2} onChange={(e) => set("residentNumber2", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("residentNumber2")} maxLength={7} placeholder="뒤 7자리" className={smallInputClass("residentNumber2") + " w-36"} />
              </div>
              {(errors.residentNumber1 || errors.residentNumber2) && <p className="mt-1 text-xs text-red-500">{errors.residentNumber1 || errors.residentNumber2}</p>}
            </div>
          )}

          {/* 외국인 분기 */}
          {form.nationality === "외국인" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">신분증 유형 <span className="text-red-500">*</span></label>
                <div className="flex gap-4 mb-3">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={idType === "foreign"} onChange={() => setIdType("foreign")} /> 외국인등록번호
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="radio" checked={idType === "passport"} onChange={() => setIdType("passport")} /> 여권번호
                  </label>
                </div>

                {idType === "foreign" ? (
                  <div>
                    <div className="flex items-center gap-2">
                      <input type="text" value={form.foreignerNumber1} onChange={(e) => set("foreignerNumber1", e.target.value.replace(/\D/g, ""))} maxLength={6} placeholder="앞 6자리" className={smallInputClass("foreignerNumber1") + " w-32"} />
                      <span className="text-gray-400">-</span>
                      <input type="text" value={form.foreignerNumber2} onChange={(e) => set("foreignerNumber2", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("foreignerNumber2")} maxLength={7} placeholder="뒤 7자리" className={smallInputClass("foreignerNumber2") + " w-36"} />
                    </div>
                    {(errors.foreignerNumber1 || errors.foreignerNumber2) && <p className="mt-1 text-xs text-red-500">{errors.foreignerNumber1 || errors.foreignerNumber2}</p>}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <input type="text" value={form.passportNumber} onChange={(e) => set("passportNumber", e.target.value.replace(/[^a-zA-Z0-9]/g, ""))} placeholder="여권번호" className={inputClass("passportNumber")} />
                      {errors.passportNumber && <p className="mt-1 text-xs text-red-500">{errors.passportNumber}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">생년월일 <span className="text-red-500">*</span></label>
                      <input type="text" value={form.birthDate} onChange={(e) => set("birthDate", e.target.value.replace(/\D/g, ""))} maxLength={8} placeholder="YYYYMMDD" className={inputClass("birthDate")} />
                      {errors.birthDate && <p className="mt-1 text-xs text-red-500">{errors.birthDate}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">성별 <span className="text-red-500">*</span></label>
                      <div className="flex gap-4">
                        {(["남", "여"] as const).map((g) => (
                          <label key={g} className="flex items-center gap-2 text-sm">
                            <input type="radio" name="gender" checked={form.gender === g} onChange={() => set("gender", g)} /> {g}
                          </label>
                        ))}
                      </div>
                      {errors.gender && <p className="mt-1 text-xs text-red-500">{errors.gender}</p>}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">국적 <span className="text-red-500">*</span></label>
                <select value={form.country} onChange={(e) => set("country", e.target.value)} className={inputClass("country")}>
                  <option value="">선택</option>
                  {countries.sort((a, b) => a.localeCompare(b, "ko")).map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                {errors.country && <p className="mt-1 text-xs text-red-500">{errors.country}</p>}
              </div>
            </>
          )}

          {/* 거주구분 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">거주구분 <span className="text-red-500">*</span></label>
            <div className="flex gap-4">
              {(["거주자", "비거주자"] as const).map((opt) => (
                <label key={opt} className="flex items-center gap-2 text-sm">
                  <input type="radio" name="residenceType" checked={form.residenceType === opt} onChange={() => set("residenceType", opt)} /> {opt}
                </label>
              ))}
            </div>
          </div>

          {/* 장애여부 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">장애여부 <span className="text-red-500">*</span></label>
            <select value={form.disabilityStatus} onChange={(e) => set("disabilityStatus", e.target.value)} className={inputClass("disabilityStatus")}>
              {["비장애인", "장애인복지법상 장애인", "국가유공자 중증환자", "중증환자"].map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">이메일 <span className="text-red-500">*</span></label>
            <input type="text" value={form.email} onChange={(e) => set("email", e.target.value)} onBlur={() => handleBlur("email")} className={inputClass("email")} />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          {/* 연락처 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">연락처 <span className="text-red-500">*</span></label>
            <input type="text" value={form.phone} onChange={(e) => set("phone", e.target.value.replace(/[^0-9+()-]/g, ""))} maxLength={30} placeholder="02-1234-5678" className={inputClass("phone")} />
            {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
          </div>

          {/* 휴대폰번호 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">휴대폰번호 <span className="text-red-500">*</span></label>
            <div className="flex items-center gap-2">
              <input type="text" value={form.mobile1} onChange={(e) => set("mobile1", e.target.value.replace(/\D/g, ""))} maxLength={3} className={smallInputClass("mobile1") + " w-20"} />
              <span className="text-gray-400">-</span>
              <input type="text" value={form.mobile2} onChange={(e) => set("mobile2", e.target.value.replace(/\D/g, ""))} maxLength={4} className={smallInputClass("mobile2") + " w-24"} />
              <span className="text-gray-400">-</span>
              <input type="text" value={form.mobile3} onChange={(e) => set("mobile3", e.target.value.replace(/\D/g, ""))} maxLength={4} className={smallInputClass("mobile3") + " w-24"} />
            </div>
            {errors.mobile2 && <p className="mt-1 text-xs text-red-500">{errors.mobile2}</p>}
          </div>

          {/* 입사일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">입사일 <span className="text-red-500">*</span></label>
            <input type="text" value={form.hireDate} onChange={(e) => set("hireDate", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("hireDate")} maxLength={8} placeholder="YYYYMMDD" className={inputClass("hireDate")} />
            {errors.hireDate && <p className="mt-1 text-xs text-red-500">{errors.hireDate}</p>}
          </div>

          {/* 퇴사일 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">퇴사일</label>
            <input type="text" value={form.resignDate} onChange={(e) => set("resignDate", e.target.value.replace(/\D/g, ""))} onBlur={() => handleBlur("resignDate")} maxLength={8} placeholder="YYYYMMDD" className={inputClass("resignDate")} />
            {errors.resignDate && <p className="mt-1 text-xs text-red-500">{errors.resignDate}</p>}
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">주소 <span className="text-red-500">*</span></label>
            <div className="space-y-2">
              <input type="text" value={form.zipCode} onChange={(e) => set("zipCode", e.target.value)} placeholder="우편번호" className={smallInputClass("zipCode") + " w-32"} />
              <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)} placeholder="주소" className={inputClass("address")} />
              <input type="text" value={form.addressDetail} onChange={(e) => set("addressDetail", e.target.value)} placeholder="상세주소" className={inputClass("addressDetail")} />
            </div>
            {errors.address && <p className="mt-1 text-xs text-red-500">{errors.address}</p>}
          </div>

          {/* 근로형태 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">근로형태</label>
            <select value={form.workTypeId} onChange={(e) => set("workTypeId", e.target.value)} className={inputClass("workTypeId")}>
              <option value="">선택</option>
              {workTypes.sort((a, b) => a.name.localeCompare(b.name, "ko")).map((wt) => (
                <option key={wt.id} value={wt.id}>{wt.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200">취소</button>
            <button type="submit" className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700">저장</button>
          </div>
        </form>
      </div>
    </div>
  );
}

import { TestCase, PolicyModule } from "@/types";

const prefixMap: Record<string, string> = {
  employee: "EP",
  worktype: "WT",
  payitem: "PI",
  payroll: "PR",
  "payroll-detail": "PD",
};

export function generateTestCases(policy: PolicyModule): TestCase[] {
  const cases: TestCase[] = [];
  const prefix = prefixMap[policy.id] || "TC";
  let seq = 1;

  const id = () => `TC_${prefix}_${String(seq++).padStart(3, "0")}`;

  // === 리스트 화면 테스트케이스 ===

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "검색",
    title: "검색어 입력 후 검색 버튼 클릭 시 결과 필터링",
    precondition: "리스트에 데이터가 존재하는 상태",
    steps: [
      "검색 인풋에 검색어 입력",
      "검색 버튼 클릭",
      "리스트 결과 확인",
    ],
    expectedResult: `검색 대상(${policy.listScreen.search.target}) 기준으로 필터링된 결과가 표시된다.`,
    priority: "high",
    tag: "화면별",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "검색",
    title: "Enter 키로 검색 실행",
    precondition: "리스트 화면 진입",
    steps: ["검색 인풋에 검색어 입력", "Enter 키 입력"],
    expectedResult: "검색이 실행되고 결과가 표시된다.",
    priority: "medium",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "검색",
    title: "검색 결과 카운트 표시",
    precondition: "검색 실행 후",
    steps: ["검색 결과 카운트 영역 확인"],
    expectedResult: "검색 결과 개수가 텍스트로 표시된다.",
    priority: "medium",
    tag: "공통",
  });

  if (policy.listScreen.search.maxLength) {
    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "검색",
      title: `검색어 최대 ${policy.listScreen.search.maxLength}자 제한`,
      precondition: "리스트 화면 진입",
      steps: [
        `검색 인풋에 ${policy.listScreen.search.maxLength}자 초과 입력 시도`,
      ],
      expectedResult: `최대 ${policy.listScreen.search.maxLength}자까지만 입력 가능하다.`,
      priority: "medium",
      tag: "화면별",
    });
  }

  if (!policy.listScreen.search.specialCharAllowed) {
    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "검색",
      title: "검색어 특수문자 입력 불가",
      precondition: "리스트 화면 진입",
      steps: ["검색 인풋에 특수문자 입력 시도"],
      expectedResult: "특수문자가 입력되지 않는다.",
      priority: "medium",
      tag: "화면별",
    });
  }

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "리스트",
    title: `기본 정렬 확인 (${policy.listScreen.sort})`,
    precondition: "리스트에 다수 데이터 존재",
    steps: ["리스트 화면 진입", "정렬 순서 확인"],
    expectedResult: `${policy.listScreen.sort}으로 항목이 표시된다.`,
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "리스트",
    title: "행 클릭 동작 확인",
    precondition: "리스트에 데이터 존재",
    steps: ["리스트 행 클릭"],
    expectedResult: policy.listScreen.rowClickAction,
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "리스트",
    title: "체크박스 멀티 선택",
    precondition: "리스트에 다수 데이터 존재",
    steps: ["여러 행의 체크박스 선택"],
    expectedResult: "복수 행이 선택되고, 선택 삭제 버튼이 활성화된다.",
    priority: "medium",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "페이지 사이즈",
    title: "페이지 사이즈 변경",
    precondition: "리스트에 30개 이상 데이터 존재",
    steps: ["페이지 사이즈 셀렉박스에서 50개 선택"],
    expectedResult: "한 페이지에 50개 항목이 표시된다.",
    priority: "medium",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "엑셀",
    title: "전체 리스트 엑셀 다운로드",
    precondition: "검색하지 않은 상태",
    steps: ["엑셀 다운로드 버튼 클릭"],
    expectedResult: `'${policy.listScreen.excelFileName}' 파일명으로 전체 리스트가 다운로드된다.`,
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "엑셀",
    title: "검색 결과 엑셀 다운로드",
    precondition: "검색 실행 후 결과 존재",
    steps: ["엑셀 다운로드 버튼 클릭"],
    expectedResult: "검색 결과만 엑셀로 다운로드된다.",
    priority: "medium",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "엑셀",
    title: "선택 항목 엑셀 다운로드",
    precondition: "리스트에서 일부 행 체크박스 선택",
    steps: ["엑셀 다운로드 버튼 클릭"],
    expectedResult: "선택한 항목만 엑셀로 다운로드된다.",
    priority: "medium",
    tag: "공통",
  });

  // 삭제 테스트
  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "삭제",
    title: "선택 삭제 confirm 노출",
    precondition: "1개 이상 행 선택",
    steps: ["선택 삭제 버튼 클릭"],
    expectedResult: "'총 N개의 리스트를 삭제하시겠습니까?' confirm이 노출된다.",
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "삭제",
    title: "삭제 후 리스트 갱신",
    precondition: "삭제 confirm에서 확인 클릭",
    steps: ["confirm 확인 클릭", "리스트 및 카운트 확인"],
    expectedResult: "삭제된 항목이 리스트에서 제거되고, 카운트가 갱신된다.",
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.listScreen.screenId,
    category: "삭제",
    title: "삭제 실패 시 실패 리스트 팝업",
    precondition: "일부 삭제 실패 발생",
    steps: ["삭제 실행", "실패 팝업 확인"],
    expectedResult:
      "실패한 리스트 개수, 정보, 실패 사유가 포함된 팝업이 노출된다.",
    priority: "high",
    tag: "공통",
  });

  if (policy.deletePolicy.warning) {
    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "삭제",
      title: "삭제 경고 confirm 노출",
      precondition: "삭제 제한 조건에 해당하는 항목 삭제 시도",
      steps: ["삭제 버튼 클릭", "경고 confirm 확인"],
      expectedResult: policy.deletePolicy.warning,
      priority: "high",
      tag: "화면별",
    });
  }

  // === 추가 팝업 테스트케이스 ===

  cases.push({
    id: id(),
    screenId: policy.addPopup.screenId,
    category: "팝업",
    title: "이탈 방지 confirm 노출",
    precondition: "추가 팝업 열린 상태에서 입력값 존재",
    steps: ["팝업 외 영역 클릭 또는 닫기 버튼 클릭"],
    expectedResult: `'${policy.addPopup.confirmMessage}' confirm이 노출된다.`,
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.addPopup.screenId,
    category: "팝업",
    title: "추가 완료 토스트 노출",
    precondition: "모든 필수 필드 유효한 값 입력",
    steps: ["저장 버튼 클릭", "토스트 확인"],
    expectedResult: `'${policy.addPopup.toastMessage}' 토스트가 1.5초 노출된다.`,
    priority: "high",
    tag: "공통",
  });

  // 필드별 유효성 검사 테스트케이스
  for (const field of policy.fields) {
    if (field.required) {
      cases.push({
        id: id(),
        screenId: policy.addPopup.screenId,
        category: "유효성 검사",
        title: `${field.name} 필수 입력 검증`,
        precondition: "추가 팝업 열린 상태",
        steps: [`${field.name} 필드 비워둔 채 저장 클릭`],
        expectedResult: `${field.name} 필드에 필수 입력 에러가 표시된다.`,
        priority: "high",
        tag: "화면별",
      });
    }

    if (field.maxLength) {
      cases.push({
        id: id(),
        screenId: policy.addPopup.screenId,
        category: "유효성 검사",
        title: `${field.name} 최대 ${field.maxLength}자 제한`,
        precondition: "추가 팝업 열린 상태",
        steps: [`${field.name} 필드에 ${field.maxLength}자 초과 입력`],
        expectedResult: `최대 ${field.maxLength}자까지만 입력 가능하다.`,
        priority: "medium",
        tag: "화면별",
      });
    }

    if (field.errorMessages) {
      for (const [key, msg] of Object.entries(field.errorMessages)) {
        cases.push({
          id: id(),
          screenId: policy.addPopup.screenId,
          category: "유효성 검사",
          title: `${field.name} - ${key} 에러 메시지 확인`,
          precondition: "추가 팝업 열린 상태",
          steps: [`${field.name} 필드에 ${key} 조건 위반 값 입력`, "blur 또는 submit"],
          expectedResult: `'${msg}' 에러 문구가 노출된다.`,
          priority: "medium",
          tag: "화면별",
        });
      }
    }
  }

  // 서버 에러 테스트
  cases.push({
    id: id(),
    screenId: policy.addPopup.screenId,
    category: "서버 에러",
    title: "서버 에러 시 alert 노출 및 팝업 유지",
    precondition: "서버 에러(500) 발생 상황",
    steps: ["저장 버튼 클릭", "에러 alert 확인"],
    expectedResult:
      "'서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' alert 노출. 확인 후 팝업 유지, 입력값 보존.",
    priority: "high",
    tag: "공통",
  });

  // === 수정 팝업 테스트케이스 ===

  cases.push({
    id: id(),
    screenId: policy.editPopup.screenId,
    category: "팝업",
    title: "수정 팝업 이탈 방지 confirm",
    precondition: "수정 팝업 열린 상태",
    steps: ["닫기 버튼 클릭"],
    expectedResult: `'${policy.editPopup.confirmMessage}' confirm이 노출된다.`,
    priority: "high",
    tag: "공통",
  });

  cases.push({
    id: id(),
    screenId: policy.editPopup.screenId,
    category: "팝업",
    title: "수정 완료 토스트",
    precondition: "유효한 값으로 수정",
    steps: ["저장 버튼 클릭"],
    expectedResult: `'${policy.editPopup.toastMessage}' 토스트가 1.5초 노출된다.`,
    priority: "high",
    tag: "공통",
  });

  if (policy.editPopup.readonlyFields) {
    for (const fieldName of policy.editPopup.readonlyFields) {
      cases.push({
        id: id(),
        screenId: policy.editPopup.screenId,
        category: "수정 제한",
        title: `${fieldName} 읽기 전용 확인`,
        precondition: "수정 팝업 열린 상태",
        steps: [`${fieldName} 필드 편집 시도`],
        expectedResult: `${fieldName} 필드가 읽기 전용으로 편집이 불가하다.`,
        priority: "high",
        tag: "화면별",
      });
    }
  }

  // === 모듈별 추가 테스트케이스 ===

  // 급여대장 전용
  if (policy.id === "payroll") {
    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "확정/해제",
      title: "급여대장 행 클릭 시 급여내역 상세 이동",
      precondition: "급여대장 리스트에 데이터 존재",
      steps: ["급여대장 행 클릭"],
      expectedResult: "급여내역 상세 페이지로 이동한다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "확정/해제",
      title: "수정 버튼 클릭 시 수정 팝업 노출",
      precondition: "급여대장 리스트에 데이터 존재",
      steps: ["수정 버튼 클릭 (행 클릭과 별도)"],
      expectedResult: "수정 팝업이 노출된다. 행 클릭 이벤트는 발생하지 않는다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: policy.editPopup.screenId,
      category: "확정/해제",
      title: "확정된 급여대장 수정 팝업 readonly",
      precondition: "확정된 급여대장의 수정 팝업 열기",
      steps: ["모든 필드 편집 시도"],
      expectedResult: "모든 필드가 readonly이며, 닫기 버튼만 사용 가능하다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: policy.listScreen.screenId,
      category: "확정/해제",
      title: "확정된 급여대장 삭제 불가",
      precondition: "확정된 급여대장 선택",
      steps: ["선택 삭제 실행"],
      expectedResult: "확정된 급여대장은 삭제되지 않고 실패 사유가 표시된다.",
      priority: "high",
      tag: "화면별",
    });
  }

  // 급여내역 상세 전용
  if (policy.id === "payroll-detail") {
    cases.push({
      id: id(),
      screenId: "HRIS_PD_01",
      category: "동적 컬럼",
      title: "급여항목 관리에서 활성화된 항목만 컬럼 표시",
      precondition: "급여항목이 활성화된 상태",
      steps: ["급여내역 상세 테이블 컬럼 확인"],
      expectedResult: "활성화된 지급항목 → 지급합계 → 공제항목 → 공제합계 순서로 동적 컬럼이 표시된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_03",
      category: "동적 컬럼",
      title: "급여항목 비활성화 시 금액 데이터 초기화 경고",
      precondition: "활성화된 급여항목에 금액이 입력된 상태",
      steps: ["급여항목 관리에서 해당 항목 토글 OFF"],
      expectedResult: "금액 데이터 초기화 경고 confirm이 노출된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_02",
      category: "임직원 추가",
      title: "귀속연월 겹침 필터링된 임직원만 표시",
      precondition: "급여대장의 귀속연월이 설정된 상태",
      steps: ["임직원 추가 팝업 열기", "표시된 임직원 목록 확인"],
      expectedResult: "귀속연월과 근무기간이 겹치는 미추가 임직원만 표시된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_02",
      category: "임직원 추가",
      title: "멀티 선택으로 여러 임직원 동시 추가",
      precondition: "추가 가능한 임직원이 복수 존재",
      steps: ["여러 임직원 체크박스 선택", "추가 버튼 클릭"],
      expectedResult: "선택한 모든 임직원이 급여내역에 추가된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_01",
      category: "확정/해제",
      title: "급여확정 시 모든 편집 비활성화",
      precondition: "급여대장이 미확정 상태",
      steps: ["급여확정 버튼 클릭", "확인"],
      expectedResult: "임직원 추가/삭제, 금액 수정, 항목 관리가 모두 비활성화된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_01",
      category: "확정/해제",
      title: "급여확정 해제 시 편집 가능 복원",
      precondition: "급여대장이 확정된 상태",
      steps: ["급여확정 해제 버튼 클릭", "확인"],
      expectedResult: "모든 편집 기능이 다시 활성화된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PD_04",
      category: "금액 수정",
      title: "금액 입력 시 콤마 포맷",
      precondition: "상세 수정 팝업 열린 상태",
      steps: ["금액 필드에 숫자 입력"],
      expectedResult: "입력된 금액이 콤마 포맷으로 표시된다.",
      priority: "medium",
      tag: "화면별",
    });
  }

  // 급여항목 전용
  if (policy.id === "payitem") {
    cases.push({
      id: id(),
      screenId: "HRIS_PI_02",
      category: "구분 연동",
      title: "구분 변경 시 유형 드롭다운 옵션 변경",
      precondition: "추가 팝업 열린 상태",
      steps: ["구분을 지급항목에서 공제항목으로 변경", "유형 드롭다운 확인"],
      expectedResult: "유형 옵션이 지급항목(기본급/수당/상여금)에서 공제항목(4대보험/세금/기타공제)으로 변경된다.",
      priority: "high",
      tag: "화면별",
    });

    cases.push({
      id: id(),
      screenId: "HRIS_PI_03",
      category: "수정 제한",
      title: "수정 팝업에서 구분 readonly",
      precondition: "수정 팝업 열린 상태",
      steps: ["구분 필드 편집 시도"],
      expectedResult: "구분 필드가 읽기 전용으로 표시된다.",
      priority: "high",
      tag: "화면별",
    });
  }

  return cases;
}

export function getTestCaseSummary(cases: TestCase[]) {
  const byPriority = {
    high: cases.filter((c) => c.priority === "high").length,
    medium: cases.filter((c) => c.priority === "medium").length,
    low: cases.filter((c) => c.priority === "low").length,
  };
  const byCategory: Record<string, number> = {};
  for (const c of cases) {
    byCategory[c.category] = (byCategory[c.category] || 0) + 1;
  }
  const byScreen: Record<string, number> = {};
  for (const c of cases) {
    byScreen[c.screenId] = (byScreen[c.screenId] || 0) + 1;
  }
  return { total: cases.length, byPriority, byCategory, byScreen };
}

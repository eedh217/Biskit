import { CompareItem, PolicyModule } from "@/types";

export function generateCompareItems(
  policyA: PolicyModule,
  policyB: PolicyModule
): CompareItem[] {
  const items: CompareItem[] = [];

  // 검색 영역 비교
  items.push({
    category: "검색영역",
    attribute: "검색 대상",
    moduleA: policyA.listScreen.search.target,
    moduleB: policyB.listScreen.search.target,
    tag: "화면별",
    isDifferent: policyA.listScreen.search.target !== policyB.listScreen.search.target,
  });
  items.push({
    category: "검색영역",
    attribute: "placeholder",
    moduleA: policyA.listScreen.search.placeholder,
    moduleB: policyB.listScreen.search.placeholder,
    tag: "화면별",
    isDifferent: policyA.listScreen.search.placeholder !== policyB.listScreen.search.placeholder,
  });
  items.push({
    category: "검색영역",
    attribute: "검색 입력 제한",
    moduleA: policyA.listScreen.search.maxLength
      ? `최대 ${policyA.listScreen.search.maxLength}자${!policyA.listScreen.search.specialCharAllowed ? ", 특수문자 불가" : ""}`
      : "없음",
    moduleB: policyB.listScreen.search.maxLength
      ? `최대 ${policyB.listScreen.search.maxLength}자${!policyB.listScreen.search.specialCharAllowed ? ", 특수문자 불가" : ""}`
      : "없음",
    tag: "화면별",
    isDifferent: true,
  });
  items.push({
    category: "검색영역",
    attribute: "Enter 검색",
    moduleA: "지원",
    moduleB: "지원",
    tag: "공통",
    isDifferent: false,
  });

  // 리스트 공통 비교
  items.push({
    category: "리스트",
    attribute: "기본 정렬",
    moduleA: policyA.listScreen.sort,
    moduleB: policyB.listScreen.sort,
    tag: policyA.listScreen.sort === policyB.listScreen.sort ? "공통" : "화면별",
    isDifferent: policyA.listScreen.sort !== policyB.listScreen.sort,
  });
  items.push({
    category: "리스트",
    attribute: "페이지 사이즈 기본값",
    moduleA: `${policyA.listScreen.defaultPageSize}개`,
    moduleB: `${policyB.listScreen.defaultPageSize}개`,
    tag: "공통",
    isDifferent: false,
  });
  items.push({
    category: "리스트",
    attribute: "행 클릭 동작",
    moduleA: policyA.listScreen.rowClickAction,
    moduleB: policyB.listScreen.rowClickAction,
    tag: policyA.listScreen.rowClickAction === policyB.listScreen.rowClickAction ? "공통" : "화면별",
    isDifferent: policyA.listScreen.rowClickAction !== policyB.listScreen.rowClickAction,
  });

  // 테이블 컬럼 비교
  items.push({
    category: "테이블 컬럼",
    attribute: "컬럼 수",
    moduleA: `${policyA.tableColumns.length}개`,
    moduleB: `${policyB.tableColumns.length}개`,
    tag: "화면별",
    isDifferent: policyA.tableColumns.length !== policyB.tableColumns.length,
  });
  items.push({
    category: "테이블 컬럼",
    attribute: "컬럼 목록",
    moduleA: policyA.tableColumns.map((c) => c.name).join(", "),
    moduleB: policyB.tableColumns.map((c) => c.name).join(", "),
    tag: "화면별",
    isDifferent: true,
  });

  // 엑셀 다운로드 비교
  items.push({
    category: "엑셀 다운로드",
    attribute: "파일명",
    moduleA: policyA.listScreen.excelFileName,
    moduleB: policyB.listScreen.excelFileName,
    tag: "화면별",
    isDifferent: policyA.listScreen.excelFileName !== policyB.listScreen.excelFileName,
  });
  items.push({
    category: "엑셀 다운로드",
    attribute: "다운로드 범위 규칙",
    moduleA: "3가지 규칙 (공통)",
    moduleB: "3가지 규칙 (공통)",
    tag: "공통",
    isDifferent: false,
  });

  // 삭제 정책 비교
  items.push({
    category: "삭제 정책",
    attribute: "삭제 방식",
    moduleA: policyA.deletePolicy.type,
    moduleB: policyB.deletePolicy.type,
    tag: policyA.deletePolicy.type === policyB.deletePolicy.type ? "공통" : "화면별",
    isDifferent: policyA.deletePolicy.type !== policyB.deletePolicy.type,
  });
  items.push({
    category: "삭제 정책",
    attribute: "삭제 설명",
    moduleA: policyA.deletePolicy.description.join("; "),
    moduleB: policyB.deletePolicy.description.join("; "),
    tag: "화면별",
    isDifferent: true,
  });

  // 팝업 비교
  items.push({
    category: "추가 팝업",
    attribute: "이탈 방지 confirm",
    moduleA: policyA.addPopup.confirmMessage,
    moduleB: policyB.addPopup.confirmMessage,
    tag: "공통",
    isDifferent: false,
  });
  items.push({
    category: "추가 팝업",
    attribute: "성공 토스트",
    moduleA: policyA.addPopup.toastMessage,
    moduleB: policyB.addPopup.toastMessage,
    tag: "공통",
    isDifferent: false,
  });

  // 입력 필드 비교
  items.push({
    category: "입력 필드",
    attribute: "필드 수",
    moduleA: `${policyA.fields.length}개`,
    moduleB: `${policyB.fields.length}개`,
    tag: "화면별",
    isDifferent: policyA.fields.length !== policyB.fields.length,
  });

  // 수정 팝업 비교
  items.push({
    category: "수정 팝업",
    attribute: "읽기 전용 필드",
    moduleA: policyA.editPopup.readonlyFields?.join(", ") || "없음",
    moduleB: policyB.editPopup.readonlyFields?.join(", ") || "없음",
    tag: "화면별",
    isDifferent: true,
  });

  // 유효성 검사 공통
  items.push({
    category: "유효성 검사",
    attribute: "검증 타이밍",
    moduleA: "blur / submit",
    moduleB: "blur / submit",
    tag: "공통",
    isDifferent: false,
  });
  items.push({
    category: "유효성 검사",
    attribute: "에러 표시 방식",
    moduleA: "컴포넌트 하단 에러 문구",
    moduleB: "컴포넌트 하단 에러 문구",
    tag: "공통",
    isDifferent: false,
  });

  // 서버 에러 공통
  items.push({
    category: "서버 에러",
    attribute: "에러 처리",
    moduleA: "alert 노출 + 팝업 유지",
    moduleB: "alert 노출 + 팝업 유지",
    tag: "공통",
    isDifferent: false,
  });

  return items;
}

export function countByTag(items: CompareItem[]) {
  const common = items.filter((i) => !i.isDifferent).length;
  const screenSpecific = items.filter((i) => i.isDifferent).length;
  return { common, screenSpecific, total: items.length };
}

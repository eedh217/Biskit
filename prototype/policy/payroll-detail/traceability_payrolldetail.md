# 급여내역 상세 - 추적성 매트릭스 (Traceability Matrix)

> 근거 문서: policy_payrolldetail_merged.md

---

## 요구사항 → 테스트케이스 매핑

| Req ID | 요구사항 요약 | 화면 | TC-ID | 커버리지 |
|--------|---------------|------|-------|----------|
| REQ-01 | 검색 (사번 OR 성명, Enter, placeholder) | HRIS_PD_01 | TC-001, TC-002, TC-003, TC-004, TC-005, TC-006 | 6건 |
| REQ-02 | 리스트 개수 카운트 (전체/검색) | HRIS_PD_01 | TC-001, TC-002, TC-004, TC-005 | 4건 |
| REQ-03 | 테이블 (고정+동적, 합계, 정렬, 행 클릭, 체크박스) | HRIS_PD_01 | TC-007, TC-008, TC-009, TC-010, TC-011, TC-013 | 6건 |
| REQ-04 | 금액 표시 (천 단위 콤마) | HRIS_PD_01 | TC-010, TC-011, TC-012 | 3건 |
| REQ-05 | 버튼 영역 (임직원추가/급여항목관리/확정·해제/삭제) | HRIS_PD_01 | TC-024, TC-028 | 2건 |
| REQ-06 | 페이지 사이즈 (15/30/50/100, 기본 30) | HRIS_PD_01 | TC-014, TC-015 | 2건 |
| REQ-07 | 엑셀 다운로드 (파일명, 범위 3가지, 동적 컬럼, 합계 포함) | HRIS_PD_01 | TC-016, TC-017, TC-018 | 3건 |
| REQ-08 | 선택 삭제 (물리삭제, 삭제 실패 처리) | HRIS_PD_01 | TC-019, TC-020, TC-021, TC-022, TC-023 | 5건 |
| REQ-09 | 급여확정 (confirm, 비활성화, 버튼 라벨 변경) | HRIS_PD_01 | TC-024, TC-025, TC-026, TC-027 | 4건 |
| REQ-10 | 급여확정해제 (confirm, 활성화 복원, 라벨 변경) | HRIS_PD_01 | TC-028, TC-029, TC-030 | 3건 |
| REQ-11 | 임직원 추가 팝업 검색 (사번 OR 성명) | HRIS_PD_02 | TC-031, TC-032, TC-033, TC-034 | 4건 |
| REQ-12 | 임직원 리스트 제공 조건 (귀속연월 근무+미추가) | HRIS_PD_02 | TC-035, TC-036, TC-037, TC-038, TC-039, TC-040 | 6건 |
| REQ-13 | 임직원 선택 및 추가 (다중, 토스트, 갱신) | HRIS_PD_02 | TC-041 | 1건 |
| REQ-14 | 임직원 추가 팝업 닫기/이탈 confirm | HRIS_PD_02 | TC-042, TC-043, TC-044 | 3건 |
| REQ-15 | 미확정 수정 모드 (사번/성명 readonly, 급여항목 편집, NULL) | HRIS_PD_04 | TC-046, TC-047, TC-050, TC-051 | 4건 |
| REQ-16 | 금액 입력 규칙 (0이상 정수, 소수점/음수 불가, 콤마) | HRIS_PD_04 | TC-047, TC-048, TC-049, TC-050, TC-052 | 5건 |
| REQ-17 | 미확정 수정 닫기/이탈 confirm | HRIS_PD_04 | TC-053, TC-054, TC-055 | 3건 |
| REQ-18 | 미확정 수정 완료 토스트 1.5초 | HRIS_PD_04 | TC-056 | 1건 |
| REQ-19 | 확정 읽기 전용 모드 (readonly, 닫기만, confirm 미노출) (충돌①) | HRIS_PD_04 | TC-058, TC-059, TC-060, TC-061 | 4건 |
| REQ-20 | 급여항목 관리 탭 (지급/공제) | HRIS_PD_03 | TC-062 | 1건 |
| REQ-21 | 토글 ON (컬럼 추가) | HRIS_PD_03 | TC-064 | 1건 |
| REQ-22 | 토글 OFF (alert, 데이터 삭제, 취소 시 복원) | HRIS_PD_03 | TC-065, TC-066, TC-067 | 3건 |
| REQ-23 | 저장 (일괄 반영, 토스트, 팝업 닫힘) | HRIS_PD_03 | TC-068 | 1건 |
| REQ-24 | 팝업 닫기 (confirm 미노출, 미저장 시 미반영) | HRIS_PD_03 | TC-069, TC-070 | 2건 |
| REQ-25 | 리스트 정렬: 등록 오래된 순 (충돌②) | HRIS_PD_03 | TC-063 | 1건 |
| REQ-26 | 귀속연월 변경 시 임직원 검증 (confirm, 삭제/취소) | HRIS_PD_01 | TC-071, TC-072, TC-073, TC-074 | 4건 |
| REQ-27 | 서버 에러 처리 (alert + 팝업 유지) | HRIS_PD_02/04 | TC-045, TC-057 | 2건 |
| REQ-28 | 유효성 검사 공통 (blur/submit, 에러 노출/제거) | HRIS_PD_04 | TC-075, TC-076 | 2건 |

---

## 커버리지 요약

| 구분 | 건수 |
|------|------|
| 총 요구사항 | 28건 |
| 총 테스트케이스 | 76건 |
| 요구사항 당 평균 TC | 2.7건 |
| TC가 1건인 요구사항 | REQ-13 (선택 추가), REQ-20 (탭 UI), REQ-21 (토글 ON), REQ-23 (저장), REQ-25 (정렬), REQ-18 (수정 토스트) |

---

## 테스트케이스 → 요구사항 역매핑

| TC-ID | Req Ref |
|-------|---------|
| TC-001 | REQ-01, REQ-02 |
| TC-002 | REQ-01, REQ-02 |
| TC-003 | REQ-01 |
| TC-004 | REQ-01, REQ-02 |
| TC-005 | REQ-01, REQ-02 |
| TC-006 | REQ-01 |
| TC-007 | REQ-03 |
| TC-008 | REQ-03 |
| TC-009 | REQ-03 |
| TC-010 | REQ-03, REQ-04 |
| TC-011 | REQ-03, REQ-04 |
| TC-012 | REQ-04 |
| TC-013 | REQ-03 |
| TC-014 | REQ-06 |
| TC-015 | REQ-06 |
| TC-016 | REQ-07 |
| TC-017 | REQ-07 |
| TC-018 | REQ-07 |
| TC-019 | REQ-08 |
| TC-020 | REQ-08 |
| TC-021 | REQ-08 |
| TC-022 | REQ-08 |
| TC-023 | REQ-08 |
| TC-024 | REQ-05, REQ-09 |
| TC-025 | REQ-09 |
| TC-026 | REQ-09 |
| TC-027 | REQ-09 |
| TC-028 | REQ-05, REQ-10 |
| TC-029 | REQ-10 |
| TC-030 | REQ-10 |
| TC-031 | REQ-11 |
| TC-032 | REQ-11 |
| TC-033 | REQ-11 |
| TC-034 | REQ-11 |
| TC-035 | REQ-12 |
| TC-036 | REQ-12 |
| TC-037 | REQ-12 |
| TC-038 | REQ-12 |
| TC-039 | REQ-12 |
| TC-040 | REQ-12 |
| TC-041 | REQ-13 |
| TC-042 | REQ-14 |
| TC-043 | REQ-14 |
| TC-044 | REQ-14 |
| TC-045 | REQ-27 |
| TC-046 | REQ-15 |
| TC-047 | REQ-15, REQ-16 |
| TC-048 | REQ-16 |
| TC-049 | REQ-16 |
| TC-050 | REQ-15, REQ-16 |
| TC-051 | REQ-15 |
| TC-052 | REQ-16 |
| TC-053 | REQ-17 |
| TC-054 | REQ-17 |
| TC-055 | REQ-17 |
| TC-056 | REQ-18 |
| TC-057 | REQ-27 |
| TC-058 | REQ-19 |
| TC-059 | REQ-19 |
| TC-060 | REQ-19 |
| TC-061 | REQ-19 |
| TC-062 | REQ-20 |
| TC-063 | REQ-25 |
| TC-064 | REQ-21 |
| TC-065 | REQ-22 |
| TC-066 | REQ-22 |
| TC-067 | REQ-22 |
| TC-068 | REQ-23 |
| TC-069 | REQ-24 |
| TC-070 | REQ-24 |
| TC-071 | REQ-26 |
| TC-072 | REQ-26 |
| TC-073 | REQ-26 |
| TC-074 | REQ-26 |
| TC-075 | REQ-28 |
| TC-076 | REQ-28 |

---

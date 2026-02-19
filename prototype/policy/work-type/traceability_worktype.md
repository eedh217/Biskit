# 근로형태 관리 - 추적성 매트릭스 (Traceability Matrix)

> 근거 문서: policy_worktype_merged.md

---

## 요구사항 → 테스트케이스 매핑

| Req ID | 요구사항 요약 | 화면 | TC-ID | 커버리지 |
|--------|---------------|------|-------|----------|
| REQ-WT-001 | 검색 (근로형태명 OR 코드, 최대 10자, 특수문자 불가, Enter, placeholder) | HRIS_WT_01 | WT-L-001, WT-L-002, WT-L-003, WT-L-004, WT-L-005, WT-L-006, WT-L-007, WT-L-008 | 8건 |
| REQ-WT-002 | 리스트 개수 카운트 (전체/검색) | HRIS_WT_01 | WT-L-010, WT-L-011, WT-L-012 | 3건 |
| REQ-WT-003 | 테이블 (2컬럼: 근로형태명/코드, 정렬, 행 클릭→수정 팝업 PK(id), 체크박스) | HRIS_WT_01 | WT-L-013, WT-L-014, WT-L-015 | 3건 |
| REQ-WT-004 | 페이지 사이즈 (15/30/50/100, 기본 30) | HRIS_WT_01 | WT-L-016, WT-L-017 | 2건 |
| REQ-WT-005 | 엑셀 다운로드 (파일명 HRIS_근로형태_리스트, 범위 3가지, 정렬 동일) | HRIS_WT_01 | WT-L-020, WT-L-021, WT-L-022, WT-L-023 | 4건 |
| REQ-WT-006 | 선택 삭제 (물리삭제, 복구 불가, 삭제 실패 처리, 건별 트랜잭션) | HRIS_WT_01 | WT-L-030, WT-L-031, WT-L-033, WT-L-034, WT-L-035, WT-L-036, WT-EP-006 | 7건 |
| REQ-WT-007 | 추가 팝업 닫기/이탈 방지 confirm (ESC/뒤로가기 차단) | HRIS_WT_02 | WT-A-001, WT-A-002, WT-A-003, WT-A-004 | 4건 |
| REQ-WT-008 | 추가 완료 토스트 1.5초 | HRIS_WT_02 | WT-A-005, WT-A-032 | 2건 |
| REQ-WT-009 | 추가 필드 유효성 (근로형태명/코드: 필수, 최대 10자, 특수문자 불가, 코드 submit 중복검사) | HRIS_WT_02 | WT-A-010, WT-A-011, WT-A-012, WT-A-013, WT-A-014, WT-A-015, WT-A-016, WT-A-020, WT-A-021, WT-A-022, WT-A-023, WT-A-024, WT-A-025, WT-A-026, WT-A-032, WT-A-033 | 16건 |
| REQ-WT-010 | 추가 서버 에러 처리 (alert + 팝업 유지) | HRIS_WT_02 | WT-A-030, WT-A-031 | 2건 |
| REQ-WT-011 | 삭제 시 임직원 연관 경고 confirm (사용 중 임직원 N명) | HRIS_WT_01 | WT-L-032, WT-L-037, WT-EP-005 | 3건 |
| REQ-WT-012 | 삭제 시 임직원 근로형태 NULL 변경 | HRIS_WT_01 | WT-L-037, WT-EP-005 | 2건 |
| REQ-WT-013 | 수정 팝업 닫기/이탈 방지 confirm (ESC 차단) | HRIS_WT_03 | WT-E-001, WT-E-002, WT-E-003 | 3건 |
| REQ-WT-014 | 수정 완료 토스트 1.5초 | HRIS_WT_03 | WT-E-004 | 1건 |
| REQ-WT-015 | 수정 필드 유효성 (근로형태명/코드 동일 규칙) | HRIS_WT_03 | WT-E-010, WT-E-011, WT-E-012, WT-E-013 | 4건 |
| REQ-WT-016 | 수정 코드 중복검사 (자기 자신 포함, 미변경 시 통과) | HRIS_WT_03 | WT-E-013, WT-E-014, WT-E-015 | 3건 |
| REQ-WT-017 | 수정 서버 에러 처리 (alert + 팝업 유지) | HRIS_WT_03 | WT-E-016 | 1건 |
| REQ-WT-018 | 임직원 관리 연관 (셀렉박스 단일선택, 근로형태명만, 가나다순, 선택 필수 아님, 리스트 미추가) | HRIS_EP_02/03 | WT-EP-001, WT-EP-002, WT-EP-003, WT-EP-004 | 4건 |

---

## 커버리지 요약

| 구분 | 건수 |
|------|------|
| 총 요구사항 | 18건 |
| 총 테스트케이스 | 55건 |
| 요구사항 당 평균 TC | 3.1건 |
| TC가 1건인 요구사항 | REQ-WT-014 (수정 토스트), REQ-WT-017 (수정 서버 에러) |

---

## 테스트케이스 → 요구사항 역매핑

| TC-ID | Req Ref |
|-------|---------|
| WT-L-001 | REQ-WT-001 |
| WT-L-002 | REQ-WT-001 |
| WT-L-003 | REQ-WT-001 |
| WT-L-004 | REQ-WT-001 |
| WT-L-005 | REQ-WT-001 |
| WT-L-006 | REQ-WT-001 |
| WT-L-007 | REQ-WT-001 |
| WT-L-008 | REQ-WT-001 |
| WT-L-010 | REQ-WT-002 |
| WT-L-011 | REQ-WT-002 |
| WT-L-012 | REQ-WT-002 |
| WT-L-013 | REQ-WT-003 |
| WT-L-014 | REQ-WT-003 |
| WT-L-015 | REQ-WT-003 |
| WT-L-016 | REQ-WT-004 |
| WT-L-017 | REQ-WT-004 |
| WT-L-020 | REQ-WT-005 |
| WT-L-021 | REQ-WT-005 |
| WT-L-022 | REQ-WT-005 |
| WT-L-023 | REQ-WT-005 |
| WT-L-030 | REQ-WT-006 |
| WT-L-031 | REQ-WT-006 |
| WT-L-032 | REQ-WT-006, REQ-WT-011 |
| WT-L-033 | REQ-WT-006 |
| WT-L-034 | REQ-WT-006 |
| WT-L-035 | REQ-WT-006 |
| WT-L-036 | REQ-WT-006 |
| WT-L-037 | REQ-WT-011, REQ-WT-012 |
| WT-A-001 | REQ-WT-007 |
| WT-A-002 | REQ-WT-007 |
| WT-A-003 | REQ-WT-007 |
| WT-A-004 | REQ-WT-007 |
| WT-A-005 | REQ-WT-008 |
| WT-A-010 | REQ-WT-009 |
| WT-A-011 | REQ-WT-009 |
| WT-A-012 | REQ-WT-009 |
| WT-A-013 | REQ-WT-009 |
| WT-A-014 | REQ-WT-009 |
| WT-A-015 | REQ-WT-009 |
| WT-A-016 | REQ-WT-009 |
| WT-A-020 | REQ-WT-009 |
| WT-A-021 | REQ-WT-009 |
| WT-A-022 | REQ-WT-009 |
| WT-A-023 | REQ-WT-009 |
| WT-A-024 | REQ-WT-009 |
| WT-A-025 | REQ-WT-009 |
| WT-A-026 | REQ-WT-009 |
| WT-A-030 | REQ-WT-010 |
| WT-A-031 | REQ-WT-010 |
| WT-A-032 | REQ-WT-008, REQ-WT-009 |
| WT-A-033 | REQ-WT-009 |
| WT-E-001 | REQ-WT-013 |
| WT-E-002 | REQ-WT-013 |
| WT-E-003 | REQ-WT-013 |
| WT-E-004 | REQ-WT-014 |
| WT-E-010 | REQ-WT-015 |
| WT-E-011 | REQ-WT-015 |
| WT-E-012 | REQ-WT-015 |
| WT-E-013 | REQ-WT-015, REQ-WT-016 |
| WT-E-014 | REQ-WT-016 |
| WT-E-015 | REQ-WT-016 |
| WT-E-016 | REQ-WT-017 |
| WT-EP-001 | REQ-WT-018 |
| WT-EP-002 | REQ-WT-018 |
| WT-EP-003 | REQ-WT-018 |
| WT-EP-004 | REQ-WT-018 |
| WT-EP-005 | REQ-WT-011, REQ-WT-012 |
| WT-EP-006 | REQ-WT-006 |

---

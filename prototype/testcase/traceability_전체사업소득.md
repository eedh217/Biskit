# SPS_BI_05 전체 사업소득 - 추적성 매트릭스 (Traceability Matrix)

## 요구사항 정의

| 요구사항 ID | 요구사항 설명 |
|---|---|
| SPS_BI_05_REQ_001 | 화면 진입: '전체 사업소득' 메뉴 클릭 시 SPS_BI_05로 이동, 전체 데이터 표시 |
| SPS_BI_05_REQ_002 | 검색영역: 성명(상호) 인풋박스+검색버튼, Enter 검색, 부분 일치, 빈값/공백 처리, 검색 시 1페이지 초기화, 체크박스 초기화, placeholder |
| SPS_BI_05_REQ_003 | 리스트(테이블): 최근 등록순, 좌측 체크박스(멀티선택), 헤더 전체선택(현재 페이지), 체크박스 영역 클릭 시 행 클릭 미발생 |
| SPS_BI_05_REQ_004 | 리스트 개수(카운트): 총 건수/검색 결과 건수 표시 |
| SPS_BI_05_REQ_005 | 테이블 컬럼: 귀속연도("YYYY년"), 귀속월("MM월"), 지급연도, 지급월, 성명(상호), 주민번호(마스킹 없음), 업종코드, 지급액, 소득세, 지방소득세, 실지급액 |
| SPS_BI_05_REQ_006 | 금액 표시: 천 단위 콤마 + "원", 우측 정렬 |
| SPS_BI_05_REQ_007 | 선택 삭제 버튼: 0건 시 비활성화, 체크박스 선택 시 활성화 |
| SPS_BI_05_REQ_008 | 데이터 범위: 모든 데이터 표시, 귀속 기준 예외 규칙 미적용, 원본 값 그대로 표시 |
| SPS_BI_05_REQ_009 | 페이지 사이즈: 15/30/50/100, 기본 30개 |
| SPS_BI_05_REQ_010 | 페이지 사이즈 변경 시 데이터 위치 유지 |
| SPS_BI_05_REQ_011 | 페이지네이션 |
| SPS_BI_05_REQ_012 | 엑셀 다운로드: 3가지 범위(전체/검색결과/선택), 0건 안내, 금액 숫자 형식, 정렬 동일, 파일명 "전체 사업소득.xlsx" |
| SPS_BI_05_REQ_013 | 선택 삭제: confirm "총 N개의 리스트를 삭제하시겠습니까?", 물리삭제, 토스트 "삭제가 완료되었습니다." 1.5초, 리스트/카운트 갱신 |
| SPS_BI_05_REQ_014 | 삭제 실패: 건별 트랜잭션, 부분 성공, 실패 리스트 팝업(성명+사유) |
| SPS_BI_05_REQ_015 | 데이터 연동: 추가/수정/삭제 시 SPS_BI_01, SPS_BI_02 즉시 반영 |
| SPS_BI_05_REQ_016 | 엑셀 업로드: SPS_BI_01과 동일, 완료 후 리스트 자동 갱신, 데이터 연동 |
| SPS_BI_05_REQ_017 | 사업소득 추가: 리스트 상단 버튼, 클릭 시 SPS_BI_06 팝업 |
| SPS_BI_05_REQ_018 | 추가 팝업 닫기/이탈 방지: 초기상태 confirm 없이, 입력 시 "사업소득 추가를 취소하시겠습니까?" |
| SPS_BI_05_REQ_019 | 추가 완료: 토스트 "사업소득 추가를 완료했습니다." 1.5초, 리스트/카운트 갱신 |
| SPS_BI_05_REQ_020 | 행 클릭: SPS_BI_07 수정 팝업 호출, PK(id) 전달 |
| SPS_BI_05_REQ_021 | 수정 팝업 닫기/이탈 방지: 변경 없으면 confirm 없이, 변경 시 "사업소득 수정을 취소하시겠습니까?" |
| SPS_BI_05_REQ_022 | 수정 완료: 토스트 "사업소득 수정을 완료했습니다." 1.5초, 리스트/카운트 갱신 |
| SPS_BI_05_REQ_023 | 서버 에러: alert "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |

---

## 1. 요구사항 -> 테스트케이스 매핑 (Forward Traceability)

| 요구사항 ID | 요구사항 설명 | 매핑 TC-ID |
|---|---|---|
| SPS_BI_05_REQ_001 | 화면 진입 | SPS_BI_05_TC_001, SPS_BI_05_TC_003 |
| SPS_BI_05_REQ_002 | 검색영역 | SPS_BI_05_TC_004, SPS_BI_05_TC_005, SPS_BI_05_TC_006, SPS_BI_05_TC_007, SPS_BI_05_TC_008, SPS_BI_05_TC_009, SPS_BI_05_TC_010, SPS_BI_05_TC_011, SPS_BI_05_TC_012, SPS_BI_05_TC_093 |
| SPS_BI_05_REQ_003 | 리스트(테이블) 체크박스 | SPS_BI_05_TC_002, SPS_BI_05_TC_026, SPS_BI_05_TC_027, SPS_BI_05_TC_028, SPS_BI_05_TC_029, SPS_BI_05_TC_084, SPS_BI_05_TC_085, SPS_BI_05_TC_086 |
| SPS_BI_05_REQ_004 | 리스트 개수(카운트) | SPS_BI_05_TC_013, SPS_BI_05_TC_014, SPS_BI_05_TC_015 |
| SPS_BI_05_REQ_005 | 테이블 컬럼 | SPS_BI_05_TC_016, SPS_BI_05_TC_017, SPS_BI_05_TC_018, SPS_BI_05_TC_019, SPS_BI_05_TC_020, SPS_BI_05_TC_021 |
| SPS_BI_05_REQ_006 | 금액 표시 | SPS_BI_05_TC_022, SPS_BI_05_TC_023, SPS_BI_05_TC_087, SPS_BI_05_TC_088, SPS_BI_05_TC_089, SPS_BI_05_TC_090, SPS_BI_05_TC_091, SPS_BI_05_TC_092 |
| SPS_BI_05_REQ_007 | 삭제 버튼 비활성화 | SPS_BI_05_TC_003, SPS_BI_05_TC_045, SPS_BI_05_TC_046 |
| SPS_BI_05_REQ_008 | 데이터 범위 (원본 표시) | SPS_BI_05_TC_024, SPS_BI_05_TC_025, SPS_BI_05_TC_095, SPS_BI_05_TC_096 |
| SPS_BI_05_REQ_009 | 페이지 사이즈 | SPS_BI_05_TC_030, SPS_BI_05_TC_031, SPS_BI_05_TC_032, SPS_BI_05_TC_033, SPS_BI_05_TC_034 |
| SPS_BI_05_REQ_010 | 페이지 사이즈 변경 시 위치 유지 | SPS_BI_05_TC_035 |
| SPS_BI_05_REQ_011 | 페이지네이션 | SPS_BI_05_TC_036, SPS_BI_05_TC_037 |
| SPS_BI_05_REQ_012 | 엑셀 다운로드 | SPS_BI_05_TC_038, SPS_BI_05_TC_039, SPS_BI_05_TC_040, SPS_BI_05_TC_041, SPS_BI_05_TC_042, SPS_BI_05_TC_043, SPS_BI_05_TC_044 |
| SPS_BI_05_REQ_013 | 선택 삭제 | SPS_BI_05_TC_047, SPS_BI_05_TC_048, SPS_BI_05_TC_049, SPS_BI_05_TC_050, SPS_BI_05_TC_051, SPS_BI_05_TC_052, SPS_BI_05_TC_053, SPS_BI_05_TC_093, SPS_BI_05_TC_094 |
| SPS_BI_05_REQ_014 | 삭제 실패 처리 | SPS_BI_05_TC_056, SPS_BI_05_TC_057 |
| SPS_BI_05_REQ_015 | 데이터 연동 | SPS_BI_05_TC_054, SPS_BI_05_TC_055, SPS_BI_05_TC_060, SPS_BI_05_TC_067, SPS_BI_05_TC_073 |
| SPS_BI_05_REQ_016 | 엑셀 업로드 | SPS_BI_05_TC_058, SPS_BI_05_TC_059, SPS_BI_05_TC_060 |
| SPS_BI_05_REQ_017 | 사업소득 추가 버튼 | SPS_BI_05_TC_061, SPS_BI_05_TC_062 |
| SPS_BI_05_REQ_018 | 추가 팝업 닫기/이탈 방지 | SPS_BI_05_TC_063, SPS_BI_05_TC_064 |
| SPS_BI_05_REQ_019 | 추가 완료 토스트 + 갱신 | SPS_BI_05_TC_065, SPS_BI_05_TC_066 |
| SPS_BI_05_REQ_020 | 행 클릭 → 수정 팝업 | SPS_BI_05_TC_068 |
| SPS_BI_05_REQ_021 | 수정 팝업 닫기/이탈 방지 | SPS_BI_05_TC_069, SPS_BI_05_TC_070 |
| SPS_BI_05_REQ_022 | 수정 완료 토스트 + 갱신 | SPS_BI_05_TC_071, SPS_BI_05_TC_072 |
| SPS_BI_05_REQ_023 | 서버 에러 | SPS_BI_05_TC_074, SPS_BI_05_TC_075 |

---

## 2. 테스트케이스 -> 요구사항 매핑 (Backward Traceability)

| TC-ID | TC 설명 | 매핑 요구사항 ID |
|---|---|---|
| SPS_BI_05_TC_001 | 화면 진입 | SPS_BI_05_REQ_001 |
| SPS_BI_05_TC_002 | 초기 리스트 정렬 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_003 | 데이터 0건 시 화면 | SPS_BI_05_REQ_001, SPS_BI_05_REQ_007 |
| SPS_BI_05_TC_004 | 검색 - 정상 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_005 | 검색 - 부분 일치 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_006 | 검색 - Enter 키 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_007 | 검색 - 빈값 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_008 | 검색 - 공백만 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_009 | 검색 - 결과 없음 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_010 | 검색 - placeholder | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_011 | 검색 시 1페이지 초기화 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_012 | 검색 시 체크박스 초기화 | SPS_BI_05_REQ_002 |
| SPS_BI_05_TC_013 | 카운트 - 전체 건수 | SPS_BI_05_REQ_004 |
| SPS_BI_05_TC_014 | 카운트 - 검색 결과 | SPS_BI_05_REQ_004 |
| SPS_BI_05_TC_015 | 카운트 - 삭제 후 갱신 | SPS_BI_05_REQ_004 |
| SPS_BI_05_TC_016 | 테이블 컬럼 확인 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_017 | 귀속연도 표시형식 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_018 | 귀속월 표시형식 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_019 | 지급연도 표시형식 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_020 | 지급월 표시형식 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_021 | 주민번호 마스킹 없음 | SPS_BI_05_REQ_005 |
| SPS_BI_05_TC_022 | 금액 - 천단위 콤마 + 원 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_023 | 금액 - 0원 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_024 | 데이터 범위 - 전체 표시 | SPS_BI_05_REQ_008 |
| SPS_BI_05_TC_025 | 예외 업종 원본 표시 | SPS_BI_05_REQ_008 |
| SPS_BI_05_TC_026 | 체크박스 - 개별 선택 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_027 | 헤더 체크박스 - 전체 선택 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_028 | 헤더 체크박스 - 전체 해제 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_029 | 체크박스 영역 클릭 시 행 클릭 미발생 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_030 | 페이지 사이즈 - 기본 30 | SPS_BI_05_REQ_009 |
| SPS_BI_05_TC_031 | 페이지 사이즈 - 15 | SPS_BI_05_REQ_009 |
| SPS_BI_05_TC_032 | 페이지 사이즈 - 50 | SPS_BI_05_REQ_009 |
| SPS_BI_05_TC_033 | 페이지 사이즈 - 100 | SPS_BI_05_REQ_009 |
| SPS_BI_05_TC_034 | 페이지 사이즈 - 옵션 확인 | SPS_BI_05_REQ_009 |
| SPS_BI_05_TC_035 | 페이지 사이즈 변경 시 위치 유지 | SPS_BI_05_REQ_010 |
| SPS_BI_05_TC_036 | 페이지네이션 - 다음 페이지 | SPS_BI_05_REQ_011 |
| SPS_BI_05_TC_037 | 페이지네이션 - 1페이지만 | SPS_BI_05_REQ_011 |
| SPS_BI_05_TC_038 | 엑셀 - 전체 다운로드 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_039 | 엑셀 - 검색 결과 다운로드 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_040 | 엑셀 - 선택 다운로드 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_041 | 엑셀 - 0건 안내 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_042 | 엑셀 - 파일명 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_043 | 엑셀 - 금액 숫자 형식 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_044 | 엑셀 - 정렬 동일 | SPS_BI_05_REQ_012 |
| SPS_BI_05_TC_045 | 삭제 버튼 - 0건 비활성화 | SPS_BI_05_REQ_007 |
| SPS_BI_05_TC_046 | 삭제 버튼 - 미선택 시 | SPS_BI_05_REQ_007 |
| SPS_BI_05_TC_047 | 선택 삭제 - confirm | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_048 | 선택 삭제 - 1건 confirm | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_049 | 선택 삭제 - confirm 확인 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_050 | 선택 삭제 - confirm 취소 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_051 | 삭제 토스트 1.5초 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_052 | 삭제 후 리스트/카운트 갱신 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_053 | 삭제 - 물리삭제 확인 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_054 | 삭제 데이터 연동 - SPS_BI_01 | SPS_BI_05_REQ_015 |
| SPS_BI_05_TC_055 | 삭제 데이터 연동 - SPS_BI_02 | SPS_BI_05_REQ_015 |
| SPS_BI_05_TC_056 | 삭제 실패 - 부분 성공 | SPS_BI_05_REQ_014 |
| SPS_BI_05_TC_057 | 삭제 실패 팝업 | SPS_BI_05_REQ_014 |
| SPS_BI_05_TC_058 | 엑셀 업로드 - 정상 | SPS_BI_05_REQ_016 |
| SPS_BI_05_TC_059 | 엑셀 업로드 후 갱신 | SPS_BI_05_REQ_016 |
| SPS_BI_05_TC_060 | 엑셀 업로드 데이터 연동 | SPS_BI_05_REQ_015, SPS_BI_05_REQ_016 |
| SPS_BI_05_TC_061 | 추가 버튼 위치 | SPS_BI_05_REQ_017 |
| SPS_BI_05_TC_062 | 추가 버튼 → SPS_BI_06 | SPS_BI_05_REQ_017 |
| SPS_BI_05_TC_063 | 추가 팝업 - 초기상태 닫기 | SPS_BI_05_REQ_018 |
| SPS_BI_05_TC_064 | 추가 팝업 - 입력 후 닫기 | SPS_BI_05_REQ_018 |
| SPS_BI_05_TC_065 | 추가 완료 토스트 | SPS_BI_05_REQ_019 |
| SPS_BI_05_TC_066 | 추가 완료 후 갱신 | SPS_BI_05_REQ_019 |
| SPS_BI_05_TC_067 | 추가 데이터 연동 | SPS_BI_05_REQ_015 |
| SPS_BI_05_TC_068 | 행 클릭 → SPS_BI_07 | SPS_BI_05_REQ_020 |
| SPS_BI_05_TC_069 | 수정 팝업 - 변경 없이 닫기 | SPS_BI_05_REQ_021 |
| SPS_BI_05_TC_070 | 수정 팝업 - 변경 후 닫기 | SPS_BI_05_REQ_021 |
| SPS_BI_05_TC_071 | 수정 완료 토스트 | SPS_BI_05_REQ_022 |
| SPS_BI_05_TC_072 | 수정 완료 후 갱신 | SPS_BI_05_REQ_022 |
| SPS_BI_05_TC_073 | 수정 데이터 연동 | SPS_BI_05_REQ_015 |
| SPS_BI_05_TC_074 | 서버 에러 - 조회 | SPS_BI_05_REQ_023 |
| SPS_BI_05_TC_075 | 서버 에러 - 삭제 | SPS_BI_05_REQ_023 |
| SPS_BI_05_TC_076 | E2E - 조회+검색+삭제 | 전체 |
| SPS_BI_05_TC_077 | E2E - 추가+리스트 확인 | 전체 |
| SPS_BI_05_TC_078 | E2E - 수정+리스트 확인 | 전체 |
| SPS_BI_05_TC_079 | E2E - 엑셀 다운로드 | 전체 |
| SPS_BI_05_TC_080 | E2E - 페이지사이즈+검색 | 전체 |
| SPS_BI_05_TC_081 | E2E - 전체선택 삭제 | 전체 |
| SPS_BI_05_TC_082 | E2E - 추가 후 검색 | 전체 |
| SPS_BI_05_TC_083 | E2E - 수정팝업에서 삭제 | 전체 |
| SPS_BI_05_TC_084 | 전체선택 - 현재 페이지만 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_085 | 개별 해제 후 전체선택 상태 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_086 | 페이지 이동 시 체크박스 초기화 | SPS_BI_05_REQ_003 |
| SPS_BI_05_TC_087 | 소득세 표시 형식 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_088 | 지방소득세 표시 형식 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_089 | 실지급액 표시 형식 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_090 | 소득세 0원 표시 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_091 | 지방소득세 0원 표시 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_092 | 대금액 표시 | SPS_BI_05_REQ_006 |
| SPS_BI_05_TC_093 | 검색 결과에서 삭제 | SPS_BI_05_REQ_002, SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_094 | 삭제 후 검색 상태 유지 | SPS_BI_05_REQ_013 |
| SPS_BI_05_TC_095 | 음료배달 예외 원본 표시 | SPS_BI_05_REQ_008 |
| SPS_BI_05_TC_096 | 방문판매원 예외 원본 표시 | SPS_BI_05_REQ_008 |

---

## 3. 커버리지 요약

| 항목 | 수량 |
|---|---|
| 총 요구사항 | 23개 (SPS_BI_05_REQ_001 ~ SPS_BI_05_REQ_023) |
| 총 테스트케이스 | 96건 (SPS_BI_05_TC_001 ~ SPS_BI_05_TC_096) |
| 요구사항당 평균 TC 수 | 약 4.2개 |
| 미커버 요구사항 | 0개 (전체 커버) |

### 유형별 분포

| 유형 | 수량 |
|---|---|
| 정상 | 55건 |
| 경계 | 17건 |
| 예외 | 8건 |
| 데이터무결성 | 16건 |
| 권한 | 0건 (해당 화면 권한 정책 미기재) |

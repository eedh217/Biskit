# SPS_BI_01 사업소득 합산 - 추적 매트릭스 (Traceability Matrix)

## 1. 요구사항 정의

| 요구사항 ID | 요구사항 설명 |
|---|---|
| SPS_BI_01_REQ_001 | 연도 선택 셀렉박스: 범위 2026년~(현재연도+1)년, 기본값 현재연도, 변경 시 테이블 갱신, placeholder "선택" 미적용 |
| SPS_BI_01_REQ_002 | 월별 합산 테이블: 1~12월 12행 고정, 오름차순 정렬, 컬럼 구성(월/건수/지급액/소득세/지방소득세/실지급액/신고파일생성일/다운로드), 금액 천단위 콤마+"원" 우측정렬, 데이터 없는 월 0표시, 건수=소득 지급 건수(중복 포함), 신고파일 최종생성일 YYYY-MM-DD 형식, 음수 금액 미발생 |
| SPS_BI_01_REQ_003 | 행 클릭: 해당 월 SPS_BI_02(월별 리스트)로 이동, 다운로드 버튼 제외 영역, 12월 추가 행 클릭 불가 |
| SPS_BI_01_REQ_004 | 다운로드: 신고파일 최근 생성 파일 다운로드, 미생성 시 버튼 공간 유지 후 숨김(visibility:hidden), 12월 추가 행 다운로드 버튼 없음, 파일명 YYYY년 M월 간이지급명세서.xlsx (패딩 없음) |
| SPS_BI_01_REQ_005 | 귀속 기준 예외 규칙: 보험설계사(940906)/음료배달(940907)/방문판매원(940908) + 귀속연도!=지급연도 -> 귀속연도 12월 합산 포함. 예외 업종 외 일반 업종은 귀속연도!=지급연도여도 지급월 기준 합산 |
| SPS_BI_01_REQ_006 | 12월 예외 데이터 표시: 예외 업종+귀속!=지급 데이터 1건 이상 시 추가 2행("YYYY년 지급", "YYYY년 이후 지급"), 추가 행 클릭 불가/신고파일 미노출/시각적 구분(배경색+들여쓰기+폰트 크기 작게)/건수 포함, 예외 없으면 미생성 |
| SPS_BI_01_REQ_007 | 서버 에러: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| SPS_BI_01_REQ_008 | 접근 권한: 모든 로그인 사용자 접근 가능, 별도 역할/권한 제한 없음 |
| SPS_BI_01_REQ_009 | 로딩 상태: 초기 로딩 및 연도 변경 시 로딩 인디케이터(스피너) 표시 |
| SPS_BI_01_REQ_010 | 음수 금액: 음수 금액은 발생하지 않음 |

---

## 2. 요구사항 -> TC-ID 매핑 (Forward Traceability)

| 요구사항 ID | 요구사항 설명 | TC-ID |
|---|---|---|
| SPS_BI_01_REQ_001 | 연도 선택 셀렉박스 | SPS_BI_01_TC_001, SPS_BI_01_TC_002, SPS_BI_01_TC_003, SPS_BI_01_TC_004, SPS_BI_01_TC_005, SPS_BI_01_TC_006, SPS_BI_01_TC_007, SPS_BI_01_TC_008, SPS_BI_01_TC_059 |
| SPS_BI_01_REQ_002 | 월별 합산 테이블 | SPS_BI_01_TC_009, SPS_BI_01_TC_010, SPS_BI_01_TC_011, SPS_BI_01_TC_012, SPS_BI_01_TC_013, SPS_BI_01_TC_014, SPS_BI_01_TC_015, SPS_BI_01_TC_016, SPS_BI_01_TC_017, SPS_BI_01_TC_018, SPS_BI_01_TC_019, SPS_BI_01_TC_020, SPS_BI_01_TC_021, SPS_BI_01_TC_057, SPS_BI_01_TC_060, SPS_BI_01_TC_061, SPS_BI_01_TC_062 |
| SPS_BI_01_REQ_003 | 행 클릭 (월별 리스트 이동) | SPS_BI_01_TC_022, SPS_BI_01_TC_023, SPS_BI_01_TC_024, SPS_BI_01_TC_025, SPS_BI_01_TC_026, SPS_BI_01_TC_027, SPS_BI_01_TC_028 |
| SPS_BI_01_REQ_004 | 다운로드 | SPS_BI_01_TC_029, SPS_BI_01_TC_030, SPS_BI_01_TC_031, SPS_BI_01_TC_032, SPS_BI_01_TC_033, SPS_BI_01_TC_034, SPS_BI_01_TC_035, SPS_BI_01_TC_036, SPS_BI_01_TC_037, SPS_BI_01_TC_038, SPS_BI_01_TC_063 |
| SPS_BI_01_REQ_005 | 귀속 기준 예외 규칙 | SPS_BI_01_TC_039, SPS_BI_01_TC_040, SPS_BI_01_TC_041, SPS_BI_01_TC_042, SPS_BI_01_TC_043, SPS_BI_01_TC_044, SPS_BI_01_TC_045 |
| SPS_BI_01_REQ_006 | 12월 예외 데이터 표시 | SPS_BI_01_TC_026, SPS_BI_01_TC_027, SPS_BI_01_TC_032, SPS_BI_01_TC_046, SPS_BI_01_TC_047, SPS_BI_01_TC_048, SPS_BI_01_TC_049, SPS_BI_01_TC_050, SPS_BI_01_TC_051, SPS_BI_01_TC_052, SPS_BI_01_TC_053, SPS_BI_01_TC_054, SPS_BI_01_TC_055, SPS_BI_01_TC_056, SPS_BI_01_TC_057, SPS_BI_01_TC_058, SPS_BI_01_TC_059, SPS_BI_01_TC_069, SPS_BI_01_TC_070, SPS_BI_01_TC_071, SPS_BI_01_TC_072, SPS_BI_01_TC_073, SPS_BI_01_TC_074, SPS_BI_01_TC_075 |
| SPS_BI_01_REQ_007 | 서버 에러 | SPS_BI_01_TC_008, SPS_BI_01_TC_021, SPS_BI_01_TC_036 |
| SPS_BI_01_REQ_008 | 접근 권한 | SPS_BI_01_TC_064, SPS_BI_01_TC_065 |
| SPS_BI_01_REQ_009 | 로딩 상태 표시 | SPS_BI_01_TC_066, SPS_BI_01_TC_067 |
| SPS_BI_01_REQ_010 | 음수 금액 미발생 | SPS_BI_01_TC_068 |

---

## 3. TC-ID -> 요구사항 ID 매핑 (Backward Traceability)

| TC-ID | 화면/기능 | 요구사항 ID |
|---|---|---|
| SPS_BI_01_TC_001 | 연도 셀렉박스 / 기본값 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_002 | 연도 셀렉박스 / 범위 확인 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_003 | 연도 셀렉박스 / 연도 변경 시 테이블 갱신 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_004 | 연도 셀렉박스 / 하한 경계값 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_005 | 연도 셀렉박스 / 상한 경계값 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_006 | 연도 셀렉박스 / placeholder 미적용 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_007 | 연도 셀렉박스 / 동일 연도 재선택 | SPS_BI_01_REQ_001 |
| SPS_BI_01_TC_008 | 연도 셀렉박스 / 서버 오류 | SPS_BI_01_REQ_001, SPS_BI_01_REQ_007 |
| SPS_BI_01_TC_009 | 테이블 / 12행 고정 표시 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_010 | 테이블 / 정렬 순서 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_011 | 테이블 / 컬럼 구성 확인 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_012 | 테이블 / 금액 포맷 - 천 단위 콤마 + 원 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_013 | 테이블 / 금액 우측 정렬 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_014 | 테이블 / 데이터 없는 월 표시 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_015 | 테이블 / 전체 월 데이터 없음 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_016 | 테이블 / 신고파일 최종생성일 표시 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_017 | 테이블 / 신고파일 미생성 시 표시 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_018 | 테이블 / 금액 0원 포맷 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_019 | 테이블 / 대량 금액 표시 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_020 | 테이블 / 월 표시 형식 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_021 | 테이블 / 초기 로딩 시 서버오류 | SPS_BI_01_REQ_002, SPS_BI_01_REQ_007 |
| SPS_BI_01_TC_022 | 행 클릭 / 정상 이동 | SPS_BI_01_REQ_003 |
| SPS_BI_01_TC_023 | 행 클릭 / 데이터 없는 월 클릭 | SPS_BI_01_REQ_003 |
| SPS_BI_01_TC_024 | 행 클릭 / 12월 행 클릭 | SPS_BI_01_REQ_003 |
| SPS_BI_01_TC_025 | 행 클릭 / 다운로드 버튼 영역 클릭 시 이동 안 됨 | SPS_BI_01_REQ_003 |
| SPS_BI_01_TC_026 | 행 클릭 / 12월 추가 행 클릭 불가 ("지급") | SPS_BI_01_REQ_003, SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_027 | 행 클릭 / 12월 추가 행 클릭 불가 ("이후 지급") | SPS_BI_01_REQ_003, SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_028 | 행 클릭 / 모든 월(1~11월) 클릭 | SPS_BI_01_REQ_003 |
| SPS_BI_01_TC_029 | 다운로드 / 정상 다운로드 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_030 | 다운로드 / 신고파일 미생성 시 버튼 숨김 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_031 | 다운로드 / 신고파일 생성 완료 시 버튼 표시 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_032 | 다운로드 / 12월 추가 행 다운로드 버튼 없음 | SPS_BI_01_REQ_004, SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_033 | 다운로드 / 파일명 형식 확인 (1월) | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_034 | 다운로드 / 파일명 형식 확인 (12월) | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_035 | 다운로드 / 최근 생성 파일 다운로드 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_036 | 다운로드 / 서버 오류 | SPS_BI_01_REQ_004, SPS_BI_01_REQ_007 |
| SPS_BI_01_TC_037 | 다운로드 / 파일명 월 두 자리 (한 자리 월) | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_038 | 다운로드 / 파일 확장자 확인 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_039 | 귀속 예외 / 보험설계사(940906) | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_040 | 귀속 예외 / 음료배달(940907) | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_041 | 귀속 예외 / 방문판매원(940908) | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_042 | 귀속 예외 / 예외 업종 + 귀속=지급연도 (지급월 기준 합산) | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_043 | 귀속 예외 / 비예외 업종 + 귀속!=지급연도 | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_044 | 귀속 예외 / 여러 예외 업종 동시 존재 | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_045 | 귀속 예외 / 지급연도 기준 화면 미표시 | SPS_BI_01_REQ_005 |
| SPS_BI_01_TC_046 | 12월 예외 / 추가 행 2개 생성 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_047 | 12월 예외 / 기본 행 전체 합산 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_048 | 12월 예외 / "YYYY년 지급" 행 데이터 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_049 | 12월 예외 / "YYYY년 이후 지급" 행 데이터 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_050 | 12월 예외 / 추가 행 클릭 불가 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_051 | 12월 예외 / 추가 행 신고파일 미노출 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_052 | 12월 예외 / 추가 행 시각적 구분 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_053 | 12월 예외 / 예외 없으면 추가 행 미생성 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_054 | 12월 예외 / 테이블 총 행 수 확인 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_055 | 12월 예외 / 기본 행 = 지급+이후지급 합계 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_056 | 12월 예외 / 여러 지급연도 합산 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_057 | 12월 예외 / 추가 행 금액 포맷 | SPS_BI_01_REQ_002, SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_058 | 12월 예외 / "YYYY년 지급" 행 0건 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_059 | 12월 예외 / 연도 변경 시 추가 행 갱신 | SPS_BI_01_REQ_001, SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_060 | 데이터 무결성 / 월별 합산 정확성 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_061 | 데이터 무결성 / 소득세/지방소득세/실지급액 합산 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_062 | 데이터 무결성 / 건수 정확성 | SPS_BI_01_REQ_002 |
| SPS_BI_01_TC_063 | 테이블 / 다운로드 버튼 숨김 시 레이아웃 | SPS_BI_01_REQ_004 |
| SPS_BI_01_TC_064 | 접근 권한 / 로그인 사용자 접근 | SPS_BI_01_REQ_008 |
| SPS_BI_01_TC_065 | 접근 권한 / 비로그인 사용자 접근 불가 | SPS_BI_01_REQ_008 |
| SPS_BI_01_TC_066 | 로딩 / 초기 로딩 인디케이터 | SPS_BI_01_REQ_009 |
| SPS_BI_01_TC_067 | 로딩 / 연도 변경 시 로딩 인디케이터 | SPS_BI_01_REQ_009 |
| SPS_BI_01_TC_068 | 음수 금액 / 발생 불가 확인 | SPS_BI_01_REQ_010 |
| SPS_BI_01_TC_069 | 12월 추가 행 / 건수 컬럼 포함 표시 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_070 | YYYY년 지급 / 일반 업종 포함 (업종 무관) | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_071 | YYYY년 지급 / 예외 업종 귀속=지급 포함 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_072 | YYYY년 지급 / 예외 업종 귀속≠지급 제외 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_073 | YYYY년 지급 / 음료배달 귀속≠지급 제외 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_074 | YYYY년 지급 / 방문판매원 귀속≠지급 제외 | SPS_BI_01_REQ_006 |
| SPS_BI_01_TC_075 | YYYY년 지급 / 다양한 업종 혼합 합산 | SPS_BI_01_REQ_006 |

---

## 4. 커버리지 요약

| 요구사항 ID | TC 수 | 커버리지 상태 |
|---|---|---|
| SPS_BI_01_REQ_001 | 9 | 충분 |
| SPS_BI_01_REQ_002 | 17 | 충분 |
| SPS_BI_01_REQ_003 | 7 | 충분 |
| SPS_BI_01_REQ_004 | 11 | 충분 |
| SPS_BI_01_REQ_005 | 7 | 충분 |
| SPS_BI_01_REQ_006 | 24 | 충분 |
| SPS_BI_01_REQ_007 | 3 | 충분 |
| SPS_BI_01_REQ_008 | 2 | 충분 |
| SPS_BI_01_REQ_009 | 2 | 충분 |
| SPS_BI_01_REQ_010 | 1 | 충분 |
| **합계** | **75 TC** | **전체 커버** |

> 참고: 일부 TC는 복수 요구사항을 커버하므로 TC 수 합계와 고유 TC 수(75개)는 다를 수 있습니다.

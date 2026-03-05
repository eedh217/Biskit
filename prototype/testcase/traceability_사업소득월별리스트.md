# SPS_BI_02 사업소득 월별 리스트 - 추적성 매트릭스 (Traceability Matrix)

## 1. 요구사항 ID -> TC-ID 매핑 (Requirements to Test Cases)

| 요구사항 ID | 요구사항 설명 | TC-ID |
|---|---|---|
| SPS_BI_02_REQ_001 | 화면 진입: SPS_BI_01에서 행 클릭 시 SPS_BI_02 이동, URL 파라미터 ?year=YYYY&month=MM | SPS_BI_02_TC_001, SPS_BI_02_TC_009, SPS_BI_02_TC_010 |
| SPS_BI_02_REQ_001_SEARCH | 검색영역: 인풋박스+검색버튼, 성명(상호) 검색, placeholder, Enter 검색 실행, 부분 일치, 검색 시 리스트+카운트 갱신, 1페이지 초기화, 체크박스 초기화 | SPS_BI_02_TC_011, SPS_BI_02_TC_012, SPS_BI_02_TC_013, SPS_BI_02_TC_014, SPS_BI_02_TC_015, SPS_BI_02_TC_016, SPS_BI_02_TC_017, SPS_BI_02_TC_018, SPS_BI_02_TC_019, SPS_BI_02_TC_020, SPS_BI_02_TC_021, SPS_BI_02_TC_096, SPS_BI_02_TC_097, SPS_BI_02_TC_098 |
| SPS_BI_02_REQ_002 | 상단 요약: 건수(소득자건수), 총 지급액, 총 소득세, 총 지방소득세, 총 실지급액 (천 단위 콤마+"원"), 재귀속 데이터 포함, 검색 시 전체 기준 유지 | SPS_BI_02_TC_002, SPS_BI_02_TC_014, SPS_BI_02_TC_078, SPS_BI_02_TC_079, SPS_BI_02_TC_080, SPS_BI_02_TC_081, SPS_BI_02_TC_082, SPS_BI_02_TC_083, SPS_BI_02_TC_084, SPS_BI_02_TC_085, SPS_BI_02_TC_086, SPS_BI_02_TC_099 |
| SPS_BI_02_REQ_003 | 안내문구: 간이지급명세서 관련 안내 문구 표시 | SPS_BI_02_TC_003 |
| SPS_BI_02_REQ_004 | 리스트 개수(카운트): 총 건수 / 검색 결과 건수 | SPS_BI_02_TC_008, SPS_BI_02_TC_014, SPS_BI_02_TC_092, SPS_BI_02_TC_093, SPS_BI_02_TC_094, SPS_BI_02_TC_095 |
| SPS_BI_02_REQ_005 | 리스트(테이블): 기본 정렬(최근 등록 순), 체크박스(멀티 선택), 헤더 전체 선택(현재 페이지), 컬럼 구성, 금액 형식(천 단위 콤마+"원", 우측 정렬), 주민번호 전체 표시, 신고파일 미생성 시 "-", 체크박스 영역 클릭 시 토글만 | SPS_BI_02_TC_004, SPS_BI_02_TC_005, SPS_BI_02_TC_006, SPS_BI_02_TC_007, SPS_BI_02_TC_054, SPS_BI_02_TC_055, SPS_BI_02_TC_056, SPS_BI_02_TC_086, SPS_BI_02_TC_087, SPS_BI_02_TC_088, SPS_BI_02_TC_089, SPS_BI_02_TC_090, SPS_BI_02_TC_091, SPS_BI_02_TC_100, SPS_BI_02_TC_101, SPS_BI_02_TC_102, SPS_BI_02_TC_103, SPS_BI_02_TC_126 |
| SPS_BI_02_REQ_006 | 페이지 사이즈: 15/30/50/100, 기본 30개, 변경 시 데이터 위치 유지 | SPS_BI_02_TC_004, SPS_BI_02_TC_022, SPS_BI_02_TC_023, SPS_BI_02_TC_024, SPS_BI_02_TC_025, SPS_BI_02_TC_026, SPS_BI_02_TC_027, SPS_BI_02_TC_028, SPS_BI_02_TC_029, SPS_BI_02_TC_030, SPS_BI_02_TC_031, SPS_BI_02_TC_105, SPS_BI_02_TC_106 |
| SPS_BI_02_REQ_007 | 엑셀 다운로드: 전체/검색결과/선택항목 다운로드, 정렬 화면과 동일, 파일명 규칙, 금액 숫자 형식, 0건 안내 | SPS_BI_02_TC_032, SPS_BI_02_TC_033, SPS_BI_02_TC_034, SPS_BI_02_TC_035, SPS_BI_02_TC_036, SPS_BI_02_TC_037, SPS_BI_02_TC_038, SPS_BI_02_TC_110, SPS_BI_02_TC_111 |
| SPS_BI_02_REQ_008 | 선택 삭제: 체크박스 선택 시 활성화, 0건 비활성화, confirm, 물리삭제, 건별 트랜잭션, 부분 성공 허용, 실패 리스트 팝업, 삭제 후 갱신, 토스트 | SPS_BI_02_TC_039, SPS_BI_02_TC_040, SPS_BI_02_TC_041, SPS_BI_02_TC_042, SPS_BI_02_TC_043, SPS_BI_02_TC_044, SPS_BI_02_TC_045, SPS_BI_02_TC_046, SPS_BI_02_TC_046_1, SPS_BI_02_TC_056, SPS_BI_02_TC_094, SPS_BI_02_TC_107, SPS_BI_02_TC_125 |
| SPS_BI_02_REQ_009 | 전체 삭제: confirm, 물리삭제, 건별 트랜잭션, 부분 성공 허용, 실패 팝업, 삭제 후 갱신, 0건 비활성화, 토스트 | SPS_BI_02_TC_047, SPS_BI_02_TC_048, SPS_BI_02_TC_049, SPS_BI_02_TC_050, SPS_BI_02_TC_051, SPS_BI_02_TC_052, SPS_BI_02_TC_053, SPS_BI_02_TC_108, SPS_BI_02_TC_109 |
| SPS_BI_02_REQ_010 | 사업소득 추가: SPS_BI_03 팝업, 초기상태 닫기/입력 있으면 confirm, 성공 토스트 1.5초, 완료 후 갱신 | SPS_BI_02_TC_057, SPS_BI_02_TC_058, SPS_BI_02_TC_059, SPS_BI_02_TC_060, SPS_BI_02_TC_061, SPS_BI_02_TC_062, SPS_BI_02_TC_063, SPS_BI_02_TC_064, SPS_BI_02_TC_095 |
| SPS_BI_02_REQ_011 | 비합산 행 클릭 수정: SPS_BI_04 팝업, DB PK(id) 전달, 변경 없으면 닫기/변경 시 confirm, 성공 토스트 1.5초, 완료 후 갱신, 체크박스 영역/외 영역 클릭 구분 | SPS_BI_02_TC_065, SPS_BI_02_TC_066, SPS_BI_02_TC_067, SPS_BI_02_TC_068, SPS_BI_02_TC_069, SPS_BI_02_TC_070, SPS_BI_02_TC_071, SPS_BI_02_TC_072, SPS_BI_02_TC_103, SPS_BI_02_TC_104 |
| SPS_BI_02_REQ_012 | 귀속 기준 예외: 보험설계사(940906)/음료배달(940907)/방문판매원(940908) + 귀속연도!=지급연도 -> 귀속연도 12월 리스트 포함, 귀속월 원래값 표시 | SPS_BI_02_TC_073, SPS_BI_02_TC_074, SPS_BI_02_TC_075, SPS_BI_02_TC_076, SPS_BI_02_TC_077, SPS_BI_02_TC_078, SPS_BI_02_TC_112 |
| SPS_BI_02_REQ_013 | 서버 에러: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." | SPS_BI_02_TC_021, SPS_BI_02_TC_038, SPS_BI_02_TC_046, SPS_BI_02_TC_053, SPS_BI_02_TC_064, SPS_BI_02_TC_072, SPS_BI_02_TC_136 |
| SPS_BI_02_REQ_014 | 예외 업종 합산 그룹핑 기준 (2.13.1): 귀속연월+주민번호+업종코드 동일 시 합산, 2건 이상 합산 행, 1건 개별 행, 비예외 업종 합산 미적용 | SPS_BI_02_TC_113, SPS_BI_02_TC_114, SPS_BI_02_TC_115, SPS_BI_02_TC_116, SPS_BI_02_TC_117 |
| SPS_BI_02_REQ_015 | 합산 행 표시 (2.13.2): 대표값(첫 번째 레코드), 금액 합산값, "N건 합산" 뱃지, 시각적 구분(배경색) | SPS_BI_02_TC_118, SPS_BI_02_TC_119, SPS_BI_02_TC_120, SPS_BI_02_TC_121, SPS_BI_02_TC_122 |
| SPS_BI_02_REQ_016 | 합산 행 체크박스 동작 (2.13.3): 합산 행 선택/해제 시 그룹 내 모든 레코드, 선택 삭제 시 모든 개별 레코드 삭제 | SPS_BI_02_TC_123, SPS_BI_02_TC_124, SPS_BI_02_TC_125, SPS_BI_02_TC_126, SPS_BI_02_TC_135, SPS_BI_02_TC_143 |
| SPS_BI_02_REQ_017 | 합산 행 클릭 - 그룹 수정 (2.13.4/2.11): SPS_BI_08 팝업, 모든 레코드 전달, confirm "사업소득 그룹 수정을 취소하시겠습니까?", 토스트 "사업소득 그룹 수정을 완료했습니다.", 완료 후 갱신 | SPS_BI_02_TC_127, SPS_BI_02_TC_128, SPS_BI_02_TC_129, SPS_BI_02_TC_130, SPS_BI_02_TC_131, SPS_BI_02_TC_132, SPS_BI_02_TC_133, SPS_BI_02_TC_134, SPS_BI_02_TC_135, SPS_BI_02_TC_136 |
| SPS_BI_02_REQ_018 | 상단 요약과 합산 행 관계 (2.13.5): 건수/금액은 개별 레코드 기준 집계, 리스트 카운트 "총 N행 (M건)" 형식 | SPS_BI_02_TC_137, SPS_BI_02_TC_138, SPS_BI_02_TC_139, SPS_BI_02_TC_140, SPS_BI_02_TC_141 |
| SPS_BI_02_REQ_019 | 엑셀 다운로드와 합산 행 관계 (2.13.6): 개별 레코드 단위 내보내기, 지급연도/지급월 컬럼 포함 | SPS_BI_02_TC_142, SPS_BI_02_TC_143, SPS_BI_02_TC_144 |

---

## 2. TC-ID -> 요구사항 ID 매핑 (Test Cases to Requirements)

| TC-ID | 화면/기능 | 유형 | 요구사항 ID |
|---|---|---|---|
| SPS_BI_02_TC_001 | 화면진입 | 정상 | SPS_BI_02_REQ_001 |
| SPS_BI_02_TC_002 | 화면진입 - 상단 요약 | 정상 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_003 | 화면진입 - 안내문구 | 정상 | SPS_BI_02_REQ_003 |
| SPS_BI_02_TC_004 | 화면진입 - 리스트 기본 정렬 및 페이지 사이즈 | 정상 | SPS_BI_02_REQ_005, SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_005 | 화면진입 - 리스트 컬럼 구성 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_006 | 화면진입 - 금액 형식 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_007 | 화면진입 - 신고파일 미생성 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_008 | 화면진입 - 카운트 표시 | 정상 | SPS_BI_02_REQ_004 |
| SPS_BI_02_TC_009 | 화면진입 - URL 파라미터 없음 | 예외 | SPS_BI_02_REQ_001 |
| SPS_BI_02_TC_010 | 화면진입 - URL 파라미터 비정상 | 예외 | SPS_BI_02_REQ_001 |
| SPS_BI_02_TC_011 | 검색 - 버튼 클릭 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_012 | 검색 - Enter 키 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_013 | 검색 - placeholder | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_014 | 검색 - 결과 갱신 및 상단 요약 유지 | 정상 | SPS_BI_02_REQ_001_SEARCH, SPS_BI_02_REQ_002, SPS_BI_02_REQ_004 |
| SPS_BI_02_TC_015 | 검색 - 빈 값 | 경계 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_016 | 검색 - 공백만 입력 | 경계 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_017 | 검색 - 매칭 없음 | 예외 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_018 | 검색 - 특수문자 | 경계 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_019 | 검색 - 매우 긴 문자열 | 경계 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_020 | 검색 - 상호명 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_021 | 검색 - 서버 오류 | 예외 | SPS_BI_02_REQ_001_SEARCH, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_022 | 페이징 - 기본 30건 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_023 | 페이징 - 15건 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_024 | 페이징 - 30건 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_025 | 페이징 - 50건 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_026 | 페이징 - 100건 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_027 | 페이징 - 페이지 이동 | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_028 | 페이징 - 정확히 30건 | 경계 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_029 | 페이징 - 31건 경계 | 경계 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_030 | 페이징 - 0건 | 경계 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_031 | 페이징 - 1건 | 경계 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_032 | 엑셀다운로드 - 전체 | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_033 | 엑셀다운로드 - 검색결과 | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_034 | 엑셀다운로드 - 선택항목 | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_035 | 엑셀다운로드 - 컬럼 확인 | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_036 | 엑셀다운로드 - 금액 형식 | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_037 | 엑셀다운로드 - 0건 | 예외 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_038 | 엑셀다운로드 - 서버 오류 | 예외 | SPS_BI_02_REQ_007, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_039 | 선택삭제 - 1건 | 정상 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_040 | 선택삭제 - 5건 | 정상 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_041 | 선택삭제 - 미선택 비활성화 | 정상 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_042 | 선택삭제 - confirm 취소 | 정상 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_043 | 선택삭제 - 상단 요약 갱신 | 데이터무결성 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_044 | 선택삭제 - 부분 성공 | 예외 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_045 | 선택삭제 - 부분 성공 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_046 | 선택삭제 - 서버 오류 | 예외 | SPS_BI_02_REQ_008, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_046_1 | 선택삭제 - 0건 비활성화 | 경계 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_047 | 전체삭제 - 정상 | 정상 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_048 | 전체삭제 - confirm 취소 | 정상 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_049 | 전체삭제 - 완료 후 확인 | 데이터무결성 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_050 | 전체삭제 - 부분 성공 | 예외 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_051 | 전체삭제 - 부분 성공 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_052 | 전체삭제 - 1건 경계 | 경계 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_053 | 전체삭제 - 서버 오류 | 예외 | SPS_BI_02_REQ_009, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_054 | 체크박스 - 단건 선택 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_055 | 체크박스 - 멀티 선택 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_056 | 체크박스 - 선택 해제 | 정상 | SPS_BI_02_REQ_005, SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_057 | 사업소득추가 - 팝업 열기 | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_058 | 사업소득추가 - 초기상태 닫기 | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_059 | 사업소득추가 - 입력 후 닫기 confirm | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_060 | 사업소득추가 - confirm 취소 | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_061 | 사업소득추가 - confirm 확인 | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_062 | 사업소득추가 - 성공 토스트 | 정상 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_063 | 사업소득추가 - 완료 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_064 | 사업소득추가 - 서버 오류 | 예외 | SPS_BI_02_REQ_010, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_065 | 사업소득수정 - 비합산 행 팝업 열기 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_066 | 사업소득수정 - 변경 없이 닫기 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_067 | 사업소득수정 - 변경 후 닫기 confirm | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_068 | 사업소득수정 - confirm 취소 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_069 | 사업소득수정 - confirm 확인 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_070 | 사업소득수정 - 성공 토스트 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_071 | 사업소득수정 - 완료 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_072 | 사업소득수정 - 서버 오류 | 예외 | SPS_BI_02_REQ_011, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_073 | 귀속기준예외 - 보험설계사(940906) | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_074 | 귀속기준예외 - 음료배달(940907) | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_075 | 귀속기준예외 - 방문판매원(940908) | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_076 | 귀속기준예외 - 귀속==지급연도 | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_077 | 귀속기준예외 - 대상 외 업종코드 | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_078 | 귀속기준예외 - 상단 요약 포함 | 데이터무결성 | SPS_BI_02_REQ_002, SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_079 | 상단요약 - 건수 정합성 | 데이터무결성 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_080 | 상단요약 - 총 지급액 정합성 | 데이터무결성 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_081 | 상단요약 - 총 소득세 정합성 | 데이터무결성 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_082 | 상단요약 - 총 지방소득세 정합성 | 데이터무결성 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_083 | 상단요약 - 총 실지급액 정합성 | 데이터무결성 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_084 | 상단요약 - 0건 경계 | 경계 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_085 | 상단요약 - 큰 금액 경계 | 경계 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_086 | 상단요약 - 0원 경계 | 경계 | SPS_BI_02_REQ_002, SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_087 | 리스트형식 - 귀속연도 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_088 | 리스트형식 - 귀속월 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_089 | 리스트형식 - 주민번호 전체 표시 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_090 | 정렬 - 최근 등록 순 | 정렬페이징 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_091 | 리스트형식 - 신고파일 생성일 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_092 | 카운트 - 총 건수 | 정상 | SPS_BI_02_REQ_004 |
| SPS_BI_02_TC_093 | 카운트 - 검색 후 갱신 | 정상 | SPS_BI_02_REQ_004 |
| SPS_BI_02_TC_094 | 카운트 - 삭제 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_004, SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_095 | 카운트 - 추가 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_004, SPS_BI_02_REQ_010 |
| SPS_BI_02_TC_096 | 검색 - 부분 일치 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_097 | 검색 - 1페이지 초기화 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_098 | 검색 - 체크박스 초기화 | 정상 | SPS_BI_02_REQ_001_SEARCH |
| SPS_BI_02_TC_099 | 검색 - 상단 요약 전체 기준 유지 | 정상 | SPS_BI_02_REQ_002 |
| SPS_BI_02_TC_100 | 체크박스 - 헤더 전체 선택 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_101 | 체크박스 - 헤더 전체 해제 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_102 | 체크박스 - 현재 페이지만 선택 | 정상 | SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_103 | 체크박스 - 체크박스 영역 클릭 시 토글만 | 정상 | SPS_BI_02_REQ_005, SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_104 | 행 클릭 - 체크박스 외 영역 → 수정 팝업 | 정상 | SPS_BI_02_REQ_011 |
| SPS_BI_02_TC_105 | 페이징 - 사이즈 변경 데이터 위치 유지 (30→15) | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_106 | 페이징 - 사이즈 변경 데이터 위치 유지 (15→50) | 정상 | SPS_BI_02_REQ_006 |
| SPS_BI_02_TC_107 | 선택삭제 - 성공 토스트 | 정상 | SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_108 | 전체삭제 - 성공 토스트 | 정상 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_109 | 전체삭제 - 0건 비활성화 | 경계 | SPS_BI_02_REQ_009 |
| SPS_BI_02_TC_110 | 엑셀다운로드 - 파일명 (3월) | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_111 | 엑셀다운로드 - 파일명 (12월) | 파일 | SPS_BI_02_REQ_007 |
| SPS_BI_02_TC_112 | 귀속기준예외 - 귀속월 원래값 표시 | 정상 | SPS_BI_02_REQ_012 |
| SPS_BI_02_TC_113 | 합산그룹핑 - 동일 귀속연월+주민번호+업종코드 합산 | 정상 | SPS_BI_02_REQ_014 |
| SPS_BI_02_TC_114 | 합산그룹핑 - 1건 개별 행 | 경계 | SPS_BI_02_REQ_014 |
| SPS_BI_02_TC_115 | 합산그룹핑 - 비예외 업종 합산 미적용 | 정상 | SPS_BI_02_REQ_014 |
| SPS_BI_02_TC_116 | 합산그룹핑 - 동일 인물 업종코드 상이 → 별도 그룹 | 경계 | SPS_BI_02_REQ_014 |
| SPS_BI_02_TC_117 | 합산그룹핑 - 동일 인물 귀속연월 상이 → 별도 그룹 | 경계 | SPS_BI_02_REQ_014 |
| SPS_BI_02_TC_118 | 합산행표시 - 대표값(첫 번째 레코드) | 정상 | SPS_BI_02_REQ_015 |
| SPS_BI_02_TC_119 | 합산행표시 - 금액 합산값 | 데이터무결성 | SPS_BI_02_REQ_015 |
| SPS_BI_02_TC_120 | 합산행표시 - "N건 합산" 뱃지 (2건) | 정상 | SPS_BI_02_REQ_015 |
| SPS_BI_02_TC_121 | 합산행표시 - 시각적 구분(배경색) | 정상 | SPS_BI_02_REQ_015 |
| SPS_BI_02_TC_122 | 합산행표시 - "N건 합산" 뱃지 (5건) | 정상 | SPS_BI_02_REQ_015 |
| SPS_BI_02_TC_123 | 합산체크박스 - 합산 행 선택 → 그룹 전체 선택 | 정상 | SPS_BI_02_REQ_016 |
| SPS_BI_02_TC_124 | 합산체크박스 - 합산 행 해제 → 그룹 전체 해제 | 정상 | SPS_BI_02_REQ_016 |
| SPS_BI_02_TC_125 | 합산체크박스 - 선택 삭제 시 모든 개별 레코드 삭제 | 데이터무결성 | SPS_BI_02_REQ_016, SPS_BI_02_REQ_008 |
| SPS_BI_02_TC_126 | 합산체크박스 - 헤더 전체 선택 시 합산 행 포함 | 정상 | SPS_BI_02_REQ_016, SPS_BI_02_REQ_005 |
| SPS_BI_02_TC_127 | 그룹수정 - 합산 행 클릭 → SPS_BI_08 팝업 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_128 | 그룹수정 - 모든 레코드 데이터 전달 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_129 | 그룹수정 - 변경 없이 닫기 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_130 | 그룹수정 - 변경 후 닫기 confirm | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_131 | 그룹수정 - confirm 취소 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_132 | 그룹수정 - confirm 확인 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_133 | 그룹수정 - 성공 토스트 | 정상 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_134 | 그룹수정 - 완료 후 갱신 | 데이터무결성 | SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_135 | 그룹수정 - 합산 행 체크박스 영역 클릭 시 팝업 미노출 | 정상 | SPS_BI_02_REQ_016, SPS_BI_02_REQ_017 |
| SPS_BI_02_TC_136 | 그룹수정 - 서버 오류 | 예외 | SPS_BI_02_REQ_017, SPS_BI_02_REQ_013 |
| SPS_BI_02_TC_137 | 합산요약 - 건수 개별 레코드 기준 | 데이터무결성 | SPS_BI_02_REQ_018 |
| SPS_BI_02_TC_138 | 합산요약 - 금액 개별 레코드 기준 합산 | 데이터무결성 | SPS_BI_02_REQ_018 |
| SPS_BI_02_TC_139 | 합산요약 - 리스트 카운트 "총 N행 (M건)" 형식 | 정상 | SPS_BI_02_REQ_018 |
| SPS_BI_02_TC_140 | 합산요약 - 합산 행만 존재 시 카운트 | 경계 | SPS_BI_02_REQ_018 |
| SPS_BI_02_TC_141 | 합산요약 - 합산 없는 경우 카운트 | 경계 | SPS_BI_02_REQ_018 |
| SPS_BI_02_TC_142 | 합산엑셀 - 개별 레코드 단위 내보내기 | 파일 | SPS_BI_02_REQ_019 |
| SPS_BI_02_TC_143 | 합산엑셀 - 합산 행 선택 시 개별 레코드 모두 포함 | 파일 | SPS_BI_02_REQ_019, SPS_BI_02_REQ_016 |
| SPS_BI_02_TC_144 | 합산엑셀 - 지급연도/지급월 컬럼 포함 | 파일 | SPS_BI_02_REQ_019 |

---

## 3. 커버리지 요약

| 요구사항 ID | TC 총 개수 | 정상 | 경계 | 예외 | 권한 | 파일 | 정렬페이징 | 데이터무결성 |
|---|---|---|---|---|---|---|---|---|
| SPS_BI_02_REQ_001 | 3 | 1 | 0 | 2 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_001_SEARCH | 14 | 8 | 4 | 2 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_002 | 12 | 2 | 3 | 0 | 0 | 0 | 0 | 6 |
| SPS_BI_02_REQ_003 | 1 | 1 | 0 | 0 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_004 | 6 | 4 | 0 | 0 | 0 | 0 | 0 | 2 |
| SPS_BI_02_REQ_005 | 18 | 16 | 1 | 0 | 0 | 0 | 1 | 0 |
| SPS_BI_02_REQ_006 | 13 | 9 | 4 | 0 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_007 | 9 | 0 | 0 | 2 | 0 | 7 | 0 | 0 |
| SPS_BI_02_REQ_008 | 13 | 6 | 1 | 2 | 0 | 0 | 0 | 4 |
| SPS_BI_02_REQ_009 | 9 | 3 | 2 | 2 | 0 | 0 | 0 | 2 |
| SPS_BI_02_REQ_010 | 9 | 6 | 0 | 1 | 0 | 0 | 0 | 2 |
| SPS_BI_02_REQ_011 | 10 | 8 | 0 | 1 | 0 | 0 | 0 | 1 |
| SPS_BI_02_REQ_012 | 7 | 6 | 0 | 0 | 0 | 0 | 0 | 1 |
| SPS_BI_02_REQ_013 | 7 | 0 | 0 | 7 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_014 | 5 | 2 | 3 | 0 | 0 | 0 | 0 | 0 |
| SPS_BI_02_REQ_015 | 5 | 4 | 0 | 0 | 0 | 0 | 0 | 1 |
| SPS_BI_02_REQ_016 | 6 | 4 | 0 | 0 | 0 | 1 | 0 | 1 |
| SPS_BI_02_REQ_017 | 10 | 8 | 0 | 1 | 0 | 0 | 0 | 1 |
| SPS_BI_02_REQ_018 | 5 | 1 | 2 | 0 | 0 | 0 | 0 | 2 |
| SPS_BI_02_REQ_019 | 3 | 0 | 0 | 0 | 0 | 3 | 0 | 0 |
| **합계** | **145 (중복 제외)** | - | - | - | - | - | - | - |

> 참고: 하나의 TC가 여러 요구사항을 커버하므로 합계의 단순 합산은 실제 TC 수(145건)보다 클 수 있습니다.

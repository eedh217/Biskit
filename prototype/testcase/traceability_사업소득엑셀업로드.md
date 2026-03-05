# SPS_BI_01 사업소득 엑셀 업로드 - 추적성 매트릭스 (Traceability Matrix)

## 요구사항 목록

| 요구사항 ID | 요구사항 설명 |
|---|---|
| SPS_BI_01_EX_REQ_001 | 엑셀 업로드 버튼 클릭 시 **팝업**을 통해 "파일 올리기" / "엑셀 양식 받기" 2가지 옵션 제공 (바로 파일 선택이 아닌 팝업 먼저 노출) |
| SPS_BI_01_EX_REQ_002 | 파일 올리기: 시스템 파일 선택 팝업, .xlsx/.xls만 허용, 1개만 업로드, 다중선택 불가 |
| SPS_BI_01_EX_REQ_003 | 다중파일 업로드 불가 |
| SPS_BI_01_EX_REQ_004 | 엑셀 양식 받기: 양식 파일 즉시 다운로드, 파일명 "간이지급명세서_사업소득_업로드_양식.xlsx" |
| SPS_BI_01_EX_REQ_005 | 엑셀 양식 구조: Row 1~9 헤더/안내, Row 10 컬럼명, Row 11 컬럼코드, Row 12 샘플, Row 13~ 실제 데이터 |
| SPS_BI_01_EX_REQ_006 | 컬럼: name, attributionYear, attributionMonth, paymentYear, paymentMonth, iino, isForeign, industryCode, paymentSum, taxRate |
| SPS_BI_01_EX_REQ_007 | 필수 컬럼: name, attributionYear, attributionMonth, paymentYear, paymentMonth, iino, isForeign, industryCode, paymentSum / taxRate는 조건부 필수 |
| SPS_BI_01_EX_REQ_008 | 컬럼 구조 불일치 시 전체 실패: "양식에 맞지 않는 엑셀파일입니다." |
| SPS_BI_01_EX_REQ_009 | 데이터 없음 시 전체 실패: "데이터가 없습니다. 데이터 입력 후 파일을 업로드해주세요." |
| SPS_BI_01_EX_REQ_010 | 필수값 미입력 row 실패: "세율을 제외한 모든 컬럼이 필수입력값입니다." |
| SPS_BI_01_EX_REQ_011 | 귀속연도 숫자 아닌 경우 row 실패: "귀속연도는 숫자로 입력해주세요." |
| SPS_BI_01_EX_REQ_012 | 지급연도 숫자 아닌 경우 row 실패: "지급연도는 숫자로 입력해주세요." |
| SPS_BI_01_EX_REQ_013 | 귀속월 1~12 범위 벗어난 경우 row 실패: "귀속월은 1~12 내 숫자로 입력해주세요." |
| SPS_BI_01_EX_REQ_014 | 지급월 1~12 범위 벗어난 경우 row 실패: "지급월은 1~12 내 숫자로 입력해주세요." |
| SPS_BI_01_EX_REQ_015 | 지급연월 < 귀속연월인 경우 row 실패: "지급연월은 귀속연월 이후 날짜여야 합니다." |
| SPS_BI_01_EX_REQ_016 | 내외국인 N/Y 아닌 경우 row 실패: "내외국인 구분은 N, Y로 입력해주세요." |
| SPS_BI_01_EX_REQ_017 | 업종코드 유효하지 않은 경우 row 실패: "유효하지 않은 업종코드입니다." |
| SPS_BI_01_EX_REQ_018 | 지급액 숫자 아닌 경우 row 실패: "지급액은 숫자만 입력해주세요." |
| SPS_BI_01_EX_REQ_019 | 외국인+직업운동가(940904) 세율 3/20 아닌 경우 row 실패: "외국인 직업운동가일 경우, 세율을 3 또는 20으로 입력해주세요." |
| SPS_BI_01_EX_REQ_020 | 중복 데이터(지급연월 기준 귀속연월+주민등록번호+업종코드 동일) row 실패 |
| SPS_BI_01_EX_REQ_021 | 소득세 = 지급액 x 세율, 원단위 이하 절사, 1000원 미만 0원 |
| SPS_BI_01_EX_REQ_022 | 지방소득세 = 소득세 x 0.1, 원단위 이하 절사, 소득세 0이면 0 / 실지급액 = 지급액 - 소득세 - 지방소득세 |
| SPS_BI_01_EX_REQ_023 | 세율 처리: 기본 3%, 봉사료수취자(940905) 5%, 외국인+직업운동가(940904) 3%/20% 사용자 입력, 그 외 세율 입력값 무시 |
| SPS_BI_01_EX_REQ_024 | 신규 등록 모드 저장, 지급연도/지급월 기준 저장 |
| SPS_BI_01_EX_REQ_025 | 귀속 기준 예외: 보험설계사(940906)/음료배달(940907)/방문판매원(940908) + 귀속연도!=지급연도 -> 귀속연도 12월 리스트 표시 |
| SPS_BI_01_EX_REQ_026 | 전체 성공: 토스트 "엑셀 업로드를 완료했습니다." 1.5초 + 합산 화면 새로고침 |
| SPS_BI_01_EX_REQ_027 | 부분 실패: 토스트 미노출, 성공/실패 집계, 실패목록(주민등록번호+실패사유), 실패데이터 다운로드 버튼 |
| SPS_BI_01_EX_REQ_028 | 실패 데이터 다운로드: 파일명 "사업소득업로드_실패목록_YYYYMMDD.xlsx", 기존 컬럼 + "실패사유" 컬럼 |
| SPS_BI_01_EX_REQ_029 | 서버 에러: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| SPS_BI_01_EX_REQ_030 | 제한: 자동 컬럼 매핑 금지, 컬럼 순서 무시 금지, 임의 컬럼 금지 |
| SPS_BI_01_EX_REQ_031 | 지급액 양수 검증: 0 이하 불허, "지급액을 양수로 입력해주세요." |
| SPS_BI_01_EX_REQ_032 | 지급액 최대 12자리 제한 |
| SPS_BI_01_EX_REQ_033 | 성명(상호) 최대 50자 제한 |
| SPS_BI_01_EX_REQ_034 | 주민(사업자)등록번호 최대 숫자 13자리, 13자리일 경우 주민등록번호 형식 검증 |
| SPS_BI_01_EX_REQ_035 | 파일 크기 최대 10MB 제한 |
| SPS_BI_01_EX_REQ_036 | 업로드 진행 중 이탈 시 확인 팝업 표시, 확인 클릭 시 업로드 취소 |
| SPS_BI_01_EX_REQ_037 | 동시 업로드 시 큐잉 처리 |
| SPS_BI_01_EX_REQ_038 | Row 12 샘플 데이터 자동 무시, Row 13부터 데이터 처리 |
| SPS_BI_01_EX_REQ_039 | 복수 에러 시 검증 순서에 따라 첫 번째 에러만 표시 |
| SPS_BI_01_EX_REQ_040 | 파일 내 중복 시 첫 번째 row 성공, 이후 중복 row 실패 |
| SPS_BI_01_EX_REQ_041 | 귀속연도/지급연도 정수만 허용 (소수점 포함 시 에러) |
| SPS_BI_01_EX_REQ_042 | 실패 결과 화면 확인 버튼 제공 |
| SPS_BI_01_EX_REQ_043 | 부분 실패 시 성공 row 즉시 저장 |
| SPS_BI_01_EX_REQ_044 | 전체 실패(row 단위) 시 부분 실패와 동일 UI |
| SPS_BI_01_EX_REQ_045 | 업종코드 유효성은 시스템 업종코드 마스터 테이블 기준 |
| SPS_BI_01_EX_REQ_046 | 파일 선택 팝업에서 .xlsx/.xls만 필터링 (선택 자체 불가) |
| SPS_BI_01_EX_REQ_047 | 내국인+직업운동가(940904) 기본 세율 3% 적용 |

---

## 요구사항 -> 테스트케이스 매핑 (Requirements to Test Cases)

| 요구사항 ID | 요구사항 설명 | TC-ID |
|---|---|---|
| SPS_BI_01_EX_REQ_001 | 엑셀 업로드 버튼 2가지 옵션 | SPS_BI_01_EX_TC_001 |
| SPS_BI_01_EX_REQ_002 | 파일 올리기 (.xlsx/.xls, 1개, 다중선택 불가) | SPS_BI_01_EX_TC_002, SPS_BI_01_EX_TC_003, SPS_BI_01_EX_TC_004, SPS_BI_01_EX_TC_005, SPS_BI_01_EX_TC_006 |
| SPS_BI_01_EX_REQ_003 | 다중파일 업로드 불가 | SPS_BI_01_EX_TC_007 |
| SPS_BI_01_EX_REQ_004 | 엑셀 양식 받기 다운로드 | SPS_BI_01_EX_TC_008 |
| SPS_BI_01_EX_REQ_005 | 엑셀 양식 구조 | SPS_BI_01_EX_TC_009 |
| SPS_BI_01_EX_REQ_006 | 컬럼 정의 | SPS_BI_01_EX_TC_009 |
| SPS_BI_01_EX_REQ_007 | 필수/조건부필수 컬럼 | SPS_BI_01_EX_TC_016 ~ SPS_BI_01_EX_TC_026 |
| SPS_BI_01_EX_REQ_008 | 컬럼 구조 불일치 전체 실패 | SPS_BI_01_EX_TC_006, SPS_BI_01_EX_TC_010, SPS_BI_01_EX_TC_011, SPS_BI_01_EX_TC_012, SPS_BI_01_EX_TC_014, SPS_BI_01_EX_TC_015 |
| SPS_BI_01_EX_REQ_009 | 데이터 없음 전체 실패 | SPS_BI_01_EX_TC_013 |
| SPS_BI_01_EX_REQ_010 | 필수값 미입력 row 실패 | SPS_BI_01_EX_TC_016, SPS_BI_01_EX_TC_017, SPS_BI_01_EX_TC_018, SPS_BI_01_EX_TC_019, SPS_BI_01_EX_TC_020, SPS_BI_01_EX_TC_021, SPS_BI_01_EX_TC_022, SPS_BI_01_EX_TC_023, SPS_BI_01_EX_TC_024, SPS_BI_01_EX_TC_025, SPS_BI_01_EX_TC_026, SPS_BI_01_EX_TC_034 |
| SPS_BI_01_EX_REQ_011 | 귀속연도 숫자 아님 | SPS_BI_01_EX_TC_027, SPS_BI_01_EX_TC_028, SPS_BI_01_EX_TC_029, SPS_BI_01_EX_TC_030, SPS_BI_01_EX_TC_031, SPS_BI_01_EX_TC_109, SPS_BI_01_EX_TC_111 |
| SPS_BI_01_EX_REQ_012 | 지급연도 숫자 아님 | SPS_BI_01_EX_TC_032, SPS_BI_01_EX_TC_033 |
| SPS_BI_01_EX_REQ_013 | 귀속월 1~12 범위 | SPS_BI_01_EX_TC_035, SPS_BI_01_EX_TC_036, SPS_BI_01_EX_TC_037, SPS_BI_01_EX_TC_038, SPS_BI_01_EX_TC_039, SPS_BI_01_EX_TC_040, SPS_BI_01_EX_TC_045 |
| SPS_BI_01_EX_REQ_014 | 지급월 1~12 범위 | SPS_BI_01_EX_TC_041, SPS_BI_01_EX_TC_042, SPS_BI_01_EX_TC_043, SPS_BI_01_EX_TC_044, SPS_BI_01_EX_TC_111 |
| SPS_BI_01_EX_REQ_015 | 지급연월 >= 귀속연월 | SPS_BI_01_EX_TC_046, SPS_BI_01_EX_TC_047, SPS_BI_01_EX_TC_048, SPS_BI_01_EX_TC_049, SPS_BI_01_EX_TC_050 |
| SPS_BI_01_EX_REQ_016 | 내외국인 N/Y | SPS_BI_01_EX_TC_051, SPS_BI_01_EX_TC_052, SPS_BI_01_EX_TC_053, SPS_BI_01_EX_TC_054, SPS_BI_01_EX_TC_055, SPS_BI_01_EX_TC_056, SPS_BI_01_EX_TC_109, SPS_BI_01_EX_TC_111 |
| SPS_BI_01_EX_REQ_017 | 업종코드 유효성 | SPS_BI_01_EX_TC_057, SPS_BI_01_EX_TC_058, SPS_BI_01_EX_TC_059 |
| SPS_BI_01_EX_REQ_018 | 지급액 숫자 유효성 | SPS_BI_01_EX_TC_060, SPS_BI_01_EX_TC_061, SPS_BI_01_EX_TC_062, SPS_BI_01_EX_TC_063, SPS_BI_01_EX_TC_064, SPS_BI_01_EX_TC_065 |
| SPS_BI_01_EX_REQ_019 | 외국인+직업운동가 세율 3/20 | SPS_BI_01_EX_TC_066, SPS_BI_01_EX_TC_067, SPS_BI_01_EX_TC_068, SPS_BI_01_EX_TC_069, SPS_BI_01_EX_TC_070, SPS_BI_01_EX_TC_071, SPS_BI_01_EX_TC_075, SPS_BI_01_EX_TC_089 |
| SPS_BI_01_EX_REQ_020 | 중복 데이터 검증 | SPS_BI_01_EX_TC_076, SPS_BI_01_EX_TC_077, SPS_BI_01_EX_TC_078, SPS_BI_01_EX_TC_079, SPS_BI_01_EX_TC_109 |
| SPS_BI_01_EX_REQ_021 | 소득세 계산 로직 | SPS_BI_01_EX_TC_080, SPS_BI_01_EX_TC_081, SPS_BI_01_EX_TC_082, SPS_BI_01_EX_TC_083, SPS_BI_01_EX_TC_088, SPS_BI_01_EX_TC_089, SPS_BI_01_EX_TC_090 |
| SPS_BI_01_EX_REQ_022 | 지방소득세/실지급액 계산 로직 | SPS_BI_01_EX_TC_084, SPS_BI_01_EX_TC_085, SPS_BI_01_EX_TC_086, SPS_BI_01_EX_TC_087 |
| SPS_BI_01_EX_REQ_023 | 세율 처리 (기본/봉사료/외국인+직업운동가/무시) | SPS_BI_01_EX_TC_026, SPS_BI_01_EX_TC_072, SPS_BI_01_EX_TC_073, SPS_BI_01_EX_TC_074, SPS_BI_01_EX_TC_075, SPS_BI_01_EX_TC_088 |
| SPS_BI_01_EX_REQ_024 | 신규 등록 모드 저장 | SPS_BI_01_EX_TC_091, SPS_BI_01_EX_TC_110 |
| SPS_BI_01_EX_REQ_025 | 귀속 기준 예외 (940906/940907/940908) | SPS_BI_01_EX_TC_092, SPS_BI_01_EX_TC_093, SPS_BI_01_EX_TC_094, SPS_BI_01_EX_TC_095, SPS_BI_01_EX_TC_096 |
| SPS_BI_01_EX_REQ_026 | 전체 성공 결과 (토스트+새로고침) | SPS_BI_01_EX_TC_097, SPS_BI_01_EX_TC_101, SPS_BI_01_EX_TC_102, SPS_BI_01_EX_TC_106 |
| SPS_BI_01_EX_REQ_027 | 부분 실패 결과 (집계+실패목록) | SPS_BI_01_EX_TC_098, SPS_BI_01_EX_TC_099, SPS_BI_01_EX_TC_100 |
| SPS_BI_01_EX_REQ_028 | 실패 데이터 다운로드 | SPS_BI_01_EX_TC_103, SPS_BI_01_EX_TC_104, SPS_BI_01_EX_TC_105, SPS_BI_01_EX_TC_106 |
| SPS_BI_01_EX_REQ_029 | 서버 에러 | SPS_BI_01_EX_TC_107 |
| SPS_BI_01_EX_REQ_030 | 자동 컬럼 매핑/순서 무시/임의 컬럼 금지 | SPS_BI_01_EX_TC_108 |
| SPS_BI_01_EX_REQ_031 | 지급액 양수 검증 (0 이하 불허) | SPS_BI_01_EX_TC_063, SPS_BI_01_EX_TC_064 |
| SPS_BI_01_EX_REQ_032 | 지급액 최대 12자리 | SPS_BI_01_EX_TC_113, SPS_BI_01_EX_TC_114 |
| SPS_BI_01_EX_REQ_033 | 성명(상호) 최대 50자 | SPS_BI_01_EX_TC_115, SPS_BI_01_EX_TC_116 |
| SPS_BI_01_EX_REQ_034 | 주민(사업자)등록번호 13자리/형식 검증 | SPS_BI_01_EX_TC_117, SPS_BI_01_EX_TC_118, SPS_BI_01_EX_TC_119, SPS_BI_01_EX_TC_120 |
| SPS_BI_01_EX_REQ_035 | 파일 크기 최대 10MB | SPS_BI_01_EX_TC_112 |
| SPS_BI_01_EX_REQ_036 | 업로드 진행 중 이탈 방지 | SPS_BI_01_EX_TC_121, SPS_BI_01_EX_TC_122 |
| SPS_BI_01_EX_REQ_037 | 동시 업로드 큐잉 처리 | - (별도 TC 미작성, 서버 단위 테스트 대상) |
| SPS_BI_01_EX_REQ_038 | Row 12 샘플 데이터 자동 무시 | SPS_BI_01_EX_TC_123 |
| SPS_BI_01_EX_REQ_039 | 복수 에러 시 첫 번째 에러만 표시 | SPS_BI_01_EX_TC_111 |
| SPS_BI_01_EX_REQ_040 | 파일 내 중복 시 첫 번째 row 성공 | SPS_BI_01_EX_TC_076 |
| SPS_BI_01_EX_REQ_041 | 귀속연도/지급연도 정수만 허용 | SPS_BI_01_EX_TC_028, SPS_BI_01_EX_TC_033 |
| SPS_BI_01_EX_REQ_042 | 실패 결과 화면 확인 버튼 | SPS_BI_01_EX_TC_098, SPS_BI_01_EX_TC_099, SPS_BI_01_EX_TC_124 |
| SPS_BI_01_EX_REQ_043 | 부분 실패 시 성공 row 즉시 저장 | SPS_BI_01_EX_TC_125 |
| SPS_BI_01_EX_REQ_044 | 전체 실패(row 단위) 동일 UI | SPS_BI_01_EX_TC_099 |
| SPS_BI_01_EX_REQ_045 | 업종코드 시스템 마스터 테이블 기준 | SPS_BI_01_EX_TC_057, SPS_BI_01_EX_TC_058 |
| SPS_BI_01_EX_REQ_046 | 파일 선택 팝업 필터링 | SPS_BI_01_EX_TC_004, SPS_BI_01_EX_TC_005 |
| SPS_BI_01_EX_REQ_047 | 내국인+직업운동가 기본 세율 3% | SPS_BI_01_EX_TC_075 |

---

## 테스트케이스 -> 요구사항 매핑 (Test Cases to Requirements)

| TC-ID | TC 설명 | 요구사항 ID |
|---|---|---|
| SPS_BI_01_EX_TC_001 | 엑셀 업로드 버튼 옵션 표시 | SPS_BI_01_EX_REQ_001 |
| SPS_BI_01_EX_TC_002 | 파일 올리기 - .xlsx 정상 업로드 | SPS_BI_01_EX_REQ_002 |
| SPS_BI_01_EX_TC_003 | 파일 올리기 - .xls 정상 업로드 | SPS_BI_01_EX_REQ_002 |
| SPS_BI_01_EX_TC_004 | 허용되지 않는 확장자 (.csv) - 선택 자체 불가 | SPS_BI_01_EX_REQ_002, SPS_BI_01_EX_REQ_046 |
| SPS_BI_01_EX_TC_005 | 허용되지 않는 확장자 (.pdf) - 선택 자체 불가 | SPS_BI_01_EX_REQ_002, SPS_BI_01_EX_REQ_046 |
| SPS_BI_01_EX_TC_006 | 확장자 위조 파일 | SPS_BI_01_EX_REQ_002, SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_007 | 다중파일 선택 불가 | SPS_BI_01_EX_REQ_003 |
| SPS_BI_01_EX_TC_008 | 엑셀 양식 받기 다운로드 | SPS_BI_01_EX_REQ_004 |
| SPS_BI_01_EX_TC_009 | 엑셀 양식 구조 확인 | SPS_BI_01_EX_REQ_005, SPS_BI_01_EX_REQ_006 |
| SPS_BI_01_EX_TC_010 | 컬럼 순서 불일치 | SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_011 | 컬럼 누락 | SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_012 | 임의 컬럼 추가 | SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_013 | 데이터 없음 | SPS_BI_01_EX_REQ_009 |
| SPS_BI_01_EX_TC_014 | 빈 엑셀 파일 | SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_015 | 컬럼코드 Row 불일치 | SPS_BI_01_EX_REQ_008 |
| SPS_BI_01_EX_TC_016 | name 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_017 | attributionYear 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_018 | attributionMonth 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_019 | paymentYear 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_020 | paymentMonth 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_021 | iino 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_022 | isForeign 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_023 | industryCode 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_024 | paymentSum 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_025 | 모든 필수 컬럼 미입력 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_026 | 세율 미입력 (일반 내국인) - 정상 | SPS_BI_01_EX_REQ_010, SPS_BI_01_EX_REQ_023 |
| SPS_BI_01_EX_TC_027 | 귀속연도 문자열 | SPS_BI_01_EX_REQ_011 |
| SPS_BI_01_EX_TC_028 | 귀속연도 소수점 | SPS_BI_01_EX_REQ_011, SPS_BI_01_EX_REQ_041 |
| SPS_BI_01_EX_TC_029 | 귀속연도 특수문자 | SPS_BI_01_EX_REQ_011 |
| SPS_BI_01_EX_TC_030 | 귀속연도 음수 | SPS_BI_01_EX_REQ_011 |
| SPS_BI_01_EX_TC_031 | 귀속연도 0 | SPS_BI_01_EX_REQ_011 |
| SPS_BI_01_EX_TC_032 | 지급연도 문자열 | SPS_BI_01_EX_REQ_012 |
| SPS_BI_01_EX_TC_033 | 지급연도 소수점 | SPS_BI_01_EX_REQ_012, SPS_BI_01_EX_REQ_041 |
| SPS_BI_01_EX_TC_034 | 지급연도 공백 | SPS_BI_01_EX_REQ_010 |
| SPS_BI_01_EX_TC_035 | 귀속월 = 0 | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_036 | 귀속월 = 1 (최솟값) | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_037 | 귀속월 = 12 (최댓값) | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_038 | 귀속월 = 13 | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_039 | 귀속월 = -1 | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_040 | 귀속월 문자열 | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_041 | 지급월 = 0 | SPS_BI_01_EX_REQ_014 |
| SPS_BI_01_EX_TC_042 | 지급월 = 1 (최솟값) | SPS_BI_01_EX_REQ_014 |
| SPS_BI_01_EX_TC_043 | 지급월 = 12 (최댓값) | SPS_BI_01_EX_REQ_014 |
| SPS_BI_01_EX_TC_044 | 지급월 = 13 | SPS_BI_01_EX_REQ_014 |
| SPS_BI_01_EX_TC_045 | 귀속월 소수점 | SPS_BI_01_EX_REQ_013 |
| SPS_BI_01_EX_TC_046 | 지급연월 = 귀속연월 (동일) | SPS_BI_01_EX_REQ_015 |
| SPS_BI_01_EX_TC_047 | 지급연월 > 귀속연월 (정상) | SPS_BI_01_EX_REQ_015 |
| SPS_BI_01_EX_TC_048 | 지급연월 < 귀속연월 (월 역전) | SPS_BI_01_EX_REQ_015 |
| SPS_BI_01_EX_TC_049 | 지급연월 < 귀속연월 (연도 역전) | SPS_BI_01_EX_REQ_015 |
| SPS_BI_01_EX_TC_050 | 지급연도 > 귀속연도, 지급월 < 귀속월 | SPS_BI_01_EX_REQ_015 |
| SPS_BI_01_EX_TC_051 | 내외국인 N (정상) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_052 | 내외국인 Y (정상) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_053 | 내외국인 n (소문자) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_054 | 내외국인 y (소문자) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_055 | 내외국인 X (유효하지 않은 값) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_056 | 내외국인 YES (다수 문자) | SPS_BI_01_EX_REQ_016 |
| SPS_BI_01_EX_TC_057 | 업종코드 유효값 | SPS_BI_01_EX_REQ_017 |
| SPS_BI_01_EX_TC_058 | 업종코드 유효하지 않은 값 | SPS_BI_01_EX_REQ_017 |
| SPS_BI_01_EX_TC_059 | 업종코드 문자열 | SPS_BI_01_EX_REQ_017 |
| SPS_BI_01_EX_TC_060 | 지급액 정상 숫자 | SPS_BI_01_EX_REQ_018 |
| SPS_BI_01_EX_TC_061 | 지급액 문자열 | SPS_BI_01_EX_REQ_018 |
| SPS_BI_01_EX_TC_062 | 지급액 콤마 포함 | SPS_BI_01_EX_REQ_018 |
| SPS_BI_01_EX_TC_063 | 지급액 = 0 (불허) | SPS_BI_01_EX_REQ_018, SPS_BI_01_EX_REQ_031 |
| SPS_BI_01_EX_TC_064 | 지급액 음수 (불허) | SPS_BI_01_EX_REQ_018, SPS_BI_01_EX_REQ_031 |
| SPS_BI_01_EX_TC_065 | 지급액 소수점 | SPS_BI_01_EX_REQ_018 |
| SPS_BI_01_EX_TC_066 | 외국인+직업운동가 세율 3 | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_067 | 외국인+직업운동가 세율 20 | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_068 | 외국인+직업운동가 세율 미입력 | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_069 | 외국인+직업운동가 세율 5 (유효하지 않은 값) | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_070 | 외국인+직업운동가 세율 0 | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_071 | 외국인+직업운동가 세율 문자열 | SPS_BI_01_EX_REQ_019 |
| SPS_BI_01_EX_TC_072 | 내국인 일반 업종 세율 입력값 무시 | SPS_BI_01_EX_REQ_023 |
| SPS_BI_01_EX_TC_073 | 봉사료수취자(940905) 세율 5% 자동 | SPS_BI_01_EX_REQ_023 |
| SPS_BI_01_EX_TC_074 | 봉사료수취자(940905) 세율 입력값 무시 | SPS_BI_01_EX_REQ_023 |
| SPS_BI_01_EX_TC_075 | 내국인+직업운동가 기본 세율 3% | SPS_BI_01_EX_REQ_023, SPS_BI_01_EX_REQ_047 |
| SPS_BI_01_EX_TC_076 | 파일 내 중복 데이터 (첫 번째 row 성공) | SPS_BI_01_EX_REQ_020, SPS_BI_01_EX_REQ_040 |
| SPS_BI_01_EX_TC_077 | DB 기존 데이터와 중복 | SPS_BI_01_EX_REQ_020 |
| SPS_BI_01_EX_TC_078 | 동일 주민번호+다른 업종코드 (비중복) | SPS_BI_01_EX_REQ_020 |
| SPS_BI_01_EX_TC_079 | 동일 주민번호+다른 지급연월 (비중복) | SPS_BI_01_EX_REQ_020 |
| SPS_BI_01_EX_TC_080 | 소득세 계산 (기본 3%) | SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_081 | 소득세 원단위 이하 절사 | SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_082 | 소득세 1000원 미만 -> 0원 | SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_083 | 소득세 정확히 1000원 경계 | SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_084 | 지방소득세 계산 | SPS_BI_01_EX_REQ_022 |
| SPS_BI_01_EX_TC_085 | 지방소득세 원단위 이하 절사 | SPS_BI_01_EX_REQ_022 |
| SPS_BI_01_EX_TC_086 | 소득세 0이면 지방소득세 0 | SPS_BI_01_EX_REQ_022 |
| SPS_BI_01_EX_TC_087 | 실지급액 계산 | SPS_BI_01_EX_REQ_022 |
| SPS_BI_01_EX_TC_088 | 봉사료수취자 세율 5% 계산 | SPS_BI_01_EX_REQ_023, SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_089 | 외국인+직업운동가 세율 20% 계산 | SPS_BI_01_EX_REQ_019, SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_090 | 소득세 경계 - 999원 절사 후 0원 | SPS_BI_01_EX_REQ_021 |
| SPS_BI_01_EX_TC_091 | 신규 등록 모드 저장 | SPS_BI_01_EX_REQ_024 |
| SPS_BI_01_EX_TC_092 | 보험설계사(940906) 12월 표시 | SPS_BI_01_EX_REQ_025 |
| SPS_BI_01_EX_TC_093 | 음료배달(940907) 12월 표시 | SPS_BI_01_EX_REQ_025 |
| SPS_BI_01_EX_TC_094 | 방문판매원(940908) 12월 표시 | SPS_BI_01_EX_REQ_025 |
| SPS_BI_01_EX_TC_095 | 보험설계사 귀속연도==지급연도 일반 표시 | SPS_BI_01_EX_REQ_025 |
| SPS_BI_01_EX_TC_096 | 일반 업종 12월 예외 미적용 | SPS_BI_01_EX_REQ_025 |
| SPS_BI_01_EX_TC_097 | 전체 성공 결과 | SPS_BI_01_EX_REQ_026 |
| SPS_BI_01_EX_TC_098 | 부분 실패 결과 (확인 버튼 포함) | SPS_BI_01_EX_REQ_027, SPS_BI_01_EX_REQ_042 |
| SPS_BI_01_EX_TC_099 | 전체 실패 결과 (부분 실패와 동일 UI) | SPS_BI_01_EX_REQ_027, SPS_BI_01_EX_REQ_042, SPS_BI_01_EX_REQ_044 |
| SPS_BI_01_EX_TC_100 | 실패 row 목록 정보 확인 | SPS_BI_01_EX_REQ_027 |
| SPS_BI_01_EX_TC_101 | 토스트 1.5초 후 자동 닫힘 | SPS_BI_01_EX_REQ_026 |
| SPS_BI_01_EX_TC_102 | 전체 성공 시 합산 화면 새로고침 | SPS_BI_01_EX_REQ_026 |
| SPS_BI_01_EX_TC_103 | 실패 데이터 다운로드 버튼 | SPS_BI_01_EX_REQ_028 |
| SPS_BI_01_EX_TC_104 | 실패 데이터 파일 내용 확인 | SPS_BI_01_EX_REQ_028 |
| SPS_BI_01_EX_TC_105 | 실패 데이터 파일명 날짜 형식 | SPS_BI_01_EX_REQ_028 |
| SPS_BI_01_EX_TC_106 | 전체 성공 시 실패 데이터 다운로드 버튼 미노출 | SPS_BI_01_EX_REQ_026, SPS_BI_01_EX_REQ_028 |
| SPS_BI_01_EX_TC_107 | 서버 에러 | SPS_BI_01_EX_REQ_029 |
| SPS_BI_01_EX_TC_108 | 자동 컬럼 매핑 금지 확인 | SPS_BI_01_EX_REQ_030 |
| SPS_BI_01_EX_TC_109 | 다중 에러 row 복합 검증 | SPS_BI_01_EX_REQ_011, SPS_BI_01_EX_REQ_016, SPS_BI_01_EX_REQ_020 |
| SPS_BI_01_EX_TC_110 | 대량 데이터 업로드 | SPS_BI_01_EX_REQ_024 |
| SPS_BI_01_EX_TC_111 | 한 row에 복수 에러 (첫 번째만 표시) | SPS_BI_01_EX_REQ_011, SPS_BI_01_EX_REQ_014, SPS_BI_01_EX_REQ_016, SPS_BI_01_EX_REQ_039 |
| SPS_BI_01_EX_TC_112 | 파일 크기 10MB 초과 | SPS_BI_01_EX_REQ_035 |
| SPS_BI_01_EX_TC_113 | 지급액 12자리 정상 | SPS_BI_01_EX_REQ_032 |
| SPS_BI_01_EX_TC_114 | 지급액 13자리 초과 | SPS_BI_01_EX_REQ_032 |
| SPS_BI_01_EX_TC_115 | 성명(상호) 50자 초과 | SPS_BI_01_EX_REQ_033 |
| SPS_BI_01_EX_TC_116 | 성명(상호) 50자 정상 | SPS_BI_01_EX_REQ_033 |
| SPS_BI_01_EX_TC_117 | 주민등록번호 14자리 초과 | SPS_BI_01_EX_REQ_034 |
| SPS_BI_01_EX_TC_118 | 주민등록번호 13자리 유효 형식 | SPS_BI_01_EX_REQ_034 |
| SPS_BI_01_EX_TC_119 | 주민등록번호 13자리 유효하지 않은 형식 | SPS_BI_01_EX_REQ_034 |
| SPS_BI_01_EX_TC_120 | 사업자등록번호 10자리 정상 | SPS_BI_01_EX_REQ_034 |
| SPS_BI_01_EX_TC_121 | 업로드 진행 중 이탈 - 확인 클릭 | SPS_BI_01_EX_REQ_036 |
| SPS_BI_01_EX_TC_122 | 업로드 진행 중 이탈 - 취소 클릭 | SPS_BI_01_EX_REQ_036 |
| SPS_BI_01_EX_TC_123 | Row 12 샘플 데이터 자동 무시 | SPS_BI_01_EX_REQ_038 |
| SPS_BI_01_EX_TC_124 | 실패 결과 화면 확인 버튼 클릭 | SPS_BI_01_EX_REQ_042 |
| SPS_BI_01_EX_TC_125 | 부분 실패 시 성공 row 즉시 저장 | SPS_BI_01_EX_REQ_043 |

---

## 커버리지 요약

| 항목 | 수량 |
|---|---|
| 총 요구사항 수 | 47 |
| 총 테스트케이스 수 | 125 |
| 매핑되지 않은 요구사항 | 1 (SPS_BI_01_EX_REQ_037 - 서버 단위 테스트 대상) |
| 매핑되지 않은 테스트케이스 | 0 |
| 커버리지 | 97.9% |

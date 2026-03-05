# SPS_BI_06 전체 사업소득 추가 팝업 - 추적성 매트릭스 (Traceability Matrix)

## 요구사항 정의

| 요구사항 ID | 요구사항 설명 |
|---|---|
| SPS_BI_06_REQ_001 | SPS_BI_05에서 사업소득 추가 버튼 클릭 시 SPS_BI_06 팝업 열기 |
| SPS_BI_06_REQ_002 | 닫기/이탈 방지: 초기상태 confirm 없이 닫기, 입력 존재 시 confirm "사업소득 추가를 취소하시겠습니까?" |
| SPS_BI_06_REQ_003 | ESC 키 비활성, 브라우저 뒤로가기 차단 |
| SPS_BI_06_REQ_004 | 지급연도: 셀렉트박스, 2025~(현재연도+1), placeholder "선택" |
| SPS_BI_06_REQ_005 | 지급월: 셀렉트박스, 1~12월, placeholder "선택" |
| SPS_BI_06_REQ_006 | 귀속연도: 셀렉트박스, 2025~현재연도, placeholder "선택" |
| SPS_BI_06_REQ_007 | 귀속월: 셀렉트박스, 1~12월, placeholder "선택" |
| SPS_BI_06_REQ_008 | 성명(상호): 인풋박스, 최대 50자, 허용문자(한글/영문/숫자/공백/&/'/-.·) |
| SPS_BI_06_REQ_009 | 내외국인 구분: 라디오(내국인/외국인), 기본값 내국인 |
| SPS_BI_06_REQ_010 | 주민(사업자)등록번호: 인풋박스, 숫자만 최대 13자리, 10자리 또는 13자리만 허용, 체크디짓 검증 |
| SPS_BI_06_REQ_011 | 업종코드: 셀렉트박스, 40개 업종코드, placeholder "선택" |
| SPS_BI_06_REQ_012 | 필수값 검사(blur): "필수 입력 항목입니다." |
| SPS_BI_06_REQ_013 | 귀속연월 > 지급연월 검사(blur): 4개 필드 모두 선택 시 검사. "귀속연월은 지급연월보다 이전 날짜여야합니다." |
| SPS_BI_06_REQ_014 | 병의원(851101) + 주민번호 10자리 초과 검사(blur): "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다." |
| SPS_BI_06_REQ_015 | 지급액: 숫자입력, 최대 12자리, 0 이상 정수만 허용, 앞자리 0 자동 제거 |
| SPS_BI_06_REQ_016 | 자동 계산 필드 readonly (세율, 소득세, 지방소득세, 실지급액) |
| SPS_BI_06_REQ_017 | 세율 자동 계산: 기본 3%, 봉사료수취자(940905)=5%, 외국인+직업운동가(940904)=3%/20% 라디오 선택 |
| SPS_BI_06_REQ_018 | 소득세 = 지급액 x 세율, 원단위 이하 절사 |
| SPS_BI_06_REQ_019 | 소액부징수: 소득세 1000원 미만이면 0원 |
| SPS_BI_06_REQ_020 | 지방소득세 = 소득세 x 0.1, 원단위 이하 절사, 소득세 0이면 0 |
| SPS_BI_06_REQ_021 | 실지급액 = 지급액 - 소득세 - 지방소득세 |
| SPS_BI_06_REQ_022 | 계산 트리거: 모든 필수값(지급연도/지급월 포함) 입력 후 마지막 필드 blur 시 |
| SPS_BI_06_REQ_023 | submit 중복 검사: 입력한 지급연월 기준 "주민(사업자)등록번호, 귀속연월, 업종코드가 동일한 사업소득이 존재합니다." |
| SPS_BI_06_REQ_024 | 추가 완료 토스트: "사업소득 추가를 완료했습니다." 1.5초 |
| SPS_BI_06_REQ_025 | SPS_BI_05 리스트/카운트 갱신 + SPS_BI_01, SPS_BI_02 데이터 연동 |
| SPS_BI_06_REQ_026 | 귀속 기준 예외: 보험설계사(940906)/음료배달(940907)/방문판매원(940908) + 귀속연도 != 지급연도 → confirm + 12월 리스트 표시 |
| SPS_BI_06_REQ_027 | 저장 실패 시 팝업 유지, 에러 표시 |
| SPS_BI_06_REQ_028 | 서버 에러: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." |
| SPS_BI_06_REQ_029 | 하단 안내 문구 4줄 고정 표시 |

---

## 1. 요구사항 -> 테스트케이스 매핑 (Forward Traceability)

| 요구사항 ID | 요구사항 설명 | 매핑 TC-ID |
|---|---|---|
| SPS_BI_06_REQ_001 | 팝업 열기 | SPS_BI_06_TC_001 |
| SPS_BI_06_REQ_002 | 닫기/이탈 방지 confirm | SPS_BI_06_TC_002, SPS_BI_06_TC_003, SPS_BI_06_TC_004, SPS_BI_06_TC_005, SPS_BI_06_TC_008, SPS_BI_06_TC_009, SPS_BI_06_TC_010, SPS_BI_06_TC_011, SPS_BI_06_TC_012 |
| SPS_BI_06_REQ_003 | ESC / 뒤로가기 차단 | SPS_BI_06_TC_006, SPS_BI_06_TC_007 |
| SPS_BI_06_REQ_004 | 지급연도 입력 | SPS_BI_06_TC_013, SPS_BI_06_TC_014, SPS_BI_06_TC_015, SPS_BI_06_TC_016, SPS_BI_06_TC_017, SPS_BI_06_TC_018 |
| SPS_BI_06_REQ_005 | 지급월 입력 | SPS_BI_06_TC_020, SPS_BI_06_TC_021, SPS_BI_06_TC_022, SPS_BI_06_TC_023, SPS_BI_06_TC_024 |
| SPS_BI_06_REQ_006 | 귀속연도 입력 | SPS_BI_06_TC_026, SPS_BI_06_TC_027, SPS_BI_06_TC_028, SPS_BI_06_TC_029 |
| SPS_BI_06_REQ_007 | 귀속월 입력 | SPS_BI_06_TC_031, SPS_BI_06_TC_032, SPS_BI_06_TC_033, SPS_BI_06_TC_034, SPS_BI_06_TC_035 |
| SPS_BI_06_REQ_008 | 성명(상호) 입력 | SPS_BI_06_TC_048, SPS_BI_06_TC_049, SPS_BI_06_TC_050, SPS_BI_06_TC_051, SPS_BI_06_TC_053, SPS_BI_06_TC_054, SPS_BI_06_TC_055, SPS_BI_06_TC_056, SPS_BI_06_TC_057 |
| SPS_BI_06_REQ_009 | 내외국인 구분 | SPS_BI_06_TC_058, SPS_BI_06_TC_059, SPS_BI_06_TC_060, SPS_BI_06_TC_061 |
| SPS_BI_06_REQ_010 | 주민(사업자)등록번호 입력 | SPS_BI_06_TC_062, SPS_BI_06_TC_063, SPS_BI_06_TC_064, SPS_BI_06_TC_065, SPS_BI_06_TC_066, SPS_BI_06_TC_068, SPS_BI_06_TC_069, SPS_BI_06_TC_070, SPS_BI_06_TC_071 |
| SPS_BI_06_REQ_011 | 업종코드 입력 | SPS_BI_06_TC_077, SPS_BI_06_TC_078, SPS_BI_06_TC_080, SPS_BI_06_TC_081, SPS_BI_06_TC_082, SPS_BI_06_TC_083, SPS_BI_06_TC_084 |
| SPS_BI_06_REQ_012 | 필수값 blur 검사 | SPS_BI_06_TC_019, SPS_BI_06_TC_025, SPS_BI_06_TC_030, SPS_BI_06_TC_036, SPS_BI_06_TC_052, SPS_BI_06_TC_067, SPS_BI_06_TC_079, SPS_BI_06_TC_092, SPS_BI_06_TC_149, SPS_BI_06_TC_150, SPS_BI_06_TC_151 |
| SPS_BI_06_REQ_013 | 귀속연월 > 지급연월 검사 | SPS_BI_06_TC_037, SPS_BI_06_TC_038, SPS_BI_06_TC_039, SPS_BI_06_TC_040, SPS_BI_06_TC_041, SPS_BI_06_TC_042, SPS_BI_06_TC_043, SPS_BI_06_TC_044, SPS_BI_06_TC_045, SPS_BI_06_TC_046, SPS_BI_06_TC_047 |
| SPS_BI_06_REQ_014 | 병의원 주민번호 제한 검사 | SPS_BI_06_TC_072, SPS_BI_06_TC_073, SPS_BI_06_TC_074, SPS_BI_06_TC_075, SPS_BI_06_TC_076, SPS_BI_06_TC_082 |
| SPS_BI_06_REQ_015 | 지급액 입력 (숫자/12자리/0이상/정수) | SPS_BI_06_TC_085, SPS_BI_06_TC_086, SPS_BI_06_TC_087, SPS_BI_06_TC_088, SPS_BI_06_TC_089, SPS_BI_06_TC_090, SPS_BI_06_TC_091, SPS_BI_06_TC_093, SPS_BI_06_TC_094 |
| SPS_BI_06_REQ_016 | 자동 계산 필드 readonly | SPS_BI_06_TC_100, SPS_BI_06_TC_110, SPS_BI_06_TC_115, SPS_BI_06_TC_119 |
| SPS_BI_06_REQ_017 | 세율 자동 계산 로직 | SPS_BI_06_TC_061, SPS_BI_06_TC_080, SPS_BI_06_TC_081, SPS_BI_06_TC_083, SPS_BI_06_TC_095, SPS_BI_06_TC_096, SPS_BI_06_TC_097, SPS_BI_06_TC_098, SPS_BI_06_TC_099, SPS_BI_06_TC_101, SPS_BI_06_TC_102 |
| SPS_BI_06_REQ_018 | 소득세 계산 (원단위 이하 절사) | SPS_BI_06_TC_103, SPS_BI_06_TC_104, SPS_BI_06_TC_105, SPS_BI_06_TC_106, SPS_BI_06_TC_108, SPS_BI_06_TC_109, SPS_BI_06_TC_111 |
| SPS_BI_06_REQ_019 | 소액부징수 (1000원 미만 → 0원) | SPS_BI_06_TC_106, SPS_BI_06_TC_107, SPS_BI_06_TC_108 |
| SPS_BI_06_REQ_020 | 지방소득세 계산 | SPS_BI_06_TC_112, SPS_BI_06_TC_113, SPS_BI_06_TC_114 |
| SPS_BI_06_REQ_021 | 실지급액 계산 | SPS_BI_06_TC_116, SPS_BI_06_TC_117, SPS_BI_06_TC_118, SPS_BI_06_TC_120 |
| SPS_BI_06_REQ_022 | 계산 트리거 (필수값 완료 + blur) | SPS_BI_06_TC_121, SPS_BI_06_TC_122, SPS_BI_06_TC_123, SPS_BI_06_TC_124, SPS_BI_06_TC_125 |
| SPS_BI_06_REQ_023 | submit 중복 검사 | SPS_BI_06_TC_126, SPS_BI_06_TC_127, SPS_BI_06_TC_128, SPS_BI_06_TC_129 |
| SPS_BI_06_REQ_024 | 추가 완료 토스트 1.5초 | SPS_BI_06_TC_130, SPS_BI_06_TC_131, SPS_BI_06_TC_132 |
| SPS_BI_06_REQ_025 | SPS_BI_05 리스트/카운트 갱신 + 데이터 연동 | SPS_BI_06_TC_133, SPS_BI_06_TC_134, SPS_BI_06_TC_135, SPS_BI_06_TC_136 |
| SPS_BI_06_REQ_026 | 귀속 기준 예외 (보험설계사/음료배달/방문판매원) | SPS_BI_06_TC_137, SPS_BI_06_TC_138, SPS_BI_06_TC_139, SPS_BI_06_TC_140, SPS_BI_06_TC_141, SPS_BI_06_TC_142, SPS_BI_06_TC_143, SPS_BI_06_TC_144 |
| SPS_BI_06_REQ_027 | 저장 실패 시 팝업 유지 | SPS_BI_06_TC_145 |
| SPS_BI_06_REQ_028 | 서버 에러 메시지 | SPS_BI_06_TC_146, SPS_BI_06_TC_147, SPS_BI_06_TC_148 |
| SPS_BI_06_REQ_029 | 하단 안내 문구 4줄 고정 | SPS_BI_06_TC_152, SPS_BI_06_TC_153 |

---

## 2. 테스트케이스 -> 요구사항 매핑 (Backward Traceability)

| TC-ID | TC 설명 | 매핑 요구사항 ID |
|---|---|---|
| SPS_BI_06_TC_001 | 팝업 열기 | SPS_BI_06_REQ_001 |
| SPS_BI_06_TC_002 | 닫기 - 초기상태 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_003 | 닫기 - 입력 존재 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_004 | 닫기 confirm - 확인 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_005 | 닫기 confirm - 취소 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_006 | ESC 키 차단 | SPS_BI_06_REQ_003 |
| SPS_BI_06_TC_007 | 브라우저 뒤로가기 차단 | SPS_BI_06_REQ_003 |
| SPS_BI_06_TC_008 | 닫기 - 라디오만 변경 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_009 | 닫기 - 지급연도만 선택 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_010 | 닫기 - 라디오 변경 후 복원 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_011 | 닫기 - 지급월만 선택 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_012 | 팝업 외 영역 클릭 - 입력 존재 | SPS_BI_06_REQ_002 |
| SPS_BI_06_TC_013 | 지급연도 - 정상 선택 | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_014 | 지급연도 - placeholder | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_015 | 지급연도 - 옵션 범위 | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_016 | 지급연도 - 최소값(2025) | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_017 | 지급연도 - 최대값(현재연도+1) | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_018 | 지급연도 - 현재연도 선택 | SPS_BI_06_REQ_004 |
| SPS_BI_06_TC_019 | 지급연도 - 미선택 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_020 | 지급월 - 정상 선택 | SPS_BI_06_REQ_005 |
| SPS_BI_06_TC_021 | 지급월 - 1월 최소 | SPS_BI_06_REQ_005 |
| SPS_BI_06_TC_022 | 지급월 - 12월 최대 | SPS_BI_06_REQ_005 |
| SPS_BI_06_TC_023 | 지급월 - placeholder | SPS_BI_06_REQ_005 |
| SPS_BI_06_TC_024 | 지급월 - 옵션 1~12 | SPS_BI_06_REQ_005 |
| SPS_BI_06_TC_025 | 지급월 - 미선택 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_026 | 귀속연도 - 정상 선택 | SPS_BI_06_REQ_006 |
| SPS_BI_06_TC_027 | 귀속연도 - placeholder | SPS_BI_06_REQ_006 |
| SPS_BI_06_TC_028 | 귀속연도 - 옵션 범위 | SPS_BI_06_REQ_006 |
| SPS_BI_06_TC_029 | 귀속연도 - 현재연도 경계 | SPS_BI_06_REQ_006 |
| SPS_BI_06_TC_030 | 귀속연도 - 미선택 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_031 | 귀속월 - 정상 선택 | SPS_BI_06_REQ_007 |
| SPS_BI_06_TC_032 | 귀속월 - 1월 최소 | SPS_BI_06_REQ_007 |
| SPS_BI_06_TC_033 | 귀속월 - 12월 최대 | SPS_BI_06_REQ_007 |
| SPS_BI_06_TC_034 | 귀속월 - placeholder | SPS_BI_06_REQ_007 |
| SPS_BI_06_TC_035 | 귀속월 - 옵션 1~12 | SPS_BI_06_REQ_007 |
| SPS_BI_06_TC_036 | 귀속월 - 미선택 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_037 | 귀속연월 < 지급연월 정상 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_038 | 귀속연월 = 지급연월 경계 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_039 | 귀속연월 > 지급연월 에러 (같은해) | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_040 | 귀속연도 > 지급연도 에러 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_041 | 귀속연도 < 지급연도, 월 크로스 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_042 | 귀속연월 에러 표시 위치 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_043 | 지급연도 미선택 시 검사 안함 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_044 | 지급월 미선택 시 검사 안함 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_045 | 귀속월 미선택 시 검사 안함 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_046 | 지급연월 변경 후 귀속연월 재검증 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_047 | 에러 상태에서 지급연월 수정 정상화 | SPS_BI_06_REQ_013 |
| SPS_BI_06_TC_048 | 성명 - 정상 입력 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_049 | 성명 - 1자 최소 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_050 | 성명 - 50자 최대 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_051 | 성명 - 51자 초과 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_052 | 성명 - 빈값 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_053 | 성명 - 공백만 입력 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_054 | 성명 - 비허용 특수문자 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_055 | 성명 - 영문 입력 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_056 | 성명 - 허용 특수문자 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_057 | 성명 - 숫자 포함 | SPS_BI_06_REQ_008 |
| SPS_BI_06_TC_058 | 내외국인 - 기본값 | SPS_BI_06_REQ_009 |
| SPS_BI_06_TC_059 | 내외국인 - 외국인 선택 | SPS_BI_06_REQ_009 |
| SPS_BI_06_TC_060 | 내외국인 - 내국인 재선택 | SPS_BI_06_REQ_009 |
| SPS_BI_06_TC_061 | 내외국인 변경 시 세율 재계산 | SPS_BI_06_REQ_009, SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_062 | 주민번호 - 13자리 정상 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_063 | 사업자번호 - 10자리 정상 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_064 | 주민번호 - 14자리 초과 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_065 | 주민번호 - 문자 입력 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_066 | 주민번호 - 특수문자 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_067 | 주민번호 - 빈값 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_068 | 주민번호 - 1자리 비허용 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_069 | 주민번호 - 5자리 비허용 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_070 | 주민번호 - 11자리 비허용 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_071 | 주민번호 - 체크디짓 실패 | SPS_BI_06_REQ_010 |
| SPS_BI_06_TC_072 | 병의원 + 10자리 이하 정상 | SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_073 | 병의원 + 11자리 에러 | SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_074 | 병의원 + 13자리 에러 | SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_075 | 주민번호 먼저 입력 후 병의원 선택 | SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_076 | 병의원 + 10자리 경계 | SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_077 | 업종코드 - 정상 선택 | SPS_BI_06_REQ_011 |
| SPS_BI_06_TC_078 | 업종코드 - placeholder | SPS_BI_06_REQ_011 |
| SPS_BI_06_TC_079 | 업종코드 - 미선택 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_080 | 업종코드 - 봉사료수취자 | SPS_BI_06_REQ_011, SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_081 | 업종코드 - 직업운동가 | SPS_BI_06_REQ_011, SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_082 | 업종코드 - 병의원 | SPS_BI_06_REQ_011, SPS_BI_06_REQ_014 |
| SPS_BI_06_TC_083 | 업종코드 변경 시 세율 재계산 | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_084 | 업종코드 - 40개 옵션 표시 | SPS_BI_06_REQ_011 |
| SPS_BI_06_TC_085 | 지급액 - 정상 입력 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_086 | 지급액 - 0 경계 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_087 | 지급액 - 음수 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_088 | 지급액 - 12자리 최대 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_089 | 지급액 - 13자리 초과 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_090 | 지급액 - 소수점 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_091 | 지급액 - 문자 입력 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_092 | 지급액 - 빈값 blur | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_093 | 지급액 - 1 최소 양수 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_094 | 지급액 - 앞자리 0 | SPS_BI_06_REQ_015 |
| SPS_BI_06_TC_095 | 세율 - 기본 3% | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_096 | 세율 - 봉사료수취자 5% | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_097 | 세율 - 외국인+직업운동가 라디오 | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_098 | 세율 - 외국인+직업운동가 20% | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_099 | 세율 - 내국인+직업운동가 | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_100 | 세율 - readonly | SPS_BI_06_REQ_016 |
| SPS_BI_06_TC_101 | 세율 - 외국인→내국인 변경 시 라디오 해제 | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_102 | 세율 - 외국인+봉사료수취자 5% 고정 | SPS_BI_06_REQ_017 |
| SPS_BI_06_TC_103 | 소득세 - 기본 계산 3% | SPS_BI_06_REQ_018 |
| SPS_BI_06_TC_104 | 소득세 - 5% 계산 | SPS_BI_06_REQ_018 |
| SPS_BI_06_TC_105 | 소득세 - 20% 계산 | SPS_BI_06_REQ_018 |
| SPS_BI_06_TC_106 | 소득세 - 원단위 이하 절사 + 소액부징수 | SPS_BI_06_REQ_018, SPS_BI_06_REQ_019 |
| SPS_BI_06_TC_107 | 소득세 - 소액부징수 경계 | SPS_BI_06_REQ_019 |
| SPS_BI_06_TC_108 | 소득세 - 정확히 1000원 경계 | SPS_BI_06_REQ_018, SPS_BI_06_REQ_019 |
| SPS_BI_06_TC_109 | 소득세 - 지급액 0원 | SPS_BI_06_REQ_018 |
| SPS_BI_06_TC_110 | 소득세 - readonly | SPS_BI_06_REQ_016 |
| SPS_BI_06_TC_111 | 소득세 - 절사 검증 5% | SPS_BI_06_REQ_018 |
| SPS_BI_06_TC_112 | 지방소득세 - 기본 계산 | SPS_BI_06_REQ_020 |
| SPS_BI_06_TC_113 | 지방소득세 - 원단위 이하 절사 | SPS_BI_06_REQ_020 |
| SPS_BI_06_TC_114 | 지방소득세 - 소득세 0이면 0 | SPS_BI_06_REQ_020 |
| SPS_BI_06_TC_115 | 지방소득세 - readonly | SPS_BI_06_REQ_016 |
| SPS_BI_06_TC_116 | 실지급액 - 기본 계산 | SPS_BI_06_REQ_021 |
| SPS_BI_06_TC_117 | 실지급액 - 소액부징수 시 | SPS_BI_06_REQ_021 |
| SPS_BI_06_TC_118 | 실지급액 - 지급액 0원 | SPS_BI_06_REQ_021 |
| SPS_BI_06_TC_119 | 실지급액 - readonly | SPS_BI_06_REQ_016 |
| SPS_BI_06_TC_120 | 실지급액 - 대금액 계산 | SPS_BI_06_REQ_021 |
| SPS_BI_06_TC_121 | 계산 트리거 - 필수값 완료 blur | SPS_BI_06_REQ_022 |
| SPS_BI_06_TC_122 | 계산 트리거 - 지급연도 미선택 | SPS_BI_06_REQ_022 |
| SPS_BI_06_TC_123 | 계산 트리거 - 지급월 미선택 | SPS_BI_06_REQ_022 |
| SPS_BI_06_TC_124 | 계산 트리거 - 값 변경 후 재계산 | SPS_BI_06_REQ_022 |
| SPS_BI_06_TC_125 | 계산 트리거 - 지급액만 입력 | SPS_BI_06_REQ_022 |
| SPS_BI_06_TC_126 | 중복 데이터 submit | SPS_BI_06_REQ_023 |
| SPS_BI_06_TC_127 | 주민번호만 동일 (비중복) | SPS_BI_06_REQ_023 |
| SPS_BI_06_TC_128 | 주민번호+귀속연월 동일, 업종코드 다름 (비중복) | SPS_BI_06_REQ_023 |
| SPS_BI_06_TC_129 | 지급연월만 다르고 나머지 동일 (비중복) | SPS_BI_06_REQ_023 |
| SPS_BI_06_TC_130 | 추가 완료 - 정상 저장 | SPS_BI_06_REQ_024 |
| SPS_BI_06_TC_131 | 토스트 메시지 확인 | SPS_BI_06_REQ_024 |
| SPS_BI_06_TC_132 | 토스트 1.5초 소멸 | SPS_BI_06_REQ_024 |
| SPS_BI_06_TC_133 | SPS_BI_05 리스트 갱신 | SPS_BI_06_REQ_025 |
| SPS_BI_06_TC_134 | SPS_BI_05 카운트 갱신 | SPS_BI_06_REQ_025 |
| SPS_BI_06_TC_135 | SPS_BI_01 데이터 연동 | SPS_BI_06_REQ_025 |
| SPS_BI_06_TC_136 | SPS_BI_02 데이터 연동 | SPS_BI_06_REQ_025 |
| SPS_BI_06_TC_137 | 보험설계사 + 귀속연도 != 지급연도 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_138 | 보험설계사 confirm 확인 후 저장 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_139 | 보험설계사 confirm 취소 시 저장 중단 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_140 | 음료배달 + 귀속연도 != 지급연도 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_141 | 방문판매원 + 귀속연도 != 지급연도 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_142 | 보험설계사 + 귀속연도 = 지급연도 (정상) | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_143 | 일반 업종 + 귀속연도 != 지급연도 (alert 없음) | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_144 | 예외 업종 12월 리스트 표시 확인 | SPS_BI_06_REQ_026 |
| SPS_BI_06_TC_145 | 저장 실패 - 팝업 유지 | SPS_BI_06_REQ_027 |
| SPS_BI_06_TC_146 | 서버 에러 메시지 | SPS_BI_06_REQ_028 |
| SPS_BI_06_TC_147 | 서버 에러 후 재시도 | SPS_BI_06_REQ_028 |
| SPS_BI_06_TC_148 | 네트워크 끊김 submit | SPS_BI_06_REQ_028 |
| SPS_BI_06_TC_149 | 전체 필수값 미입력 submit | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_150 | 일부 필수값 미입력 (지급연도/지급월) | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_151 | 일부 필수값 미입력 (귀속월+지급액) | SPS_BI_06_REQ_012 |
| SPS_BI_06_TC_152 | 하단 안내 문구 표시 | SPS_BI_06_REQ_029 |
| SPS_BI_06_TC_153 | 안내 문구 스크롤 고정 | SPS_BI_06_REQ_029 |
| SPS_BI_06_TC_154 | E2E - 내국인 일반 업종 정상 등록 | 전체 |
| SPS_BI_06_TC_155 | E2E - 외국인 직업운동가 20% 등록 | 전체 |
| SPS_BI_06_TC_156 | E2E - 봉사료수취자 등록 | 전체 |
| SPS_BI_06_TC_157 | E2E - 병의원 사업자등록번호 등록 | 전체 |
| SPS_BI_06_TC_158 | E2E - 보험설계사 귀속연도 예외 | 전체 |
| SPS_BI_06_TC_159 | E2E - 소액부징수 경계값 확인 | 전체 |
| SPS_BI_06_TC_160 | E2E - 미래 지급연도(현재연도+1) 등록 | 전체 |

---

## 3. 커버리지 요약

| 항목 | 수량 |
|---|---|
| 총 요구사항 | 29개 (SPS_BI_06_REQ_001 ~ SPS_BI_06_REQ_029) |
| 총 테스트케이스 | 160개 (SPS_BI_06_TC_001 ~ SPS_BI_06_TC_160) |
| 요구사항당 평균 TC 수 | 약 5.5개 |
| 미커버 요구사항 | 0개 (전체 커버) |

### 유형별 분포

| 유형 | 수량 |
|---|---|
| 정상 | 60개 |
| 경계 | 47개 |
| 예외 | 40개 |
| 데이터무결성 | 13개 |
| 권한 | 0개 (해당 화면 권한 정책 미기재) |

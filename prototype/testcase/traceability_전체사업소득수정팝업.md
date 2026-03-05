# SPS_BI_07 전체 사업소득 수정 팝업 - 요구사항 추적 매트릭스 (Traceability Matrix)

> 화면 ID: SPS_BI_07
> 화면명: 전체 사업소득 수정 팝업
> 작성일: 2026-03-04

---

## 1. 요구사항 정의

| 요구사항 ID | 요구사항 설명 |
|---|---|
| SPS_BI_07_REQ_001 | 수정 팝업 호출: DB PK(id) 사용하여 팝업 호출 및 기존 등록 데이터를 모든 필드에 바인딩 |
| SPS_BI_07_REQ_002 | 모든 필드 수정 가능: 지급연도, 지급월, 귀속연도, 귀속월, 성명(상호), 내외국인 구분, 주민(사업자)등록번호, 업종코드, 지급액 모두 수정 가능 |
| SPS_BI_07_REQ_003 | 자동 계산 필드 readonly: 세율(%), 소득세, 지방소득세, 실지급액 |
| SPS_BI_07_REQ_004 | 지급연도 입력: 단일 셀렉트박스, 2025년~(현재연도+1)년, 기존값 바인딩, placeholder "선택" |
| SPS_BI_07_REQ_005 | 지급월 입력: 단일 셀렉트박스, 1월~12월, 기존값 바인딩, placeholder "선택" |
| SPS_BI_07_REQ_006 | 귀속연도 입력: 단일 셀렉트박스, 2025년~현재연도, 기존값 바인딩, placeholder "선택" |
| SPS_BI_07_REQ_007 | 귀속월 입력: 단일 셀렉트박스, 1월~12월, 기존값 바인딩, placeholder "선택" |
| SPS_BI_07_REQ_008 | 성명(상호) 입력: 최대 50자, 허용 문자(한글/영문/숫자/공백/&/'/-.·), 공백 trim 후 빈값 판정, 기존값 바인딩 |
| SPS_BI_07_REQ_009 | 내외국인 구분: 라디오 버튼(내국인/외국인), 기존값 바인딩, 변경 시 세율 조건부 전환 트리거 |
| SPS_BI_07_REQ_010 | 주민(사업자)등록번호 입력: 숫자만, 최대 13자리, 10자리 또는 13자리만 허용, 체크디짓 검증, 기존값 바인딩, 마스킹 없이 전체 표시 |
| SPS_BI_07_REQ_011 | 업종코드 입력: 단일 셀렉트박스, 40개 업종코드 목록, 기존값 바인딩, placeholder "선택" |
| SPS_BI_07_REQ_012 | 지급액 입력: 숫자만, 최대 12자리, 0원 허용, 기존값 바인딩. 천 단위 콤마 적용, 0 이상 정수만 허용 |
| SPS_BI_07_REQ_013 | 세율 자동 계산: 기본 3%(readonly), 봉사료수취자(940905) 5%(readonly), 외국인+직업운동가(940904) 3%/20% 라디오(입력 가능). 업종코드 또는 내외국인 변경에 의해 트리거 |
| SPS_BI_07_REQ_014 | 소득세 계산: 지급액 x 세율 (원단위 이하 절사) |
| SPS_BI_07_REQ_015 | 소액부징수: 소득세 1,000원 미만이면 소득세=0원 |
| SPS_BI_07_REQ_016 | 지방소득세 계산: 소득세=0이면 지방소득세=0, 소득세>0이면 소득세 x 0.1 (원단위 이하 절사) |
| SPS_BI_07_REQ_017 | 실지급액 계산: 지급액 - 소득세 - 지방소득세 |
| SPS_BI_07_REQ_018 | 계산 트리거: 팝업 진입 시 기존값 기반 자동 계산 + 수정 가능 필드 변경 후 blur 시 자동 재계산 |
| SPS_BI_07_REQ_019 | 필수값 검사(blur): 모든 필수 입력 항목 미입력 시 "필수 입력 항목입니다." 에러. 공백만 입력 시 trim 후 빈값 판정 |
| SPS_BI_07_REQ_020 | 귀속연월 유효성 검사: 4개 필드 모두 선택 시에만 검사, 귀속연월 > 지급연월이면 에러 "귀속연월은 지급연월보다 이전 날짜여야합니다." (동일 허용) |
| SPS_BI_07_REQ_021 | 주민번호 자릿수 검사(blur): 10자리 또는 13자리가 아닌 경우 "주민(사업자)등록번호는 10자리 또는 13자리만 입력 가능합니다." |
| SPS_BI_07_REQ_022 | 주민번호 체크디짓 검사(blur): 체크디짓 알고리즘 검증 실패 시 "유효하지 않은 주민(사업자)등록번호입니다." |
| SPS_BI_07_REQ_023 | 병의원(851101) 예외 검사(blur): 주민번호 10자리 초과 시 "병의원인 경우, 사업자등록번호만 입력하실 수 있습니다." (나중에 입력한 항목 하단 표시) |
| SPS_BI_07_REQ_024 | submit 중복 검사 (자기 자신 제외): 입력한 지급연월 기준 귀속연월+주민번호+업종코드 동일 데이터 존재 시 "주민(사업자)등록번호, 귀속연월, 업종코드가 동일한 사업소득이 존재합니다." |
| SPS_BI_07_REQ_025 | 유효성 에러 시 수정 버튼 비활성화: 에러 1건 이상 존재 시 비활성화, 모든 에러 해소 시 재활성화 |
| SPS_BI_07_REQ_026 | 다중 에러 동시 표시: 여러 필드에서 동시에 유효성 에러 발생 시 모든 에러를 동시에 표시 |
| SPS_BI_07_REQ_027 | 닫기/이탈 방지 confirm: 팝업 외 영역 클릭, ESC 키, 닫기 버튼 시 변경 있으면 confirm "사업소득 수정을 취소하시겠습니까?", 변경 없으면 confirm 없이 닫기. 브라우저 뒤로가기 차단 |
| SPS_BI_07_REQ_028 | 수정 완료 토스트: "사업소득 수정을 완료했습니다." 1.5초 노출 |
| SPS_BI_07_REQ_029 | SPS_BI_05 갱신 + 스크롤 위치 유지: 수정 완료 후 SPS_BI_05 리스트/카운트 최신 상태 갱신, 기존 스크롤 위치 유지 |
| SPS_BI_07_REQ_030 | 삭제: 변경사항 무관 바로 삭제 confirm "사업소득을 삭제하시겠습니까? 삭제한 정보는 복구할 수 없습니다.", 항상 삭제 가능, 토스트 "삭제 완료되었습니다." 1.5초 |
| SPS_BI_07_REQ_031 | 삭제 후 SPS_BI_05로 이동 (초기 상태 리셋): 검색 조건/필터 초기화, 리스트/카운트 갱신 |
| SPS_BI_07_REQ_032 | 귀속 기준 예외 규칙: 940906/940907/940908 + 귀속연도!=지급연도 → submit 시 confirm "해당 데이터는 YYYY년 12월 사업소득에 표시됩니다." (확인→저장, 취소→중단). 귀속연도/지급연도/업종코드 변경 시 적용 여부 변동 가능 |
| SPS_BI_07_REQ_033 | 저장 실패 시 팝업 유지: 중복 검사 실패, 비즈니스 로직 실패 등 시 팝업 유지 및 에러 표시 |
| SPS_BI_07_REQ_034 | 서버 에러(5xx) alert: "서버 오류가 발생했습니다. 잠시 후 다시 시도해 주세요." 수정 팝업 유지 |
| SPS_BI_07_REQ_035 | 클라이언트 에러(4xx): 서버 응답 메시지 기반 필드 하단 에러 문구, 수정 팝업 유지 |
| SPS_BI_07_REQ_036 | 네트워크 오류 alert: "네트워크 연결을 확인해 주세요." 수정 팝업 유지 |
| SPS_BI_07_REQ_037 | 하단 안내 문구 고정 표시(4개 항목) |
| SPS_BI_07_REQ_038 | 데이터 연동: 수정/삭제된 데이터는 SPS_BI_01(합산) 및 SPS_BI_02(월별 리스트)에도 즉시 반영 |
| SPS_BI_07_REQ_039 | 세율 라디오 이전 선택값 유지: 업종코드 변경으로 라디오가 사라졌다 다시 나타날 때 이전 선택값 유지 |

---

## 2. Forward Traceability (요구사항 ID -> TC-ID 매핑)

| 요구사항 ID | 요구사항 설명 | TC-ID |
|---|---|---|
| SPS_BI_07_REQ_001 | 수정 팝업 호출 (DB PK), 기존값 바인딩 | SPS_BI_07_TC_001, SPS_BI_07_TC_015, SPS_BI_07_TC_114 |
| SPS_BI_07_REQ_002 | 모든 필드 수정 가능 확인 | SPS_BI_07_TC_002, SPS_BI_07_TC_114 |
| SPS_BI_07_REQ_003 | 자동 계산 필드 readonly | SPS_BI_07_TC_003 |
| SPS_BI_07_REQ_004 | 지급연도 입력 (셀렉트, 2025~현재연도+1) | SPS_BI_07_TC_013, SPS_BI_07_TC_014, SPS_BI_07_TC_015 |
| SPS_BI_07_REQ_005 | 지급월 입력 (셀렉트, 1~12) | SPS_BI_07_TC_016, SPS_BI_07_TC_017, SPS_BI_07_TC_018 |
| SPS_BI_07_REQ_006 | 귀속연도 입력 (셀렉트, 2025~현재연도) | SPS_BI_07_TC_019, SPS_BI_07_TC_020 |
| SPS_BI_07_REQ_007 | 귀속월 입력 (셀렉트, 1~12) | SPS_BI_07_TC_021, SPS_BI_07_TC_022, SPS_BI_07_TC_023 |
| SPS_BI_07_REQ_008 | 성명(상호) 입력 | SPS_BI_07_TC_029, SPS_BI_07_TC_030, SPS_BI_07_TC_031, SPS_BI_07_TC_032, SPS_BI_07_TC_033, SPS_BI_07_TC_034 |
| SPS_BI_07_REQ_009 | 내외국인 구분 | SPS_BI_07_TC_036, SPS_BI_07_TC_037, SPS_BI_07_TC_038, SPS_BI_07_TC_039 |
| SPS_BI_07_REQ_010 | 주민(사업자)등록번호 입력 | SPS_BI_07_TC_040, SPS_BI_07_TC_041, SPS_BI_07_TC_045, SPS_BI_07_TC_046, SPS_BI_07_TC_047 |
| SPS_BI_07_REQ_011 | 업종코드 입력 | SPS_BI_07_TC_048, SPS_BI_07_TC_049 |
| SPS_BI_07_REQ_012 | 지급액 입력 (0원 허용) | SPS_BI_07_TC_053, SPS_BI_07_TC_054, SPS_BI_07_TC_055, SPS_BI_07_TC_056, SPS_BI_07_TC_057, SPS_BI_07_TC_058, SPS_BI_07_TC_059 |
| SPS_BI_07_REQ_013 | 세율 자동 계산 | SPS_BI_07_TC_038, SPS_BI_07_TC_039, SPS_BI_07_TC_049, SPS_BI_07_TC_060, SPS_BI_07_TC_061, SPS_BI_07_TC_062, SPS_BI_07_TC_063, SPS_BI_07_TC_064, SPS_BI_07_TC_066 |
| SPS_BI_07_REQ_014 | 소득세 계산 | SPS_BI_07_TC_070, SPS_BI_07_TC_072, SPS_BI_07_TC_073 |
| SPS_BI_07_REQ_015 | 소액부징수 | SPS_BI_07_TC_067, SPS_BI_07_TC_068, SPS_BI_07_TC_069 |
| SPS_BI_07_REQ_016 | 지방소득세 계산 | SPS_BI_07_TC_071 |
| SPS_BI_07_REQ_017 | 실지급액 계산 | SPS_BI_07_TC_073 |
| SPS_BI_07_REQ_018 | 계산 트리거 (진입 시 + blur) | SPS_BI_07_TC_004, SPS_BI_07_TC_074, SPS_BI_07_TC_075, SPS_BI_07_TC_076 |
| SPS_BI_07_REQ_019 | 필수값 검사(blur) | SPS_BI_07_TC_035, SPS_BI_07_TC_103, SPS_BI_07_TC_104, SPS_BI_07_TC_105, SPS_BI_07_TC_106, SPS_BI_07_TC_107, SPS_BI_07_TC_108, SPS_BI_07_TC_109, SPS_BI_07_TC_110, SPS_BI_07_TC_117 |
| SPS_BI_07_REQ_020 | 귀속연월 유효성 검사 | SPS_BI_07_TC_024, SPS_BI_07_TC_025, SPS_BI_07_TC_026, SPS_BI_07_TC_027, SPS_BI_07_TC_028 |
| SPS_BI_07_REQ_021 | 주민번호 자릿수 검사 | SPS_BI_07_TC_042, SPS_BI_07_TC_043 |
| SPS_BI_07_REQ_022 | 주민번호 체크디짓 검사 | SPS_BI_07_TC_044 |
| SPS_BI_07_REQ_023 | 병의원 예외 검사 | SPS_BI_07_TC_050, SPS_BI_07_TC_051, SPS_BI_07_TC_052 |
| SPS_BI_07_REQ_024 | submit 중복 검사 (자기 자신 제외) | SPS_BI_07_TC_077, SPS_BI_07_TC_078, SPS_BI_07_TC_079 |
| SPS_BI_07_REQ_025 | 유효성 에러 시 수정 버튼 비활성화 | SPS_BI_07_TC_111, SPS_BI_07_TC_112, SPS_BI_07_TC_117 |
| SPS_BI_07_REQ_026 | 다중 에러 동시 표시 | SPS_BI_07_TC_117 |
| SPS_BI_07_REQ_027 | 닫기/이탈 방지 confirm | SPS_BI_07_TC_005, SPS_BI_07_TC_006, SPS_BI_07_TC_007, SPS_BI_07_TC_008, SPS_BI_07_TC_009, SPS_BI_07_TC_010, SPS_BI_07_TC_011, SPS_BI_07_TC_012, SPS_BI_07_TC_118 |
| SPS_BI_07_REQ_028 | 수정 완료 토스트 | SPS_BI_07_TC_080, SPS_BI_07_TC_082, SPS_BI_07_TC_114, SPS_BI_07_TC_118 |
| SPS_BI_07_REQ_029 | SPS_BI_05 갱신 + 스크롤 위치 유지 | SPS_BI_07_TC_081, SPS_BI_07_TC_114 |
| SPS_BI_07_REQ_030 | 삭제 (항상 삭제 가능, 변경사항 무관 바로 삭제 confirm) | SPS_BI_07_TC_084, SPS_BI_07_TC_085, SPS_BI_07_TC_086, SPS_BI_07_TC_088, SPS_BI_07_TC_089, SPS_BI_07_TC_115 |
| SPS_BI_07_REQ_031 | 삭제 후 SPS_BI_05로 이동 (초기상태 리셋) | SPS_BI_07_TC_085, SPS_BI_07_TC_087, SPS_BI_07_TC_115 |
| SPS_BI_07_REQ_032 | 귀속 기준 예외 규칙 | SPS_BI_07_TC_091, SPS_BI_07_TC_092, SPS_BI_07_TC_093, SPS_BI_07_TC_094, SPS_BI_07_TC_095, SPS_BI_07_TC_096, SPS_BI_07_TC_097, SPS_BI_07_TC_116 |
| SPS_BI_07_REQ_033 | 저장 실패 시 팝업 유지 | SPS_BI_07_TC_101 |
| SPS_BI_07_REQ_034 | 서버 에러(5xx) alert | SPS_BI_07_TC_098, SPS_BI_07_TC_102 |
| SPS_BI_07_REQ_035 | 클라이언트 에러(4xx) 필드 에러 | SPS_BI_07_TC_099 |
| SPS_BI_07_REQ_036 | 네트워크 오류 alert | SPS_BI_07_TC_100 |
| SPS_BI_07_REQ_037 | 하단 안내 문구 | SPS_BI_07_TC_113 |
| SPS_BI_07_REQ_038 | 데이터 연동 (SPS_BI_01, SPS_BI_02) | SPS_BI_07_TC_083, SPS_BI_07_TC_090, SPS_BI_07_TC_116 |
| SPS_BI_07_REQ_039 | 세율 라디오 이전 선택값 유지 | SPS_BI_07_TC_065 |

---

## 3. Backward Traceability (TC-ID -> 요구사항 ID 매핑)

| TC-ID | 테스트 설명 | 요구사항 ID |
|---|---|---|
| SPS_BI_07_TC_001 | 수정 팝업 호출 - DB PK(id) 사용 데이터 로딩 | SPS_BI_07_REQ_001 |
| SPS_BI_07_TC_002 | 모든 필드 수정 가능 상태 확인 | SPS_BI_07_REQ_002 |
| SPS_BI_07_TC_003 | 자동계산 필드 readonly 상태 확인 | SPS_BI_07_REQ_003 |
| SPS_BI_07_TC_004 | 팝업 진입 시 기존값 기반 자동 계산 표시 | SPS_BI_07_REQ_018 |
| SPS_BI_07_TC_005 | 변경 있을 때 닫기 버튼 - confirm 표시 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_006 | 변경 있을 때 닫기 - confirm 확인 클릭 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_007 | 변경 있을 때 닫기 - confirm 취소 클릭 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_008 | 변경 없을 때 닫기 - confirm 없이 닫기 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_009 | 변경 있을 때 팝업 외 영역 클릭 - confirm 표시 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_010 | ESC 키 - 변경 있을 때 confirm 표시 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_011 | ESC 키 - 변경 없을 때 바로 닫힘 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_012 | 브라우저 뒤로가기 차단 | SPS_BI_07_REQ_027 |
| SPS_BI_07_TC_013 | 지급연도 정상 수정 | SPS_BI_07_REQ_004 |
| SPS_BI_07_TC_014 | 지급연도 셀렉트박스 범위 확인 (2025~현재연도+1) | SPS_BI_07_REQ_004 |
| SPS_BI_07_TC_015 | 지급연도 기존값 바인딩 확인 | SPS_BI_07_REQ_001, SPS_BI_07_REQ_004 |
| SPS_BI_07_TC_016 | 지급월 정상 수정 | SPS_BI_07_REQ_005 |
| SPS_BI_07_TC_017 | 지급월 경계값 - 1월 | SPS_BI_07_REQ_005 |
| SPS_BI_07_TC_018 | 지급월 경계값 - 12월 | SPS_BI_07_REQ_005 |
| SPS_BI_07_TC_019 | 귀속연도 정상 수정 | SPS_BI_07_REQ_006 |
| SPS_BI_07_TC_020 | 귀속연도 셀렉트박스 범위 확인 (2025~현재연도) | SPS_BI_07_REQ_006 |
| SPS_BI_07_TC_021 | 귀속월 정상 수정 | SPS_BI_07_REQ_007 |
| SPS_BI_07_TC_022 | 귀속월 경계값 - 1월 | SPS_BI_07_REQ_007 |
| SPS_BI_07_TC_023 | 귀속월 경계값 - 12월 | SPS_BI_07_REQ_007 |
| SPS_BI_07_TC_024 | 귀속연월이 지급연월 이후 - 에러 | SPS_BI_07_REQ_020 |
| SPS_BI_07_TC_025 | 귀속연월과 지급연월 동일 - 허용 | SPS_BI_07_REQ_020 |
| SPS_BI_07_TC_026 | 귀속연도가 지급연도보다 큰 경우 에러 | SPS_BI_07_REQ_020 |
| SPS_BI_07_TC_027 | 4개 필드 중 하나 미선택 시 귀속연월 검사 미수행 | SPS_BI_07_REQ_020 |
| SPS_BI_07_TC_028 | 지급연월 변경으로 귀속연월 관계 역전 에러 | SPS_BI_07_REQ_020 |
| SPS_BI_07_TC_029 | 성명 정상 수정 - 한글 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_030 | 성명 수정 - 영문 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_031 | 성명 수정 - 허용 특수문자 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_032 | 성명 수정 - 비허용 특수문자 차단 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_033 | 성명 최대 50자 입력 경계 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_034 | 성명 50자 초과 입력 차단 | SPS_BI_07_REQ_008 |
| SPS_BI_07_TC_035 | 성명 공백만 입력 시 필수 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_036 | 내외국인 구분 변경 - 내국인에서 외국인 | SPS_BI_07_REQ_009 |
| SPS_BI_07_TC_037 | 내외국인 구분 변경 - 외국인에서 내국인 | SPS_BI_07_REQ_009 |
| SPS_BI_07_TC_038 | 내국인→외국인 + 직업운동가 세율 라디오 표시 | SPS_BI_07_REQ_009, SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_039 | 외국인→내국인 + 직업운동가 세율 라디오 사라짐 | SPS_BI_07_REQ_009, SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_040 | 주민번호 정상 수정 - 13자리 | SPS_BI_07_REQ_010 |
| SPS_BI_07_TC_041 | 사업자등록번호 정상 수정 - 10자리 | SPS_BI_07_REQ_010 |
| SPS_BI_07_TC_042 | 주민번호 자릿수 에러 - 11자리 | SPS_BI_07_REQ_021 |
| SPS_BI_07_TC_043 | 주민번호 자릿수 에러 - 9자리 | SPS_BI_07_REQ_021 |
| SPS_BI_07_TC_044 | 주민번호 체크디짓 실패 | SPS_BI_07_REQ_022 |
| SPS_BI_07_TC_045 | 주민번호 숫자 외 문자 입력 차단 | SPS_BI_07_REQ_010 |
| SPS_BI_07_TC_046 | 주민번호 최대 13자리 초과 입력 차단 | SPS_BI_07_REQ_010 |
| SPS_BI_07_TC_047 | 주민번호 마스킹 없이 전체 표시 확인 | SPS_BI_07_REQ_010 |
| SPS_BI_07_TC_048 | 업종코드 정상 변경 및 세율 재계산 | SPS_BI_07_REQ_011 |
| SPS_BI_07_TC_049 | 봉사료수취자(940905) 세율 5% 자동 변경 | SPS_BI_07_REQ_011, SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_050 | 병의원(851101) 주민번호 10자리 정상 | SPS_BI_07_REQ_023 |
| SPS_BI_07_TC_051 | 병의원(851101) 주민번호 13자리 에러 | SPS_BI_07_REQ_023 |
| SPS_BI_07_TC_052 | 병의원(851101) 상태에서 주민번호 13자리 입력 에러 | SPS_BI_07_REQ_023 |
| SPS_BI_07_TC_053 | 지급액 정상 입력 - 일반 업종 3% 계산 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_054 | 지급액 0원 입력 허용 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_055 | 지급액 최대 12자리 입력 경계 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_056 | 지급액 12자리 초과 입력 차단 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_057 | 지급액 음수 입력 차단 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_058 | 지급액 문자 입력 차단 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_059 | 지급액 소수점 입력 차단 | SPS_BI_07_REQ_012 |
| SPS_BI_07_TC_060 | 세율 기본값 3% - 일반 업종 readonly | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_061 | 세율 5% - 봉사료수취자(940905) readonly | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_062 | 외국인+직업운동가(940904) 세율 라디오 표시 | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_063 | 외국인+직업운동가(940904) 세율 20% 선택 계산 | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_064 | 외국인+직업운동가(940904) 세율 3% 선택 계산 | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_065 | 외국인+직업운동가 세율 라디오 이전 선택값 유지 | SPS_BI_07_REQ_039 |
| SPS_BI_07_TC_066 | 내국인+직업운동가(940904) 세율 3% 고정 | SPS_BI_07_REQ_013 |
| SPS_BI_07_TC_067 | 소득세 소액부징수 - 1000원 미만 → 0원 | SPS_BI_07_REQ_015 |
| SPS_BI_07_TC_068 | 소득세 소액부징수 경계 - 정확히 1000원 | SPS_BI_07_REQ_015 |
| SPS_BI_07_TC_069 | 소득세 소액부징수 경계 - 999원 | SPS_BI_07_REQ_015 |
| SPS_BI_07_TC_070 | 원단위 이하 절사 확인 | SPS_BI_07_REQ_014 |
| SPS_BI_07_TC_071 | 지방소득세 - 소득세 0일 때 0 확인 | SPS_BI_07_REQ_016 |
| SPS_BI_07_TC_072 | 봉사료수취자(940905) 세율 5% 계산 검증 | SPS_BI_07_REQ_014 |
| SPS_BI_07_TC_073 | 실지급액 계산 확인 | SPS_BI_07_REQ_014, SPS_BI_07_REQ_017 |
| SPS_BI_07_TC_074 | 지급액 변경 후 blur 시 재계산 | SPS_BI_07_REQ_018 |
| SPS_BI_07_TC_075 | 업종코드 변경 후 blur 시 재계산 | SPS_BI_07_REQ_018 |
| SPS_BI_07_TC_076 | 내외국인 변경 시 세율 조건부 전환 즉시 트리거 | SPS_BI_07_REQ_018 |
| SPS_BI_07_TC_077 | 중복 데이터 존재 시 수정 submit 에러 | SPS_BI_07_REQ_024 |
| SPS_BI_07_TC_078 | 자기 자신과의 중복은 허용 | SPS_BI_07_REQ_024 |
| SPS_BI_07_TC_079 | 지급연월 변경 후 새 지급연월 기준 중복 검사 | SPS_BI_07_REQ_024 |
| SPS_BI_07_TC_080 | 수정 완료 정상 처리 - 토스트 표시 | SPS_BI_07_REQ_028 |
| SPS_BI_07_TC_081 | 수정 완료 후 SPS_BI_05 갱신 및 스크롤 위치 유지 | SPS_BI_07_REQ_029 |
| SPS_BI_07_TC_082 | 수정 완료 토스트 1.5초 후 사라짐 | SPS_BI_07_REQ_028 |
| SPS_BI_07_TC_083 | 수정 후 SPS_BI_01, SPS_BI_02 데이터 연동 확인 | SPS_BI_07_REQ_038 |
| SPS_BI_07_TC_084 | 삭제 confirm 표시 | SPS_BI_07_REQ_030 |
| SPS_BI_07_TC_085 | 삭제 confirm 확인 - 삭제 완료, 토스트, SPS_BI_05 이동(초기 상태 리셋) | SPS_BI_07_REQ_030, SPS_BI_07_REQ_031 |
| SPS_BI_07_TC_086 | 삭제 confirm 취소 - 팝업 유지 | SPS_BI_07_REQ_030 |
| SPS_BI_07_TC_087 | 삭제 후 SPS_BI_05 초기 상태 리셋 확인 | SPS_BI_07_REQ_031 |
| SPS_BI_07_TC_088 | 삭제 완료 토스트 1.5초 후 사라짐 | SPS_BI_07_REQ_030 |
| SPS_BI_07_TC_089 | 변경사항 있을 때 삭제 - 바로 삭제 confirm | SPS_BI_07_REQ_030 |
| SPS_BI_07_TC_090 | 삭제 후 SPS_BI_01, SPS_BI_02 데이터 연동 확인 | SPS_BI_07_REQ_038 |
| SPS_BI_07_TC_091 | 보험설계사(940906) 귀속연도!=지급연도 예외 confirm 확인 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_092 | 음료배달(940907) 귀속연도!=지급연도 예외 confirm 확인 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_093 | 방문판매원(940908) 귀속연도!=지급연도 예외 confirm 확인 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_094 | 예외 규칙 confirm 취소 시 저장 중단 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_095 | 귀속연도=지급연도 예외 규칙 미적용 일반 수정 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_096 | 지급연도 변경으로 예외 규칙 적용 변동 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_097 | 업종코드 변경으로 예외 규칙 적용/해제 | SPS_BI_07_REQ_032 |
| SPS_BI_07_TC_098 | 서버 에러(5xx) 발생 시 alert 및 팝업 유지 | SPS_BI_07_REQ_034 |
| SPS_BI_07_TC_099 | 클라이언트 에러(4xx) 발생 시 필드 에러 및 팝업 유지 | SPS_BI_07_REQ_035 |
| SPS_BI_07_TC_100 | 네트워크 오류 발생 시 alert 및 팝업 유지 | SPS_BI_07_REQ_036 |
| SPS_BI_07_TC_101 | 저장 실패 시 팝업 유지 및 에러 표시 | SPS_BI_07_REQ_033 |
| SPS_BI_07_TC_102 | 삭제 서버 에러(5xx) 발생 시 alert 및 팝업 유지 | SPS_BI_07_REQ_034 |
| SPS_BI_07_TC_103 | 지급연도 미선택 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_104 | 지급월 미선택 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_105 | 귀속연도 미선택 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_106 | 귀속월 미선택 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_107 | 성명 미입력 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_108 | 주민번호 미입력 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_109 | 업종코드 미선택 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_110 | 지급액 미입력 blur 필수값 에러 | SPS_BI_07_REQ_019 |
| SPS_BI_07_TC_111 | 유효성 에러 시 수정 버튼 비활성화 | SPS_BI_07_REQ_025 |
| SPS_BI_07_TC_112 | 에러 해소 시 수정 버튼 재활성화 | SPS_BI_07_REQ_025 |
| SPS_BI_07_TC_113 | 하단 안내 문구 고정 표시 확인 | SPS_BI_07_REQ_037 |
| SPS_BI_07_TC_114 | E2E: 모든 필드 수정 후 저장 | SPS_BI_07_REQ_001, SPS_BI_07_REQ_002, SPS_BI_07_REQ_028, SPS_BI_07_REQ_029 |
| SPS_BI_07_TC_115 | E2E: 수정 후 삭제 흐름 | SPS_BI_07_REQ_030, SPS_BI_07_REQ_031 |
| SPS_BI_07_TC_116 | E2E: 예외 업종 귀속연도 변경 전체 흐름 | SPS_BI_07_REQ_032, SPS_BI_07_REQ_038 |
| SPS_BI_07_TC_117 | E2E: 다중 에러 발생 후 해소하여 수정 완료 | SPS_BI_07_REQ_019, SPS_BI_07_REQ_025, SPS_BI_07_REQ_026 |
| SPS_BI_07_TC_118 | E2E: 닫기 시도 후 취소하고 수정 완료 | SPS_BI_07_REQ_027, SPS_BI_07_REQ_028 |

---

## 4. 커버리지 요약

| 항목 | 수량 |
|---|---|
| 총 요구사항 수 | 39개 (REQ_001 ~ REQ_039) |
| 총 테스트케이스 수 | 95개 (TC_001 ~ TC_118, 결번 없음) |
| 요구사항당 평균 TC 수 | 2.4개 |
| 미커버 요구사항 | 0개 |
| TC 미매핑 | 0개 |

### 유형별 분포

| 유형 | TC 수 |
|---|---|
| 정상 | 48건 |
| 경계 | 14건 |
| 예외 | 28건 |
| 데이터무결성 | 5건 |

### 우선순위별 분포

| 우선순위 | TC 수 |
|---|---|
| High | 73건 |
| Medium | 19건 |
| Low | 3건 |

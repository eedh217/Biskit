# Prototype 폴더 구조

## 📁 전체 구조 개요

```
prototype/
├── app/                    # Next.js 페이지 라우팅
│   ├── sps/               # "화면" 메뉴 - 실제 작동하는 프로토타입
│   ├── policy/            # "정책분석" 메뉴 - 설계 문서 뷰어
│   └── testcases/         # 테스트케이스 화면
├── components/            # React 컴포넌트
│   ├── sps/              # SPS 관련 팝업
│   └── manage/           # 공통 UI 컴포넌트
├── lib/                   # 비즈니스 로직 & 유틸리티
│   └── policyContent/    # 정책 콘텐츠 생성 함수
├── types/                 # TypeScript 타입 정의
├── policy/                # 정책 마크다운 파일 (정책분석 메뉴에서 사용)
│   ├── common/           # 공통 정책 MD 파일
│   └── SPS/              # SPS 정책 MD 파일
└── public/                # 정적 파일 (현재 비어있음 - 이미지/파비콘 추가용)
```

---

## 🎯 메뉴 구조 (LNB)

### 🖥️ "화면" 메뉴 (`app/sps/`, `app/oi/`)
**실제 작동하는 프로토타입 - 데이터 CRUD 가능**

- **사업소득**
  - 월별 사업소득 → `/sps/summary` (요약)
  - 전체 사업소득 → `/sps/all` (전체 리스트)
- **기타소득**
  - 월별 기타소득 → `/oi/summary` (요약)
  - 전체 기타소득 → `/oi/all` (전체 리스트)

**특징:**
- ✅ localStorage 기반 데이터 저장/수정/삭제
- ✅ 검색, 필터링, 페이지네이션
- ✅ 팝업을 통한 추가/수정
- ✅ 엑셀 업로드/다운로드
- ✅ 실시간 세금 계산

---

### 📄 "정책분석" 메뉴 (`app/policy/`)
**설계 문서 뷰어 - 읽기 전용**

- **공통 정책**
  - 공통 UI → `/policy/common/common-ui`
  - 엑셀 업로드 → `/policy/common/excel-upload`
- **사업소득**
  - 월별 사업소득 → `/policy/sps/monthly`
  - 전체 사업소득 → `/policy/sps/all`
- **기타소득**
  - 월별 기타소득 → `/policy/oi/monthly`
  - 전체 기타소득 → `/policy/oi/all`

**특징:**
- ✅ 마크다운 기반 정책 문서 표시
- ✅ 탭 방식 UI (화면 정의, 필드 정의, 정책, 테스트케이스)
- ✅ 화면 설계 문서 열람
- ❌ 데이터 조작 불가 (읽기 전용)

---

## 1️⃣ 페이지 (app/)

### 🔹 "화면" 메뉴 페이지 (app/sps/, app/oi/)
**실제 기능 구현 - 프로토타입**

#### 사업소득 (BI)
| 화면 | 파일 경로 | 설명 | 라우트 |
|------|----------|------|--------|
| **월별 사업소득 요약** | `app/sps/summary/page.tsx` | 연간 월별 사업소득 요약 (SPS_BI_01) | `/sps/summary` |
| **월별 사업소득 리스트** | `app/sps/monthly/page.tsx` | 특정 월 상세 리스트 (SPS_BI_02) | `/sps/monthly?year=2025&month=1` |
| **전체 사업소득 리스트** | `app/sps/all/page.tsx` | 전체 사업소득 리스트 (CRUD) | `/sps/all` |

#### 기타소득 (OI)
| 화면 | 파일 경로 | 설명 | 라우트 |
|------|----------|------|--------|
| **월별 기타소득 요약** | `app/oi/summary/page.tsx` | 연간 월별 기타소득 요약 (SPS_OI_01) | `/oi/summary` |
| **월별 기타소득 리스트** | `app/oi/monthly/page.tsx` | 특정 월 상세 리스트 (SPS_OI_02) | `/oi/monthly?year=2025&month=1` |
| **전체 기타소득 리스트** | `app/oi/all/page.tsx` | 전체 기타소득 리스트 (CRUD) | `/oi/all` |

### 🔹 "정책분석" 메뉴 페이지 (app/policy/)
**설계 문서 뷰어 - 읽기 전용**

| 화면 | 파일 경로 | 설명 | 라우트 |
|------|----------|------|--------|
| **SPS 전체 정책** | `app/policy/sps/all/page.tsx` | 전체 사업소득 설계 문서 (탭) | `/policy/sps/all` |
| **SPS 월별 정책** | `app/policy/sps/monthly/page.tsx` | 월별 사업소득 설계 문서 (탭) | `/policy/sps/monthly` |
| **OI 월별 정책** | `app/policy/oi/monthly/page.tsx` | 월별 기타소득 설계 문서 (탭) | `/policy/oi/monthly` |
| **OI 전체 정책** | `app/policy/oi/all/page.tsx` | 전체 기타소득 설계 문서 (탭) | `/policy/oi/all` |
| **공통 정책** | `app/policy/common/[id]/page.tsx` | 공통 정책 동적 라우팅 | `/policy/common/[id]` |

### 🔹 기타 페이지

| 화면 | 파일 경로 | 설명 |
|------|----------|------|
| **메인 페이지** | `app/page.tsx` | 프로토타입 홈 화면 |
| **레이아웃** | `app/layout.tsx` | 전역 레이아웃 |
| **테스트케이스** | `app/testcases/page.tsx` | 테스트케이스 목록 |

---

## 2️⃣ 팝업 컴포넌트

### 사업소득 팝업 (components/sps/)

| 팝업 | 파일 경로 | 사용 위치 |
|------|----------|----------|
| **월별 사업소득 추가 팝업** | `components/sps/BusinessIncomeAddPopup.tsx` | 월별 리스트 화면 (SPS_BI_03) |
| **월별 사업소득 수정 팝업** | `components/sps/BusinessIncomeEditPopup.tsx` | 월별 리스트 화면 (SPS_BI_04) |
| **전체 사업소득 추가 팝업** | `components/sps/AllBusinessIncomeAddPopup.tsx` | 전체 리스트 화면 |
| **전체 사업소득 수정 팝업** | `components/sps/AllBusinessIncomeEditPopup.tsx` | 전체 리스트 화면 |
| **엑셀 업로드 결과 팝업** | `components/sps/ExcelUploadResultPopup.tsx` | 엑셀 업로드 후 결과 표시 |

### 기타소득 팝업 (components/oi/)
**준비 중** - 추후 추가 예정
- OtherIncomeAddPopup.tsx (SPS_OI_03)
- OtherIncomeEditPopup.tsx (SPS_OI_04)
- AllOtherIncomeAddPopup.tsx (SPS_OI_06)
- AllOtherIncomeEditPopup.tsx (SPS_OI_07)

---

## 3️⃣ 공통 컴포넌트 (components/manage/)

| 컴포넌트 | 파일 경로 | 설명 |
|---------|----------|------|
| **검색바** | `components/manage/SearchBar.tsx` | 검색 입력 UI |
| **페이지네이션** | `components/manage/Pagination.tsx` | 페이지 네비게이션 |
| **페이지 크기 선택** | `components/manage/PageSizeSelect.tsx` | 페이지당 항목 수 선택 |
| **토스트** | `components/manage/Toast.tsx` | 알림 메시지 |
| **확인 다이얼로그** | `components/manage/ConfirmDialog.tsx` | 확인/취소 팝업 |
| **삭제 실패 팝업** | `components/manage/DeleteFailPopup.tsx` | 삭제 실패 안내 |

---

## 4️⃣ 기타 컴포넌트 (components/)

| 컴포넌트 | 파일 경로 | 설명 |
|---------|----------|------|
| **정책 탭** | `components/SpsPolicyTabs.tsx` | SPS 정책 탭 UI |
| **정책 상세 콘텐츠** | `components/SpsPolicyDetailContent.tsx` | SPS 정책 상세 내용 |
| **공통 정책 콘텐츠** | `components/CommonPolicyDetailContent.tsx` | 공통 정책 상세 내용 |
| **마크다운 렌더러** | `components/MarkdownContent.tsx` | 마크다운 렌더링 |
| **LNB** | `components/LNB.tsx` | 좌측 네비게이션 바 |
| **네비게이션** | `components/Navigation.tsx` | 상단 네비게이션 |
| **레이아웃 쉘** | `components/LayoutShell.tsx` | 페이지 레이아웃 컨테이너 |
| **정책 카드** | `components/PolicyCard.tsx` | 정책 카드 UI |
| **필드 상세 테이블** | `components/FieldDetailTable.tsx` | 필드 상세 정보 테이블 |
| **테스트케이스 테이블** | `components/TestCaseTable.tsx` | 테스트케이스 목록 테이블 |

---

## 5️⃣ 비즈니스 로직 & 유틸리티 (lib/)

### 📌 사업소득(BI) 핵심 로직

| 파일 | 역할 |
|------|------|
| `store.ts` | 사업소득 localStorage CRUD, 귀속예외 로직 처리 |
| `taxCalculation.ts` | 사업소득 세율 결정, 소득세/지방소득세 계산 |
| `spsValidation.ts` | 사업소득 주민/사업자번호 검증, 체크디지트 알고리즘 |
| `industryCodes.ts` | 40개 업종코드 정의, 예외업종 상수 |
| `formatUtils.ts` | 금액/날짜/시간 포맷팅 유틸리티 (formatDateTime 포함) |
| `excelUpload.ts` | 사업소득 엑셀 업로드 파싱 및 검증 |
| `excelTemplate.ts` | 사업소득 엑셀 다운로드 템플릿 생성 |

### 📌 기타소득(OI) 핵심 로직

| 파일 | 역할 |
|------|------|
| `oiStore.ts` | 기타소득 localStorage CRUD (예외 규칙 없음) |
| `oiTaxCalculation.ts` | 기타소득 세금 계산 (20% 고정, 필요경비 60% 규칙) |
| `oiValidation.ts` | 기타소득 검증 (체크디지트 제외, 필요경비 검증) |
| `incomeTypes.ts` | 2개 소득구분 코드 정의 (자문/고문, 자문/고문 외 인적용역) |

### 📌 정책 관련

| 파일 | 역할 |
|------|------|
| `spsPolicyConfig.ts` | SPS/OI 정책 탭 설정 (사업소득/기타소득) |
| `policyData.ts` | 정책 데이터 관리 |
| `commonPolicyData.ts` | 공통 정책 데이터 |
| `testcaseGenerator.ts` | 테스트케이스 생성 |

### 📌 정책 콘텐츠 생성 (lib/policyContent/)

| 파일 | 역할 |
|------|------|
| `sps-summary.ts` | 요약 화면 정책 콘텐츠 |
| `sps-monthly.ts` | 월별 리스트 정책 콘텐츠 |
| `sps-all-list.ts` | 전체 리스트 정책 콘텐츠 |
| `sps-add.ts` | 월별 추가 팝업 정책 콘텐츠 |
| `sps-edit.ts` | 월별 수정 팝업 정책 콘텐츠 |
| `sps-all-add.ts` | 전체 추가 팝업 정책 콘텐츠 |
| `sps-all-edit.ts` | 전체 수정 팝업 정책 콘텐츠 |
| `sps-excel.ts` | 엑셀 업로드 정책 콘텐츠 |

---

## 6️⃣ 타입 정의 (types/)

| 파일 | 역할 |
|------|------|
| `sps.ts` | BusinessIncome, MonthlySummary, AggregatedRow, OtherIncome, OIMonthlySummary 등 SPS/OI 타입 |
| `manage.ts` | 관리 화면용 타입 |
| `index.ts` | 공통 타입 정의 |

---

## 🎯 기능별 수정 가이드

### Q: "전체 사업소득 수정 팝업" 기능을 수정하려면?

**주 파일:**
```
components/sps/AllBusinessIncomeEditPopup.tsx
```

**관련 파일:**
- 검증 로직: `lib/spsValidation.ts`
- 세금 계산: `lib/taxCalculation.ts`
- 데이터 저장: `lib/store.ts`
- 업종코드: `lib/industryCodes.ts`

---

### 다른 기능별 수정 파일

| 수정하고 싶은 기능 | 주 파일 | 관련 파일 |
|-------------------|--------|----------|
| 월별 추가 팝업 | `BusinessIncomeAddPopup.tsx` | `store.ts`, `taxCalculation.ts` |
| 월별 수정 팝업 | `BusinessIncomeEditPopup.tsx` | `store.ts`, `taxCalculation.ts` |
| 전체 추가 팝업 | `AllBusinessIncomeAddPopup.tsx` | `store.ts` |
| 엑셀 업로드 | `ExcelUploadResultPopup.tsx` | `excelUpload.ts` |
| 세금 계산 로직 | `taxCalculation.ts` | - |
| 주민번호 검증 | `spsValidation.ts` | - |
| 금액 포맷 표시 | `formatUtils.ts` | - |
| 월별 리스트 화면 | `app/sps/monthly/page.tsx` | `store.ts`, `formatUtils.ts` (신고파일 최종 생성일 컬럼 포함) |
| 전체 리스트 화면 | `app/sps/all/page.tsx` | `store.ts` |
| 요약 화면 | `app/sps/summary/page.tsx` | `store.ts` |

---

## 📝 주요 비즈니스 로직

### 사업소득(BI) 로직

#### 예외 업종 코드
- **940906** (보험설계사)
- **940907** (음료배달)
- **940908** (방문판매원)
- 귀속연도 ≠ 지급연도일 때 → 귀속연도 12월에 표시

#### 세율 계산
- 기본: 3%
- 봉사료(940905): 5%
- 외국인 운동선수(940904): 3% 또는 20% 선택

#### 소액 부징수
- 소득세 < 1,000원 → 소득세 = 0, 지방소득세 = 0

#### 주민/사업자번호 검증
- 사업자번호: 10자리 (체크디지트 검증)
- 주민등록번호: 13자리 (체크디지트 검증)

### 기타소득(OI) 로직

#### 세금 계산
- 세율: 20% 고정
- 소득금액 = 지급액 - 필요경비
- 소득세 = 소득금액 × 0.2 (절사)
- 소액부징수: 소득세 < 1,000원 → 0원
- 지방소득세 = 소득세 × 0.1 (절사)
- 실소득금액 = 소득금액 - 소득세 - 지방소득세

#### 필요경비 60% 규칙
- 필요경비 ≥ 지급액 × 0.6

#### 주민/사업자번호 검증
- 자릿수만 검증 (10자리 또는 13자리)
- 체크디지트 검증 제외

#### 소득구분
- 자문/고문
- 자문/고문 외 인적용역

---

**마지막 업데이트:** 2026-03-19

# Biskit Plan 프로젝트 관리 지침

## 프로젝트 개요
- **프로젝트명**: Biskit Plan - 정책 관리 프로토타입
- **기술 스택**: Next.js 14 (App Router), React 18, TypeScript (strict mode), Tailwind CSS
- **데이터 저장**: localStorage (백엔드 없음)
- **작업 디렉토리**: `prototype/`
- **주요 모듈**:
  - 사업소득(SPS/BI) 관리 시스템
  - 기타소득(SPS/OI) 관리 시스템

## 파일 구조 관리
- **STRUCTURE.md 자동 업데이트 규칙**
  - `prototype/` 폴더의 구조가 변경될 때마다 `prototype/STRUCTURE.md` 파일을 업데이트할 것
  - 새로운 페이지 추가 시: `app/` 경로와 기능 설명을 STRUCTURE.md에 추가
  - 새로운 컴포넌트 추가 시: `components/` 섹션에 팝업/공통 컴포넌트 분류하여 추가
  - 새로운 비즈니스 로직 추가 시: `lib/` 섹션에 파일명과 역할 설명 추가
  - 파일 삭제 또는 이동 시: STRUCTURE.md에서도 동일하게 반영
  - 기능 변경 시: 해당 파일의 설명도 함께 업데이트

## 코드 작성 규칙
- Next.js 14 App Router 사용 (Pages Router 사용 금지)
- TypeScript strict mode 필수
- Tailwind CSS 사용 (인라인 스타일 최소화)
- localStorage 기반 데이터 저장 (백엔드 없음)
- **useSearchParams() 사용 시 반드시 Suspense로 래핑**
- 파일 경로는 절대 경로 사용 (`@/` 별칭 사용)

## 명명 규칙
- 컴포넌트: PascalCase (예: `AllBusinessIncomeEditPopup.tsx`)
- 유틸 함수/파일: camelCase (예: `formatUtils.ts`, `getBusinessIncomes()`)
- 타입/인터페이스: PascalCase (예: `BusinessIncome`, `MonthlySummary`)
- 상수: UPPER_SNAKE_CASE (예: `INDUSTRY_CODES`, `EXCEPTION_INDUSTRY_CODES`)
- 파일명: kebab-case for routes, PascalCase for components

## 핵심 데이터 모델

### BusinessIncome 인터페이스 (`types/sps.ts`)
```typescript
{
  id: string
  name: string              // 성명
  isForeign: "N" | "Y"     // 외국인 여부
  idNumber: string         // 주민번호(13자리) 또는 사업자번호(10자리)
  industryCode: string     // 업종코드
  attributionYear: number  // 귀속연도
  attributionMonth: number // 귀속월
  paymentYear: number      // 지급연도
  paymentMonth: number     // 지급월
  paymentAmount: number    // 지급액
  taxRate: number          // 세율
  incomeTax: number        // 소득세
  localTax: number         // 지방세
  netPayment: number       // 실지급액
  reportFileDate: string | null
  createdAt: string
}
```

### OtherIncome 인터페이스 (`types/sps.ts`)
```typescript
{
  id: string
  name: string                    // 성명(상호)
  isForeign: "N" | "Y"           // 외국인 여부 (정보 표시용)
  idNumber: string               // 주민(사업자)등록번호 (10 or 13자리, 체크디지트 검증 없음)
  incomeType: "자문/고문" | "자문/고문 외 인적용역"  // 소득구분
  attributionYear: number        // 귀속연도
  attributionMonth: number       // 귀속월
  paymentYear: number            // 지급연도
  paymentMonth: number           // 지급월
  paymentCount: number           // 지급건수 (사용자 입력)
  paymentAmount: number          // 지급액(A)
  necessaryExpense: number       // 필요경비(B)
  incomeAmount: number           // 소득금액(A-B)
  incomeTax: number              // 소득세
  localTax: number               // 지방소득세
  netIncome: number              // 실소득금액 = 소득금액 - 소득세 - 지방소득세
  reportFileDate: string | null  // 신고파일 최종생성일
  createdAt: string
}
```

## 주요 비즈니스 로직 (절대 변경 금지)

### 1. 예외 업종 코드 처리 (`lib/industryCodes.ts`)
- **예외 업종 코드**: `940906` (보험설계사), `940907` (음료배달), `940908` (방문판매원)
- **규칙**: 귀속연도 ≠ 지급연도 OR 귀속월 ≠ 지급월인 경우
  - 귀속연도의 12월에 표시됨 (지급월이 아닌 귀속월 기준)
  - 합산 화면에서 별도 breakdown으로 표시
- **관련 함수**:
  - `store.ts`: `hasDecemberExceptionData()`, `getDecemberExceptionBreakdown()`
  - `industryCodes.ts`: `isExceptionIndustry()`

### 2. 세금 계산 로직 (`lib/taxCalculation.ts`)
- **세율 결정**:
  - 봉사료(940905): 5% 고정
  - 외국인 직업운동가(940904): 3% 또는 20% 선택 가능
  - 기타: 3% 고정
- **소액부징수**: 소득세 < 1,000원 → 소득세 = 0, 지방세 = 0
- **계산식**:
  - 소득세 = Math.floor(지급액 × 세율)
  - 지방세 = Math.floor(소득세 × 0.1)
  - 실지급액 = 지급액 - 소득세 - 지방세
- **관련 함수**: `determineTaxRate()`, `calculateTax()`, `needsTaxRateSelection()`

### 3. 입력 검증 로직 (`lib/spsValidation.ts`)
- **주민번호/사업자번호 검증**:
  - 주민번호: 13자리 + 체크디지트 검증 (가중치: [2,3,4,5,6,7,8,9,2,3,4,5])
  - 사업자번호: 10자리 + 체크디지트 검증 (가중치: [1,3,7,1,3,7,1,3,5])
  - 병의원(851101): 사업자번호만 허용 (주민번호 입력 불가)
- **날짜 검증**: 귀속일 ≤ 지급일 (귀속연월이 지급연월보다 이전이거나 같아야 함)
- **중복 방지**: (지급연도, 지급월, 귀속연도, 귀속월, 주민번호, 업종코드) 조합이 동일하면 중복
- **관련 함수**: `validateIdNumberCheckDigit()`, `validateAttributionDate()`, `checkDuplicate()`

### 4. 업종코드 정의 (`lib/industryCodes.ts`)
- 총 40개 업종코드 (940100 ~ 851101)
- **특수 코드**:
  - `940906`: 보험설계사 (예외)
  - `940907`: 음료배달 (예외)
  - `940908`: 방문판매원 (예외)
  - `940905`: 봉사료수취자 (세율 5%)
  - `940904`: 직업운동가 (세율 선택)
  - `851101`: 병의원 (사업자번호 필수)

### 5. 합산 건수 정의
- **사업소득 합산 건수(개수)**: 동일한 (귀속연도, 귀속월, 주민번호, 업종코드)를 가진 레코드들을 그룹화한 개수
- 월별 리스트에서는 개별 건수를 표시하지만, 합산 화면에서는 그룹화된 개수를 표시
- **예시**: 같은 사람이 같은 월에 같은 업종으로 3건이 있으면 → 합산 화면에서 1건으로 카운트
- **기타소득 건수**: row 1개당 1건으로 정의 (그룹화 없음)

## 핵심 파일 및 역할

### lib/ (비즈니스 로직)
- **store.ts**: localStorage CRUD + 예외 업종 로직 (사업소득 20개 시드 데이터 포함)
- **oiStore.ts**: 기타소득 localStorage CRUD (시드 데이터 포함)
- **taxCalculation.ts**: 세율 결정 + 세금 계산 (사업소득용)
- **oiTaxCalculation.ts**: 기타소득 세금 계산 (세율 20% 고정, 필요경비 60% 규칙)
- **spsValidation.ts**: 사업소득 입력 검증 + 체크디지트 알고리즘
- **oiValidation.ts**: 기타소득 입력 검증 (체크디지트 제외)
- **industryCodes.ts**: 40개 업종코드 + 예외코드 상수 (사업소득용)
- **incomeTypes.ts**: 2개 소득구분 코드 (기타소득용: 자문/고문, 자문/고문 외 인적용역)
- **formatUtils.ts**: 금액/날짜 포맷팅 유틸
- **excelUpload.ts**: 엑셀 파일 파싱 + 18가지 검증 로직
- **excelTemplate.ts**: 엑셀 템플릿 생성 + 실패 데이터 다운로드

### app/ (페이지)
#### 사업소득 (BI)
- **sps/summary/page.tsx**: SPS_BI_01 - 연도별 월별 합산 화면
- **sps/monthly/page.tsx**: SPS_BI_02 - 월별 상세 리스트 (Suspense 필수)
- **sps/all/page.tsx**: SPS_BI_05 - 전체 리스트 (검색, 페이징, 일괄 삭제)

#### 기타소득 (OI)
- **oi/summary/page.tsx**: SPS_OI_01 - 연도별 월별 합산 화면
- **oi/monthly/page.tsx**: SPS_OI_02 - 월별 상세 리스트 (Suspense 필수)
- **oi/all/page.tsx**: SPS_OI_05 - 전체 리스트 (검색, 페이징, 일괄 삭제)

### components/sps/ (사업소득 팝업)
- **BusinessIncomeAddPopup.tsx**: SPS_BI_03 - 월별 추가 팝업
- **BusinessIncomeEditPopup.tsx**: SPS_BI_04 - 월별 수정 팝업
- **AllBusinessIncomeAddPopup.tsx**: 전체 추가 팝업
- **AllBusinessIncomeEditPopup.tsx**: 전체 수정 팝업
- **ExcelUploadResultPopup.tsx**: 엑셀 업로드 결과 팝업

### components/oi/ (기타소득 팝업)
- **OtherIncomeAddPopup.tsx**: SPS_OI_03 - 월별 추가 팝업
- **OtherIncomeEditPopup.tsx**: SPS_OI_04 - 월별 수정 팝업
- **AllOtherIncomeAddPopup.tsx**: SPS_OI_06 - 전체 추가 팝업 (지급연월 선택 가능)
- **AllOtherIncomeEditPopup.tsx**: SPS_OI_07 - 전체 수정 팝업 (지급연월 수정 가능)

### components/manage/ (재사용 공통 컴포넌트)
- **SearchBar.tsx**: 검색 입력 (한글/영문/특수문자 검증)
- **Pagination.tsx**: 페이지 네비게이션
- **PageSizeSelect.tsx**: 페이지 크기 선택 (10/30/50/100)
- **Toast.tsx**: 알림 메시지 (1.5초 자동 닫힘)
- **ConfirmDialog.tsx**: 확인 다이얼로그
- **DeleteFailPopup.tsx**: 삭제 실패 팝업

## 엑셀 업로드/다운로드 정책

### 엑셀 템플릿 구조 (`lib/excelTemplate.ts`)
- Row 1-9: 안내문구 및 가이드
- Row 10: 컬럼명 (필수 항목 `*` 표시)
- Row 11: 컬럼 코드
- Row 12: 샘플 데이터 (업로드 시 무시됨)
- Row 13~: 실제 데이터

### 컬럼 순서 (변경 금지)
```
성명 | 귀속연도 | 귀속월 | 지급연도 | 지급월 | 주민번호 | 외국인여부 | 업종코드 | 지급액합계 | 세율
```

### 검증 규칙 18가지 (`lib/excelUpload.ts`)
1. 필수 필드 검증 (세율 제외 모든 필드)
2-3. 귀속/지급 연도 숫자 검증
4. 연도 범위 검증 (2025 ~ 현재+1년)
5. 월 범위 검증 (1-12)
6. 귀속일 ≤ 지급일 검증
7. 주민번호/사업자번호 형식 검증 (10자리 또는 13자리)
8. 체크디지트 검증
9. 업종코드 유효성 검증
10. 지급액 숫자 및 양수 검증
11. 세율 검증 (외국인 운동가만 3 or 20)
12. 중복 검증
13-18. 추가 필드별 검증

## 재사용 컴포넌트 사용 규칙

### Toast 사용
```typescript
const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

// 성공 메시지
setToast({ message: "저장되었습니다.", type: "success" });

// 에러 메시지
setToast({ message: "저장에 실패했습니다.", type: "error" });

// 컴포넌트 렌더링
{toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
```

### ConfirmDialog 사용
```typescript
const [confirm, setConfirm] = useState<{ message: string; onConfirm: () => void } | null>(null);

// 확인 다이얼로그 표시
setConfirm({
  message: "정말 삭제하시겠습니까?",
  onConfirm: () => {
    // 삭제 로직
    setConfirm(null);
  }
});

// 컴포넌트 렌더링
{confirm && <ConfirmDialog message={confirm.message} onConfirm={confirm.onConfirm} onCancel={() => setConfirm(null)} />}
```

### Pagination 사용
```typescript
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={(page) => setCurrentPage(page)}
/>
```

## 빌드 및 배포

### 빌드 스크립트
```bash
cd prototype
npm run build   # copy-policies 자동 실행 후 next build
npm run dev     # 개발 서버
```

### 빌드 전 자동 실행
- `scripts/copy-policies.js`: `.agents/skills/common/` → `public/policies/common/` 복사

## 중요 주의사항

### 절대 변경하면 안 되는 것들
1. **예외 업종 코드**: 940906, 940907, 940908 및 관련 로직
2. **세금 계산식**: 소액부징수, 지방세 계산 공식
3. **체크디지트 알고리즘**: 주민번호/사업자번호 검증 로직
4. **엑셀 템플릿 컬럼 순서**: 변경 시 업로드 파싱 실패
5. **중복 검증 키**: (지급연도, 지급월, 귀속연도, 귀속월, 주민번호, 업종코드)
6. **합산 건수 정의**: (귀속연도, 귀속월, 주민번호, 업종코드) 그룹화 기준

## 기타소득(OI) 모듈 특징

### 사업소득과의 주요 차이점
1. **예외 업종 규칙 없음**: 12월 예외 처리 불필요 (단순 1~12월 합산)
2. **필요경비 필드**: 지급액(A), 필요경비(B), 소득금액(A-B) 구조
3. **실소득금액**: 소득금액 - 소득세 - 지방소득세
4. **소득구분 2개**: 자문/고문, 자문/고문 외 인적용역
5. **세율 20% 고정**: 모든 기타소득에 동일 세율 적용
6. **체크디지트 검증 제외**: 주민번호/사업자번호 자릿수만 검증
7. **필요경비 60% 규칙**: 필요경비 ≥ 지급액 × 0.6 (60% 이상)
8. **지급건수**: 사용자가 직접 입력
9. **수정 팝업**: 지급액 0원 입력 허용 (추가 팝업은 불가)

### 기타소득 비즈니스 로직
- **세금 계산**:
  - 소득금액 = 지급액 - 필요경비
  - 소득세 = Math.floor(소득금액 × 0.2)
  - 소액부징수: 소득세 < 1,000원 → 소득세 = 0원
  - 지방소득세 = Math.floor(소득세 × 0.1)
  - 실소득금액 = 소득금액 - 소득세 - 지방소득세
- **중복 검증 키**: (지급연월, 귀속연월, 주민번호, 소득구분)
- **필요경비 검증**: 지급액 × 0.6 ≤ 필요경비 ≤ 지급액

### 기타소득 화면별 특징
- **SPS_OI_05 (전체 기타소득)**:
  - 최근 등록순 정렬
  - 합산 건수 없음 (개별 건으로 표시)
  - 데이터 연동: SPS_OI_01, SPS_OI_02와 양방향 연동
- **SPS_OI_06 (전체 기타소득 추가 팝업)**:
  - SPS_OI_03과 동일 + 지급연월 선택 가능
- **SPS_OI_07 (전체 기타소득 수정 팝업)**:
  - SPS_OI_04와 동일 + 지급연월 수정 가능
  - 지급액 0원 수정 가능

### 새 기능 추가 시 체크리스트
- [ ] `types/sps.ts`에 필요한 타입 추가/수정
- [ ] `lib/store.ts` 또는 `lib/oiStore.ts`에 CRUD 함수 추가/수정
- [ ] `STRUCTURE.md` 업데이트
- [ ] 기존 비즈니스 로직과 충돌 없는지 확인
- [ ] 엑셀 업로드/다운로드 영향 확인
- [ ] Toast/ConfirmDialog 등 공통 컴포넌트 재사용

### 디버깅 팁
- 사업소득 localStorage 확인: `localStorage.getItem('businessIncomes')`
- 기타소득 localStorage 확인: `localStorage.getItem('otherIncomes')`
- 시드 데이터 리셋: localStorage 초기화 후 페이지 새로고침
- Next.js 빌드 에러: `prototype/.next` 폴더 삭제 후 재빌드
- useSearchParams 에러: Suspense 래핑 확인

# Biskit Plan 프로젝트 관리 지침

## 파일 구조 관리
- **STRUCTURE.md 자동 업데이트 규칙**
  - `prototype/` 폴더의 구조가 변경될 때마다 `prototype/STRUCTURE.md` 파일을 업데이트할 것
  - 새로운 페이지 추가 시: `app/` 경로와 기능 설명을 STRUCTURE.md에 추가
  - 새로운 컴포넌트 추가 시: `components/` 섹션에 팝업/공통 컴포넌트 분류하여 추가
  - 새로운 비즈니스 로직 추가 시: `lib/` 섹션에 파일명과 역할 설명 추가
  - 파일 삭제 또는 이동 시: STRUCTURE.md에서도 동일하게 반영
  - 기능 변경 시: 해당 파일의 설명도 함께 업데이트

## 코드 작성 규칙
- Next.js 14 App Router 사용
- TypeScript strict mode
- Tailwind CSS 사용
- localStorage 기반 데이터 저장 (백엔드 없음)

## 명명 규칙
- 컴포넌트: PascalCase (예: `AllBusinessIncomeEditPopup.tsx`)
- 유틸 함수: camelCase (예: `formatUtils.ts`)
- 상수: UPPER_SNAKE_CASE (예: `INDUSTRY_CODES`)

## 주요 비즈니스 로직
- 사업소득(SPS) 모듈 중심 개발
- 예외 업종 코드 처리 로직 유지 (940906, 940907, 940908)
- 세금 계산 로직 변경 시 충분한 테스트 필요

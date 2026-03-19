# Senior Code Implementer Memory

## Project Overview
- Next.js 14 App Router + React 18 + TypeScript + Tailwind CSS
- Policy management prototype with localStorage persistence
- Two main modules: Business Income (BI/SPS) and Other Income (OI)

## Architecture Patterns

### Data Layer Pattern
- Store files: `lib/store.ts` (BI), `lib/oiStore.ts` (OI)
- CRUD operations with localStorage
- Seed data included in store files
- ID generation: `Date.now().toString(36) + Math.random().toString(36).slice(2, 7)`

### Tax Calculation Pattern
- Separate calculation modules: `lib/taxCalculation.ts` (BI), `lib/oiTaxCalculation.ts` (OI)
- Return type pattern: `{ taxRate, incomeTax, localTax, netPayment }` (BI) or `{ incomeAmount, incomeTax, localTax, netIncome }` (OI)
- Small amount exemption: incomeTax < 1000 → 0

### Validation Pattern
- Separate validation modules: `lib/spsValidation.ts` (BI), `lib/oiValidation.ts` (OI)
- Check-digit validation for BI, but not for OI
- Return null if valid, error message string if invalid

### Page Structure Pattern
- Client component with "use client" directive
- useSearchParams wrapped in Suspense for monthly pages
- State management: allData, filteredData, selectedIds, pageSize, currentPage
- Toast and ConfirmDialog for user feedback

## Key Business Logic Differences

### Business Income (BI)
- Exception industry codes: 940906, 940907, 940908 with December display rule
- Variable tax rates: 3%, 5%, 20% depending on industry code and foreign status
- Check-digit validation required
- Aggregation for monthly display

### Other Income (OI)
- No exception rules (simple 1-12 month display)
- Fixed 20% tax rate
- 60% necessary expense rule
- No check-digit validation
- No aggregation (row count = data count)

## Component Reuse
- SearchBar, Pagination, PageSizeSelect from `components/manage/`
- Toast and ConfirmDialog for notifications
- formatAmount and formatDateTime from `lib/formatUtils.ts`

## File Naming Conventions
- Store: `oiStore.ts` (not `otherIncomeStore.ts`)
- Tax calculation: `oiTaxCalculation.ts`
- Validation: `oiValidation.ts`
- Types: defined in `types/sps.ts` even for OI

## Implementation Notes
- Always update STRUCTURE.md when adding new files
- Popup components not implemented yet - buttons disabled
- Excel upload/download to be implemented later
- Year options: 2025 to currentYear + 1

## Testing Data
- 10 seed records for OI in `lib/oiStore.ts`
- 20 seed records for BI in `lib/store.ts`
- Mix of regular, small amount, foreign, and business number cases

## Last Updated
2026-03-19 - Implemented OI module (Phase 1 + Phase 2)

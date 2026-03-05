// 천단위 콤마 + "원"
export function formatAmount(amount: number): string {
  return amount.toLocaleString("ko-KR") + "원";
}

// 천단위 콤마만 (입력 필드 표시용)
export function formatNumber(num: number): string {
  return num.toLocaleString("ko-KR");
}

// 날짜 포매팅 YYYY-MM-DD
export function formatDateFull(dateStr: string | null): string {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 금액 입력 파싱: 콤마 제거 후 숫자만 반환
export function parseAmountInput(value: string): string {
  const cleaned = value.replace(/[^0-9]/g, "");
  // 앞자리 0 제거
  if (cleaned.length > 1 && cleaned.startsWith("0")) {
    return cleaned.replace(/^0+/, "") || "0";
  }
  return cleaned;
}

// 금액 입력 표시: 숫자를 콤마 포함 문자열로
export function displayAmountInput(value: string): string {
  if (!value) return "";
  const num = parseInt(value, 10);
  if (isNaN(num)) return "";
  return num.toLocaleString("ko-KR");
}

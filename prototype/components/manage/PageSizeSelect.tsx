"use client";

interface Props {
  value: number;
  onChange: (size: number) => void;
}

const OPTIONS = [15, 30, 50, 100];

export default function PageSizeSelect({ value, onChange }: Props) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="px-3 py-1.5 border border-gray-300 rounded-md text-sm"
    >
      {OPTIONS.map((opt) => (
        <option key={opt} value={opt}>
          {opt}개
        </option>
      ))}
    </select>
  );
}

"use client";

import { useState, KeyboardEvent } from "react";

interface Props {
  placeholder: string;
  onSearch: (query: string) => void;
  maxLength?: number;
  allowSpecialChar?: boolean;
}

export default function SearchBar({ placeholder, onSearch, maxLength, allowSpecialChar = true }: Props) {
  const [value, setValue] = useState("");

  const handleChange = (v: string) => {
    if (maxLength && v.length > maxLength) return;
    if (!allowSpecialChar) {
      v = v.replace(/[^a-zA-Z0-9가-힣ㄱ-ㅎㅏ-ㅣ\s&'\-\.·()]/g, "");
    }
    setValue(v);
  };

  const handleSearch = () => onSearch(value);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 max-w-md px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
      >
        검색
      </button>
    </div>
  );
}

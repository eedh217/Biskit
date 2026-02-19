"use client";

import { useState } from "react";
import { CompareItem } from "@/types";
import SectionBadge from "./SectionBadge";

interface Props {
  items: CompareItem[];
  moduleAName: string;
  moduleBName: string;
}

export default function CompareTable({ items, moduleAName, moduleBName }: Props) {
  const [filter, setFilter] = useState<"all" | "common" | "different">("all");

  const filtered =
    filter === "all"
      ? items
      : filter === "common"
        ? items.filter((i) => !i.isDifferent)
        : items.filter((i) => i.isDifferent);

  const categories = [...new Set(filtered.map((i) => i.category))];

  return (
    <div>
      <div className="flex gap-2 mb-4">
        {(
          [
            { key: "all", label: "전체", count: items.length },
            {
              key: "common",
              label: "공통",
              count: items.filter((i) => !i.isDifferent).length,
            },
            {
              key: "different",
              label: "화면별 차이",
              count: items.filter((i) => i.isDifferent).length,
            },
          ] as const
        ).map((btn) => (
          <button
            key={btn.key}
            onClick={() => setFilter(btn.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              filter === btn.key
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {btn.label} ({btn.count})
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-32">
                카테고리
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-40">
                항목
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                {moduleAName}
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">
                {moduleBName}
              </th>
              <th className="text-center px-4 py-3 font-medium text-gray-600 w-24">
                구분
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => {
              const catItems = filtered.filter((i) => i.category === cat);
              return catItems.map((item, idx) => (
                <tr
                  key={`${cat}-${idx}`}
                  className={`border-b border-gray-100 ${
                    item.isDifferent ? "bg-purple-50/30" : ""
                  }`}
                >
                  {idx === 0 && (
                    <td
                      rowSpan={catItems.length}
                      className="px-4 py-3 font-medium text-gray-900 align-top border-r border-gray-100"
                    >
                      {cat}
                    </td>
                  )}
                  <td className="px-4 py-3 text-gray-700">{item.attribute}</td>
                  <td className="px-4 py-3 text-gray-700">{item.moduleA}</td>
                  <td className="px-4 py-3 text-gray-700">{item.moduleB}</td>
                  <td className="px-4 py-3 text-center">
                    <SectionBadge tag={item.isDifferent ? "화면별" : "공통"} />
                  </td>
                </tr>
              ));
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

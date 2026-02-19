import { PolicyTag } from "@/types";

const tagColors: Record<PolicyTag, string> = {
  "공통": "bg-green-100 text-green-800",
  "화면별": "bg-purple-100 text-purple-800",
  "보완": "bg-yellow-100 text-yellow-800",
  "공통 권장": "bg-blue-100 text-blue-800",
  "공통 기본값": "bg-gray-100 text-gray-800",
};

export default function SectionBadge({ tag }: { tag: PolicyTag }) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${tagColors[tag]}`}
    >
      {tag}
    </span>
  );
}

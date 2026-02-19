import Link from "next/link";
import { PolicyModule } from "@/types";

export default function PolicyCard({ policy }: { policy: PolicyModule }) {
  return (
    <Link href={`/policy/${policy.id}`}>
      <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            {policy.moduleName}
          </h3>
          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
            {policy.screens.length}개 화면
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-4">{policy.features}</p>
        <div className="space-y-2">
          {policy.screens.map((screen) => (
            <div
              key={screen.screenId}
              className="flex items-center gap-2 text-sm"
            >
              <span className="font-mono text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">
                {screen.screenId}
              </span>
              <span className="text-gray-700">{screen.screenName}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
          <span className="text-xs text-gray-500">
            입력 필드 {policy.fields.length}개 | 테이블 컬럼{" "}
            {policy.tableColumns.length}개
          </span>
          <span className="text-xs text-blue-600 font-medium">
            상세 보기 &rarr;
          </span>
        </div>
      </div>
    </Link>
  );
}

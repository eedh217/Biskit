import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biskit 정책 관리</h1>
        <p className="mt-2 text-gray-600">
          사업소득 관리 화면 프로토타입입니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/sps/summary">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                사업소득 합산
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                SPS_BI_01
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              연도별 월별 사업소득 합산 데이터를 조회합니다.
            </p>
            <span className="inline-block mt-3 text-xs text-blue-600 font-medium">
              합산 화면 &rarr;
            </span>
          </div>
        </Link>

        <Link href="/sps/monthly?year=2026&month=1">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-semibold text-gray-900">
                사업소득 월별 리스트
              </h3>
              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                SPS_BI_02
              </span>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              특정 월의 사업소득 상세 데이터를 관리합니다.
            </p>
            <span className="inline-block mt-3 text-xs text-blue-600 font-medium">
              월별 리스트 &rarr;
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

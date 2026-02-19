import { allPolicies } from "@/lib/policyData";
import PolicyCard from "@/components/PolicyCard";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Biskit 정책 관리</h1>
        <p className="mt-2 text-gray-600">
          임직원 / 근로형태 / 급여항목 / 급여대장 / 급여내역 정책을 비교하고, 테스트케이스를 미리 확인합니다.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPolicies.map((policy) => (
          <PolicyCard key={policy.id} policy={policy} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/compare">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              정책 비교
            </h3>
            <p className="text-sm text-gray-600">
              두 정책의 공통 항목과 화면별 차이점을 비교합니다.
            </p>
            <span className="inline-block mt-3 text-xs text-blue-600 font-medium">
              비교 화면 &rarr;
            </span>
          </div>
        </Link>
        <Link href="/testcases">
          <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              테스트케이스 미리보기
            </h3>
            <p className="text-sm text-gray-600">
              정책 기반으로 자동 생성된 테스트케이스를 확인합니다.
            </p>
            <span className="inline-block mt-3 text-xs text-blue-600 font-medium">
              테스트케이스 &rarr;
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

import { PolicyModule } from "@/types";
import MarkdownContent from "@/components/MarkdownContent";

interface Props {
  policy: PolicyModule;
}

export default function PolicyDetailContent({ policy }: Props) {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {policy.moduleName} 정책 상세
        </h1>
        <p className="mt-2 text-gray-600">{policy.features}</p>
      </div>

      {/* 화면 개요 (원본 정책 문서) */}
      {policy.detailedContent?.overview && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">화면 개요</h2>
          <MarkdownContent content={policy.detailedContent.overview} />
        </section>
      )}

      {/* 화면 목록 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">화면 구성</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {policy.screens.map((screen) => (
            <div
              key={screen.screenId}
              className="border border-gray-200 rounded-lg p-4"
            >
              <div className="font-mono text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded inline-block mb-2">
                {screen.screenId}
              </div>
              <h3 className="font-medium text-gray-900">{screen.screenName}</h3>
              <p className="text-sm text-gray-600 mt-1">
                {screen.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 화면 기능 상세 (원본 정책 문서) */}
      {policy.detailedContent?.features && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">화면 기능 상세</h2>
          <MarkdownContent content={policy.detailedContent.features} />
        </section>
      )}

    </div>
  );
}

import { PolicyModule } from "@/types";
import MarkdownContent from "@/components/MarkdownContent";

interface Props {
  policy: PolicyModule;
}

export default function PolicyDetailContent({ policy }: Props) {
  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {policy.moduleName}
          </h1>
          <p className="mt-2 text-gray-600">{policy.features}</p>
        </div>
        {policy.sourceFile && (
          <a
            href={`/api/policy/download?file=${encodeURIComponent(policy.sourceFile)}`}
            download
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            정책 다운로드
          </a>
        )}
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

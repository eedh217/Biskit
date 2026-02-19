import { notFound } from "next/navigation";
import { allPolicies } from "@/lib/policyData";
import SectionBadge from "@/components/SectionBadge";
import FieldDetailTable from "@/components/FieldDetailTable";

interface Props {
  params: { id: string };
}

export function generateStaticParams() {
  return allPolicies.map((p) => ({ id: p.id }));
}

export default function PolicyDetailPage({ params }: Props) {
  const policy = allPolicies.find((p) => p.id === params.id);

  if (!policy) {
    notFound();
  }

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {policy.moduleName} 정책 상세
        </h1>
        <p className="mt-2 text-gray-600">{policy.features}</p>
      </div>

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

      {/* 리스트 화면 정책 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          리스트 화면 ({policy.listScreen.screenId})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                검색 대상
              </span>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-900">
                  {policy.listScreen.search.target}
                </p>
                <SectionBadge tag="화면별" />
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                Placeholder
              </span>
              <p className="text-sm text-gray-600 mt-1 italic">
                &ldquo;{policy.listScreen.search.placeholder}&rdquo;
              </p>
            </div>
            {policy.listScreen.search.maxLength && (
              <div>
                <span className="text-xs font-medium text-gray-500 uppercase">
                  검색 입력 제한
                </span>
                <p className="text-sm text-gray-600 mt-1">
                  최대 {policy.listScreen.search.maxLength}자, 특수문자{" "}
                  {policy.listScreen.search.specialCharAllowed
                    ? "허용"
                    : "불가"}
                </p>
              </div>
            )}
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                기본 정렬
              </span>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm text-gray-900">
                  {policy.listScreen.sort}
                </p>
                <SectionBadge tag="공통" />
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                페이지 사이즈
              </span>
              <p className="text-sm text-gray-900 mt-1">
                {policy.listScreen.pageSizeOptions.join(" / ")}개 (기본{" "}
                {policy.listScreen.defaultPageSize}개)
              </p>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                엑셀 파일명
              </span>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-sm font-mono text-gray-900">
                  {policy.listScreen.excelFileName}
                </p>
                <SectionBadge tag="화면별" />
              </div>
            </div>
            <div>
              <span className="text-xs font-medium text-gray-500 uppercase">
                행 클릭
              </span>
              <p className="text-sm text-gray-600 mt-1">
                {policy.listScreen.rowClickAction}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 테이블 컬럼 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          테이블 컬럼 <SectionBadge tag="화면별" />
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  컬럼명
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  타입
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  비고
                </th>
              </tr>
            </thead>
            <tbody>
              {policy.tableColumns.map((col) => (
                <tr
                  key={col.name}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {col.name}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                      {col.type}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {col.note || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 입력 필드 상세 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          입력 필드 상세 ({policy.fields.length}개){" "}
          <SectionBadge tag="화면별" />
        </h2>
        <FieldDetailTable fields={policy.fields} />
      </section>

      {/* 삭제 정책 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          삭제 정책 <SectionBadge tag="화면별" />
        </h2>
        <div className="space-y-2">
          <p className="text-sm text-gray-900">
            삭제 방식:{" "}
            <span className="font-medium">{policy.deletePolicy.type}</span>
          </p>
          <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
            {policy.deletePolicy.description.map((desc, i) => (
              <li key={i}>{desc}</li>
            ))}
          </ul>
          {policy.deletePolicy.warning && (
            <div className="mt-3 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <span className="font-medium">경고 confirm: </span>
                {policy.deletePolicy.warning}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* 팝업 정책 */}
      <section className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">팝업 정책</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              추가 팝업 ({policy.addPopup.screenId})
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">이탈 방지:</span>
                <p className="text-gray-700 italic">
                  &ldquo;{policy.addPopup.confirmMessage}&rdquo;
                </p>
              </div>
              <div>
                <span className="text-gray-500">성공 토스트:</span>
                <p className="text-gray-700 italic">
                  &ldquo;{policy.addPopup.toastMessage}&rdquo;
                </p>
              </div>
            </div>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-3">
              수정 팝업 ({policy.editPopup.screenId})
            </h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-gray-500">이탈 방지:</span>
                <p className="text-gray-700 italic">
                  &ldquo;{policy.editPopup.confirmMessage}&rdquo;
                </p>
              </div>
              <div>
                <span className="text-gray-500">성공 토스트:</span>
                <p className="text-gray-700 italic">
                  &ldquo;{policy.editPopup.toastMessage}&rdquo;
                </p>
              </div>
              {policy.editPopup.readonlyFields && (
                <div>
                  <span className="text-gray-500">읽기 전용 필드:</span>
                  <p className="text-gray-700">
                    {policy.editPopup.readonlyFields.join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 추가 정책 (근로형태만) */}
      {policy.extraPolicies && policy.extraPolicies.length > 0 && (
        <section className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            연관 정책 <SectionBadge tag="화면별" />
          </h2>
          <div className="space-y-4">
            {policy.extraPolicies.map((extra, i) => (
              <div
                key={i}
                className="border border-gray-200 rounded-lg p-4"
              >
                <h3 className="font-medium text-gray-900 mb-2">
                  {extra.title}
                </h3>
                <p className="text-sm text-gray-700">{extra.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

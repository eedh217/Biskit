"use client";

import { UploadResult } from "@/lib/excelUpload";
import { downloadFailData } from "@/lib/excelTemplate";

interface Props {
  result: UploadResult;
  onClose: () => void;
}

export default function ExcelUploadResultPopup({ result, onClose }: Props) {
  const handleDownloadFail = () => {
    downloadFailData(result.failRows);
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            엑셀 업로드 결과
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* 본문 */}
        <div className="px-6 py-4 flex-1 overflow-y-auto">
          {/* 집계 */}
          <div className="flex items-center gap-6 mb-4">
            <div className="text-sm text-gray-700">
              총 <span className="font-semibold">{result.totalCount}</span>건
            </div>
            <div className="text-sm text-blue-600">
              성공 <span className="font-semibold">{result.successCount}</span>
              건
            </div>
            <div className="text-sm text-red-600">
              실패 <span className="font-semibold">{result.failCount}</span>건
            </div>
          </div>

          {/* 실패 목록 */}
          {result.failRows.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase w-12">
                        행
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        주민(사업자)등록번호
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                        실패사유
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.failRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className="border-t border-gray-100 hover:bg-gray-50"
                      >
                        <td className="px-4 py-2 text-sm text-gray-500">
                          {row.rowIndex}
                        </td>
                        <td className="px-4 py-2 text-sm text-gray-900">
                          {row.iino || "-"}
                        </td>
                        <td className="px-4 py-2 text-sm text-red-600">
                          {row.failReason}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
          {result.failRows.length > 0 && (
            <button
              onClick={handleDownloadFail}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              실패 데이터 다운로드
            </button>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            확인
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

interface FailItem {
  name: string;
  reason: string;
}

interface Props {
  items: FailItem[];
  onClose: () => void;
}

export default function DeleteFailPopup({ items, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-base font-semibold text-gray-900 mb-2">삭제 실패</h3>
        <p className="text-sm text-gray-600 mb-4">
          {items.length}건의 삭제가 실패했습니다.
        </p>
        <div className="max-h-48 overflow-y-auto border border-gray-200 rounded-md">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 sticky top-0">
              <tr>
                <th className="text-left px-3 py-2 font-medium text-gray-600">항목</th>
                <th className="text-left px-3 py-2 font-medium text-gray-600">실패 사유</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-t border-gray-100">
                  <td className="px-3 py-2 text-gray-800">{item.name}</td>
                  <td className="px-3 py-2 text-red-600">{item.reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-end mt-4">
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

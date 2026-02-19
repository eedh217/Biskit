"use client";

import { useState, useEffect } from "react";
import { getPayItems, getPayrollItemConfigsForPayroll, togglePayrollItem } from "@/lib/store";
import { PayItem, PayrollItemConfig } from "@/types/manage";

interface Props {
  payrollId: string;
  isConfirmed: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PayrollDetailManageItemsPopup({ payrollId, isConfirmed, onClose, onSuccess }: Props) {
  const [payItems, setPayItems] = useState<PayItem[]>([]);
  const [configs, setConfigs] = useState<PayrollItemConfig[]>([]);
  const [tab, setTab] = useState<"지급항목" | "공제항목">("지급항목");
  const [confirmToggle, setConfirmToggle] = useState<{ payItemId: string; itemName: string; newState: boolean } | null>(null);

  useEffect(() => {
    const items = getPayItems();
    setPayItems(items);
    const c = getPayrollItemConfigsForPayroll(payrollId);
    setConfigs(c);
  }, [payrollId]);

  const isEnabled = (payItemId: string) => {
    const config = configs.find((c) => c.payItemId === payItemId);
    return config ? config.enabled : false;
  };

  const handleToggle = (payItemId: string, itemName: string, currentState: boolean) => {
    if (isConfirmed) return;
    if (currentState) {
      // Disabling - show warning
      setConfirmToggle({ payItemId, itemName, newState: false });
    } else {
      // Enabling - no warning
      doToggle(payItemId, true);
    }
  };

  const doToggle = (payItemId: string, enabled: boolean) => {
    togglePayrollItem(payrollId, payItemId, enabled);
    setConfigs(getPayrollItemConfigsForPayroll(payrollId));
    setConfirmToggle(null);
  };

  const filteredItems = payItems.filter((p) => p.category === tab);

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">급여항목 관리</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">&times;</button>
        </div>

        <div className="px-6 pt-4">
          <div className="flex gap-2">
            {(["지급항목", "공제항목"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  tab === t ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6">
          {filteredItems.length === 0 ? (
            <p className="text-center text-gray-400 py-8">등록된 {tab}이 없습니다.</p>
          ) : (
            <div className="space-y-2">
              {filteredItems.map((item) => {
                const enabled = isEnabled(item.id);
                return (
                  <div key={item.id} className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-lg">
                    <div>
                      <span className="text-sm font-medium text-gray-900">{item.itemName}</span>
                      <span className="ml-2 text-xs text-gray-500 font-mono">{item.payCode}</span>
                      <span className="ml-2 text-xs text-gray-400">{item.itemType}</span>
                    </div>
                    <button
                      onClick={() => handleToggle(item.id, item.itemName, enabled)}
                      disabled={isConfirmed}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        isConfirmed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                      } ${enabled ? "bg-blue-600" : "bg-gray-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        enabled ? "translate-x-6" : "translate-x-1"
                      }`} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end px-6 py-4 border-t border-gray-200">
          <button
            onClick={() => { onSuccess(); }}
            className="px-4 py-2 text-sm text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            완료
          </button>
        </div>

        {confirmToggle && (
          <div className="fixed inset-0 z-[90] flex items-center justify-center">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative bg-white rounded-lg shadow-xl p-6 max-w-sm mx-4">
              <p className="text-sm text-gray-700 mb-4">
                &apos;{confirmToggle.itemName}&apos; 항목을 비활성화하면 해당 항목의 금액 데이터가 초기화됩니다. 계속하시겠습니까?
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setConfirmToggle(null)}
                  className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  취소
                </button>
                <button
                  onClick={() => doToggle(confirmToggle.payItemId, false)}
                  className="px-4 py-2 text-sm text-white bg-red-600 rounded-md hover:bg-red-700"
                >
                  비활성화
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

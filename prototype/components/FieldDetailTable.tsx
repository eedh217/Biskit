import { PolicyField } from "@/types";

export default function FieldDetailTable({
  fields,
}: {
  fields: PolicyField[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50 border-b border-gray-200">
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              필드명
            </th>
            <th className="text-center px-4 py-3 font-medium text-gray-600 w-16">
              필수
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">
              타입
            </th>
            <th className="text-center px-4 py-3 font-medium text-gray-600 w-20">
              최대길이
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              유효성 검사
            </th>
            <th className="text-left px-4 py-3 font-medium text-gray-600">
              설명
            </th>
          </tr>
        </thead>
        <tbody>
          {fields.map((field) => (
            <tr
              key={field.name}
              className="border-b border-gray-100 hover:bg-gray-50"
            >
              <td className="px-4 py-3 font-medium text-gray-900">
                {field.name}
              </td>
              <td className="px-4 py-3 text-center">
                {field.required ? (
                  <span className="text-red-600 font-bold">*</span>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3">
                <span className="font-mono text-xs bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded">
                  {field.type}
                </span>
              </td>
              <td className="px-4 py-3 text-center text-gray-600">
                {field.maxLength || "-"}
              </td>
              <td className="px-4 py-3">
                {field.validation ? (
                  <ul className="space-y-1">
                    {field.validation.map((v, i) => (
                      <li
                        key={i}
                        className="text-xs text-gray-600 flex items-start gap-1"
                      >
                        <span className="text-blue-500 mt-0.5">&#8226;</span>
                        {v}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="text-gray-400">-</span>
                )}
              </td>
              <td className="px-4 py-3 text-xs text-gray-600">
                {field.description || "-"}
                {field.errorMessages && (
                  <div className="mt-1 space-y-0.5">
                    {Object.entries(field.errorMessages).map(([key, msg]) => (
                      <div key={key} className="text-red-500">
                        {key}: &ldquo;{msg}&rdquo;
                      </div>
                    ))}
                  </div>
                )}
                {field.options && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {field.options.map((opt) => (
                      <span
                        key={opt}
                        className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-xs"
                      >
                        {opt}
                      </span>
                    ))}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
